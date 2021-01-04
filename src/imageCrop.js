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
import { getStatusBarHeight } from 'react-native-status-bar-height';


export default class imageCrop extends React.Component {
constructor(props){
  super(props)
  this.state = {
    infoObj: this.props.route.params.infoObj,
    cropRef: React.createRef(),
    imageHeight: 0,
    imageWidth: 0,
    loading: true
  }
    //alert(JSON.stringify(this.state.infoObj.pages[this.state.infoObj.pages.length - 1].url))
}
 
async componentDidMount(){
  await this.getImageSize(this.state.infoObj.pages[this.state.infoObj.pages.length - 1].url)
  
}

 async onDone(croppedImageUri){
   
 this.state.infoObj.pages.splice(this.state.infoObj.pages.length - 1, 1, {url: croppedImageUri})
  await this.getImageSize(croppedImageUri) 
}

async getImageSize(img){
  await ImageSize.getSize(img).then(size => {
    this.setState({
      imageHeight: size.height,
      imageWidth: size.width,
      loading: false
    })
  }).catch(err => alert(err))
  //alert(this.state.imageHeight + " " + this.state.imageWidth)
}

onError = (err) => {
  console.log(err);
}
onContinue = () =>{
  this.props.navigation.navigate('ScanStack', {params:{infoObj: this.state.infoObj}, screen: 'ScanPreview'})
}




    render(){
      if(!this.state.loading){
            return(         
              <React.Fragment>
              <View style ={{flex:1}}>
              {(Platform.OS != "android") && 
              <View style = {{paddingTop: getStatusBarHeight()}}>
                 <StatusBar />
               </View>}
              
                      <AmazingCropper
                          
                         footerComponent={ <this.CustomCropperFooter />}
                        
                          onDone={ (croppedImageUri) => {
                            this.onDone(croppedImageUri)}
                             
                          }
                          onError={this.onError}
                          onCancel = {() => this.onContinue()}
                          imageUri={this.state.infoObj.pages[this.state.infoObj.pages.length - 1].url}
                          imageWidth={this.state.imageWidth}
                          imageHeight={this.state.imageHeight}
                          initialRotation = {0}
                        />
                </View>
              </React.Fragment>
         
         
         )
      }
      else return(
        <View>
          <Text> please wait...</Text>
        </View>
      );
      
        
    }

     CustomCropperFooter = (props) => {
       
       return(
        <View style={{flexDirection:"row", justifyContent:"center"}}>
          <TouchableOpacity onPress={()=>{this.setState({loading:true})
           props.onDone()}} style={styles.button}>
            <Text style={styles.text}>Crop</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onCancel} style={styles.button}>
            <Text style={styles.text}>Continue</Text>
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
    width: 200,
    height: 50,
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center',
    margin:10,
   marginTop: 20,
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