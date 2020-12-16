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
  import {addDoc, setIBAN, setDate} from './actions/claimActions'


class DocumentInfo extends React.Component {
constructor(props){
  super(props)
  this.state = {
        isEditing: this.props.route.params.isEditing,
        isDocumentGerman: 'Select...',
        docType: 'Select...',
        sendMoneyToContractualServices: 'Select...',
        isDatePickerVisible: false,
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
      this.check_if_editing()
      this.setPrefilledDateAndBankDetails()
  }

  setPrefilledDateAndBankDetails(){
    if(this.props.date){
      this.state.infoObj ={
        ...this.state.infoObj,
        dateStatus: this.props.date
      }
    }
    if(this.props.iban){
      this.state.infoObj = {
        ...this.state.infoObj,
        IBAN: this.props.iban
      }
    }
  }

  check_if_editing(){
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
                {this.renderAge()}
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
          
                      {(this.state.infoObj.docType == 'Claim Document' || this.state.docType == 'Claim Document') && this.renderClaimInfo()}   
                      {(this.state.docType == 'Other Document' || this.state.infoObj.docType == 'Other Document') && this.renderContinue()}                      
                                      
                     
              
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
                  <TouchableOpacity
                        onPress = {()=>{
                          this.setState({isDatePickerVisible: true})
                        }}
                        >
      <View style = {{margin: 10, borderColor: '#f59b00', borderWidth: 5, height: 40, width: 120, justifyContent: "center", alignItems:"center"}}>
                      <Text
                      style={{color: '#f59b00', fontSize: 12}}
                      >{this.state.isEditing && this.state.infoObj.dateStatus || this.props.date} </Text>

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
   this.props.set_date(birthDate)  
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
              {this.renderIsFromSameAccount()}
      </Menu>

    </View>
  )
}

renderIsFromSameAccount = () =>{
  return(
    <View style = {{justifyContent: 'center', alignItems:'center'}}>
        <Text style = {styles.questionText}> 
              Should contractual services be reimbursed to the biller (physician/hospital, etc.)?
                </Text>
                <Menu >
                    <MenuTrigger text={this.state.isEditing && this.state.infoObj.sendMoneyToContractualServices || this.state.sendMoneyToContractualServices} customStyles = {this.state.menuStyle}/>
                        <MenuOptions>
                            <MenuOption onSelect={() => {
                              this.state.infoObj = {
                                ...this.state.infoObj,
                                sendMoneyToContractualServices: 'Yes'
                              }
                              this.setState({sendMoneyToContractualServices: 'Yes'})
                              }} text='Yes' />
                            <MenuOption onSelect={() => {
                              this.state.infoObj = {
                                ...this.state.infoObj,
                                sendMoneyToContractualServices: 'No'
                              }
                              this.setState({sendMoneyToContractualServices: 'No'})
                              }} text='No' />
                        </MenuOptions>
                </Menu>
                {(this.state.sendMoneyToContractualServices == 'Yes' || this.state.infoObj.sendMoneyToContractualServices == 'Yes') && this.renderContinue()}
                {(this.state.sendMoneyToContractualServices == 'No' || this.state.infoObj.sendMoneyToContractualServices == 'No') && this.renderBankAccountDetails()}
      </View>
  )
}
renderBankAccountDetails = () =>{
return(
    <View style = {{justifyContent: 'center', alignItems:'center'}}>
      <Text style = {styles.questionText}> 
        Please enter your IBAN
      </Text>
        <TextInput
          style = {styles.policyInput}
          placeholder = 'IBAN'
          placeholderTextColor="#004799"
          secureTextEntry = {false}
          onChangeText={iban =>{
            this.props.set_iban(iban)
            this.state.infoObj = {
              ...this.state.infoObj,
              IBAN: iban
            }
            }}
          value={this.state.isEditing && this.state.infoObj.IBAN || this.props.iban || ''}
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
   marginTop: 30,
   borderRadius:15,
   marginBottom: 200,
  },
  questionText: {
    width: 300,
    color: '#E67F00',
    justifyContent: 'center',
    alignItems: 'center',
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
    margin:10,
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
    docs: state.docReducer.docList,
    iban: state.docReducer.IBAN,
    date: state.docReducer.date
  }
}

const mapDispatchToProps = (dispatch) =>{
  return {
    add: (doc) => dispatch(addDoc(doc)),
    set_iban: (iban) => dispatch(setIBAN(iban)),
    set_date: (date) => dispatch(setDate(date)),
  }
}   

export default connect(mapStateToProps, mapDispatchToProps)(DocumentInfo)