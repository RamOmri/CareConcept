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
  Button,
  KeyboardAvoidingView
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
  import DateTimePickerModal from "react-native-modal-datetime-picker";



class ClaimInfo extends React.Component {
constructor(props){
  super(props)
  this.state = {
            isDatePickerVisible: false,
            dateStatus: 'select...',
            isEditing: this.props.route.params.isEditing,
            pages: [],

        
    }
  }

  componentDidMount(){
    if(this.state.isEditing){
        this.state.pages = this.props.route.params.pages
    }
  }

  hideDatePicker = () =>{
    this.setState({isDatePickerVisible: false})
}
handleConfirm = (date) => {
    this.state.isDatePickerVisible = false
    this.setState({dateStatus: date.getDate().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear().toString() }) 
  };

  
    render(){
        return(
            <ImageBackground style={styles.container}
            source={require('./img/background.jpg')}
            style={{ resizeMode: 'stretch', flex: 1,  }}
             >
                 <Image  source = {require('./img/CareConceptLogo.png')} style = {styles.logo} />
                <View style = {{alignItems: 'center', justifyContent:'center'}}>
                    <Text style = {styles.questionText}>Please enter the birthdate of the insured person: </Text>
                              <Button color = '#f59b00'
                                title={this.state.dateStatus} 
                                onPress={()=>{
                                this.setState({isDatePickerVisible: true})
                                }} />
                                <DateTimePickerModal
                                    isVisible={this.state.isDatePickerVisible}
                                    mode="date"
                                    date = {new Date()}
                                    onConfirm={date => this.handleConfirm(date)}
                                    onCancel={() =>{
                                    this.setState({isDatePickerVisible: false})
                                    }}
                                />

                                    <View style = {styles.button}>
                                                        <TouchableOpacity
                                                            onPress = {()=>{
                                                                if(this.state.isEditing){
                                                                    this.props.navigation.navigate('ScanStack', {params:{img: this.state.pages,}, screen: 'ScanPreview'})
                                                                }
                                                                else{
                                                                    this.props.navigation.navigate('ScanStack', {params:{images: new Array(),}, screen: 'Scanner'})
                                                                }
                                                            }}
                                                           >
                                                             
                                                                    <Text
                                                                    style={{color: 'white', fontSize: 12}}
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
        marginBottom:150
  },
  questionText: {
    marginBottom: 10,
    width: 250,
    color: '#E67F00',
    justifyContent: 'center',
    alignItems: 'center',

  },
  button: {
    width: 160,
    height: 45,
    backgroundColor: "#E67F00",
    justifyContent: 'center',
    alignItems: 'center',
   marginTop: 300,
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

const mapStateToProps = (state) =>{
  return{
   
  }
}

const mapDispatchToProps = (dispatch) =>{
  return {
    
  }
}  

export default ClaimInfo