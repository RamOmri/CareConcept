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
  Image
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import DocumentScanner from "@woonivers/react-native-document-scanner"
import CustomCrop from "react-native-perspective-image-cropper";
import ImageSize from 'react-native-image-size'
import ImgToBase64 from 'react-native-image-base64';


export default class Scanner extends React.Component {

constructor(props){
 super(props)
  this.state = {
      image: null,
      pdfScannerElement: React.createRef(),
      isScannerRendered: true,
      isCropperRendered: false,
      isImagePreview: false,

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
        await ImageSize.getSize(base64Img).then(size => {
           this.setState({
             initialImage: base64Img,
            originImg: init,
            imageWidth: size.width,
            imageHeight: size.height,
            rectangleCoordinates: {
              topLeft: { x: -10, y: 10 },
              topRight: { x: 10, y: 10 },
              bottomRight: { x: 10, y: -10 },
              bottomLeft: { x: 10, y: -10 }
            },
             isScannerRendered: false,
            isCropperRendered: true 
          }) 
          
      }).
      catch(err => alert("Something went wrong while attempting to setup image-croper: " + err));

     
          
      }

    updateImage(image, newCoordinates) {
      this.setState({
        initialImage: image,
       // rectangleCoordinates: newCoordinates,
        isCropperRendered: false,
        isImagePreview: true,
      });
    }
   
    crop() {
      this.customCrop.crop();
    }

    renderCropper(){
      return(
        <View>
        <View style = {{flex:1, width: this.state.imageWidth/5, height: this.state.imageHeight/5}}>
          
       <CustomCrop
       style = {{
         marginTop:100,
         margin: 100, 
         
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
      <View>
        <TouchableOpacity  style={styles.cropButton} onPress={this.crop.bind(this)}>
          <Text>CROP IMAGE</Text>
        </TouchableOpacity>
      </View>
      </View>
      )
  }

  renderPreview(){
    return(
      <View style = {{alignContent: 'center', justifyContent:'center', alignItems:'center'}}>
      <Image  style={{ marginTop: 40, width: this.state.imageWidth/5, height: this.state.imageHeight/5, borderWidth:5, borderColor: 'black', resizeMode: 'stretch'}}
      resizeMode='contain' source={{uri: `data:image/gif;base64,${this.state.initialImage}`}} />
      </View>
    )
  }

    render(){
      return(
        <React.Fragment>
             {this.state.isScannerRendered && this.renderScanner()}
             {this.state.isCropperRendered && this.renderCropper()}
             {this.state.isImagePreview && this.renderPreview()}
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
    top: 600,
    width: 220,
    height: 50,
    backgroundColor: "#711401ff",
    justifyContent: 'center',
    alignItems: 'center',
   marginTop: 20,
   borderRadius:30,
   marginBottom: 20,
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