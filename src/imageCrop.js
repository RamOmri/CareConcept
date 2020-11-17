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
import CustomCrop from "react-native-perspective-image-cropper";
import ImageSize from 'react-native-image-size'


export default class imageCrop extends React.Component {
constructor(props){
  super(props)
  this.state = {
    croppedImage: this.props.route.params.cropped,
    initialImage: this.props.route.params.initial,
    imageHeight: 0,
    imageWidth: 0,
    rectangleCoordinates: null
    
  }

  ImageSize.getSize(this.props.route.params.initial).then(size => {
    this.setState({
      imageWidth: size.width,
      imageHeight: size.height,
      rectangleCoordinates: {
        topLeft: { x: 10, y: 10 },
        topRight: { x: 10, y: 10 },
        bottomRight: { x: 10, y: 10 },
        bottomLeft: { x: 10, y: 10 }
      }
    });
})

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
          <View>
         <CustomCrop
          style={{
            flex: 0,
            aspectRatio: 1,
            backgroundColor: 'red',
            border: '1px solid red',
          }}
          updateImage={()=>{

          }}
          //rectangleCoordinates={this.state.rectangleCoordinates}
          initialImage=  {require('./me.jpg')}
          height={this.state.imageHeight}
          width={this.state.imageWidth}
          path={this.state.path}
          ref={ref => (this.CustomCrop = ref)}
          overlayColor="rgba(18,190,210, 1)"
          overlayStrokeColor="rgba(20,190,210, 1)"
          handlerColor="rgba(20,150,160, 1)"
          enablePanStrict={false}
        /> 
          <TouchableOpacity onPress={this.crop.bind(this)}>
            <Text>CROP IMAGE</Text>
          </TouchableOpacity>
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