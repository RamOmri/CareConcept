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
  Dimensions,
  ImageBackground,
  FlatList,
  Button
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
  import ImgToBase64 from 'react-native-image-base64';
  import base64Image from './base64Example';
  import { getStatusBarHeight } from 'react-native-status-bar-height';
  const sha256 = require('sha256')


class SummaryScreen extends React.Component {
constructor(props){
          super(props)
          this.state = {
            insuranceNumber: '',
            gender: 'please select gender',
            firstName: '',
            surName: '',
          }
         
     }
     

    render(){
        return(
                <ImageBackground style={styles.container}
                    source={require('./img/background.jpg')}
                    style={{ resizeMode: 'stretch', flex: 1, }}
                 >
                   {(Platform.OS != "android") && 
              <View style = {{paddingTop: getStatusBarHeight()}}>
                 <StatusBar />
               </View>}
               <View style = {{flex: 1}}>
                                         
                            <Image  source = {require('./img/CareConceptLogo.png')} style = {styles.logo} />
                              
                              <TouchableOpacity
                                onPress={()=>{
                                  this.props.navigation.navigate('ClaimStack', {params:{isEditing: false}, screen: 'DocumentInfo'})
                                }}
                              >
                                <View style = {{ width: Dimensions.get('window').width, backgroundColor:"#E67F00", height: Dimensions.get('window').height/16, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style = {{color: 'white', fontSize:16}}>
                                      Scan a new Document
                                    </Text>
                                </View>
                              </TouchableOpacity>
                            
                                
                                       
                            <ScrollView
                              contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}
                            >
                                       <FlatList
                                          extraData={this.state} 
                                          data = {this.props.docs}
                          
                                          renderItem = {({item, index}) => (                                         
                                            <TouchableOpacity onPress={()=>{ 
                                                  let info = item
                                                 
                                                  this.props.delete(item.key)
                                                  this.props.navigation.navigate('ClaimStack', {params:{isEditing:  true, infoObj: info}, screen: 'DocumentInfo'})          
                                                }  
                                              }>
                                             <View style = {{marginTop: 10, justifyContent:'center', alignItems:'center'}}>
                                                <Text style = {styles.DocumentText}>{`This is a ${item.document.docType} with ${item.document.pages.length} page/s`}</Text>
                                                  <Image                                             
                                                  source={{uri: item.document.pages[0].url}}
                                                  style={{
                                                    flex: 1,
                                                    margin:5,
                                                    width: Dimensions.get('window').width/1.5,
                                                    height: Dimensions.get('window').height/3,
                                                    resizeMode: 'contain'}}
                                                />
                                              </View>
                                            </TouchableOpacity>   
                                              )}
                                      />
                                      
                                    
                       
                        <View style = {{flex: 1, justifyContent: 'flex-end', marginBottom: 10, alignItems: 'center', marginTop: 3}}>
                                
                                
                                                <TouchableOpacity
                                                    onPress = {()=>{
                                                        this.constructObject()
                                                    }}
                                                    >
                                                        <View style = {styles.button}>
                                                                <Text
                                                                style={{color: 'white', fontSize: 12}}
                                                                >Send...</Text>
                                                      </View>
                                                </TouchableOpacity>
                                
                    </View>
              </ScrollView>
              </View>
            </ImageBackground>
        )
    }
 
    async constructObject(){
      let arrayOfBase64Documents = await this.makePagesBase64()
      let objectToSend = {
        apikey:sha256('GCrzJC4Jb.un4Gd%8njJ'),
        payload: new Array()
      }
      for(let i = 0; i < arrayOfBase64Documents.length; i++){
        let document = {
          VNR:"AP209099999",
          vorname: 'Omri',
          nachname: 'ram',
          geschlecht: 'm',
          dokumentenart: 1,
          auslandsbeleg: 0,
          bezahlt: 0,
          iban: 'DE05200300000000128751',
          bic: 'HYVEDEMM300',
          vp_geburtsdatum_tag:"01",
          vp_geburtsdatum_monat:"12",
          vp_geburtsdatum_jahr:"1990",
          kto_inhaber:"t_nachname",

          dokument: base64Image
        }
        objectToSend.payload.push(document)
      }
      this.sendObject(objectToSend)
    }

  async sendObject(objectToSend){
    console.log(objectToSend)
   await fetch('https://www.care-concept.de/service/erstattungsannehmer.php', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(objectToSend)
          })
          .then((response) => 
              response.json()
          ).then((jsonData) =>{
            alert(JSON.stringify(jsonData))
            console.log(jsonData)
          })
          .catch((error) => console.log(error))
  }

  async  makePagesBase64(){
      let documentsArray = [] 
      for(let i = 0; i < this.props.docs.length; i++){
        let pagesArray = []
        for(let j = 0; j < this.props.docs[i].document.pages.length; j++){
         await ImgToBase64.getBase64String(this.props.docs[i].document.pages[j].url)
                      .then(base64String => pagesArray.push(base64String))
                      .catch(err => alert(err));
        }
        //console.log(pagesArray[0])
        documentsArray.push(pagesArray)
      }
     
     return documentsArray
    } 
}

const styles = StyleSheet.create({
  logo:{
        margin: 10,
        
  },
  DocumentText: {
    flexDirection:'row',
    fontSize:14,
    fontWeight:'bold',
    color: '#E67F00',
    justifyContent: 'center',
    alignItems: 'center',
    
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