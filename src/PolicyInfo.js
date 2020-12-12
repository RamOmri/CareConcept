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
  Platform
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
 
}

render(){
  return(
          <ImageBackground style={styles.container}
      source={require('./img/background.jpg')}
      style={{ resizeMode: 'stretch', flex: 1, }}
  >                        
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
                                          <MenuOption onSelect={() => this.props.changeGender('Unspecified')} text='Unspecified' />
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
                                                            this.requestCameraPermission()
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

requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Request Camera permision",
        message:
          "CareConcept needs to access your phone's camera",
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