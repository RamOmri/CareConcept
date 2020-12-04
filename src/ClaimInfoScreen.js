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
  KeyboardAvoidingView
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



class ClaimInfo extends React.Component {
constructor(props){
  super(props)
  this.state = {
        isDocumentGerman: true,
        isDocumentPaid: false,
        sendMoneyToOriginalBank: true,
        bankDetails:{
            bankNumber: ''
        },

        menuStyle: {
            triggerText: {
                color: 'white',
            },
            triggerWrapper: {
                padding: 5,
                height: 40,
                width: 100,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f59b00',
                borderRadius: 7,
                margin:10,
                marginBottom: 20,
            },
            triggerTouchable: {
                underlayColor: 'darkblue',
                activeOpacity: 70,
            },
            
            
        }
    }
  }
  
  renderIsFromSameAccount = () =>{
      return(
        <View style = {{justifyContent: 'center', alignItems:'center'}}>
            <Text style = {styles.questionText}> 
                    Would you like us to transfer the money to the same bank account you used to pay for your insurance?
                    </Text>
                    <Menu >
                        <MenuTrigger text={this.state.sendMoneyToOriginalBank && 'Yes' || 'No' } customStyles = {this.state.menuStyle} />
                            <MenuOptions>
                                <MenuOption onSelect={() => this.setState({sendMoneyToOriginalBank: true})} text='Yes' />
                                <MenuOption onSelect={() => this.setState({sendMoneyToOriginalBank: false})} text='No' />
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
  
    render(){
        return(
            <ImageBackground style={styles.container}
            source={require('./img/background.jpg')}
            style={{ resizeMode: 'stretch', flex: 1,  }}
             >
                 <Image  source = {require('./img/CareConceptLogo.png')} style = {styles.logo} />
                <View  style = {{justifyContent: 'center', alignItems:'center'}}>
                    <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={50}>
                    <ScrollView>
                        <Text style = {styles.questionText}> 
                            Is the document you are about to scan from Germany?
                        </Text>
                        <Menu >
                            <MenuTrigger text={this.state.isDocumentGerman && 'Yes' || 'No' } customStyles = {this.state.menuStyle} />
                                <MenuOptions>
                                    <MenuOption onSelect={() => this.setState({isDocumentGerman: true})} text='Yes' />
                                    <MenuOption onSelect={() => this.setState({isDocumentGerman: false})} text='No' />
                                </MenuOptions>
                        </Menu>
                        <Text style = {styles.questionText}> 
                            Have you already paid for the invoice?
                        </Text>
                        <Menu >
                            <MenuTrigger text={this.state.isDocumentPaid && 'Yes' || 'No' } customStyles = {this.state.menuStyle} />
                                <MenuOptions>
                                    <MenuOption onSelect={() => this.setState({isDocumentPaid: true})} text='Yes' />
                                    <MenuOption onSelect={() => this.setState({isDocumentPaid: false})} text='No' />
                                </MenuOptions>
                        </Menu>

                        {this.state.isDocumentPaid && this.renderIsFromSameAccount()}
                        
                            <View>
                        {!this.state.sendMoneyToOriginalBank && this.renderBankAccountDetails()}
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
  questionText: {
    width: 300,
    color: '#E67F00',
    justifyContent: 'center',
    alignItems: 'center',

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

export default ClaimInfo