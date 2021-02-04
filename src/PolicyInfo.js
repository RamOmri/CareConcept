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
  KeyboardAvoidingView,
  Keyboard,
  LogBox,
  YellowBox,
  I18nManager,
  BackHandler,
  Dimensions,
  Alert,
  ActivityIndicator,
  DeviceEventEmitter
} from 'react-native';

import {WebView} from 'react-native-webview';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import ImageSize from 'react-native-image-size';
import {CropView} from 'react-native-image-crop-tools';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
import {connect} from 'react-redux';
import {
  changeSurname,
  changeInsuranceNumber,
  changeGender,
  changeName,
  setLanguage
} from './actions/policInfoActions';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions';
import {Pattern} from 'react-native-svg';

import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize'; // Use for caching/memoize for better performance



const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);
const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('./translations/eng.json'),
  de: () => require('./translations/De.json'),
};



class PolicyInfo extends React.Component {
  constructor(props) {  
    super(props);
   
    //setI18nConfig(); // set initial config
    YellowBox.ignoreWarnings(['']);

    this.state = {
      didBlurSubscription: null,
      optionStyles: {
        optionTouchable: {
          underlayColor: '#E5ECF5',
          activeOpacity: 40,
        },
        optionWrapper: {
          backgroundColor: '#004799',
          margin: 3,
          borderRadius: 10,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
        },
        optionText: {
          color: 'white',
          margin: 8,
        },
      },
      menuStyle: {
        triggerText: {
          color: '#f59b00',
        },
        triggerWrapper: {
          padding: 5,
          height: 40,
          width: 250,
          justifyContent: 'center',
          backgroundColor: 'white',
          borderColor: '#f59b00',
          borderWidth: 5,
          borderRadius: 7,
        },
        triggerTouchable: {
          underlayColor: 'darkblue',
          activeOpacity: 70,
        },
      },
    };
  
  }

 
  componentDidMount(){
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress)
   /*  this.didFocus.remove();
    this.willBlur.remove(); */
  }

 
  onBackPress = () => {
    console.log(1)
    if (!this.state.renderWebView) {
      this.props.navigation.goBack()
      return true
    } else {
      return true;
    }
  };
 
