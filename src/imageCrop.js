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
import CameraRoll from "@react-native-community/cameraroll";


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
 
componentDidMount = () => {
  this.getImageSize()
}

async getImageSize(){
  await Image.getSize(this.state.Images[this.state.Images.length - 1].url, (width, height) => {
    this.setState({
      imageHeight: height,
      imageWidth: width
    })
  });
 // alert(this.state.imageHeight + " " + this.state.imageWidth)
}
    render(){
        return(
          
          <View style = {{flex:1, backgroundColor:'#E5ECF5', justifyContent:'center',}}>
              <View style ={{flex:0.06, alignItems:'center', flexDirection:'row', justifyContent:'center'}}>
                                    <TouchableOpacity
                                        style={{flex:1, backgroundColor:'#f59b00', alignItems:'center', borderRightWidth:2, borderRightColor:'white'}}
                                        onPress={() =>{
                                          this.state.cropRef.current.saveImage(true, 100)
                                        }}
                                            >
                                        <Text style={{ fontSize: 18, color: "white", margin: 10 }}>
                                            Crop
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{backgroundColor:'#f59b00', flex: 1, alignItems:'center', borderLeftWidth:2, borderLeftColor:'white'}}
                                        onPress={() =>{
                                          this.state.cropRef.current.rotateImage(true) 
                                          
                                          
                                        }}
                                            >
                                        <Text style={{ fontSize: 18, color: "white", margin: 10 }}>
                                            Rotate
                                        </Text>
                    </TouchableOpacity>
              </View>

              <View style = {{flex: 0.88, margin: 20, justifyContent: 'center', backgroundColor:'white', alignItems:'center'}}>
                <CropView
                    sourceUrl={this.state.Images[this.state.Images.length - 1].url}
                    style={{aspectRatio: this.state.imageWidth/this.state.imageHeight,
                      flex:1,
                      width: this.state.imageWidth,
                    backgroundColor: '#E5ECF5'}}
                    ref={this.state.cropRef}
                    onImageCrop={(res) => {
                      this.state.Images[this.state.Images.length - 1] = {url: res.uri}
                      this.forceUpdate()
                    }}
                    onImageRotate={(res)=>{
                        this.state.Images[this.state.Images.length - 1] = {url: res.uri}
                      this.forceUpdate()
                    }}
                   // keepAspectRatio
                    //aspectRatio={{width: this.state.imageWidth, height: this.state.imageHeight}}
                 />
               </View>

                <View style ={{flex:0.06, alignItems:'center', flexDirection:'row', justifyContent:'center'}}>
                            

                              <TouchableOpacity
                                  style={{backgroundColor:'#f59b00', flex: 1, alignItems:'center'}}
                                  onPress={() =>{
                                   // CameraRoll.save(this.state.Images[this.state.Images.length - 1].uri) // uncomment this to save the image to your phone library (for testing)
                                    this.props.navigation.navigate('ScanStack', {params:{img: this.state.Images, index: -1}, screen: 'ScanPreview'})
                                  }}
                                      >
                                  <Text style={{ fontSize: 18, color: "white", margin: 10 }}>
                                      Continue
                                  </Text>
                              </TouchableOpacity>

              </View>
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