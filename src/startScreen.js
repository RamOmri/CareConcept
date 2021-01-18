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
  Dimensions,
  ActivityIndicator,
  I18nManager,
  ImageBackground,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import DocumentScanner from '@woonivers/react-native-document-scanner';
import ImageSize from 'react-native-image-size';
import ImageViewer from 'react-native-image-zoom-viewer';
import {getStatusBarHeight} from 'react-native-status-bar-height';




import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize'; // Use for caching/memoize for better performance

var language = null

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('./translations/eng.json'),
  de: () => require('./translations/De.json'),
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

const setI18nConfig = async (userSelect) => {
  let lang = userSelect
  if(RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) == null && lang == null) lang = await userLanguageSelect(false)
   
  const {languageTag, isRTL} =
    lang || RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters))
 
  // clear translation cache
  translate.cache.clear();
  // update layout direction
  try {
    I18nManager.allowRTL(false);
  } catch (e) {
    console.log(e);
  }
  // set i18n-js config
  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
   language = JSON.stringify(languageTag)
};


const userLanguageSelect = async (isLangSelected) =>{
  let lang = null
  await new Promise((resolve, reject) => { Alert.alert(
    "Language Selection:",
    'Please select your language \n Bitte wählen Sie Ihre Sprache',
    [
      {
        text: "English",
        onPress: () =>{
          lang = {languageTag: 'en', isRTL: false};
          resolve()
        }
      },
      {
        text: "German",
        onPress: () =>{
          lang = {languageTag: 'de', isRTL: false};
          resolve()
        }
      },
     
    ]
  )})
  if(isLangSelected) setI18nConfig(lang)
  else return lang
}

export default class StartScreen extends React.Component {
  constructor(props) {
    super(props);
   
   
    this.state = {
    };
    
  }

  async componentDidMount() { 
    await setI18nConfig(null)
    this.forceUpdate()
  }

  render() {
    return (
      <React.Fragment>
        {Platform.OS != 'android' && (
          <View style={{paddingTop: getStatusBarHeight()}}>
            <StatusBar />
          </View>
        )}
        <View style={{flex: 1, backgroundColor: '#004799'}}>
          <ImageBackground
            resizeMode="contain"
            style={styles.container}
            source={require('./img/startScreen.jpg')}
            style={{
              resizeMode: 'stretch',
              flex: 1,
            }}>
              <TouchableOpacity
              style = {{
                position:'absolute',
                bottom:Dimensions.get('window').height/8.7,
                right:Dimensions.get('window').width/5,
               }}
              onPress = { async () =>{
                await userLanguageSelect(true)
                this.forceUpdate()
              }}
              >
          <View style = {{height:30,width:100,backgroundColor:'#004799', borderRadius:30, justifyContent:'center', alignItems:'center'}}>   
           <Text style = {{fontSize:10, fontWeight:'bold', color: 'white'}}>
              {translate("Set language")}
           </Text>
           </View> 
        </TouchableOpacity>

            <TouchableOpacity
            style = {{backgroundColor: '#f59b00',
            position: 'absolute',
            height: Dimensions.get('window').width/3.789,
            width: Dimensions.get('window').width/3.789,
            top:Dimensions.get('window').height/4.656,
            borderRadius:1000,
            left:Dimensions.get('window').width/1.5,
            justifyContent:'center',
            alignItems:'center'
          }
          }
            
                onPress ={() =>{
                    this.props.navigation.push('ClaimStack', {
                        params: {},
                        screen: 'PolicyInfo',
                      })
                }}
            >
                 <View style = {{alignItems:'center', justifyContent:'center'}}>
                    <Text style = {{color:'white', fontSize:22, fontWeight:'bold'}}>
                            Start
                    </Text>
              </View>
              </TouchableOpacity>
          </ImageBackground>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    backgroundColor: 'rgba(245, 252, 255, 0.7)',
    fontSize: 32,
  },
});
