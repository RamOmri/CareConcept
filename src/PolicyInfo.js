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
} from 'react-native';

import {WebView} from 'react-native-webview';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import DocumentScanner from '@woonivers/react-native-document-scanner';
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
} from './actions/policInfoActions';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions';
import {Pattern} from 'react-native-svg';

import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize'; // Use for caching/memoize for better performance

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('./translations/eng.json'),
  de: () => require('./translations/De.json'),
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

const setI18nConfig = () => {
  // fallback if no available language fits
  const fallback = {languageTag: 'en', isRTL: false};

  const {languageTag, isRTL} =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
};

class PolicyInfo extends React.Component {
  constructor(props) {
    console.log(
      JSON.stringify(
        RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)),
      ),
    );
    super(props);
    setI18nConfig(); // set initial config
    YellowBox.ignoreWarnings(['']);

    this.state = {
      optionStyles: {
        optionTouchable: {
          underlayColor: '#E5ECF5',
          activeOpacity: 40,
        },
        optionWrapper: {
          backgroundColor: '#004799',
          margin: 3,
          borderRadius: 10,
          height: 40,
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
          width: 100,
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
    console.log(this.props);
  }

  componentDidMount() {
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange);
  }

  render() {
    /*  if(this.state.renderWebView){
    return(
      <View style = {{flex:1}}>
        <Text>testing something</Text>
      <WebView
      source={{
        uri: 'https://github.com/facebook/react-native'
      }}
      style={{ marginTop: 20 }}
    />
    </View>
    )
  } */
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
        <Image
          source={require('./img/CareConceptLogo.png')}
          style={styles.logo}
        />
        <KeyboardAvoidingView>
          <ScrollView>
            <View style={{flex: 1, alignItems: 'center'}}>
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
              <Text style={styles.questionText}>
                {translate('Please select your sex')}
              </Text>
              <Menu>
                <MenuTrigger
                  text={translate(this.props.gender)}
                  customStyles={this.state.menuStyle}
                />
                <MenuOptions customStyles={this.state.optionStyles}>
                  <MenuOption
                    onSelect={() => this.props.changeGender('Male')}
                    text={translate('Male')}
                  />
                  <MenuOption
                    onSelect={() => this.props.changeGender('Female')}
                    text={translate('Female')}
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
                placeholder={translate('Surname')}
                placeholderTextColor="#004799"
                secureTextEntry={false}
                onChangeText={(surname) => this.props.changeSurname(surname)}
                value={this.props.Surname}
              />

              <TouchableOpacity
                onPress={() => {
                  // this.setState({renderWebView: true})
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
                  <Text style={{color: 'white', fontSize: 15}}>
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
    if (!this.checkInsuranceNumber()) {
      alert(translate('Please check your insurance number'));
      return false;
    } else if (this.props.gender === 'Select') {
      alert(translate('Please select your gender'));
      return false;
    } else if (this.props.FirstName === '' || this.props.Surname === '') {
      alert(translate('Please enter your name'));
      return false;
    } else if (!this.checkName()) {
      alert('Please only use latin characters in your name');
      return false;
    }

    return true;
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
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    if (
      alphabet.includes(this.props.insuranceNumber[0]) &&
      alphabet.includes(this.props.insuranceNumber[1])
    ) {
      let policynumberlength = this.props.insuranceNumber.split('').length;
      if (policynumberlength != 11) return false;
      for (let i = 2; i <= 10; i++) {
        if (!numbers.includes(this.props.insuranceNumber[i])) return false;
      }
      return true;
    } else if (alphabet.includes(this.props.insuranceNumber[0])) {
      let policynumberlength = this.props.insuranceNumber.split('').length;
      if (policynumberlength != 10) return false;
      for (let i = 1; i < 10; i++) {
        if (!numbers.includes(this.props.insuranceNumber.split('')[i])) {
          return false;
        }
      }
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
        alert('could not access camera, please grant permission manually');
      }
    } else {
      alert(
        'Could not access camera, please grant permission through phone settings ',
      );
    }
  };
}

const styles = StyleSheet.create({
  logo: {
    margin: 10,
    marginBottom: 50,
  },
  questionText: {
    margin: 10,
    fontSize: 16,
    color: '#E67F00',
  },
  button: {
    width: 160,
    height: 45,
    backgroundColor: '#E67F00',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 15,
    marginBottom: 20,
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
    margin: 20,
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