renderInfo(){
  return (
    <View style={{flex: 1, backgroundColor: '#004799'}}>
        {Platform.OS === 'ios' && (
            <View style={{paddingTop: getStatusBarHeight()}}>
              <StatusBar />
            </View>
          )}
      <TouchableOpacity
        onPress={() => {
          this.setState({renderWebView: false})
        }}>
      <Image source = {this.props.language.includes('en') && require('./img/goBackEn.png') || this.props.language.includes('de') && require('./img/goBackDe.png')} 
          style = {styles.goBackButton} />
      </TouchableOpacity>
      <WebView
        startInLoadingState
        renderLoading={this.renderLoading}
        source={{
          uri:
            this.props.language.includes('en') && 
            'https://www.care-concept.de/scripte/sniplets/app_general_information_eng.php?navilang=eng' ||
             this.props.language.includes('de') && 
             "https://www.care-concept.de/scripte/sniplets/app_general_information.php"
        }}
        style={{marginTop: 20}}
      />
    </View>
  );
}
  
  renderLoading = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color="#004799" />
      </View>
    );
  };
  render() {
    if (this.state.renderWebView) {
     return this.renderInfo()
    }

    return (
      <ImageBackground
        style={styles.container}
        source={require('./img/background.jpg')}
        style={{resizeMode: 'stretch', flex: 1}}>
        {Platform.OS != 'android' && (
          <View style={{paddingTop: getStatusBarHeight()}}>
            <StatusBar />
          </View>
        )}
        {Platform.OS === 'ios' && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack()
                }}>
              <Image source = {this.props.language.includes('en') && require('./img/goBackEn.png') ||
               this.props.language.includes('de') && require('./img/goBackDe.png')} 
              style = {styles.goBackButton} />
              </TouchableOpacity>
            )}
        <View style = {{flexDirection:'row'}}>
        
        <Image
          source={require('./img/CareConceptLogo.png')}
          style={styles.logo}
        />
        </View>
        <KeyboardAvoidingView>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={{flex: 1, alignItems: 'center', marginBottom: 200}}>
              <Text
                style={{
                  color: '#004799',
                  fontSize: 10,
                  marginBottom: 20,
                  textAlign: 'center',
                }}>
                *{translate("Press these")} (
                {
                  <Image
                    source={require('./img/questionMark.png')}
                    style={{width: 20, height: 20}}
                  />
                }
                ) {translate("icons for instructions")}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({renderWebView: true});
                }}>
                <Image
                  source={require('./img/questionMark.png')}
                  style={{width: 50, height: 50}}
                />
              </TouchableOpacity>
              

              <TextInput
                style={styles.policyInput}
                placeholder={translate('Insurance Number')}
                placeholderTextColor="#004799"
                secureTextEntry={false}
                onChangeText={(number) =>
                  this.props.changeInsuranceNumber(number)
                }
                value={this.props.insuranceNumber}
              />
              <Text style={styles.headerText}>
                {translate("Please enter the information of the policy holder below")}
              </Text>
              <Text style={styles.questionText}>
                {translate("Salutation")}
              </Text>
              <Menu>
                <MenuTrigger
                  text={translate(this.props.gender == 'Male' && "Mr" || this.props.gender == 'Female' && "Ms" || 'Select')}
                  customStyles={this.state.menuStyle}
                />
                <MenuOptions customStyles={this.state.optionStyles}>
                  <MenuOption
                    onSelect={() => this.props.changeGender('Male')}
                    text={translate('Mr')}
                  />
                  <MenuOption
                    onSelect={() => this.props.changeGender('Female')}
                    text={translate('Ms')}
                  />
                </MenuOptions>
              </Menu>

              <TextInput
                style={styles.nameInput}
                placeholder={translate('First Name')}
                placeholderTextColor="#004799"
                secureTextEntry={false}
                onChangeText={(name) => this.props.changeName(name)}
                value={this.props.FirstName}
              />
              <TextInput
                style={styles.nameInput}
                placeholder={translate('Last name')}
                placeholderTextColor="#004799"
                secureTextEntry={false}
                onChangeText={(surname) => this.props.changeSurname(surname)}
                value={this.props.Surname}
              />

              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  if (this.checkFields()) {
                    if (Platform.OS === 'android') {
                      this.requestCameraPermissionAndroid();
                    } else {
                      this.handleCameraPermissionIOS();
                    }
                  }
                }}>
                <View style={styles.button}>
                  <Text style={{color: 'white', fontSize: 12}}>
                    {translate('Continue')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
  checkFields = () => {
    let fieldsCorrect = true
    let errorMessage = ''
    if (!this.checkInsuranceNumber()) {
      errorMessage = errorMessage + translate('Please check your insurance number') + ' \n'
      fieldsCorrect = false;
    } 
    if (this.props.gender === 'Select') {
      errorMessage = errorMessage + translate('Please enter your salutation') + ' \n'
      fieldsCorrect = false
    }
     if (this.props.FirstName === '' || this.props.Surname === '') {
      errorMessage = errorMessage + translate('Please enter your name') + ' \n'
      fieldsCorrect = false
    } 
    if (!this.checkName()) {
      errorMessage = errorMessage + 'Please only use latin characters in your name' + ' \n'
      fieldsCorrect = false
    }
    
    if(!fieldsCorrect) Alert.alert('',errorMessage)
    return fieldsCorrect
  };

  checkName = () => {
    const utf8 =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZüöäÜÖÄß0123456789 _çÇñÑëáé&;.-:';
    for (let i = 0; i < this.props.FirstName.split('').length; i++) {
      if (!utf8.includes(this.props.FirstName[i])) return false;
    }
    for (let i = 0; i < this.props.Surname.split('').length; i++) {
      if (!utf8.includes(this.props.Surname[i])) return false;
    }
    return true;
  };

  checkInsuranceNumber = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    var insuranceNumber = this.props.insuranceNumber.toUpperCase()
    if (
      alphabet.includes(insuranceNumber[0]) &&
      alphabet.includes(insuranceNumber[1])
    ) {
      let policynumberlength = insuranceNumber.split('').length;
      if (policynumberlength != 11) return false;
      for (let i = 2; i <= 10; i++) {
        if (!numbers.includes(insuranceNumber[i])) return false;
      }
      this.props.changeInsuranceNumber(insuranceNumber)
      console.log(this.props.insuranceNumber)
      return true;
    } else if (alphabet.includes(insuranceNumber[0])) {
      let policynumberlength = insuranceNumber.split('').length;
      if (policynumberlength != 10) return false;
      for (let i = 1; i < 10; i++) {
        if (!numbers.includes(insuranceNumber.split('')[i])) {
          return false;
        }
      }
      this.props.changeInsuranceNumber(insuranceNumber)
      console.log('fewfewfew' + this.props.insuranceNumber)
      return true;
    } else {
      return false;
    }
  };

  requestCameraPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Request Camera permision',
          message:
            "CareConcept needs to access your phone's camera in order to scan documents",
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.props.navigation.navigate('ClaimStack', {
          params: {Document: [], index: -1},
          screen: 'SummaryScreen',
        });
      } else {
        //do nothing
      }
    } catch (err) {
      console.warn(err);
    }
  };
  handleCameraPermissionIOS = async () => {
    const res = await check(PERMISSIONS.IOS.CAMERA);
    console.log(res);
    if (res === RESULTS.GRANTED) {
      this.setState({cameraPermissionGranted: true});
      this.props.navigation.navigate('ClaimStack', {
        params: {Document: [], index: -1},
        screen: 'SummaryScreen',
      });
    } else if (res === RESULTS.DENIED) {
      const res2 = await request(PERMISSIONS.IOS.CAMERA);
      if (res2 === RESULTS.GRANTED) {
        this.setState({cameraPermissionGranted: true});
        this.props.navigation.navigate('ClaimStack', {
          params: {Document: [], index: -1},
          screen: 'SummaryScreen',
        });
      } else {
        this.setState({cameraPermissionGranted: false});
        Alert.alert('',translate('could not access camera please grant permission manually'))
      }
    } else {
      Alert.alert('',
        'Could not access camera please grant permission through phone settings',
      );
    }
  };
}

