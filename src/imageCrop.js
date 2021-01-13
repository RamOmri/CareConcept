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
  Dimensions,
  ActivityIndicator,
  Platform,
  I18nManager,
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

import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize"; // Use for caching/memoize for better performance


const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require("./translations/eng.json"),
  de: () => require("./translations/De.json")
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

const setI18nConfig = () => {
  // fallback if no available language fits
  const fallback = { languageTag: "en", isRTL: false };

  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};
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
   setI18nConfig(); // set initial config
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
              <View style = {{ flex: 1}}>
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
        <View style = {{   position: 'absolute', 
        top: 0, left: 0, 
        right: 0, bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center'}}>
          <ActivityIndicator size = "large" color = "#004799" />
        </View>
      );
      
        
    }

     CustomCropperFooter = (props) => {
       
       return(
        <View style={{flexDirection:"row", justifyContent:"center"}}>
            <TouchableOpacity onPress={()=>{
              this.state.infoObj.pages.splice(this.state.infoObj.pages.length - 1, 1)
              if(Platform.OS === 'ios') this.props.navigation.push('ScanStack', {params:{infoObj: this.state.infoObj,}, screen: 'Scanner'})
              else this.props.navigation.navigate('ScanStack', {params:{infoObj: this.state.infoObj,}, screen: 'Scanner'})
              }} style={styles.button}>
            <Text style={styles.text}>{translate("Rescan")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.setState({loading:true})
           props.onDone()}} style={styles.button}>
            <Text style={styles.text}>{translate("Crop")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onCancel} style={styles.button}>
            <Text style={styles.text}>{translate("Continue")}</Text>
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
    width: Dimensions.get('window').width/4,
    height: Dimensions.get('window').height/13,
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