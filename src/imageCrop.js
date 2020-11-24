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
    imageHeight: 0,
    imageWidth: 0,
    cropRef: React.createRef()
    
  }

}
 
  crop() {
    this.CustomCrop.crop();
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
                                          this.state.cropRef.current.saveImage()
                                          
                                        }}
                                            >
                                        <Text style={{ fontSize: 18, color: "white", margin: 10 }}>
                                            Rotate
                                        </Text>
                    </TouchableOpacity>
              </View>

              <View style = {{flex: 0.88, margin: 20, justifyContent: 'center', backgroundColor:'black'}}>
                <CropView
                    sourceUrl={this.state.Images[this.state.Images.length - 1].url}
                    style={{flex: 1,
                    backgroundColor: '#E5ECF5'}}
                    ref={this.state.cropRef}
                    onImageCrop={(res) => {
                      this.state.Images[this.state.Images.length - 1] = {url: res.uri}
                      this.forceUpdate()
                    }}
                    aspectRatio={{width: 16, height: 9}}
                 />
               </View>

                <View style ={{flex:0.06, alignItems:'center', flexDirection:'row', justifyContent:'center'}}>
                            

                              <TouchableOpacity
                                  style={{backgroundColor:'#f59b00', flex: 1, alignItems:'center'}}
                                  onPress={() =>{
                                   // CameraRoll.save(this.state.Images[this.state.Images.length - 1].uri) // uncomment this to save the image to your phone library (for testing)
                                    this.props.navigation.navigate('ClaimStack', {params:{img: this.state.Images}, screen: 'ScanPreview'})
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