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

                                         
                            <Image  source = {require('./img/CareConceptLogo.png')} style = {styles.logo} />
                              
                            
                                  
                                                     <Button color = '#f59b00'
                                                            title={'Scan a Document'} 
                                                            onPress={()=>{
                                                              this.props.navigation.navigate('ClaimStack', {params:{isEditing: false}, screen: 'DocumentInfo'})
                                                            }} />
                                       
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
                                                <Text style = {styles.questionText}>{`This is a ${item.document.docType} with ${item.document.pages.length} page/s`}</Text>
                                                  <Image                                             
                                                  source={{uri: item.document.pages[0].url}}
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
            </ImageBackground>
        )
    }
 
    async constructObject(){
      let arrayOfBase64Documents = await this.makePagesBase64()
      let objectToSend = {
        apikey:'GCrzJC4Jb.un4Gd%8njJ',
        payLoad:[]
      }
      for(let i = 0; i < arrayOfBase64Documents.length; i++){
        let document = {
          vorname: 'Omri',
          nachname: 'ram',
          geshlecht: 'm',
          dokumenart: 1,
          auslandsbeleg: 0,
          bezahlt: 0,
          iban: 'DE05200300000000128751',
          bic: 'HYVEDEMM300',
          dokument: arrayOfBase64Documents[i]
        }
        objectToSend.payLoad.push(document)
      }
      this.sendObject(objectToSend)
    }
  async sendObject(objectToSend){
   await fetch('https://www.care-concept.de/service/erstattungsannehmer.php', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              apikey: 'GCrzJC4Jb.un4Gd%8njJ',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(objectToSend)
          })
          .then((response) => alert(JSON.stringify(response)))
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
        documentsArray.push(pagesArray)
      }
     return documentsArray
    } 
}

const styles = StyleSheet.create({
  logo:{
        margin: 10,
        
  },
  questionText: {
    width: 300,
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