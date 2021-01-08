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
  PermissionsAndroid,
  Platform,
  Keyboard
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
import { changeSurname, changeInsuranceNumber,changeGender, changeName } from './actions/policInfoActions';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions'
class PolicyInfo extends React.Component {
constructor(props){
  super(props)
  this.state = {
    menuStyle: {
        triggerText: {
            color: '#f59b00',
        },
        triggerWrapper: {
            padding: 5,
            height: 40,
            width: 80,
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
 console.log(this.props)
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
                      <Image  source = {require('./img/CareConceptLogo.png')} style = {styles.logo} />

                      <View style = {{flex: 1, alignItems:'center'}}>
                          
                          <TextInput
                                          style = {styles.policyInput}
                                              placeholder = 'Insurance Number'
                                              placeholderTextColor="#004799"
                                              secureTextEntry = {false}
                                              onChangeText={number => this.props.changeInsuranceNumber(number)}
                                              value={this.props.insuranceNumber}
                                              />
                              <Text style = {styles.questionText}>Please select your sex</Text>
                              <Menu >
                                  <MenuTrigger text={this.props.gender} customStyles = {this.state.menuStyle} />
                                      <MenuOptions>
                                          <MenuOption onSelect={() => this.props.changeGender('Male')} text='Male' />
                                          <MenuOption onSelect={() => this.props.changeGender('Female')} text='Female' />
                                      </MenuOptions>
                              </Menu>
                       
                                  <TextInput
                                                  style = {styles.nameInput}
                                                      placeholder = 'First name'
                                                      placeholderTextColor="#004799"
                                                      secureTextEntry = {false}
                                                      onChangeText={name => this.props.changeName(name)}
                                                      value={this.props.FirstName}
                                                      />
                                  <TextInput
                                                  style = {styles.nameInput}
                                                      placeholder = 'Surname'
                                                      placeholderTextColor="#004799"
                                                      secureTextEntry = {false}
                                                      onChangeText={surname => this.props.changeSurname(surname)}
                                                      value={this.props.Surname}
                                                      />
                     
                                          <TouchableOpacity
                                                        onPress = {()=>{
                                                          Keyboard.dismiss()
                                                          if(this.checkFields()){
                                                            if(Platform.OS === "android"){
                                                              this.requestCameraPermissionAndroid()
                                                            }
                                                            else{
                                                              this.handleCameraPermissionIOS()
                                                            }
                                                          }

                                                        }}
                                                        >
                                      <View style = {styles.button}>
                                         
                                                      <Text
                                                      style={{color: 'white', fontSize: 15}}
                                                      >Continue...</Text>
                                         
                                      </View>
                                       </TouchableOpacity>
                  </View>
      </ImageBackground>
  )
}
checkFields = () =>{
 if(!this.checkInsuranceNumber()){
   alert('Insurance number is incorrect')
   return false
 } 
 else if(this.props.gender === 'select...'){
   alert('please select gender')
   return false
 }
 else if(this.props.FirstName === '' || this.props.Surname === ''){
  alert('Please enter your name')
  return false
 }
else if(!this.checkName()){
   alert('Please only use latin characters in your name')
   return false
 }

  return true
}

checkName = ()=>{
  const utf8 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZüöäÜÖÄß0123456789 _çÇñÑëáé&;.-:'
  for(let i = 0; i < this.props.FirstName.split('').length; i++){
    if(!utf8.includes(this.props.FirstName[i])) return false
  }
  for(let i = 0; i < this.props.Surname.split('').length; i++){
    if(!utf8.includes(this.props.Surname[i])) return false
  }
  return true
}

checkInsuranceNumber = () =>{
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  if(alphabet.includes(this.props.insuranceNumber[0]) && alphabet.includes(this.props.insuranceNumber[1])){
    let policynumberlength = this.props.insuranceNumber.split('').length
    if(policynumberlength != 11) return false
    for(let i = 2; i <= 10; i++){
      if(!numbers.includes(this.props.insuranceNumber[i])) return false
    }
    return true
  }
  else if(alphabet.includes(this.props.insuranceNumber[0])){
    let policynumberlength = this.props.insuranceNumber.split('').length
    if(policynumberlength != 10) return false
    for(let i = 1; i < 10; i++){
      if(!numbers.includes(this.props.insuranceNumber.split('')[i])){
        return false
      }
    }
    return true
  }
  else{
    return false
  }

}


requestCameraPermissionAndroid = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Request Camera permision",
        message:
          "CareConcept needs to access your phone's camera in order to scan documents",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      this.props.navigation.navigate('ClaimStack', {params:{Document: [], index: -1}, screen: 'SummaryScreen'})
    } else {
        //do nothing
    }
  } catch (err) {
    console.warn(err);
  }
};
handleCameraPermissionIOS = async () => {
  const res = await check(PERMISSIONS.IOS.CAMERA);

  if (res === RESULTS.GRANTED) {
    this.setState({cameraPermissionGranted:true});
    this.props.navigation.navigate('ClaimStack', {params:{Document: [], index: -1}, screen: 'SummaryScreen'})
  } 
  else if (res === RESULTS.DENIED) {

    const res2 = await request(PERMISSIONS.IOS.CAMERA);
    if(res2 === RESULTS.GRANTED){
       this.setState({cameraPermissionGranted:true});
       this.props.navigation.navigate('ClaimStack', {params:{Document: [], index: -1}, screen: 'SummaryScreen'})
    }
    else{
      this.setState({cameraPermissionGranted:false});
    }


  }
  else if(res == RESULTS.BLOCKED){
    alert("Could not access camera, please grant permission through phone settings ")
  }
};




   
}

const styles = StyleSheet.create({
  logo:{
        margin: 10,
        marginBottom:50
  },
  questionText: {
    margin: 10,
    fontSize: 16,
    color: '#E67F00',

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
    width: 250,
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
  //alert(JSON.stringify(state))
  return{
    insuranceNumber: state.policyInfoReducers.policyInfo.insuranceNumber,
    gender: state.policyInfoReducers.policyInfo.gender, 
    FirstName: state.policyInfoReducers.policyInfo.FirstName,
    Surname: state.policyInfoReducers.policyInfo.Surname
  }
}

const mapDispatchToProps = (dispatch) =>{
  return {
    changeInsuranceNumber: (num) => dispatch(changeInsuranceNumber(num)),
    changeGender: (gender) => dispatch(changeGender(gender)),
    changeName: (name) => dispatch(changeName(name)),
    changeSurname: (surname) => dispatch(changeSurname(surname)),
  }
}  

export default connect(mapStateToProps, mapDispatchToProps)(PolicyInfo)