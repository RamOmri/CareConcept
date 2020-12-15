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
  TouchableOpacity,
  Dimensions
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
import {connect} from 'react-redux'
import {addDoc} from './actions/claimActions'

import { CommonActions } from '@react-navigation/native';

 class ScanPreview extends React.Component {

  constructor(props){
      super(props)
      this.state = {
      infoObj: this.props.route.params.infoObj,
    }        
  }
  
  
    componentDidMount(){
      this.state.infoObj.pages.reverse()
    }

  
    render(){
        return(
          <View style = {{marginTop:10}}>
            <Modal visible={true} transparent={true}>
             
               <View style ={{flex:0.06, alignItems:'center', flexDirection:'row', justifyContent:'center',}}>
                                    <TouchableOpacity
                                       style={{flex:1, backgroundColor:'#f59b00', alignItems:'center', borderRightWidth:2, borderRightColor:'black'}}
                                        onPress={() =>{
                                          this.state.infoObj.pages.reverse()

                                          

                                         // this.props.navigation.reset('ScanStack', {params:{img: [{url: this.state.finalImages}]}, screen: 'Scanner'})
                                         const resetAction =   CommonActions.reset({
                                                                                  index: 1,
                                                                                  routes: [
                                                                                    {
                                                                                      name: 'Scanner',
                                                                                      params: { infoObj: this.state.infoObj },
                                                                                    },
                                                                                  ],
                                                                                })
                                            this.props.navigation.dispatch(resetAction);
                                         // this.props.navigation.push('Scanner', {params:{img: [{url: this.state.finalImages}]}});
                                        }}
                                            >
                                        <Text style={{ fontSize: 18, color: "white", margin: 10 }}>
                                            Add Page
                                        </Text>
                                    </TouchableOpacity>      

                                    <TouchableOpacity
                                        style={{backgroundColor:'#f59b00', flex: 1, alignItems:'center', borderLeftWidth:2, borderLeftColor:'black'}}
                                        onPress={() =>{                                      
                                          this.props.navigation.navigate('ClaimStack', {params:{}, screen: 'SummaryScreen'})
                                          
                                        }}
                                            >
                                        <Text style={{ fontSize: 18, color: "white", margin: 10 }}>
                                            Delete all Pages
                                        </Text>
                    </TouchableOpacity>  
              </View>
              <View style ={{flex:1}}>
                
                <ImageViewer imageUrls={this.state.infoObj.pages}/>
              </View>
              <View style ={{flex:0.06, alignItems:'center', flexDirection:'row', justifyContent:'center'}}>
                            

                              <TouchableOpacity
                                  style={{backgroundColor:'#f59b00', flex: 1, alignItems:'center'}}
                                  onPress={() =>{
                                    this.state.infoObj.pages.reverse()
                                    this.props.add(this.state.infoObj)
                                    this.props.navigation.navigate('ClaimStack', {params:{}, screen: 'SummaryScreen'})
                                  }}
                                      >
                                  <Text style={{ fontSize: 18, color: "white", margin: 10 }}>
                                      Continue...
                                  </Text>
                              </TouchableOpacity>

              </View>
            </Modal>
          </View>
            
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

const mapStateToProps = (state) =>{
  return{
    docs: state.docReducer.docList
  }
}

const mapDispatchToProps = (dispatch) =>{
  return {
    add: (doc) => dispatch(addDoc(doc)),
    delete: (key) => dispatch(deleteFood(key))
  }
}  

export default connect(mapStateToProps, mapDispatchToProps)(ScanPreview)

