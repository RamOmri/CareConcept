import React, {Image} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import DocumentScanner from "@woonivers/react-native-document-scanner"


export default class Scanner extends React.Component {


    state = {
      image: null,
      pdfScannerElement: React.createRef()
    }
  

  


    render(){
        return(
         <React.Fragment>
          <DocumentScanner
            ref={this.state.pdfScannerElement}
            style={styles.scanner}
            onPictureTaken={(data) =>{
              this.props.navigation.navigate('ScanStack', {params:{cropped:data.croppedImage, initial:data.initialImage}, screen: 'imageCrop'})
            }}
            overlayColor="rgba(255,130,0, 0.7)"
            enableTorch={false}
            quality={1}
            detectionRefreshRateInMS = {10000}
            detectionCountBeforeCapture={-1}
            detectionRefreshRateInMS={50}
          /> 
           
           <View style ={{flex:0.1}}>
                                        <TouchableOpacity
                                  style={styles.button}
                                  onPress={() =>{
                                         this.state.pdfScannerElement.current.capture()
                                  }}
                                      >
                                  <Text style={{ fontSize: 18, color: "white", margin: 10 }}>
                                      Scan
                                  </Text>
                              </TouchableOpacity>
                                            </View>
          
          
          </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
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