const styles = StyleSheet.create({
  logo: {
    width:Dimensions.get('window').width/2,
    height: Dimensions.get('window').height/9,
    marginLeft: 20,
    marginBottom: 20,
  },
  headerText: {
    color: '#004799',
    fontSize: 17,
    margin: 10,
    marginBottom: 0,
    alignSelf: 'center',
    textAlign: 'center',
  },
  questionText: {
    margin: 10,
    fontSize: 16,
    color: '#E67F00',
    alignSelf: 'center',
    textAlign: 'center',
  },
  goBackButton:{marginLeft:10,resizeMode:'contain', height:Dimensions.get('window').height/15, width:Dimensions.get('window').width/5},
  backButton:{
    marginLeft:10,
    marginTop:10,
    height:Dimensions.get('window').height/16,
    width: Dimensions.get('window').height/16,
  },
  button: {
    width: Dimensions.get('window').width / 2.5,
    backgroundColor: '#E67F00',
    height: Dimensions.get('window').height / 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    margin: 10,
  },
  nameInput: {
    marginTop: 12,
    margin: 2,
    borderWidth: 1,
    width: 250,
    height: 40,
    borderColor: '#f59b00',
    backgroundColor: '#E5ECF5',
  },
  policyInput: {
    marginTop: 30,
    marginBottom: 4,
    borderWidth: 1,
    width: 250,
    height: 40,
    borderColor: '#f59b00',
    backgroundColor: '#E5ECF5',
  },
  scanner: {
    flex: 0.9,
    aspectRatio: undefined,
  },

  buttonText: {
    backgroundColor: 'rgba(245, 252, 255, 0.7)',
    fontSize: 32,
  },
  preview: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  permissions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  //alert(JSON.stringify(state))
  return {
    insuranceNumber: state.policyInfoReducers.policyInfo.insuranceNumber,
    gender: state.policyInfoReducers.policyInfo.gender,
    FirstName: state.policyInfoReducers.policyInfo.FirstName,
    Surname: state.policyInfoReducers.policyInfo.Surname,
    language: state.policyInfoReducers.policyInfo.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeInsuranceNumber: (num) => dispatch(changeInsuranceNumber(num)),
    changeGender: (gender) => dispatch(changeGender(gender)),
    changeName: (name) => dispatch(changeName(name)),
    changeSurname: (surname) => dispatch(changeSurname(surname)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PolicyInfo);
