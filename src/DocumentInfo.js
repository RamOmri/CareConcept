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
  import DateTimePickerModal from "react-native-modal-datetime-picker";


class DocumentInfo extends React.Component {
constructor(props){
  super(props)
  this.state = {
        isEditing: this.props.route.params.isEditing,
        isDocumentGerman: 'Select...',
        isDocumentPaid: 'Select...',
        sendMoneyToOriginalBank: 'Select...',
        isClaimDocument: 'Select...',
        isDatePickerVisible: false,
        pages: [],
        dateStatus: 'select...',
        bankDetails:{
            bankNumber: ''
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
        this.state.pages = this.props.route.params.pages
      }
  }
  
  renderIsFromSameAccount = () =>{
      return(
        <View style = {{justifyContent: 'center', alignItems:'center'}}>
            <Text style = {styles.questionText}> 
                    Would you like us to transfer the money to the same bank account you used to pay for your insurance?
                    </Text>
                    <Menu >
                        <MenuTrigger text={this.state.sendMoneyToOriginalBank} customStyles = {this.state.menuStyle}/>
                            <MenuOptions>
                                <MenuOption onSelect={() => this.setState({sendMoneyToOriginalBank: 'Yes'})} text='Yes' />
                                <MenuOption onSelect={() => this.setState({sendMoneyToOriginalBank: 'No'})} text='No' />
                            </MenuOptions>
                    </Menu>
          </View>
      )
  }
  renderBankAccountDetails = () =>{
    return(
      <View style = {{justifyContent: 'center', alignItems:'center'}}>
          <TextInput
            style = {styles.policyInput}
            placeholder = 'Insurance Number'
            placeholderTextColor="#004799"
            secureTextEntry = {false}
            onChangeText={number => this.props.changeInsuranceNumber(number)}
            value={this.props.insuranceNumber}
            />
        </View>
    )
}

renderClaimInfo(){
  return(
    <View>
          <Text style = {styles.questionText}> 
          Is the document you are about to scan from Germany?
      </Text>
      <Menu >
          <MenuTrigger text={this.state.isDocumentGerman } customStyles = {this.state.menuStyle} />
              <MenuOptions>
                  <MenuOption onSelect={() => this.setState({isDocumentGerman: 'Yes'})} text='Yes' />
                  <MenuOption onSelect={() => this.setState({isDocumentGerman: 'No'})} text='No' />
              </MenuOptions>
      </Menu>
      <Text style = {styles.questionText}> 
          Have you already paid for the invoice?
      </Text>
      <Menu >
          <MenuTrigger text={this.state.isDocumentPaid } customStyles = {this.state.menuStyle} />
              <MenuOptions>
                  <MenuOption onSelect={() => this.setState({isDocumentPaid: 'Yes'})} text='Yes' />
                  <MenuOption onSelect={() => this.setState({isDocumentPaid: 'No'})} text='No' />
              </MenuOptions>
      </Menu>
    </View>
  )
}

renderAge(){
  return(
    <View style = {{alignItems: 'center', justifyContent:'center'}}>
    <Text style = {styles.questionText}>Please enter the birthdate of the insured person: </Text>
              <Button color = '#f59b00'
                title={this.state.dateStatus} 
                onPress={()=>{
                this.setState({isDatePickerVisible: true})
                }} />
                <DateTimePickerModal
                    isVisible={this.state.isDatePickerVisible}
                    mode="date"
                    date = {new Date()}
                    onConfirm={date => this.handleConfirm(date)}
                    onCancel={() =>{
                    this.setState({isDatePickerVisible: false})
                    }}
                />
</View>
  )
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
                          <MenuTrigger text={this.state.isClaimDocument} customStyles = {this.state.menuStyle} />
                              <MenuOptions>
                                  <MenuOption onSelect={() => this.setState({isClaimDocument: 'Claim Document'})} text='Claim Document' />
                                  <MenuOption onSelect={() => this.setState({isClaimDocument: 'Other Document'})} text='Other Document' />
                              </MenuOptions>
                      </Menu>
              
                          {(this.state.isClaimDocument == 'Other Document') && this.renderAge()}
                          {(this.state.isClaimDocument == 'Claim Document') && this.renderClaimInfo()}

                          {(this.state.isDocumentPaid == 'Yes') && this.renderIsFromSameAccount()}                      
                          {(this.state.sendMoneyToOriginalBank == 'No') && this.renderBankAccountDetails()}
                   <View style = {styles.button}>
                <TouchableOpacity
                    onPress = {()=>{
                        if(this.state.isEditing){
                            this.props.navigation.navigate('ScanStack', {params:{img: this.state.pages,}, screen: 'ScanPreview'})
                        }
                        else{
                            this.props.navigation.navigate('ScanStack', {params:{images: new Array(),}, screen: 'Scanner'})
                        }
                    }}
                    >
                      
                            <Text
                            style={{color: 'white', fontSize: 12}}
                            >Continue...</Text>
            </TouchableOpacity>
            </View>   
                  </ScrollView>
              </KeyboardAvoidingView>

            
               </View>
          </ImageBackground>
              
        )
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
   
  }
}

const mapDispatchToProps = (dispatch) =>{
  return {
    
  }
}  

export default DocumentInfo