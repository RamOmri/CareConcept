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
import { CropView } from 'react-native-image-crop-tools';
import CameraRoll from "@react-native-community/cameraroll";
import AmazingCropper, { DefaultFooter } from 'react-native-amazing-cropper';
import CustomCropperFooter from './CustomCropperFooter';

export default class imageCrop extends React.Component {
constructor(props){
  super(props)
  this.state = {
    Images: this.props.route.params.images,
    imageHeight: 1,
    imageWidth: 1,
    cropRef: React.createRef(),
  }
    
}
 
async componentDidMount(){
  await this.getImageSize(this.state.Images[this.state.Images.length - 1].url)
  
}

async onDone(croppedImageUri){
 
  await this.getImageSize(croppedImageUri)
  this.state.Images[this.state.Images.length - 1].url = croppedImageUri
  this.forceUpdate()
}

async getImageSize(img){
  await ImageSize.getSize(img).then(size => {
    this.setState({
      imageHeight: size.height,
      imageWidth: size.width
    })
  }).catch(err => alert(err))
  //alert(this.state.imageHeight + " " + this.state.imageWidth)
}

onError = (err) => {
  console.log(err);
}
onContinue = () =>{
  this.props.navigation.navigate('ScanStack', {params:{img: this.state.Images}, screen: 'ScanPreview'})
}




    render(){
        return(
          
          <React.Fragment>
     
          
                  <AmazingCropper
                      footerComponent={<CustomCropperFooter />}
                      onDone={croppedImg => this.onDone(croppedImg)}
                      onError={this.onError}
                      onCancel = {() => this.onContinue()}
                      //onCancel={this.onCancel}
                      imageUri={this.state.Images[this.state.Images.length - 1].url}
                      imageWidth={this.state.imageWidth}
                     imageHeight={this.state.imageHeight}
                      NOT_SELECTED_AREA_OPACITY={0.3}
                      BORDER_WIDTH={20}
                    />
        
          </React.Fragment>
            
      
        )
    }
}

const styles = StyleSheet.create({
  logo:{

  },
  scanner: {
    flex: 0.9,
    aspectRatio:undefined
  },
  button: {
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