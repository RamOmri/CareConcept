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
      image: null,
      pdfScannerElement: React.createRef(),
      isScannerRendered: true,
      isCropperRendered: false,

      originImg: null,
      imgURI: null,
      croppedImage: null,
      initialImage: null,
      imageHeight: 0,
      imageWidth: 0,
      rectangleCoordinates: null
    }
   
}

  


    renderScanner(){
        return(
         <React.Fragment>
          <DocumentScanner
          useBase64 = {true}
            ref={this.state.pdfScannerElement}
            style={styles.scanner}
            onPictureTaken={(data) =>{
              this.handleScannedDocument(data.croppedImage, data.initialImage)
              //this.props.navigation.navigate('ScanStack', {params:{cropped:data.croppedImage, initial:data.initialImage}, screen: 'imageCrop'})
            }}
            overlayColor="rgba(255,130,0, 0.7)"
            enableTorch={false}
            quality={1}
            detectionRefreshRateInMS = {10000}
            detectionCountBeforeCapture={-1}
            detectionRefreshRateInMS={50}
          /> 
           
           <View style ={{flex:0.1}}>
                                        <TouchableOpacity
                                  style={styles.scanButton}
                                  onPress={() =>{
                                         this.state.pdfScannerElement.current.capture()
                                  }}
                                      >
                                  <Text style={{ fontSize: 18, color: "white", margin: 10 }}>
                                      Scan
                                  </Text>
                              </TouchableOpacity>
                                            </View>
          
          
          </React.Fragment>
        )
        this.setState({ScanView : this.renderScanner()})
    }



    async handleScannedDocument(base64Img, init){      
      this.props.navigation.navigate('ScanStack', {params:{img: base64Img}, screen: 'imageCrop'})
      }

    updateImage(image, newCoordinates) {
      images = []
      images.push({url: `data:image/gif;base64,${image}`})
      this.props.navigation.navigate('ScanStack', {params:{img: images}, screen: 'ScanPreview'})
    /*   this.setState({
        initialImage: image,
       // rectangleCoordinates: newCoordinates,
        isCropperRendered: false,
        isImagePreview: true,
      }); */
    }
   
    crop() {
      this.customCrop.crop();
    }

    renderCropper(){
      return(
        
        <View >
        <View> 
          <View style = {{marginBottom:20,}}>
          <TouchableOpacity  style={styles.cropButton} onPress={this.crop.bind(this)}>
          <Text>CROP IMAGE</Text>
        </TouchableOpacity>
          </View>
          <View>
       <CustomCrop
              style = {{
              /*   marginTop:100,
                margin: 100,  */
                
              }}
            updateImage={this.updateImage.bind(this)}
            //rectangleCoordinates={this.state.rectangleCoordinates}
            initialImage={this.state.initialImage}
            height={this.state.imageHeight}
            width={this.state.imageWidth}
            ref={(ref) => this.customCrop = ref}
            overlayColor="rgba(18,190,210, 1)"
            overlayStrokeColor="rgba(20,190,210, 1)"
            handlerColor="rgba(20,150,160, 1)"
            enablePanStrict={true}
      /> 
      </View>
        
       </View> 
  
     {/*  <View>
       
      </View> */}

      </View>
      )
  }

  

    render(){
      return(
        <React.Fragment>
             {this.state.isScannerRendered && this.renderScanner()}
             {this.state.isCropperRendered && this.renderCropper()}
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