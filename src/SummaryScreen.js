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
  ImageBackground
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
 


export default class PolicyInfo extends React.Component {
constructor(props){
  super(props)
  this.state = {
    insuranceNumber: '',
    gender: 'please select gender',
    firstName: '',
    surName: ''
  }

}
 
  crop() {
    this.CustomCrop.crop();
  }
    render(){
        return(
                <ImageBackground style={styles.container}
            source={require('./img/background.jpg')}
            style={{ resizeMode: 'stretch', flex: 1, }}
        >                        
                            <Image  source = {require('./img/CareConceptLogo.png')} style = {styles.logo} />

                            <View style = {{flexDirection:'row', justifyContent:'center'}}>
                                
                                    <View style = {styles.button}>
                                                        <TouchableOpacity
                                                            onPress = {()=>{
                                                                this.props.navigation.navigate('ScanStack', {params:{images: new Array()}, screen: 'Scanner'})
                                                            }}
                                                            >
                                                                    <Text
                                                                    style={{color: 'white', fontSize: 12}}
                                                                    >Scan other documents.</Text>
                                                        </TouchableOpacity>
                                    </View>

                                    <View style = {styles.button}>
                                                        <TouchableOpacity
                                                            onPress = {()=>{
                                                                this.props.navigation.navigate('ClaimStack', {params:{}, screen: 'SummaryScreen'})
                                                            }}
                                                            >
                                                                    <Text
                                                                    style={{color: 'white', fontSize: 12}}
                                                                    >Scan Claim documents.</Text>
                                                        </TouchableOpacity>
                                    </View>
                        </View>
                        
                        <ScrollView>

                        </ScrollView>

                        <View style = {{flex: 1, justifyContent: 'flex-end', marginBottom: 10, alignItems: 'center'}}>
                                
                                <View style = {styles.button}>
                                                    <TouchableOpacity
                                                        onPress = {()=>{
                                                            this.props.navigation.navigate('ClaimStack', {params:{}, screen: 'SummaryScreen'})
                                                        }}
                                                        >
                                                                <Text
                                                                style={{color: 'white', fontSize: 12}}
                                                                >Send...</Text>
                                                    </TouchableOpacity>
                                </View>
                    </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
  logo:{
        margin: 10,
        
  },
  button: {
    width: 150,
    height: 45,
    backgroundColor: "#E67F00",
    justifyContent: 'center',
    alignItems: 'center',
   marginTop: 30,
   borderRadius:15,
   margin: 10,
  },
  nameInput:{
    marginTop:12,
    margin:2,
    borderWidth: 1,
    width: 200,
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