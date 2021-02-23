import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  DeviceEventEmitter,
  BackHandler
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import ImageViewer from 'react-native-image-zoom-viewer';
import {connect} from 'react-redux';
import {addDoc} from './actions/claimActions';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {CommonActions} from '@react-navigation/native';


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


class ScanPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      infoObj: this.props.route.params.infoObj,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress)
    this.state.infoObj.pages.reverse();
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress)
  }


  onBackPress = () =>{
    return true
  }
  deleteCachedImage = async (path) =>{
    let RNFS = require('react-native-fs');
    return RNFS.unlink(path)
      .then(() => {

       })
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch((err) => {
        console.log(err)
      });
  }
  render() {
    return (
      <View style={{marginTop: 10}}>
        <Modal visible={true} transparent={true}>
          {Platform.OS != 'android' && (
            <View style={{paddingTop: getStatusBarHeight()}}>
              <StatusBar />
            </View>
          )}
          <View
            style={{
              flex: 0.1,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: 'black',
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (this.state.infoObj.pages.length < 20) {
                  this.state.infoObj.pages.reverse();
                  const resetAction = CommonActions.reset({
                    index: 1,
                    routes: [
                      {
                        name: 'Scanner',
                        params: {infoObj: this.state.infoObj},
                      },
                    ],
                  });
                  this.props.navigation.dispatch(resetAction);
                } else {
                  Alert.alert('',
                    translate(
                      'number of pages per document cannot be more than 20',
                    ),
                  );
                }
              }}>
              <Text style={styles.buttonText}>
                {translate('Add Page')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                for(let i = 0; i < this.state.infoObj.pages.length; i++){
                  await this.deleteCachedImage(this.state.infoObj.pages[i].url)
                                }
                  this.props.navigation.navigate('ClaimStack', {
                  params: {},
                  screen: 'SummaryScreen',
                });
              }}>
              <Text style={styles.buttonText}>
                {translate('Delete all Pages')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.8}}>
            <ImageViewer imageUrls={this.state.infoObj.pages} />
          </View>
          <View
            style={{
              flex: 0.1,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: 'black',
            }}>
            
          </View>
          <View style = {{justifyContent:'center', alignItems:'center', flex:0.1, backgroundColor:'black'}}>
            <TouchableOpacity
                style={{...styles.button, height:Dimensions.get('window').height/15, width:Dimensions.get('window').width/1.2, marginBottom:30}}
                onPress={() => {
                  this.state.infoObj.pages.reverse();
                  this.props.add(this.state.infoObj);
                  this.props.navigation.navigate('ClaimStack', {
                    params: {},
                    screen: 'SummaryScreen',
                  });
                }}>
                <Text style={styles.buttonText}>
                  {translate('Continue')}
                </Text>
            </TouchableOpacity>
            </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logo: {},
  scanner: {
    flex: 0.9,
    aspectRatio: undefined,
  },
  button: {
    width: Dimensions.get('window').width/2.5,
    backgroundColor: '#E67F00',
    height: Dimensions.get('window').height / 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:40,
    margin:10
  },
  buttonText: {
    color: 'white', fontSize: 13,
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    add: (doc) => dispatch(addDoc(doc)),
    delete: (key) => dispatch(deleteFood(key)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScanPreview);
