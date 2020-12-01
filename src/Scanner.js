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



export default class Scanner extends React.Component {

constructor(props){
 super(props)
  this.state = {
      pdfScannerReference: React.createRef(),
      Images: this.props.route.params.images
    }
   
}

 handleScannedDocument(Img, init){    
  this.state.Images.push({url: Img})  
  
  this.props.navigation.navigate('ScanStack', {params:{images: this.state.Images}, screen: 'imageCrop'})
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
          <DocumentScanner
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
           
           <View style ={{flex:0.12}}>
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
  }
})