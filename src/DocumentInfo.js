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
  KeyboardAvoidingView,
  Button,
  BackHandler
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
  import DateTimePickerModal from "react-native-modal-datetime-picker";
  import {connect} from 'react-redux'
  import {addDoc} from './actions/claimActions'


class DocumentInfo extends React.Component {
constructor(props){
  super(props)
  this.state = {
        isEditing: this.props.route.params.isEditing,
        isDocumentGerman: 'Select...',
        isDocumentPaid: 'Select...',
        sendMoneyToOriginalBank: 'Select...',
        docType: 'Select...',
        isDatePickerVisible: false,
        dateStatus: 'select...',
        IBAN: '',
        infoObj: {
          pages: [],
        },
        menuStyle: {
          triggerText: {
              color: '#f59b00',
          },
          triggerWrapper: {
              padding: 5,
              height: 40,
              width: 150,
              marginBottom: 10,
              justifyContent: 'center',
              backgroundColor: 'white',
              borderColor: '#f59b00',
              borderWidth:5,
              borderRadius: 7,
          },
          triggerTouchable: {
              underlayColor: 'darkblue',
              activeOpacity: 70,
          },   
      }
    }
      if(this.state.isEditing){
        this.state = {
          ...this.state,
          infoObj: this.props.route.params.infoObj.document
        }
        delete this.state.infoObj.key
      }
  }

