import React, {Component, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  I18nManager,
  Dimensions
} from 'react-native';

import StartScreen from './startScreen'
import Privacy from './Privacy'
import Imprint from './Imprint'
import HowToVid from './HowToVid'

import Scanner from './Scanner';
import ScanPreview from './ScanPreview';
import imageCrop from './imageCrop';

import PolicyInfo from './PolicyInfo';
import SummaryScreen from './SummaryScreen';
import DocumentInfo from './DocumentInfo';


import {connect} from 'react-redux';
import {setLanguage} from './actions/policInfoActions';

import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize'; // Use for caching/memoize for better performance


const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('./translations/eng.json'),
  de: () => require('./translations/De.json'),
  zh: () => require('./translations/chn.json')
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);
const setI18nConfig = async () => {
  console.log()
  const {languageTag, isRTL} = ("endezh".includes(RNLocalize.getLocales()[0].languageCode)) && 
                                RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || await userLanguageSelect()
 
  // clear translation cache
  translate.cache.clear();
  // update layout direction
  try {
    I18nManager.allowRTL(false);
  } catch (e) {
    alert('Something went wrong, please contact technical support ' + e)
  }
  // set i18n-js config
  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
  return JSON.stringify(languageTag)
};

const userLanguageSelect = async () =>{
  let lang = null
  await new Promise((resolve, reject) => { Alert.alert(
    "Language Selection:",
    'Please select your language \n Bitte wählen Sie Ihre Sprache, \n 请选择语言',
    [
      {
        text: "English",
        onPress: () =>{
          lang = {languageTag: 'en', isRTL: false};
          resolve()
        }
      },
      {
        text: 'Deutsch',
        onPress: () =>{
          lang = {languageTag: 'de', isRTL: false};
          resolve()
        }
      },
      {
        text: '中文',
        onPress: () =>{
          lang = {languageTag: 'zh', isRTL: false};
          resolve()
        }
      },
     
    ]
  )})
   return lang
}


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ScanStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      initial: false,
      lazy: false,
      gestureEnabled: !Platform.OS === 'ios',
    }}>
    <Stack.Screen name="Scanner" component={Scanner} />
    <Stack.Screen name="imageCrop" component={imageCrop} />
    <Stack.Screen name="ScanPreview" component={ScanPreview} />
  </Stack.Navigator>
);

const ClaimStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      initial: false,
      lazy: false,
      gestureEnabled: !Platform.OS === 'ios',
    }}>
    <Stack.Screen name="PolicyInfo" component={PolicyInfo} />
    <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
    <Stack.Screen name="DocumentInfo" component={DocumentInfo} />
  </Stack.Navigator>
);

const infoStack = () =>(
  <Tab.Navigator
  
  screenOptions={({ route }) => ({
   
    tabBarLabel: ({ focused, color, size }) => { 
     // setI18nConfig()
      if (route.name === 'Start') {
        return focused ? (<><Image source = {require('./img/startOrange.png')}/>
                              <Text style = {{color:'orange', fontSize:12,}}>{translate('Start')}</Text></>) 
                              :(<><Image source = {require('./img/startWhite.png')}/>
                              <Text style = {{color:'white', fontSize:12, }}>{translate('Start')}</Text></>);
                              }
      else if(route.name === 'HowToVid'){
        return focused ? (<>
          <Image  source = {require('./img/HowToOrange.png')}/>
        <Text style = {{color:'orange', fontSize:12,}}>{translate('How to video')}</Text></>) 
        :(<><Image source = {require('./img/HowToBlue.png')}/>
        <Text style = {{color:'white', fontSize:12, }}>{translate('How to video')}</Text></>);
      }else if(route.name === 'Imprint'){
        return focused ? (<><Image source = {require('./img/imprintOrange.png')}/>
        <Text style = {{color:'orange', fontSize:12}}>{translate("Imprint")}</Text></>)
        :(<><Image source = {require('./img/imprintWhite.png')}/>
        <Text style = {{color:'white', fontSize:12, }}>{translate("Imprint")}</Text></>)
        
      }
      else if(route.name === 'Privacy'){
        return focused ? (<><Image source = {require('./img/privacyOrange.png')}/>
        <Text style = {{color:'orange', fontSize:12, }}>{translate("Privacy")}</Text></>)
        :(<><Image source = {require('./img/privacyWhite.png')}/>
        <Text style = {{color:'white', fontSize:12, }}>{translate("Privacy")}</Text></>)
      }
      
    },
  })}

  tabBarOptions={
    {
      
        style: {
            flex:0.13,
            flexDirection: 'row',
            alignSelf: 'center',
            elevation: 6,
            fontSize:16,
            backgroundColor:'#004799',
            justifyContent:'center',
            alignItems:'center',
        },
        labelStyle: {
          fontSize: 14,
          
          
        },
        inactiveTintColor: 'white',
        activeTintColor:'#f59b00'
    }
}
  >
 <Tab.Screen name = "Start" component = {StartScreen} />
 <Tab.Screen name = 'HowToVid' component = {HowToVid} />
 <Tab.Screen name = "Privacy" component = {Privacy} />
 <Tab.Screen name = "Imprint" component = {Imprint} />
  </Tab.Navigator>

)



class Navigator extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      isLangSelected:false
    }
  }

  async componentDidMount(){
    let lang = await setI18nConfig()
    this.props.setLanguage(lang)
    //console.log(this.props.language) <- uncomment this to get letter code from console
    this.setState({isLangSelected:true})
  }
   render(){
     if(this.state.isLangSelected){
     return(
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: (Platform.OS =='android')
      }
      }>
      <Stack.Screen name = "infoStack"  component = {infoStack} />
      <Stack.Screen name="ClaimStack" component={ClaimStack} />
      <Stack.Screen name="ScanStack" component={ScanStack} />
    </Stack.Navigator>
  </NavigationContainer>
)
    }
    else{
      return(
        <View>

        </View>
      )
    }
}

}

const styles = StyleSheet.create({
  tabs: {},
});



const mapStateToProps = (state) => {
  //alert(JSON.stringify(state))
  return {
    language: state.policyInfoReducers.policyInfo.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLanguage: (lang) => dispatch(setLanguage(lang))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigator)

