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
  ActivityIndicator,
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

class InfoMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imprintView: false,
      privacyView: false,
    };
    console.log(this.props);
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

          <WebView
            startInLoadingState
            renderLoading={this.renderLoading}
            source={{
              uri:
                (this.props.language.includes('en') &&
                  'https://www.care-concept.de/scripte/sniplets/app_general_information_eng.php?navilang=eng') ||
                (this.props.language.includes('de') &&
                  'https://www.care-concept.de/scripte/sniplets/app_general_information.php')||
                  (this.props.language.includes('zh') &&
                  'https://www.care-concept.de/scripte/sniplets/app_general_information_chn.php?navilang=chn'),
            }}
            style={{marginTop: 20}}
          />
        </ImageBackground>
      );
    
  }
}

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  buttonStyle: {
    height: Dimensions.get('window').height / 16,
    width: Dimensions.get('window').width / 1.6,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f59b00',
    margin: 40,
  },
  logo: {
    width: Dimensions.get('window').width / 2,
    height: Dimensions.get('window').height / 9,
    marginLeft: 15,
    marginBottom: 20,
  },
});

const mapStateToProps = (state) => {
  //alert(JSON.stringify(state))
  return {
    language: state.policyInfoReducers.policyInfo.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoMenu);