  render(){
    return(
        <ImageBackground style={styles.container}
        source={require('./img/background.jpg')}
        style={{ resizeMode: 'stretch', flex: 1,  }}
         >
        <Image  source = {require('./img/CareConceptLogo.png')} style = {styles.logo} />
            <View  style = {{justifyContent: 'center', alignItems:'center'}}>
            <KeyboardAvoidingView>
              <ScrollView>
                  <Text style = {styles.questionText}> 
                      What type of Invoice are you about to scan?
                  </Text>
                  <Menu >
                      <MenuTrigger text={this.state.isEditing && this.state.infoObj.docType || this.state.docType} customStyles = {this.state.menuStyle} />
                          <MenuOptions>
                              <MenuOption onSelect={() =>{
                                                          this.state.infoObj ={
                                                            ...this.state.infoObj,
                                                            docType: 'Claim Document'
                                                          }
                                                          this.setState({docType: 'Claim Document'})
                                                        }} text='Claim Document' />
                              <MenuOption onSelect={() =>{
                                                          this.state.infoObj ={
                                                            ...this.state.infoObj,
                                                            docType: 'Other Document'
                                                          }
                                                          this.setState({docType: 'Other Document'})
                                                        }} text='Other Document' />
                          </MenuOptions>
                  </Menu>
          
                      {(this.state.infoObj.docType  == 'Other Document' || this.state.docType == 'Other Document') && this.renderAge()}
                      {(this.state.infoObj.docType == 'Claim Document' || this.state.docType == 'Claim Document') && this.renderClaimInfo()}

                      {(this.state.infoObj.isDocumentPaid == 'Yes' && this.state.infoObj.docType == 'Claim Document' || this.state.isDocumentPaid == 'Yes'  &&  this.state.docType == 'Claim Document') && this.renderIsFromSameAccount()}                      
                      {(this.state.infoObj.sendMoneyToOriginalBank == 'No' && this.state.infoObj.docType == 'Claim Document' && this.state.infoObj.isDocumentPaid == 'Yes' || this.state.sendMoneyToOriginalBank == 'No' &&  this.state.docType == 'Claim Document' && this.state.isDocumentPaid == 'Yes') && this.renderBankAccountDetails()}
              
              </ScrollView>
          </KeyboardAvoidingView>

        
           </View>
      </ImageBackground>
          
    )
}

renderAge(){
    return(
      <View style = {{alignItems: 'center', justifyContent:'center'}}>
      <Text style = {styles.questionText}>Please enter the birthdate of the insured person: </Text>
               {/*  <Button color = '#f59b00'
                  title={this.state.isEditing && this.state.infoObj.dateStatus || this.state.dateStatus} 
                  onPress={()=>{
                  this.setState({isDatePickerVisible: true})
                  }} /> */}
                  <TouchableOpacity
                        onPress = {()=>{
                          this.setState({isDatePickerVisible: true})
                        }}
                        >
      <View style = {{margin: 10, borderColor: '#f59b00', borderWidth: 5, height: 40, width: 120, justifyContent: "center", alignItems:"center"}}>
                      <Text
                      style={{color: '#f59b00', fontSize: 12}}
                      >{this.state.isEditing && this.state.infoObj.dateStatus || this.state.dateStatus} </Text>

      </View>  
    </TouchableOpacity> 
                  <DateTimePickerModal
                      isVisible={this.state.isDatePickerVisible}
                      mode="date"
                      date = {new Date()}
                      onConfirm={date => {
                        this.handleConfirm(date)
                      }}
                      onCancel={() =>{
                      this.setState({isDatePickerVisible: false})
                      }}
                  />


              {this.renderContinue()}
      </View>
    )
}

handleConfirm = (date) => {
  this.state.isDatePickerVisible = false
  let birthDate =  date.getDate().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear().toString() 
  this.state.infoObj ={
    ...this.state.infoObj,
    dateStatus: birthDate
  }
  this.setState({dateStatus: birthDate})
     
};



renderClaimInfo(){
  return(
    <View>
          <Text style = {styles.questionText}> 
          Is the document you are about to scan from Germany?
      </Text>
      <Menu >
          <MenuTrigger text={this.state.isEditing && this.state.infoObj.isDocumentGerman || this.state.isDocumentGerman } customStyles = {this.state.menuStyle} />
              <MenuOptions>
                  <MenuOption onSelect={() =>{
                                  this.state.infoObj = {
                                    ...this.state.infoObj,
                                    isDocumentGerman: 'Yes'
                                  }
                                  this.setState({isDocumentGerman: 'Yes'})
                                  }} text='Yes' />
                  <MenuOption onSelect={() => {
                                              this.state.infoObj = {
                                                ...this.state.infoObj,
                                                isDocumentGerman: 'No'
                                              }
                                              this.setState({isDocumentGerman: 'No'})
                                              }} text='No' />
              </MenuOptions>
      </Menu>
      <Text style = {styles.questionText}> 
          Have you already paid for the invoice?
      </Text>
      <Menu >
          <MenuTrigger text={this.state.isEditing && this.state.infoObj.isDocumentPaid || this.state.isDocumentPaid } customStyles = {this.state.menuStyle} />
              <MenuOptions>
                  <MenuOption onSelect={() => {
                                              this.state.infoObj = {
                                                ...this.state.infoObj,
                                                isDocumentPaid: 'Yes'
                                              }
                                              this.setState({isDocumentPaid: 'Yes'})
                                              }} text='Yes' />
                  <MenuOption onSelect={() => {
                                              this.state.infoObj = {
                                                ...this.state.infoObj,
                                                isDocumentPaid: 'No'
                                              }
                                              this.setState({isDocumentPaid: 'No'})
                                              }} text='No' />
              </MenuOptions>
      </Menu>
      {(this.state.isDocumentPaid == 'No' || this.state.infoObj.isDocumentPaid == "No") && this.renderContinue()}

    </View>
  )
}

renderIsFromSameAccount = () =>{
  return(
    <View style = {{justifyContent: 'center', alignItems:'center'}}>
        <Text style = {styles.questionText}> 
                Would you like us to transfer the money to the same bank account you used to pay for your insurance?
                </Text>
                <Menu >
                    <MenuTrigger text={this.state.isEditing && this.state.infoObj.sendMoneyToOriginalBank || this.state.sendMoneyToOriginalBank} customStyles = {this.state.menuStyle}/>
                        <MenuOptions>
                            <MenuOption onSelect={() => {
                              this.state.infoObj = {
                                ...this.state.infoObj,
                                sendMoneyToOriginalBank: 'Yes'
                              }
                              this.setState({sendMoneyToOriginalBank: 'Yes'})
                              }} text='Yes' />
                            <MenuOption onSelect={() => {
                              this.state.infoObj = {
                                ...this.state.infoObj,
                                sendMoneyToOriginalBank: 'No'
                              }
                              this.setState({sendMoneyToOriginalBank: 'No'})
                              }} text='No' />
                        </MenuOptions>
                </Menu>
                {this.state.sendMoneyToOriginalBank == 'Yes' && this.renderContinue()}
      </View>
  )
}
renderBankAccountDetails = () =>{
return(
  <View style = {{justifyContent: 'center', alignItems:'center'}}>
      <TextInput
        style = {styles.policyInput}
        placeholder = 'please enter your IBAN'
        placeholderTextColor="#004799"
        secureTextEntry = {false}
        onChangeText={iban =>{
           this.setState({IBAN: iban})
           this.state.infoObj = {
            ...this.state.infoObj,
            IBAN: iban
          }
          }}
        value={this.state.isEditing && this.state.infoObj.IBAN || this.state.IBAN}
        />
         {this.renderContinue()}
    </View>
)
}

renderContinue = () =>{
  return(
    <TouchableOpacity
    onPress = {()=>{
          if(this.state.isEditing){
              this.props.navigation.navigate('ScanStack', {params:{infoObj: this.state.infoObj,}, screen: 'ScanPreview'})
          }
          else{
              this.props.navigation.navigate('ScanStack', {params:{infoObj: this.state.infoObj,}, screen: 'Scanner'})
          }
    }}
    >
      <View style = {styles.button}>
                      <Text
                      style={{color: 'white', fontSize: 12}}
                      >Continue...</Text>

      </View>  
    </TouchableOpacity> 
        )
}
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    if(this.state.isEditing){
      this.props.add(this.state.infoObj)
    }
    this.props.navigation.navigate('ClaimStack', {params:{}, screen: 'SummaryScreen'})
    return true;
  }
  
}

const styles = StyleSheet.create({
  logo:{
        margin: 10,
        marginBottom:50
  },
  button: {
    width: 160,
    height: 45,
    backgroundColor: "#E67F00",
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
   marginTop: 500,
   borderRadius:15,
   marginBottom: 20,
  },
  questionText: {
    width: 300,
    color: '#E67F00',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  button: {
    width: 160,
    height: 45,
    backgroundColor: "#E67F00",
    justifyContent: 'center',
    alignItems: 'center',
   marginTop: 30,
   borderRadius:15,
   marginBottom: 20,
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

const mapStateToProps = (state) =>{
  return{
    docs: state.docReducer.docList
  }
}

const mapDispatchToProps = (dispatch) =>{
  return {
    add: (doc) => dispatch(addDoc(doc)),
  }
}   

export default connect(mapStateToProps, mapDispatchToProps)(DocumentInfo)