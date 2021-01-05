import React, { Component, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import {
  StyleSheet,
  Text, TextInput,
  View, Button, ImageBackground,
  Image, TouchableOpacity,
  Alert,StatusBar,ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native'

import Scanner from './Scanner'
import ScanPreview from './ScanPreview'
import imageCrop from './imageCrop'

import PolicyInfo from './PolicyInfo'
import SummaryScreen from './SummaryScreen'
import DocumentInfo from './DocumentInfo'

    const Stack = createStackNavigator()

 const ScanStack = () => (
      <Stack.Navigator screenOptions={{
        headerShown: false,
        initial:false,
        lazy: false
        }}>
       
      <Stack.Screen name='Scanner' component={Scanner} />
      <Stack.Screen name= 'imageCrop' component={imageCrop} />
      <Stack.Screen name = 'ScanPreview' component = {ScanPreview} />
       
    
    </Stack.Navigator>

    )

    const ClaimStack = () => (
      <Stack.Navigator screenOptions={{
        headerShown: false,
        initial:false,
        lazy: false,
        gestureEnabled:(!Platform.OS === "ios")
        }}>
      <Stack.Screen name='PolicyInfo' component={PolicyInfo} />
      <Stack.Screen name = 'SummaryScreen' component = {SummaryScreen} />
      <Stack.Screen name = 'DocumentInfo' component = {DocumentInfo} />
     
    
    </Stack.Navigator>
    )
   


export default () => (
   
        <NavigationContainer >
              <Stack.Navigator screenOptions={{
                  headerShown: false
                  }}>
                <Stack.Screen name= 'ClaimStack' component={ClaimStack} />
                <Stack.Screen name='ScanStack' component={ScanStack} />
              </Stack.Navigator>
    
          
    
        </NavigationContainer>
      
)

const styles = StyleSheet.create({
  tabs: {
    
  },

})