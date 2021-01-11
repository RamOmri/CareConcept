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
  ActivityIndicator
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import DocumentScanner from "@woonivers/react-native-document-scanner"
import ImageSize from 'react-native-image-size'
import ImageViewer from 'react-native-image-zoom-viewer';
import { getStatusBarHeight } from 'react-native-status-bar-height';


export default class Scanner extends React.Component {

constructor(props){
 super(props)
  this.state = {
    isScanning: false,
      pdfScannerReference: React.createRef(),
      infoObj: this.props.route.params.infoObj
    }
    const unsubscribe = this.props.navigation.addListener('focus', () => {
     this.forceUpdate()
    });
}


componentDidMount() {
  this.willFocusSubscription = this.props.navigation.addListener(
    'willFocus',
    () => {
      this.forceUpdate()
    }
  );
}



 handleScannedDocument(Img, init){    
  this.setState({isScanning: false})
  this.state.infoObj.pages.push({url: Img})  
  this.props.navigation.navigate('ScanStack', {params:{infoObj: this.state.infoObj}, screen: 'imageCrop'})
  
  }
  render(){
        return(
          <React.Fragment>
              {this.renderScanner()}
          </React.Fragment>
        )

    

      }

    renderScanner(){
        return(
         <React.Fragment>
           {(Platform.OS != "android") && 
              <View style = {{paddingTop: getStatusBarHeight()}}>
                 <StatusBar />
               </View>}
          <DocumentScanner
           ref={this.state.pdfScannerReference}
            style={styles.scanner}
            onPictureTaken={(picture) =>{
              
              this.handleScannedDocument(picture.croppedImage, picture.initialImage)
              
            }}
            overlayColor="rgba(255,130,0, 0.7)"
            enableTorch={false}
            quality={1}
           detectionRefreshRateInMS = {1}
           detectionCountBeforeCapture={10000}
          />  
          
          <View style ={{flex:0.12}}>
           {!this.state.isScanning && <TouchableOpacity
                        style={styles.scanButton}
                        onPress={() =>{ 
                                    this.setState({isScanning: true})
                                    this.state.pdfScannerReference.current.capture()
                                  setTimeout(() => {
                                    
                                    let that = this
                                     if(that.state.isScanning === true){
                                       alert('Scan timed out, please hold phone steady and try again')
                                       that.state.pdfScannerReference.current.forceUpdate()
                                       that.setState({isScanning: false})
                                     }
                                  }, 9000);
                                   
                                    
                                  }}
                                        > 
            
                    
                          <Text style={{ fontSize: 18, color: "white", margin: 10 }}>
                                    Scan
                          </Text>
                  
              
            </TouchableOpacity> ||
           <View style ={{justifyContent:"center",alignItems:"center"}}>
            <Text style = {styles.DocumentText}>
               Please wait while your document is being scanned
            </Text>
          <ActivityIndicator size="large" color="#004799" />
    </View>
        }

          </View>
          </React.Fragment>
        )

    }

    
  }

  



const styles = StyleSheet.create({
  scanner: {
    flex: 0.9,
    aspectRatio:undefined
  },
  scanButton: {
    flex:1,
    backgroundColor: "#f59b00",
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  buttonText: {
    backgroundColor: "rgba(245, 252, 255, 0.7)",
    fontSize: 32,
  },
  preview: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
  },
  permissions: {
    flex:1,
    justifyContent: "center",
    alignItems: "center"
  },
  DocumentText: {
    flexDirection: 'row',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E67F00',
    justifyContent: 'center',
    alignItems: 'center',
  },
})