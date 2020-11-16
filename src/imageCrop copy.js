import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import DocumentScanner from "@woonivers/react-native-document-scanner"


export default class imageCrop extends React.Component {

  state = {
    imageInit: this.props.route.params.cropped,
    imageCropped: this.props.route.params.initial
  }
    render(){
        return(
            <ScrollView>
                <Image
                   style={{ width: 350, height: 500, marginBottom: 10, borderWidth:5, borderColor: 'black', resizeMode: 'stretch'}}
                  resizeMode='contain'
                  source={{uri: this.props.route.params.cropped}}
                  />  
                  <Image
                   style={{ width: 350, height: 500, marginBottom: 10, borderWidth:5, borderColor: 'black', resizeMode: 'stretch'}}
                  resizeMode='contain'
                  source={{uri: this.props.route.params.initial}}
                  />   
            </ScrollView>
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