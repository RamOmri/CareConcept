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
  I18nManager
} from 'react-native';

import StartScreen from './startScreen'
import InfoMenu from './infoMenu'
import Imprint from './Imprint'

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
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);
const setI18nConfig = async () => {
  const {languageTag, isRTL} = ("ende".includes(RNLocalize.getLocales()[0].languageCode)) && 
                                RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || await userLanguageSelect()
 
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
  return JSON.stringify(languageTag)
};

const userLanguageSelect = async () =>{
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
        text: 'Deutsch',
        onPress: () =>{
          lang = {languageTag: 'de', isRTL: false};
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

const infoStack = ({lang}) =>(
  <Tab.Navigator
  
  screenOptions={({ route }) => ({
   
    tabBarLabel: ({ focused, color, size }) => { 
     // setI18nConfig()
      if (route.name === 'Start') {
        return focused ? (<><Image source = {require('./img/startOrange.png')}/>
                              <Text style = {{color:'orange', fontSize:12,}}>{translate('Start')}</Text></>) 
                              :(<><Image source = {require('./img/startWhite.png')}/>
                              <Text style = {{color:'white', fontSize:12, }}>{translate('Start')}</Text></>);
      }else if(route.name === 'Imprint'){
        return focused ? (<><Image source = {require('./img/imprintOrange.png')}/>
        <Text style = {{color:'orange', fontSize:12, fontWeight:'700'}}>{translate("Imprint")}</Text></>)
        :(<><Image source = {require('./img/imprintWhite.png')}/>
        <Text style = {{color:'white', fontSize:12, }}>{translate("Imprint")}</Text></>)
        
      }
      else if(route.name === 'privacy'){
        return focused ? (<><Image source = {require('./img/privacyOrange.png')}/>
        <Text style = {{color:'orange', fontSize:12, fontWeight:'700'}}>{translate("Privacy")}</Text></>)
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
          fontWeight:'700',
          
          
        },
        inactiveTintColor: 'white',
        activeTintColor:'#f59b00'
    }
}
  >
 <Tab.Screen name = "Start" component = {StartScreen} />
 <Tab.Screen name = "privacy" component = {InfoMenu} />
 <Tab.Screen name = "Imprint" component = {InfoMenu} />
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
    console.log(this.props.language)
    this.setState({isLangSelected:true})
  }
   render(){
     if(this.state.isLangSelected){
     return(
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: (Platform.OS !='android')
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

