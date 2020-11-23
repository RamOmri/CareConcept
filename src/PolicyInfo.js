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
    surName: '',
    menuStyle: {
        triggerText: {
            color: 'white',
        },
        triggerWrapper: {
            padding: 5,
            height: 40,
            justifyContent: 'center',
            backgroundColor: '#f59b00',
            borderRadius: 7,
            marginTop:10
        },
        triggerTouchable: {
            underlayColor: 'darkblue',
            activeOpacity: 70,
        },
        
        
    }
  }

}
 

    render(){
        return(
                <ImageBackground style={styles.container}
            source={require('./img/background.jpg')}
            style={{ resizeMode: 'stretch', flex: 1, }}
        >                        
                            <Image  source = {require('./img/CareConceptLogo.png')} style = {styles.logo} />

                            <View style = {{justifyContent:'center', alignItems:'center'}}>
                                
                                <TextInput
                                                style = {styles.policyInput}
                                                    placeholder = 'Insurance Number'
                                                    placeholderTextColor="#004799"
                                                    secureTextEntry = {false}
                                                    onChangeText={number => this.setState({insuranceNumber: number})}
                                                    value={this.state.password}
                                                    />
                                
                                    <Menu >
                                        <MenuTrigger text={this.state.gender} customStyles = {this.state.menuStyle} />
                                            <MenuOptions>
                                                <MenuOption onSelect={() => this.setState({gender: 'Male'})} text='Male' />
                                                <MenuOption onSelect={() => this.setState({gender: 'Female'})} text='Female' />
                                                <MenuOption onSelect={() => this.setState({gender: 'Unspecified'})} text='Unspecified' />
                                            </MenuOptions>
                                    </Menu>
                             
                                        <TextInput
                                                        style = {styles.nameInput}
                                                            placeholder = 'First name'
                                                            placeholderTextColor="#004799"
                                                            secureTextEntry = {false}
                                                            onChangeText={name => this.setState({firstName: name })}
                                                            value={this.state.password}
                                                            />
                                        <TextInput
                                                        style = {styles.nameInput}
                                                            placeholder = 'Surname'
                                                            placeholderTextColor="#004799"
                                                            secureTextEntry = {false}
                                                            onChangeText={name => this.setState({surName: name})}
                                                            value={this.state.password}
                                                            />
                           
                        
                                            <View style = {styles.button}>
                                                <TouchableOpacity
                                                    onPress = {()=>{
                                                        this.props.navigation.navigate('ClaimStack', {params:{}, screen: 'SummaryScreen'})
                                                    }}
                                                    >
                                                            <Text
                                                            style={{color: 'white', fontSize: 15}}
                                                            >Continue...</Text>
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
        marginBottom:50
  },
  button: {
    width: 160,
    height: 45,
    backgroundColor: "#E67F00",
    justifyContent: 'center',
    alignItems: 'center',
   marginTop: 30,
   borderRadius:15,
   marginBottom: 20,
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