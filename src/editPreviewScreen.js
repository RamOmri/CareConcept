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
import ImageViewer from 'react-native-image-zoom-viewer';


export default class ScanPreview extends React.Component {

  constructor(props){
      super(props)
      this.state = {
      Document: this.props.route.params.document,
      Index: this.props.route.params.index
    }
   /*  const navigateToScreen = this.props.navigation.addListener('focus', () => {
     this.state.Index = this.props.route.params.index
        
  });   */  
    
  }
  
    componentDidMount(){
      //alert(this.state.Index)  
     //this.state.finalImages.reverse()
    }

  
    render(){
        return(
      
            <Modal visible={true} transparent={true}>
               <View style ={{flex:0.06, alignItems:'center', flexDirection:'row', justifyContent:'center'}}>
                                 <TouchableOpacity
                                  style={{backgroundColor:'#f59b00', flex: 1, alignItems:'center'}}
                                  onPress={() =>{
                                    this.props.navigation.navigate('ClaimStack', {params:{Document: this.state.Document, index: this.state.Index}, screen: 'SummaryScreen'})
                                  }}
                                      >
                                        <Text style={{ fontSize: 18, color: "white", margin: 10 }}>
                                            Delete entire document
                                        </Text>
                                 </TouchableOpacity>                  
 
              </View>
              <View style ={{flex:1}}>
                
                <ImageViewer imageUrls={this.state.Document}/>
              </View>
              <View style ={{flex:0.06, alignItems:'center', flexDirection:'row', justifyContent:'center'}}>
                                 <TouchableOpacity
                                  style={{backgroundColor:'#f59b00', flex: 1, alignItems:'center'}}
                                  onPress={() =>{
                                    this.props.navigation.navigate('ClaimStack', {params:{Document: [], index: -1}, screen: 'SummaryScreen'})
                                  }}
                                      >
                                        <Text style={{ fontSize: 18, color: "white", margin: 10 }}>
                                            Go Back
                                        </Text>
                              </TouchableOpacity>            

                              

              </View>
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