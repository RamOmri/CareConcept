import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  FlatList
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import DocumentScanner from "@woonivers/react-native-document-scanner"
import ImageSize from 'react-native-image-size'
import { CropView } from 'react-native-image-crop-tools';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuProvider
  } from 'react-native-popup-menu';
  import {connect} from 'react-redux'
  import {addDoc} from './actions/claimActions'
  import {deleteDoc} from './actions/claimActions'
  import { StackActions, NavigationActions } from 'react-navigation';


 class SummaryScreen extends React.Component {
constructor(props){
          super(props)
          this.state = {
            insuranceNumber: '',
            gender: 'please select gender',
            firstName: '',
            surName: '',
          }
         /*  const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'ScanStack' })],
          });
          this.props.navigation.dispatch(resetAction); */
     }

    render(){
        return(
                <ImageBackground style={styles.container}
                    source={require('./img/background.jpg')}
                    style={{ resizeMode: 'stretch', flex: 1, }}
                 >

                                         
                            <Image  source = {require('./img/CareConceptLogo.png')} style = {styles.logo} />

                            <View style = {{flexDirection:'row', justifyContent:'center',}}>
                            
                                    <View style = {styles.documentScanButton}>
                                                        <TouchableOpacity
                                                            onPress = {()=>{
                                                                this.props.navigation.navigate('ClaimStack', {params:{isEditig: false}, screen: 'DocumentInfo'})
                                                            }}
                                                            >
                                                                    <Text
                                                                    style={{color: 'white', fontSize: 16}}
                                                                    >Scan a Document.</Text>
                                                        </TouchableOpacity>
                                    </View>
                        </View>
                                       <FlatList
                                          extraData={this.state} 
                                          data = {this.props.docs}
                          
                                          renderItem = {({item, index}) => (                                         
                                            <TouchableOpacity onPress={()=>{ 
                                                  let pagesInDoc = new Array()
                                                  for(let i = 0; i < item.pages.length; i++){
                                                    pagesInDoc.push({url: item.pages[i].url})
                                                  }
                                                  //alert(JSON.stringify(pagesInDoc))
                                                  this.props.delete(item.key)
                                                  this.props.navigation.navigate('ClaimStack', {params:{isEditing:  true, pages: pagesInDoc}, screen: 'DocumentInfo'})          
                                                }  
                                              }>
                                             <View style = {{marginTop: 10, justifyContent:'center', alignItems:'center'}}>
                                                  <Image                                             
                                                  source={{uri: item.pages[0].url}}
                                                  style={{flex: 1,
                                                    width: 200,
                                                    height: 400,
                                                    margin: 10,
                                                    resizeMode: 'contain'}}
                                                />
                                              </View>
                                            </TouchableOpacity>   
                                              )}
                                      />
                                      
                                    
                       
                        <View style = {{flex: 1, justifyContent: 'flex-end', marginBottom: 10, alignItems: 'center', marginTop: 3}}>
                                
                                <View style = {styles.button}>
                                                    <TouchableOpacity
                                                        onPress = {()=>{
                                                            this.props.navigation.navigate('ClaimStack', {params:{}, screen: 'SummaryScreen'})
                                                        }}
                                                        >
                                                                <Text
                                                                style={{color: 'white', fontSize: 12}}
                                                                >Send...</Text>
                                                    </TouchableOpacity>
                                </View>
                    </View>
                
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
  logo:{
        margin: 10,
        
  },
  documentScanButton: {
    flex:1,
    height: 50,
    backgroundColor: "#E67F00",
    justifyContent: 'center',
    alignItems: 'center',
   marginTop: 30,
   borderRadius:15,
   margin: 10,
  },
  button: {
    width: 150,
    height: 45,
    backgroundColor: "#E67F00",
    justifyContent: 'center',
    alignItems: 'center',
   marginTop: 30,
   borderRadius:15,
   margin: 10,
  },
  nameInput:{
    marginTop:12,
    margin:2,
    borderWidth: 1,
    width: 200,
    height:40,
    borderColor:'#f59b00',
    backgroundColor:'#E5ECF5'
  },
  policyInput:{
    margin:20,
    borderWidth: 1,
    width: 250,
    height:40,
    borderColor:'#f59b00',
    backgroundColor:'#E5ECF5'
  },
  scanner: {
    flex: 0.9,
    aspectRatio:undefined
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

const mapStateToProps = (state) => {
  console.log(state);
  return {
    docs: state.docReducer.docList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    delete: (key) => dispatch(deleteDoc(key))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SummaryScreen)