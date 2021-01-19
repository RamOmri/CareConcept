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



const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);


class InfoMenu extends React.Component {
  constructor(props) {  
    super(props);

    this.state = {
     imprintView: false,
     privacyView:false
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
 
    if(this.state.imprintView || this.state.privacyView){
        return(
            <View style={{flex: 1, backgroundColor: '#004799'}}>
         
          <TouchableOpacity
            style={{
              marginLeft: 20,
              margin: 10,
              backgroundColor: 'orange',
              height: Dimensions.get('screen').height / 17,
              width: Dimensions.get('screen').width / 3.5,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 200,
              borderBottomLeftRadius: 200,
            }}
            onPress={() => {
              this.setState({imprintView:false})
              this.setState({privacyView:false})
            }}>
            <View>
              <Text style={{color: 'white', fontSize: 12}}>
                {translate('Go Back')}
              </Text>
            </View>
          </TouchableOpacity>
          <WebView
            startInLoadingState
            renderLoading={this.renderLoading}
            source={{
              uri:
                this.props.language.includes('en') && 'https://www.care-concept.de/scripte/sniplets/app_general_information_eng.php?navilang=eng' ||
                 this.props.language.includes('de') && "https://www.care-concept.de/scripte/sniplets/app_general_information.php"
            }}
            style={{marginTop: 20}}
          />
        </View>
        )
    }
    else{
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

                <View style = {{justifyContence:'center',alignItems:'center'}}>
                    <TouchableOpacity
                    onPress = {()=> this.setState({imprintView: true})}
                    style = {styles.buttonStyle}
                    >
                        <Text style = {styles.buttonText}>
                            Imprint
                        </Text>
                    </TouchableOpacity>

                </View>
                <View style = {{justifyContence:'center',alignItems:'center'}}>
                    <TouchableOpacity
                     onPress = {()=> this.setState({privacyView: true})}
                     style = {styles.buttonStyle}
                    >
                        <Text style = {styles.buttonText}>
                            Privacy information
                        </Text>
                    </TouchableOpacity>

                </View>
            
            </ImageBackground>
            );
    }
  }


}

const styles = StyleSheet.create({
  buttonText:{
    color:'white',
    fontSize:13,
    fontWeight:'bold'
  },
  buttonStyle:{
      height:Dimensions.get('window').height/16,
      width:Dimensions.get('window').width/1.6,
      borderRadius:20,
      alignSelf:'center',
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#f59b00',
      margin:40
  },
  logo: {
    margin: 10,
    marginBottom: 60,
  },
});

const mapStateToProps = (state) => {
  //alert(JSON.stringify(state))
  return {
    language: state.policyInfoReducers.policyInfo.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoMenu);
