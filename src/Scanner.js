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
  Dimensions
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
import RNFetchBlob from 'rn-fetch-blob'
import ImgToBase64 from 'react-native-image-base64';



export default class Scanner extends React.Component {

constructor(props){
 super(props)
  this.state = {
      pdfScannerReference: React.createRef(),
    }
   
}

async unCacheImg(){
  await RNFetchBlob.fs
          .unlink(Img)
          .then(() => {
            //do nothing because file was successfully deleted
          })
          .catch(err => {
            alert(err);
          }); 
  }

async handleScannedDocument(Img, unCroppedImage){   
  let base64Img = ''   
 await  ImgToBase64.getBase64String(Img)
  .then(base64String => {base64Img = base64String})
  .catch(err => alert(err));

  this.unCacheImg(Img)

  this.props.navigation.navigate('ScanStack', {params:{img: base64Img}, screen: 'imageCrop'})
  }

  

    renderScanner(){
        return(
         <React.Fragment>
          <DocumentScanner
            useBase64
            ref={this.state.pdfScannerReference}
            style={styles.scanner}
            onPictureTaken={(picture) =>{
              this.handleScannedDocument(picture.croppedImage, picture.initialImage)
            }}
            overlayColor="rgba(255,130,0, 0.7)"
            enableTorch={false}
            quality={1}
            detectionRefreshRateInMS = {10000}
            detectionCountBeforeCapture={-1}
            detectionRefreshRateInMS={50000}
          /> 
           
           <View style ={{flex:0.1}}>
                   <TouchableOpacity
                       style={styles.scanButton}
                       onPress={() =>{
                                  this.state.pdfScannerReference.current.capture()
                                }}
                                      >
                        <Text style={{ fontSize: 18, color: "white", margin: 10 }}>
                                  Scan
                        </Text>
                  </TouchableOpacity>
            </View>
          
          
          </React.Fragment>
        )

    }

    render(){
      return(
        <React.Fragment>
             {this.renderScanner()}
        </React.Fragment>
      )
    }
  }

  



const styles = StyleSheet.create({
  scanner: {
    flex: 0.9,
    aspectRatio:undefined
  },
  cropButton:{
  //  top: 600,
    width: 220,
    height: 50,
    backgroundColor: "#711401ff",
    //justifyContent: 'center',
   // alignItems: 'center',
   //marginTop: 20,
   borderRadius:30,
  // marginBottom: 20,
  },
  scanButton: {
    width: 220,
    height: 50,
    backgroundColor: "#711401ff",
    justifyContent: 'center',
    alignItems: 'center',
   marginTop: 20,
   borderRadius:30,
   marginBottom: 20,
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
  }
})