import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  Dimensions,
  ActivityIndicator,
  I18nManager,
  Platform,
  BackHandler,
  DeviceEventEmitter
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import DocumentScanner from '@woonivers/react-native-document-scanner';
import ImageSize from 'react-native-image-size';
import ImageViewer from 'react-native-image-zoom-viewer';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize'; // Use for caching/memoize for better performance


const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('./translations/eng.json'),
  de: () => require('./translations/De.json'),
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);


export default class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isScanning: false,
      pdfScannerReference: React.createRef(),
      infoObj: this.props.route.params.infoObj,
      isDocumentDetection:true
    };
  
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress)
    
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress)
  }
onBackPress = () =>{

}
  async handleScannedDocument(Img, init) {
    let image;
    if(this.state.isDocumentDetection) image = Img
    else image = init
 
    this.setState({isScanning: false});
    this.state.infoObj.pages.push({url: image});
    let info = this.state.infoObj
    this.props.navigation.pop()
    this.props.navigation.navigate('ScanStack', {
      params: {infoObj: info},
      screen: 'imageCrop',
    });
    
  }
  deleteCachedImage = async (path) =>{
    let RNFS = require('react-native-fs');
    return RNFS.unlink(path)
      .then(() => {
        
      })
      .catch((err) => {
        alert('Something went wrong, please clear cache of this app ' + err)
      });
  }
  render() {
    return <React.Fragment>{this.renderScanner()}</React.Fragment>;
  }

  renderScanner() {
    return (
      <React.Fragment>
        {Platform.OS != 'android' && (
          <View style={{paddingTop: getStatusBarHeight()}}>
            <StatusBar />
          </View>
        )}
        <DocumentScanner
          ref={this.state.pdfScannerReference}
          style={styles.scanner}
          onPictureTaken={(picture) => {
            this.handleScannedDocument(
              picture.croppedImage,
              picture.initialImage,
            );
          }}
          overlayColor= {this.state.isDocumentDetection ? "rgba(255,130,0, 0.7)": "rgba(0,0,0,0)"}
          enableTorch={false}
          quality={1}
          detectionRefreshRateInMS={1}
          detectionCountBeforeCapture={-1}

        />

        <View style={{flex: 0.12}}>
          {(!this.state.isScanning && (

            <View style = {{justifyContent:'center', alignItems:'center', backgroundColor:'black', flexDirection:'row'}}>
              <TouchableOpacity
              style={{...styles.scanButton, backgroundColor: this.state.isDocumentDetection ? 'green':"red",}}
              onPress={() => {
               this.setState({isDocumentDetection: !this.state.isDocumentDetection})
              }}>
              <Text style={{fontSize: 14, color: 'white', margin: 10, textAlign:'center'}}>
                {translate('document detection')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.setState({isScanning: true});
                this.state.pdfScannerReference.current.capture();
                setTimeout(() => {
                  let that = this;
                  if (that.state.isScanning === true) {
                    Alert.alert('',
                      translate(
                        'Scan timed out, please hold phone steady and try again',
                      ),
                    );
                    if(Platform.OS === "ios"){ 
                      this.props.navigation.pop()
                      this.props.navigation.push('ScanStack', {
                      params: {infoObj: this.state.infoObj},
                      screen: 'Scanner',
                    });
                  }
                  else{
                    that.state.pdfScannerReference.current.forceUpdate();
                    that.setState({isScanning: false});
                  }

                  }
                }, 9000);
              }}>
              <Text style={{fontSize: 18, color: 'white', margin: 10}}>
                {translate('Scan')}
              </Text>
            </TouchableOpacity>
          
          </View>
          )) || (
            <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor:'black'}}>
              <Text style={styles.DocumentText}>
                {translate('Please wait while your document is being scanned')}
              </Text>
              <ActivityIndicator size="large" color="#004799" />
            </View>
          )}
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scanner: {
    flex: 0.9,
    aspectRatio: undefined,
  },
  scanButton: {
    width: Dimensions.get('window').width/2.5,
    height:Dimensions.get('window').width/6,
    margin:10,
    borderRadius:20,
    backgroundColor: '#f59b00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    backgroundColor: 'rgba(245, 252, 255, 0.7)',
    fontSize: 32,
  },
  preview: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  permissions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  DocumentText: {
    flexDirection: 'row',
    marginLeft:30,
    fontSize: 14,
    color: '#E67F00',
    justifyContent: 'center',
    alignItems: 'center',
  },
});