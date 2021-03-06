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
  BackHandler,
  Dimensions,
  Keyboard,
  I18nManager,
  ActivityIndicator,
  Platform,
  Modal,
  Alert,
  DeviceEventEmitter
} from 'react-native';

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
  renderers,
} from 'react-native-popup-menu';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {connect} from 'react-redux';
import {
  addDoc,
  setIBAN,
  setDate,
  setBIC,
  setAccountHolder,
} from './actions/claimActions';
import {setLanguage} from './actions/policInfoActions';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import bic from 'bic';
var IBAN = require('iban');
const {SlideInMenu} = renderers;
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize'; // Use for caching/memoize for better performance
import {WebView} from 'react-native-webview';
//import {DatePicker} from 'react-native-common-date-picker';
import DatePicker from 'react-native-datepicker'

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('./translations/eng.json'),
  de: () => require('./translations/De.json'),
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

class DocumentInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: this.props.route.params.isEditing,
      isDocumentGerman: 'Select',
      docType: 'Select',
      sendMoneyToContractualServices: 'Select',
      renderGeneralInfoWeb: false,
      renderDocTypeInfoWeb: false,
      renderDatePickerInfo: false,
      renderBillFromGermanyInfo: false,
      renderWhoToPay: false,
      infoObj: {
        pages: [],
      },
      menuStyle: {
        triggerText: {
          color: '#f59b00',
          fontSize: 14,
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
      optionStyles: {
        optionTouchable: {
          underlayColor: '#E5ECF5',
          activeOpacity: 40,
        },
        optionWrapper: {
          backgroundColor: '#004799',
          margin: 10,
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
    };

    this.setPrefilledDateAndBankDetails();
    this.check_if_editing();
  }

  setPrefilledDateAndBankDetails() {
    if (this.props.date) {
      this.state.infoObj = {
        ...this.state.infoObj,
        dateStatus: this.props.date,
      };
    }
    if (this.props.iban && this.props.bic && this.props.AccountHolder) {
      this.state.infoObj = {
        ...this.state.infoObj,
        IBAN: this.props.iban,
        BIC: this.props.bic,
        AccountHolder: this.props.AccountHolder,
      };
    }
    console.log(this.state.infoObj)
  }

  check_if_editing() {
    if (this.state.isEditing) {
      this.state = {
        ...this.state,
        infoObj: this.props.route.params.infoObj.document,
      };
      
      this.state.isDocumentGerman = this.state.infoObj.isDocumentGerman || "Select"
      this.state.docType = this.state.infoObj.docType
      delete this.state.infoObj.key;
      this.state.sendMoneyToContractualServices = this.state.infoObj.sendMoneyToContractualServices || "Select"
    }
    
  }

  render() {
    if (this.state.renderGeneralInfoWeb || this.state.renderDocTypeInfoWeb || this.state.renderDatePickerInfo || this.state.renderBillFromGermanyInfo || this.state.renderWhoToPay) {
     return this.renderQuestionInfo()
    }
    return (
      <ImageBackground
        style={styles.container}
        source={require('./img/background.jpg')}
        style={{resizeMode: 'stretch', flex: 1}}>
     {Platform.OS == 'ios' && (
        <View style={{paddingTop: getStatusBarHeight()}}>
            <StatusBar />
          </View>
     )}

         {Platform.OS === 'ios' && (
              <TouchableOpacity
                onPress={() => {
                 this.onBackPress()
                }}>
            {!this.state.isEditing && <Image source = {this.props.language.includes('en') && require('./img/goBackEn.png') || 
            this.props.language.includes('de') && require('./img/goBackDe.png') || 
            this.props.language.includes('zh') && require('./img/goBackChn.png') ||
          this.props.language.includes("es")&&require("./img/goBackEs.png")} 
              style = {styles.goBackButton} />}
              </TouchableOpacity>
            )}
        <Image
          source={require('./img/CareConceptLogo.png')}
          style={styles.logo}
        />
       {this.state.isEditing &&
        <Text style = {{color:"#004799", fontSize:15, marginRight:8, textAlign:'center', marginLeft:8,}}>
          {translate("Here you can edit the information you put in and view the pages of the document by pressing the Show Document button")}
        </Text>}

        <View style={{}}>
          <ScrollView>
          <KeyboardAvoidingView
          behavior='position'
          keyboardVerticalOffset={-330} style={{
            marginBottom: 200,
            justifyContent: 'center',
            marginLeft: 20,
            flex:1
          }}>
           
              <TouchableOpacity
                onPress={() => {
                  this.setState({renderGeneralInfoWeb: true});
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 5,
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('./img/questionMark.png')}
                    style={{width: 50, height: 50}}
                  />
                </View>
              </TouchableOpacity>

              {this.renderAge()}

              <Text style={styles.questionText}>
                {translate('Which type of document are you about to scan')}
              </Text>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Menu>
                  <MenuTrigger
                    text={translate(
                      (this.state.isEditing && this.state.infoObj.docType) ||
                        this.state.docType,
                    )}
                    customStyles={this.state.menuStyle}
                  />
                  <MenuOptions customStyles={this.state.optionStyles}>
                    <MenuOption /* customStyles = {this.state.optionStyles} */
                      onSelect={() => {
                        this.state.infoObj = {
                          ...this.state.infoObj,
                          docType: 'Claim Document',
                        };
                        this.setState({docType: 'Claim Document'});
                      }}
                      text={translate('Claim Document')}
                    />
                    <MenuOption
                      onSelect={() => {
                        this.state.infoObj = {
                          ...this.state.infoObj,
                          docType: 'Other Document',
                        };
                        this.setState({docType: 'Other Document'});
                      }}
                      text={translate('Other Document')}
                    />
                  </MenuOptions>
                </Menu>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({renderDocTypeInfoWeb: true});
                  }}>
                  <View style={{flexDirection: 'row', marginLeft: 10}}>
                    <Image
                      source={require('./img/questionMark.png')}
                      style={{width: 30, height: 30}}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {(this.state.infoObj.docType == 'Claim Document' ||
                this.state.docType == 'Claim Document') &&
                this.renderClaimInfo()}
              {(this.state.docType == 'Other Document' ||
                this.state.infoObj.docType == 'Other Document') &&
                this.renderContinue()}
            
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }

  renderQuestionInfo(){
    return (
      <View style={{flex: 1, backgroundColor: '#004799'}}>
           {Platform.OS === 'ios' && (
            <View style={{paddingTop: getStatusBarHeight()}}>
              <StatusBar />
            </View>
          )}
        <View style={{height: Dimensions.get('screen').height / 15}}>
          <TouchableOpacity
            
            onPress={() => {
              this.setState({renderGeneralInfoWeb: false});
              this.setState({renderDocTypeInfoWeb: false});
              this.setState({renderBillFromGermanyInfo: false})
              this.setState({renderWhoToPay: false})
            }}>
             <Image source = {this.props.language.includes('en') && require('./img/goBackEn.png') || 
             this.props.language.includes('de') && require('./img/goBackDe.png') ||
            this.props.language.includes('zh') && require('./img/goBackChn.png')||
            this.props.language.includes("es")&&require("./img/goBackEs.png")} 
            style = {styles.goBackButton} />
          </TouchableOpacity>
        </View>
        <View style={{flex: 0.9}}>
          <WebView
            startInLoadingState
            renderLoading={this.renderLoading}
            source={{
              uri:
                this.props.language.includes('en') &&
                  (this.state.renderGeneralInfoWeb && 'https://www.care-concept.de/scripte/sniplets/app_general_information_3_eng.php?navilang=eng' ||
                  this.state.renderDocTypeInfoWeb &&  'https://www.care-concept.de/scripte/sniplets/app_general_information_2_eng.php?navilang=eng' ||
                  this.state.renderDatePickerInfo && 'https://www.care-concept.de/scripte/sniplets/app_general_information_4_eng.php?navilang=eng' || 
                  this.state.renderBillFromGermanyInfo && 'https://www.care-concept.de/scripte/sniplets/app_general_information_5_eng.php?navilang=eng'||
                  this.state.renderWhoToPay && 'https://www.care-concept.de/scripte/sniplets/app_general_information_6_eng.php?navilang=eng')
                  || 
                this.props.language.includes('de') &&
                  (this.state.renderGeneralInfoWeb && 'https://www.care-concept.de/scripte/sniplets/app_general_information_3.php' ||              
                  this.state.renderDocTypeInfoWeb && 'https://www.care-concept.de/scripte/sniplets/app_general_information_2.php'||
                  this.state.renderDatePickerInfo && 'https://www.care-concept.de/scripte/sniplets/app_general_information_4.php' ||
                  this.state.renderBillFromGermanyInfo && 'https://www.care-concept.de/scripte/sniplets/app_general_information_5.php'||
                  this.state.renderWhoToPay && 'https://www.care-concept.de/scripte/sniplets/app_general_information_6.php')
                 ||
                 this.props.language.includes('zh') &&
                 (this.state.renderGeneralInfoWeb && 'https://www.care-concept.de/scripte/sniplets/app_general_information_3_chn.php?navilang=chn' ||
                 this.state.renderDocTypeInfoWeb &&  'https://www.care-concept.de/scripte/sniplets/app_general_information_2_chn.php?navilang=chn' ||
                 this.state.renderDatePickerInfo && 'https://www.care-concept.de/scripte/sniplets/app_general_information_4_eng.php?navilang=chn' || 
                 this.state.renderBillFromGermanyInfo && 'https://www.care-concept.de/scripte/sniplets/app_general_information_5_chn.php?navilang=chn'||
                 this.state.renderWhoToPay && 'https://www.care-concept.de/scripte/sniplets/app_general_information_6_chn.php?navilang=chn') 
                 ||
                 this.props.language.includes('es') &&
                 (this.state.renderGeneralInfoWeb && 'https://www.care-concept.de/scripte/sniplets/app_general_information_3_esp.php?navilang=esp' ||
                 this.state.renderDocTypeInfoWeb &&  'https://www.care-concept.de/scripte/sniplets/app_general_information_2_esp.php?navilang=esp' ||
                 this.state.renderDatePickerInfo && 'https://www.care-concept.de/scripte/sniplets/app_general_information_4_esp.php?navilang=esp' || 
                 this.state.renderBillFromGermanyInfo && 'https://www.care-concept.de/scripte/sniplets/app_general_information_5_esp.php?navilang=esp'||
                 this.state.renderWhoToPay && 'https://www.care-concept.de/scripte/sniplets/app_general_information_6_esp.php?navilang=esp') 
                  ,

            }}
            style={{marginTop: 20}}
          />
        </View>
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



  renderAge() {
    return (
      <View style={{justifyContent: 'center',}}>
        <Text style={styles.questionText}>
          {translate('Please enter the birthdate of the insured person')}{' '}
        </Text>
        <View style = {{flexDirection:'row'}}>

        <DatePicker
        locale = {this.props.language.includes("en") && "en" || this.props.language.includes("de") && "de" || 
        this.props.language.includes("zh")&&zh-Hans || this.props.language.includes("es")&& "es"}
        style={{width: 245}}
        date={(this.state.isEditing && this.state.infoObj.dateStatus) ||
          this.props.date ||
          ''}
        mode="date"
        onDateChange = {(date) => {
          this.handleConfirm(date);
        }}
        androidMode = 'spinner'
        placeholder= {translate('Select')}
        format="DD-MM-YYYY"
        minDate={this.getMaxMinDate()[1]}
        maxDate={this.getMaxMinDate()[0]}
        confirmBtnText= {translate("Confirm")}
        cancelBtnText={translate("Cancel")}
        customStyles={{
          datePicker: {
            backgroundColor: '#d1d3d8',
            justifyContent:'center'
            },
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0,
          },
          dateInput: {
            marginLeft: 36,
            padding: 5,
            height: 40,
            width: 250,
            justifyContent: 'center',
            backgroundColor: 'white',
            borderColor: '#f59b00',
            borderWidth: 5,
            borderRadius: 7,
            
          }
        }}
      />

      {Platform.OS === 'android' &&  (<TouchableOpacity onPress = {()=> this.setState({renderDatePickerInfo: true})}>
        <Image source = {require('./img/questionMark.png')}
         style={{marginLeft: 10,width: 30, height: 30}}
        />
        </TouchableOpacity>)}
        </View>
      </View>
    );
  }

  checkBirthDateAndroid = (birthDate) => {
    birthDate = birthDate.split('/');
    let year = new Date();
    year = year.getFullYear().toString();

    if (parseInt(year) - parseInt(birthDate[2]) >= 100) {
      return false;
    } else {
      return true;
    }
  };

  handleConfirm = (date) => {
      let birthDate = date
      this.state.infoObj = {
        ...this.state.infoObj,
        dateStatus: birthDate,
      };
      this.props.set_date(birthDate);
    
  };

    getMaxMinDate() {
      let date = new Date()

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    

  today = dd + '-' + mm + '-' + yyyy;
  century = dd + '-' + mm + '-' + (parseInt(yyyy) - 100).toString()
      return [today, century]
  }

  renderClaimInfo() {
    return (
      <View style={{}}>
        <Text style={styles.questionText}>
          {translate("Is the bill/receipt from Germany")}
        </Text>
        <View style = {{flexDirection:'row'}}>
        <Menu>
          <MenuTrigger
            text={translate(
              (this.state.isEditing && this.state.infoObj.isDocumentGerman) ||
                this.state.isDocumentGerman,
            )}
            customStyles={this.state.menuStyle}
          />
          <MenuOptions customStyles={this.state.optionStyles}>
            <MenuOption
              onSelect={() => {
                this.state.infoObj = {
                  ...this.state.infoObj,
                  isDocumentGerman: 'Yes',
                };
                this.setState({isDocumentGerman: 'Yes'});
              }}
              text={translate('Yes')}
            />
            <MenuOption
              onSelect={() => {
                this.state.infoObj = {
                  ...this.state.infoObj,
                  isDocumentGerman: 'No',
                };
                this.setState({isDocumentGerman: 'No'});
              }}
              text={translate('No')}
            />
          </MenuOptions></Menu>
          <TouchableOpacity onPress = {()=> this.setState({renderBillFromGermanyInfo: true})}>
        <Image source = {require('./img/questionMark.png')}
         style={{marginLeft: 10,width: 30, height: 30}}
        />
        </TouchableOpacity>
</View>
          {this.renderSendMoneyTo()}
        
      </View>
    );
  }

  renderSendMoneyTo = () => {
    return (
      <View style={{}}>
        <Text style={styles.questionText}>
          {translate('Should contractual services')}
        </Text>
        <View style = {{flexDirection:'row'}}>
        <Menu>
          <MenuTrigger
            text={translate(
              (this.state.isEditing &&
                this.state.infoObj.sendMoneyToContractualServices) ||
                this.state.sendMoneyToContractualServices,
            )}
            customStyles={this.state.menuStyle}
          />
          <MenuOptions customStyles={this.state.optionStyles}>
            <MenuOption
              onSelect={() => {
                this.state.infoObj = {
                  ...this.state.infoObj,
                  sendMoneyToContractualServices: 'Yes',
                };
                this.setState({sendMoneyToContractualServices: 'Yes'});
              }}
              text={translate('Yes')}
            />
            <MenuOption
              onSelect={() => {
                this.state.infoObj = {
                  ...this.state.infoObj,
                  sendMoneyToContractualServices: 'No',
                };
                this.setState({sendMoneyToContractualServices: 'No'});
              }}
              text={translate('No')}
            />
          </MenuOptions>
        </Menu>
        <TouchableOpacity onPress = {()=> this.setState({renderWhoToPay: true})}>
        <Image source = {require('./img/questionMark.png')}
         style={{marginLeft: 10,width: 30, height: 30}}
        />
        </TouchableOpacity>
        </View>
        {(this.state.sendMoneyToContractualServices == 'Yes' ||
          this.state.infoObj.sendMoneyToContractualServices == 'Yes') &&
          this.renderContinue()}
        {(this.state.sendMoneyToContractualServices == 'No' ||
          this.state.infoObj.sendMoneyToContractualServices == 'No') &&
          this.renderBankAccountDetails()}
      </View>
    );
  };
  renderBankAccountDetails = () => {
    return (
      <View style={{justifyContent: 'center'}}>
        <Text style = {{marginTop:30, color:"#004799", fontSize:15, marginRight:10}}>
          {translate( "The contractual services shall be reimbursed to the following account")}
        </Text>
        <Text style={styles.questionText}>
          {translate('Please enter the full name of the account holder')}
        </Text>
        <TextInput
          style={styles.policyInput}
          placeholder={translate('Full Name')}
          placeholderTextColor="#004799"
          secureTextEntry={false}
          onChangeText={(name) => {
            const utf8 =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZüöäÜÖÄß _çÇñÑëáé&;.-:';
            if(name && !utf8.includes(name[name.length-1])){
              Alert.alert('', translate('Name must only include latin characters'))}
            else{
            this.props.set_AccountHolder(name);
            this.state.infoObj = {
              ...this.state.infoObj,
              AccountHolder: name,
            };
          }
          }}
          value={
            (this.state.isEditing && this.state.infoObj.AccountHolder) ||
            this.props.AccountHolder ||
            ''
          }
        />

        <Text style={styles.questionText}>
          {translate('Please enter your IBAN')} 
        </Text>
        <TextInput
          style={styles.policyInput}
          placeholder="IBAN"
          placeholderTextColor="#004799"
          secureTextEntry={false}
          onChangeText={(iban) => {
            this.props.set_iban(iban);
            this.state.infoObj = {
              ...this.state.infoObj,
              IBAN: iban,
            };
          }}
          value={
            (this.state.isEditing && this.state.infoObj.IBAN) ||
            this.props.iban ||
            ''
          }
        />

        <View style={{justifyContent: 'center'}}>
          <Text style={styles.questionText}>
            {translate('Please enter your BIC')} 
          </Text>
          <TextInput
          autoCapitalize = "characters"
            style={styles.policyInput}
            placeholder="BIC"
            placeholderTextColor="#004799"
            secureTextEntry={false}
            onChangeText={(bic) => {
              this.props.set_bic(bic);
              this.state.infoObj = {
                ...this.state.infoObj,
                BIC: bic,
              };
            }}
            value={
              (this.state.isEditing && this.state.infoObj.BIC) ||
              this.props.bic ||
              ''
            }
          />
        </View>

        {this.renderContinue()}
      </View>
    );
  };
  checkName = (name) => {
    if (name) {
      const utf8 =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZüöäÜÖÄß0123456789 _çÇñÑëáé&;.-:';
      for (let i = 0; i < name.split('').length; i++) {
        if (!utf8.includes(name[i])) return false;
      }
    } else {
      return false;
    }
    return true;
  };

  renderContinue = () => {
    return (
      <View style = {{marginBottom:130}}>
      <TouchableOpacity
        onPress={() => {

          if (this.state.isEditing && this.checkFieldsBeforeContinue()) {
            this.props.navigation.push('ScanStack', {
              params: {infoObj: this.state.infoObj, isEditing:this.state.isEditing, prevScreen:"DocumentInfo",},
              screen: 'ScanPreview',
            });
          } else if (this.checkFieldsBeforeContinue()) {
            this.props.navigation.push('ScanStack', {
              params: {infoObj: this.state.infoObj, prevScreen:"DocumentInfo",}, 
              screen: 'Scanner',
            });
          }
        }}>
        <View style={styles.button}>
          <Text style={{color: 'white', fontSize: Dimensions.get("window").width/25}}>
            {!this.state.isEditing && translate('Continue') || translate("Show Document")}
          </Text>
        </View>
      </TouchableOpacity>
      
      </View>
    );
  };

  checkFieldsBeforeContinue() {
    let shouldCheckBankDetails = (this.state.infoObj.docType == 'Claim Document' ||
    this.state.docType == 'Claim Document') && (this.state.sendMoneyToContractualServices == 'No' ||
    this.state.infoObj.sendMoneyToContractualServices == 'No')

    let correctFields = true;
    let errorMessage = '';
    if (this.state.infoObj.docType === 'Other Document')
      this.state.infoObj.sendMoneyToContractualServices == 'Yes';

    if (
       this.state.isDocumentGerman === 'Select' &&
      this.state.docType === 'Claim Document'
    ) {
      errorMessage =
        translate('Please make sure all fields have been selected') + ' \n';
      correctFields = false;
    }
    if (
      shouldCheckBankDetails &&
      !this.checkName(this.state.infoObj.AccountHolder)
    ) {
      errorMessage =
        errorMessage +
        `${translate('please check your bank details')} ${this.props.language.includes("de")&& "(Name)" || 
        this.props.language.includes('en') && "(name)" || this.props.language.includes('zh') && "(姓名)" || 
      this.props.language.includes("es") && "nombre"}` +
        ' \n';
      correctFields = false;
    }
    if (
      (shouldCheckBankDetails &&
        !bic.isValid(this.state.infoObj.BIC)) ||
      (shouldCheckBankDetails &&
        this.props.bic == '')
    ) {
      errorMessage =
        errorMessage +
        `${translate('please check your bank details')} (BIC)` +
        ' \n';
      correctFields = false;
    }

    if (
      (shouldCheckBankDetails &&
        !IBAN.isValid(this.state.infoObj.IBAN)) ||
      (shouldCheckBankDetails &&
        this.props.iban == '')
    ) {
      errorMessage =
        errorMessage +
        `${translate('please check your bank details')} (IBAN)` +
        ' \n';
      correctFields = false;
    }
    if (!this.props.date) {
      errorMessage =
        errorMessage + translate('Please enter a birth date') + ' \n';
      correctFields = false;
    }
    if (!correctFields) Alert.alert('',errorMessage);
    return correctFields;
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress)
  }

  onBackPress = () => {

    // Below code allows a back press on this screen when editing but returns the info obj to the global app state
  /*   if (
      this.state.isEditing &&
      !(this.state.renderDocTypeInfoWeb || this.state.renderGeneralInfoWeb || this.state.renderBillFromGermanyInfo || this.state.renderDatePickerInfo ||
        this.state.renderWhoToPay)
    ) {
      if (this.checkFieldsBeforeContinue()) {
        this.props.add(this.state.infoObj);
        this.props.navigation.navigate('ClaimStack', {
          params: {},
          screen: 'SummaryScreen',
        });
      } else return true;
    } else if (
      !(this.state.renderDocTypeInfoWeb || this.state.renderGeneralInfoWeb || this.state.renderBillFromGermanyInfo || this.state.renderDatePickerInfo ||
        this.state.renderWhoToPay)
    ) {
      this.props.navigation.navigate('ClaimStack', {
        params: {},
        screen: 'SummaryScreen',
      });
    } */
    let not_in_webview = !(this.state.renderDocTypeInfoWeb || this.state.renderGeneralInfoWeb || this.state.renderBillFromGermanyInfo || this.state.renderDatePickerInfo ||
      this.state.renderWhoToPay)
      if(not_in_webview && this.state.isEditing) Alert.alert('', translate('Press the show document button below to view all the pages of your document'))
      else if (not_in_webview) {
      this.props.navigation.navigate('ClaimStack', {
        params: {},
        screen: 'SummaryScreen',
      });
    }
    return true;
  };
}

const styles = StyleSheet.create({
  logo: {
    width: Dimensions.get('window').width / 2,
    height: Dimensions.get('window').height / 9,
    marginLeft: 15,
    marginBottom: 20,
  },
  button: {
    width: Dimensions.get('window').width / 2.5,
    backgroundColor: '#E67F00',
    height: Dimensions.get('window').height / 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 40,
    marginTop: 20,
  },
  questionText: {
    width: 300,
    color: '#E67F00',
    marginLeft: 0,
    margin: 10,
  },
  nameInput: {
    marginTop: 12,
    margin: 2,
    borderWidth: 1,
    width: 200,
    height: 40,
    borderColor: '#f59b00',
    backgroundColor: '#E5ECF5',
  },
  goBackButton:{marginLeft:10,resizeMode:'contain', height:Dimensions.get('window').height/15, width:Dimensions.get('window').width/5},
  policyInput: {
    margin: 10,
    marginLeft: 0,
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
  return {
    docs: state.docReducer.docList,
    iban: state.docReducer.IBAN,
    date: state.docReducer.date,
    bic: state.docReducer.BIC,
    AccountHolder: state.docReducer.AccountHolder,
    language: state.policyInfoReducers.policyInfo.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    add: (doc) => dispatch(addDoc(doc)),
    set_iban: (iban) => dispatch(setIBAN(iban)),
    set_bic: (bic) => dispatch(setBIC(bic)),
    set_AccountHolder: (accountHolder) =>
      dispatch(setAccountHolder(accountHolder)),
    set_date: (date) => dispatch(setDate(date)),
    setLanguage: (lang) => dispatch(setLanguage(lang)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentInfo);
