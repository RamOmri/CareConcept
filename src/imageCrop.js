import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity
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


export default class imageCrop extends React.Component {
constructor(props){
  super(props)
  this.state = {
    scannedImage: this.props.route.params.img,
    imageHeight: 0,
    imageWidth: 0,
    cropRef: React.createRef()
    
  }

}

componentDidMount(){
 // alert(this.state.scannedImage)
}


  updateImage(image, newCoordinates) {
    this.setState({
      image,
      rectangleCoordinates: newCoordinates
    });
  }
 
  crop() {
    this.CustomCrop.crop();
  }
    render(){
        return(
          <View style = {{flex: 1}}>
            <CropView
          sourceUrl={this.state.scannedImage}
          style={{flex: 1,
            backgroundColor: 'red'}}
          ref={this.state.cropRef}
          onImageCrop={(res) => console.warn(res)}
          //keepAspectRatio
          aspectRatio={{width: 16, height: 9}}
        />
        </View>
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