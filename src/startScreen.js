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
import ImageViewer from 'react-native-image-zoom-viewer';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export default class StartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log(Dimensions.get('window').height)
  }

  componentDidMount() {}

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
            source={require('./img/startScreen.jpg')}
            style={{
              resizeMode: 'stretch',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
            style = {{backgroundColor: '#f59b00',
            position: 'absolute',
            height: Dimensions.get('window').width/3.789,
            width: Dimensions.get('window').width/3.789,
            top:Dimensions.get('window').height/4.656,
            borderRadius:1000,
            left:Dimensions.get('window').width/1.5,
            justifyContent:'center',
            alignItems:'center'
          }
          }
            
                onPress ={() =>{
                    this.props.navigation.push('ClaimStack', {
                        params: {},
                        screen: 'PolicyInfo',
                      })
                }}
            >
                 <View style = {{alignItems:'center', justifyContent:'center'}}>
                    <Text style = {{color:'white', fontSize:22, fontWeight:'bold', fontFamily:'Sans-serif '}}>
                            Start
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
