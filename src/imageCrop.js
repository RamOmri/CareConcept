import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
  I18nManager,
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
import ImageSize from 'react-native-image-size';
import {CropView} from 'react-native-image-crop-tools';
import CameraRoll from '@react-native-community/cameraroll';
import AmazingCropper, {DefaultFooter} from 'react-native-amazing-cropper';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {WebView} from 'react-native-webview';


import {connect} from 'react-redux';
import {
  setLanguage
} from './actions/policInfoActions';

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


class imageCrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderWebView:false,
      infoObj: this.props.route.params.infoObj,
      cropRef: React.createRef(),
      imageHeight: 0,
      imageWidth: 0,
      loading: true,
    };
  }

  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress)
    /* if(Platform.OS == "ios"){
      await ImageResizer.createResizedImage( this.state.infoObj.pages[this.state.infoObj.pages.length - 1].url, 2000, 2000, "JPEG", 80)
      .then(response => { 
        this.state.infoObj.pages[this.state.infoObj.pages.length - 1].url = response.uri
      })
     } */
    await this.getImageSize(
      this.state.infoObj.pages[this.state.infoObj.pages.length - 1].url,
    );
  }

  
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress)
  }
  onBackPress = () =>{
    return true
  }
  async onDone(croppedImageUri) {
    this.state.infoObj.pages.splice(this.state.infoObj.pages.length - 1, 1, {
      url: croppedImageUri,
    });
    await this.getImageSize(croppedImageUri);
  }

  async getImageSize(img) {
    await ImageSize.getSize(img)
      .then((size) => {
        this.setState({
          imageHeight: size.height,
          imageWidth: size.width,
          loading: false,
          renderWebView:false,
        });
      })
      .catch((err) => alert(err));
    //alert(this.state.imageHeight + " " + this.state.imageWidth)
  }

  onError = (err) => {
    alert('Something went wrong, please contact support '+ err)
  };
  
  onContinue = () => {
    this.props.navigation.navigate('ScanStack', {
      params: {infoObj: this.state.infoObj},
      screen: 'ScanPreview',
    });
  };


  renderLoading = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color="#004799" />
      </View>
    );
  };

  render() {
    if(this.state.renderWebView){
      return(
        <View style={{flex: 1, backgroundColor: '#004799'}}>
         
          <TouchableOpacity
            style={{
              marginLeft: 20,
              margin: 10,
              backgroundColor: 'orange',
              height: Dimensions.get('screen').height / 17,
              width: Dimensions.get('screen').width / 4,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 200,
              borderBottomLeftRadius: 200,
            }}
            onPress={() => {
              this.setState({renderWebView: false})
            }}>
            <View>
              <Text style={{color: 'white', fontSize: 12}}>
                {translate('Go Back')}
              </Text>
            </View>
          </TouchableOpacity>
          <WebView
            startInLoadingState
            renderLoading={this.renderLoading}
            source={{
              uri:
                this.props.language.includes('en') && 'https://www.care-concept.de/scripte/sniplets/app_general_information_eng.php?navilang=eng' ||
                 this.props.language.includes('de') && "https://www.care-concept.de/scripte/sniplets/app_general_information.php"
            }}
            style={{marginTop: 20}}
          />
        </View>
      )
    }
    else if (!this.state.loading) {
      return (
        <React.Fragment>
         
          <View style={{flex: 1, }}>
            <AmazingCropper
              footerComponent={<this.CustomCropperFooter />}
              onDone={(croppedImageUri) => {
                this.onDone(croppedImageUri);
              }}
              onError={this.onError}
              onCancel={() => this.onContinue()}
              imageUri={
                this.state.infoObj.pages[this.state.infoObj.pages.length - 1]
                  .url
              }
              imageWidth={this.state.imageWidth}
              imageHeight={this.state.imageHeight}
              initialRotation={0}
            />
          </View>
        </React.Fragment>
      );
    } else
      return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="#004799" />
        </View>
      );
  }
 
 
  CustomCropperFooter = (props) => {
   
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center',}}>
        <TouchableOpacity
          onPress={async () => {
            let imguri = this.state.infoObj.pages[this.state.infoObj.pages.length - 1]
            this.state.infoObj.pages.splice(
              this.state.infoObj.pages.length - 1,
              1,
            );
            let RNFS = require('react-native-fs');
           RNFS.unlink(imguri.url)
            .then(() => {
              
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch((err) => {
              alert('Something went wrong, please clear cache of this app')
            });
            if (Platform.OS === 'ios'){
              this.props.navigation.push('ScanStack', {
                params: {infoObj: this.state.infoObj},
                screen: 'Scanner',
              });}
            else{
              this.props.navigation.navigate('ScanStack', {
                params: {infoObj: this.state.infoObj},
                screen: 'Scanner',
              });}
          }}
          style={styles.button}>
          <Text style={styles.text}>{translate('Rescan')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.setState({loading: true});
            props.onDone();
          }}
          style={styles.button}>
          <Text style={styles.text}>{translate('Crop')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onCancel} style={styles.button}>
          <Text style={styles.text}>{translate('Continue')}</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  logo: {},
  scanner: {
    flex: 0.9,
    aspectRatio: undefined,
  },
  button: {
    width: Dimensions.get('window').width/3.6,
    backgroundColor: '#E67F00',
    height: Dimensions.get('window').height / 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    borderRadius:10,
    margin:10,
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
  text:{
    color:'white',
    fontSize:11,
  }
});


const mapStateToProps = (state) => {
  //alert(JSON.stringify(state))
  return {
    language: state.policyInfoReducers.policyInfo.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLanguage: (lang) => dispatch(setLanguage(lang)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(imageCrop)