import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Modal
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


export default class ScanPreview extends React.Component {

  state = {
    finalImage: [{url: this.props.route.params.img}]
  }

  componentDidMount(){
   // alert(this.state.finalImage[0].url)
  }
  
    render(){
        return(
      
            <Modal visible={true} transparent={true}>
              <ImageViewer imageUrls={this.state.finalImage}/>
            </Modal>
            
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