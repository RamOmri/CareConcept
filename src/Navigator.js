import React, { Component, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import {
  StyleSheet,
  Text, TextInput,
  View, Button, ImageBackground,
  Image, TouchableOpacity,
  Alert,StatusBar,ScrollView,
  KeyboardAvoidingView
} from 'react-native'

import Scanner from './Scanner'
import imageCrop from './imageCrop'

    const Stack = createStackNavigator()

 const ScanStack = () => (
      <Stack.Navigator screenOptions={{
        headerShown: false
        }}>
      <Stack.Screen name='Scanner' component={Scanner} />
      <Stack.Screen name= 'imageCrop' component={imageCrop} />
    
    </Stack.Navigator>

    )
   


export default () => (
   
        <NavigationContainer >
              <Stack.Navigator screenOptions={{
                  headerShown: false
                  }}>
                <Stack.Screen name='ScanStack' component={ScanStack} />
              </Stack.Navigator>
    
          
    
        </NavigationContainer>
      
)

const styles = StyleSheet.create({
  tabs: {
    
  },

})