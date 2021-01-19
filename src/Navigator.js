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

const infoStack = () => (
  <Tab.Navigator
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
            alignItems:'center'
        },
        labelStyle: {
          fontSize: 14,
          fontWeight:'bold'
          
        },
        inactiveTintColor: 'white',
        activeTintColor:'#f59b00'
    }
}
  >
 <Tab.Screen name = "Start" component = {StartScreen} />
 <Tab.Screen name = "Information" component = {InfoMenu} />
 <Tab.Screen name = "Imprint" component = {InfoMenu} />
  </Tab.Navigator>
)

export default () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }
      }>
      <Stack.Screen name = "infoStack" component = {infoStack} />
      <Stack.Screen name="ClaimStack" component={ClaimStack} />
      <Stack.Screen name="ScanStack" component={ScanStack} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabs: {},
});
