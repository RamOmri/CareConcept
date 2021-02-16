import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  Dimensions,
  ActivityIndicator,
  I18nManager,
  ImageBackground,
  BackHandler
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {connect} from 'react-redux';
import {setLanguage} from './actions/policInfoActions'




import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize'; // Use for caching/memoize for better performance




const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);



class StartScreen extends React.Component {
  constructor(props) {
    super(props);
   
   
    this.state = {
    };
    
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }
  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }
  
  onBackPress = () => { 
      return true;
  };

  render() {
    return (
      <React.Fragment>
        {Platform.OS != 'android' && (
          <View style={{paddingTop: getStatusBarHeight()}}>
            <StatusBar />
          </View>
        )}
        <View style={{flex: 1, backgroundColor: '#004799'}}>
          <ImageBackground
            resizeMode="contain"
            style={styles.container}
            source={ this.props.language.includes('de') && require('./img/startScreenDe.jpg') || 
            this.props.language.includes('en') && require('./img/startScreenEn.jpg')||
          this.props.language.includes('zh') && require('./img/startScreenCHN.jpg')}
            style={{
              resizeMode: 'stretch',
              flex: 1,
            }}>
              

            <TouchableOpacity
            style = {{backgroundColor: '#f59b00',
            position: 'absolute',
            height: Dimensions.get('window').width/3.789,
            width: Dimensions.get('window').width/3.789,
            top:Dimensions.get('window').height/7.4,
            borderRadius:1000,
            left:Dimensions.get('window').width/1.45,
            justifyContent:'center',
            alignItems:'center'
          }
          }
            
                onPress ={() =>{
                    this.props.navigation.navigate('ClaimStack', {
                        params: {},
                        screen: 'PolicyInfo',
                      })
                }}
            >
                 <View style = {{alignItems:'center', justifyContent:'center'}}>
                    <Text style = {{color:'white', fontSize:14}}>
                            {translate("Start")}
                    </Text>
              </View>
              </TouchableOpacity>
          </ImageBackground>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    backgroundColor: 'rgba(245, 252, 255, 0.7)',
    fontSize: 32,
  },
});


const mapStateToProps = (state) => {
  return {
    language: state.policyInfoReducers.policyInfo.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StartScreen)