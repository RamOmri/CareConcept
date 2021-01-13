import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions,
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
import ImageViewer from 'react-native-image-zoom-viewer';
import {connect} from 'react-redux'
import {addDoc} from './actions/claimActions'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { CommonActions } from '@react-navigation/native';

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
 class ScanPreview extends React.Component {

  constructor(props){
      super(props)
      this.state = {
      infoObj: this.props.route.params.infoObj,
    }        
  }
  
  
    componentDidMount(){
      this.state.infoObj.pages.reverse()
    }

  
    render(){
        return(
          <View style = {{marginTop:10}}>
           
            <Modal visible={true} transparent={true}>
              {(Platform.OS != "android") && 
              <View style = {{paddingTop: getStatusBarHeight()}}>
                 <StatusBar />
               </View>}
               <View style ={{flex:0.1, alignItems:'center', flexDirection:'row', justifyContent:'center', backgroundColor:"black"}}>
                                    <TouchableOpacity
                                       style={{flex:1, backgroundColor:'#f59b00', alignItems:'center', borderRightWidth:2, borderRightColor:'black'}}
                                        onPress={() =>{
                                          if(this.state.infoObj.pages.length <20){
                                          this.state.infoObj.pages.reverse()
                                         // this.props.navigation.reset('ScanStack', {params:{img: [{url: this.state.finalImages}]}, screen: 'Scanner'})
                                         const resetAction =   CommonActions.reset({
                                                                                  index: 1,
                                                                                  routes: [
                                                                                    {
                                                                                      name: 'Scanner',
                                                                                      params: { infoObj: this.state.infoObj },
                                                                                    },
                                                                                  ],
                                                                                })
                                            this.props.navigation.dispatch(resetAction);
                                         // this.props.navigation.push('Scanner', {params:{img: [{url: this.state.finalImages}]}});
                                                                              }
                                                                              else{
                                                                                alert(translate("number of pages per document cannot be more than 20"))
                                                                              }
                                        }}
                                            >
                                        <Text style={{ fontSize: 15, color: "white", margin: 10 }}>
                                            {translate("Add Page")}
                                        </Text>
                                    </TouchableOpacity>      

                                    <TouchableOpacity
                                        style={{backgroundColor:'#f59b00', flex: 1, alignItems:'center', borderLeftWidth:2, borderLeftColor:'black'}}
                                        onPress={() =>{                                      
                                          this.props.navigation.navigate('ClaimStack', {params:{}, screen: 'SummaryScreen'})
                                          
                                        }}
                                            >
                                        <Text style={{ fontSize: 15, color: "white", margin: 10 }}>
                                            {translate("Delete all Pages")}
                                        </Text>
                    </TouchableOpacity>  
              </View>
              <View style ={{flex:1}}>
                
                <ImageViewer imageUrls={this.state.infoObj.pages}/>
              </View>
            <View style ={{flex:0.1, alignItems:'center', flexDirection:'row', justifyContent:'center', backgroundColor:"black"}}>
                            

                              <TouchableOpacity
                                  style={{backgroundColor:'#f59b00', flex: 1, alignItems:'center'}}
                                  onPress={() =>{
                                    this.state.infoObj.pages.reverse()
                                    this.props.add(this.state.infoObj)
                                    this.props.navigation.navigate('ClaimStack', {params:{}, screen: 'SummaryScreen'})
                                  }}
                                      >
                                  <Text style={{ fontSize: 18, color: "white", margin: 10 }}>
                                      {translate("Continue")}
                                  </Text>
                              </TouchableOpacity>

              </View>
            </Modal>
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

const mapStateToProps = (state) =>{
  return{
    docs: state.docReducer.docList
  }
}

const mapDispatchToProps = (dispatch) =>{
  return {
    add: (doc) => dispatch(addDoc(doc)),
    delete: (key) => dispatch(deleteFood(key))
  }
}  

export default connect(mapStateToProps, mapDispatchToProps)(ScanPreview)

