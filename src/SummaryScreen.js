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
  Alert,
  Dimensions,
  ImageBackground,
  FlatList,
  Button,
  ActivityIndicator,
  BackHandler,
  I18nManager,
} from 'react-native';

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
import {addDoc} from './actions/claimActions';
import {deleteDoc, deleteStateClaimInfo} from './actions/claimActions';
import {deleteStatePolicyInfo, setLanguage} from './actions/policInfoActions';
import {StackActions, NavigationActions} from 'react-navigation';
import ImgToBase64 from 'react-native-image-base64';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {PDFDocument} from 'pdf-lib';
const sha256 = require('sha256');
var RNFS = require('react-native-fs');
import base64 from 'react-native-base64';

import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize'; // Use for caching/memoize for better performance

import {WebView} from 'react-native-webview';

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('./translations/eng.json'),
  de: () => require('./translations/De.json'),
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

class SummaryScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      server_message: '',
      isLoading: false,
      finishedSending: false,
      renderWebView: false,
    };

    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    if (!this.state.isLoading && !this.state.renderWebView) {
      this.props.navigation.goBack();
      return true;
    } else {
      return true;
    }
  };

  renderInfo() {
    return (
      <View style={{flex: 1, backgroundColor: '#004799'}}>
        <TouchableOpacity
          onPress={() => {
            this.setState({renderWebView: false});
          }}>
          <Image
            source={
              (this.props.language.includes('en') &&
                require('./img/goBackEn.png')) ||
              (this.props.language.includes('de') &&
                require('./img/goBackDe.png'))
            }
            style={styles.goBackButton}
          />
        </TouchableOpacity>
        <WebView
          startInLoadingState
          renderLoading={this.renderLoading}
          source={{
            uri:
              (this.props.language.includes('en') &&
    'https://www.care-concept.de/scripte/sniplets/app_general_information_3_eng.php?navilang=eng') ||
              (this.props.language.includes('de') &&
                'https://www.care-concept.de/scripte/sniplets/app_general_information_3.php'),
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
    if (this.state.isLoading) {
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
          <Text style={styles.DocumentText}>
            {translate('Please wait while we send your claim')}
          </Text>
          <ActivityIndicator size="large" color="#004799" />
        </View>
      );
    } else if (this.state.renderWebView) {
      return this.renderInfo();
    } else {
      return (
        <ImageBackground
          style={styles.container}
          source={require('./img/background.jpg')}
          style={{resizeMode: 'stretch', flex: 1}}>
          {Platform.OS === 'ios' && (
            <View style={{paddingTop: getStatusBarHeight()}}>
              <StatusBar />
            </View>
          )}

          <View style={{flex: 1}}>
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
                <Image
                  source={
                    (this.props.language.includes('en') &&
                      require('./img/goBackEn.png')) ||
                    (this.props.language.includes('de') &&
                      require('./img/goBackDe.png'))
                  }
                  style={styles.goBackButton}
                />
              </TouchableOpacity>
            )}
            <Image
              source={require('./img/CareConceptLogo.png')}
              style={styles.logo}
            />

            <View style={{alignItems: 'center', marginBottom: 20}}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({renderWebView: true});
                }}>
                <Image
                  source={require('./img/questionMark.png')}
                  style={{width: 50, height: 50}}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'space-between',
                flexDirection: 'column',
              }}>
              <FlatList
                extraData={this.state}
                data={this.props.docs}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    onPress={() => {
                      let info = item;

                      this.props.delete(item.key);
                      this.props.navigation.navigate('ClaimStack', {
                        params: {isEditing: true, infoObj: info},
                        screen: 'DocumentInfo',
                      });
                    }}>
                    <View
                      style={{
                        marginTop: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: 3,
                        borderBottomColor: '#004799',
                      }}>
                      <Text style={styles.DocumentText}>{`${translate(
                        'This is a',
                      )} ${translate(item.document.docType)} ${translate(
                        'with',
                      )} ${item.document.pages.length} ${translate(
                        'pages',
                      )}`}</Text>
                      <Image
                        source={{uri: item.document.pages[0].url}}
                        style={{
                          flex: 1,
                          margin: 5,
                          width: Dimensions.get('window').width / 1.5,
                          height: Dimensions.get('window').height / 3,
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />

              <View
                style={{
                  //justifyContent: 'flex-end',
                  justifyContent: 'center',
                  marginBottom: 10,
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 5,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (this.props.docs.length < 20) {
                      this.props.navigation.navigate('ClaimStack', {
                        params: {isEditing: false},
                        screen: 'DocumentInfo',
                      });
                    } else {
                      Alert.alert('',translate('Cannot send more than 20 documents'));
                    }
                  }}>
                  <View style={styles.button}>
                    <Text style={{color: 'white', fontSize: 10}}>
                      {translate('Scan Document')}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (this.props.docs.length != 0) {
                      this.setState({isLoading: true});
                      this.constructObject();
                    } else {
                      Alert.alert('',
                        translate(
                          'Cannot send anything before you scan some documents',
                        ),
                      );
                    }
                  }}>
                  <View style={styles.button}>
                    <Text style={{color: 'white', fontSize: 10}}>
                      {translate('Send')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      );
    }
  }

  async constructObject() {
    var pdfArray = await this.makeDocumentPagesPDF();
    var time = Math.floor(new Date().getTime() / 1000).toString();
    let objectToSend = {
      apikey: sha256('GCrzJC4Jb.un4Gd%8njJ' + time),
      user_language: 'eng',
      timestamp: time,
      payload: new Array(),
    };
    for (let i = 0; i < this.props.docs.length; i++) {
      let document = {
        VNR: this.props.policyInfo.insuranceNumber,
        vorname: this.props.policyInfo.FirstName,
        nachname: this.props.policyInfo.Surname,
        geschlecht: (this.props.policyInfo.gender === 'Male' && 'm') || 'w',
        dokumentenart:
          (this.props.docs[i].document.docType === 'Claim Document' && 1) || 2,
        auslandsbeleg:
          (this.props.docs[i].document.isDocumentGerman === 'Yes' && 1) || 0,
        iban: this.props.docs[i].document.IBAN || '',
        bezahlt:
          (this.props.docs[i].document.docType === 'Claim Document' &&
            this.props.docs[i].document.sendMoneyToContractualServices ===
              'Yes' &&
            1) ||
          0,
        bic: this.props.docs[i].document.BIC || '',
        vp_geburtsdatum_tag: this.props.docs[0].document.dateStatus.split(
          '/',
        )[0],
        vp_geburtsdatum_monat: this.props.docs[0].document.dateStatus.split(
          '/',
        )[1],
        vp_geburtsdatum_jahr: this.props.docs[0].document.dateStatus.split(
          '/',
        )[2],
        kto_inhaber: this.props.docs[0].document.AccountHolder,
        dokument: pdfArray[i],
      };
      //console.log(document)
      objectToSend.payload.push(document);
    }
    this.sendObject(objectToSend);
  }

  async makeDocumentPagesPDF() {
    var bytes;
    let pdfArray = [];

    for (let d = 0; d < this.props.docs.length; d++) {
      var pdfDoc = await PDFDocument.create();
      let pages = this.props.docs[d].document.pages.map((a) => a.url);
      for (let i = 0; i < pages.length; i++) {
        await RNFS.readFile(pages[i], 'base64')
          .then((data) => {
            bytes = data;
          })
          .catch((err) => console.log('here1:::::::::::::::::::: ' + err));

        var embeddedImage = await pdfDoc
          .embedJpg(bytes)
          .catch((err) => console.log('here2:::::::::::::::::::: ' + err));
        var page = pdfDoc.addPage();

        console.log('!!!!!!!!!!!!!!!!!!!!!' + embeddedImage.height);
        console.log(embeddedImage.width / page.getWidth());
        console.log(embeddedImage.height / page.getHeight());
        const pdfDims = embeddedImage.scale(
          (page.getHeight() / embeddedImage.height >
            page.getWidth() / embeddedImage.width &&
            page.getWidth() / embeddedImage.width) ||
            page.getHeight() / embeddedImage.height,
        );

        page.drawImage(embeddedImage, {
          x: page.getWidth() / 2 - pdfDims.width / 2,
          y: page.getHeight() / 2 - pdfDims.height / 2,
          width: pdfDims.width,
          height: pdfDims.height,
        });
      }
      let pdfBytes = await pdfDoc.save();
      let pdfBase64 = await base64.encodeFromByteArray(pdfBytes);

      pdfArray.push(pdfBase64);
    }

    return pdfArray;
  }

  //If not used then please delete
  /* _base64ToArrayBuffer(base64) {
    var binary_string = new Buffer.from(base64, 'base64');
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  } */

  async sendObject(objectToSend) {
    var message_from_server;
    await fetch('https://www.care-concept.de/service/erstattungsannehmer.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objectToSend),
    })
      .then((response) => {
        const status = response.status;
        const data = response.json();
        return Promise.all([status, data]);
      })
      .then(([res, data]) => {
        if (res == '400') {
          this.state.server_message = '400';
          this.setState({isLoading: false});
          Alert.alert('',
            `${JSON.stringify(data[0].arg3)} ${translate(
              'was entered incorrectly Please fix your entry and try again',
            )}`,
          );
        } else {
          this.state.server_message = res;
        }
      })
      .catch((error) => console.log('could not send ' + error));
    if (this.state.server_message == '200') {
      let lang = this.props.language;
      console.log(lang);
      this.setState({isLoading: false});
      this.props.deleteStateClaimInfo();
      this.props.deleteStatePolicyInfo();
      this.props.setLanguage(lang);

      Alert.alert('',
        translate(
          'Thank you for uploading the documents We will contact you shortly',
        ),
      );
      this.props.navigation.push('ClaimStack', {
        params: {},
        screen: 'PolicyInfo',
      });
    } else if (this.state.server_message != '400') {
      Alert.alert('',translate('Something went wrong sending claim Please try again'));
      console.log(this.state.server_message);
      this.setState({isLoading: false});
    }
  }
}

const styles = StyleSheet.create({
  logo: {
    width: Dimensions.get('window').width / 2,
    height: Dimensions.get('window').height / 9,
    marginLeft: 15,
  },
  DocumentText: {
    flexDirection: 'row',
    fontSize: 14,
    color: '#E67F00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentScanButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#E67F00',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 15,
    margin: 10,
  },
  goBackButton: {
    marginLeft: 10,
    resizeMode: 'contain',
    height: Dimensions.get('window').height / 15,
    width: Dimensions.get('window').width / 5,
  },
  button: {
    width: Dimensions.get('window').width / 2.5,
    backgroundColor: '#E67F00',
    height: Dimensions.get('window').height / 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
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
  console.log(':::::::::::::: ' + state);
  return {
    policyInfo: state.policyInfoReducers.policyInfo,
    docs: state.docReducer.docList,
    language: state.policyInfoReducers.policyInfo.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    delete: (key) => dispatch(deleteDoc(key)),
    deleteStateClaimInfo: () => dispatch(deleteStateClaimInfo()),
    deleteStatePolicyInfo: () => dispatch(deleteStatePolicyInfo()),
    setLanguage: (lang) => dispatch(setLanguage(lang)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryScreen);
