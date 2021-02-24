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
  Platform,
  BackHandler,
  DeviceEventEmitter,
  Animated
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import ImageSize from 'react-native-image-size';
import ImageViewer from 'react-native-image-zoom-viewer';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import { PropTypes } from 'prop-types';
import React, { PureComponent } from 'react';
import Scanner, { Filters, RectangleOverlay } from 'react-native-rectangle-scanner';

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


export default class ScanScreen extends PureComponent {


  static defaultProps = {
    cameraIsOn: undefined,
    onLayout: () => {},
    onSkip: () => {},
    onCancel: () => {},
    onPictureTaken: () => {},
    onPictureProcessed: () => {},
    onFilterIdChange: () => {},
    hideSkip: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      infoObj: this.props.route.params.infoObj,
      prevScreen:this.props.route.params.prevScreen || "",
      flashEnabled: false,
      showScannerView: false,
      didLoadInitialLayout: false,
      detectedRectangle: false,
      isMultiTasking: false,
      useScanner: true,
      loadingCamera: true,
      processingImage: false,
      docScanned: false,
      takingPicture: false,
      overlayFlashOpacity: new Animated.Value(0),
      device: {
        initialized: false,
        hasCamera: false,
        permissionToUseCamera: false,
        flashIsAvailable: false,
        previewHeightPercent: 1,
        previewWidthPercent: 1,
      },
      ScannerRef: React.createRef(),
      
    };
    this.imageProcessorTimeout = null;
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
    console.log("here")
          this.setState({
            infoObj: this.props.route.params.infoObj,
        flashEnabled: false,
        docScanned: false,
        showScannerView: false,
        didLoadInitialLayout: false,
        detectedRectangle: false,
        isMultiTasking: false,
        loadingCamera: true,
        processingImage: false,
        takingPicture: false,
        overlayFlashOpacity: new Animated.Value(0),
        device: {
          initialized: false,
          hasCamera: false,
          permissionToUseCamera: false,
          flashIsAvailable: false,
          previewHeightPercent: 1,
          previewWidthPercent: 1,
        },
        ScannerRef: React.createRef(),
        
          })
          
       
    });
    // Add a react navigation blur listener.
    // Removes the scanner when the screen is not active
    this.props.navigation.addListener('blur', () => {
      console.log("here 2")
      this.turnOffCamera(true)
    });

    if (this.state.didLoadInitialLayout && !this.state.isMultiTasking) {
      this.turnOnCamera();
    }
    
  }
  componentWillUnmount() {
    clearTimeout(this.imageProcessorTimeout);
  }

  componentDidUpdate() {
    if (this.state.didLoadInitialLayout) {
      if (this.state.isMultiTasking) return this.turnOffCamera(true);
      if (this.state.device.initialized) {
        if (!this.state.device.hasCamera) return this.turnOffCamera();
        if (!this.state.device.permissionToUseCamera) return this.turnOffCamera();
      }

      if (this.props.cameraIsOn === true && !this.state.showScannerView) {
        return this.turnOnCamera();
      }

      if (this.props.cameraIsOn === false && this.state.showScannerView) {
        return this.turnOffCamera(true);
      }

      if (this.props.cameraIsOn === undefined) {
        return this.turnOnCamera();
      }
    }
    return null;
  }
onBackPress = () =>{
  return true
}

  // Called after the device gets setup. This lets you know some platform specifics
  // like if the device has a camera or flash, or even if you have permission to use the
  // camera. It also includes the aspect ratio correction of the preview
  onDeviceSetup = (deviceDetails) => {
    const {
      hasCamera, permissionToUseCamera, flashIsAvailable, previewHeightPercent, previewWidthPercent,
    } = deviceDetails;
    this.setState({
      device: {
        initialized: true,
        hasCamera: true,
        permissionToUseCamera,
        flashIsAvailable,
        previewHeightPercent: previewHeightPercent || 1,
        previewWidthPercent: previewWidthPercent || 1,
      },
    });
    this.setState({loadingCamera:false})
  }
    // Determine why the camera is disabled.
    getCameraDisabledMessage() {
      if (this.state.isMultiTasking) {
        return 'Camera is not allowed in multi tasking mode.';
      }
  
      const { device } = this.state;
      if (device.initialized) {
        if (!device.hasCamera) {
          return 'Could not find a camera on the device.';
        }
        if (!device.permissionToUseCamera) {
          return 'Permission to use camera has not been granted.';
        }
      }
      return 'Failed to set up the camera.';
    }

     // On some android devices, the aspect ratio of the preview is different than
  // the screen size. This leads to distorted camera previews. This allows for correcting that.
  getPreviewSize() {
    const dimensions = Dimensions.get('window');
    // We use set margin amounts because for some reasons the percentage values don't align the camera preview in the center correctly.
    const heightMargin = (1 - this.state.device.previewHeightPercent) * dimensions.height / 2;
    const widthMargin = (1 - this.state.device.previewWidthPercent) * dimensions.width / 2;
    if (dimensions.height > dimensions.width) {
      // Portrait
      return {
        height: this.state.device.previewHeightPercent,
        width: this.state.device.previewWidthPercent,
        marginTop: heightMargin,
        marginLeft: widthMargin,
      };
    }

    // Landscape
    return {
      width: this.state.device.previewHeightPercent,
      height: this.state.device.previewWidthPercent,
      marginTop: widthMargin,
      marginLeft: heightMargin,
    };
  }

    // Capture the current frame/rectangle. Triggers the flash animation and shows a
  // loading/processing state. Will not take another picture if already taking a picture.
  capture = () => {
   this.setState({docScanned: true})
    if(this.state.loadingCamera)return
    if (this.state.takingPicture) return;
    if (this.state.processingImage) return;
    this.setState({ takingPicture: true, processingImage: true });

    setTimeout(() => {
      if (this.state.takingPicture) {
        let info = this.state.infoObj
        this.props.navigation.pop()
        this.props.navigation.push('ScanStack', {
          params: {infoObj: info},
          screen: 'Scanner',
        });
        
     alert(translate("Please wait until screen turns on before scanning"))
      }
    }, 5000);
    this.state.ScannerRef.current.capture();
    this.triggerSnapAnimation();

    // If capture failed, allow for additional captures
    
  }

    // The picture was captured but still needs to be processed.
    onPictureTaken = (event) => {
      this.setState({ takingPicture: false });
      this.props.onPictureTaken(event);
    }
    deleteCachedImage = async (path) =>{
      let RNFS = require('react-native-fs');
      return RNFS.unlink(path)
        .then(() => {
  
         })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err) => {
          alert('Something went wrong, please clear cache of this app ' + err)
        });
    }
    // Flashes the screen on capture
    triggerSnapAnimation() {
      Animated.sequence([
        Animated.timing(this.state.overlayFlashOpacity, { toValue: 0.2, duration: 100 }),
        Animated.timing(this.state.overlayFlashOpacity, { toValue: 0, duration: 50 }),
        Animated.timing(this.state.overlayFlashOpacity, { toValue: 0.6, delay: 100, duration: 120 }),
        Animated.timing(this.state.overlayFlashOpacity, { toValue: 0, duration: 90 }),
      ]).start();
    }

      // Hides the camera view. If the camera view was shown and onDeviceSetup was called,
  // but no camera was found, it will not uninitialize the camera state.
  turnOffCamera(shouldUninitializeCamera = false) {
    if (shouldUninitializeCamera && this.state.device.initialized) {
      this.setState(({ device }) => ({
        showScannerView: false,
        device: { ...device, initialized: false },
      }));
    } else if (this.state.showScannerView) {
      this.setState({ showScannerView: false });
    }
  }
  // Will show the camera view which will setup the camera and start it.
  // Expect the onDeviceSetup callback to be called
  turnOnCamera() {
    if (!this.state.showScannerView) {
      this.setState({
        showScannerView: true,
        loadingCamera: true,
      });
    }
  }

    // Renders the flashlight button. Only shown if the device has a flashlight.
    renderFlashControl() {
      const { flashEnabled, device } = this.state;
      if (!device.flashIsAvailable || this.state.docScanned) return null;
      return (
        <View >
          <TouchableOpacity
            style={{height:50, width:100,borderRadius:30, justifyContent:"center", alignItems:"center",
              backgroundColor: flashEnabled ? "green" : 'red',  }}
            activeOpacity={0.8}
            onPress={() => this.setState({ flashEnabled: !flashEnabled })}
          >
            <Text style={{color:"white"}}>
              {translate("Flash")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    // Renders the camera controls. This will show controls on the side for large tablet screens
  // or on the bottom for phones. (For small tablets it will adjust the view a little bit).
  renderCameraControls() {
    
    const dimensions = Dimensions.get('window');
    const aspectRatio = dimensions.height / dimensions.width;
    const isPhone = aspectRatio > 1.6;
    const cameraIsDisabled = this.state.takingPicture || this.state.processingImage;
    const disabledStyle = { opacity: cameraIsDisabled ? 0.8 : 1 };
    if (!isPhone) {
      if (dimensions.height < 500) {
        return (
          <View style={styles.buttonContainer}>
            <View style={[styles.buttonActionGroup, { flexDirection: 'row', alignItems: 'center', marginBottom: 28 }]}>
              {this.renderFlashControl()}
            </View>
            <View style = {{justifyContent:"center", alignItems:"center"}}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cameraButton}
                onPress={this.capture}
              />
              </View>
            <View style={[styles.buttonActionGroup, { marginTop: 28 }]}>
            </View>
          </View>
        );
      }
      return (
        <View style={styles.buttonContainer}>
          <View style={[styles.buttonActionGroup, { justifyContent: 'flex-end', marginBottom: 20 }]}>
            {this.renderFlashControl()}
        
          </View>
          <View style={[styles.cameraOutline, disabledStyle]}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cameraButton}
              onPress={this.capture}
            />
          </View>
          <View style={[styles.buttonActionGroup, { marginTop: 28 }]}>
            <View style={styles.buttonGroup}>
            </View>
          </View>
        </View>
      );
    }
              return (
                <>
                <View style ={{flex:0.93, }}>
                  <View style ={{position:"absolute", right:20, top:20}}>
                  {this.renderFlashControl()}
            </View>
                </View>
                  <View style={{flexDirection:"row", justifyContent:"center",marginRight:110, alignItems:"center"}}>
                
                  <TouchableOpacity
                      
                      activeOpacity={0.8}
                      style={{
                        alignSelf:"center",
                        justifyContent:"center", alignItems:"center",
                      height:50, width:100, backgroundColor: '#f59b00',
                    borderRadius:100,
                    marginLeft:80,
                  marginRight:10, marginTop:30,}}
                      onPress={()=>{
                        this.props.navigation.pop()
                      }}
                    >
                      <Text style={{ fontSize:12, color:"white"}}>
                       {translate("Cancel")}
                      </Text>
                      </TouchableOpacity>

 <TouchableOpacity
                      
                      activeOpacity={0.8}
                      style={{
                        alignSelf:"center",
                        justifyContent:"center", alignItems:"center",
                      height:50, width:100, backgroundColor: this.state.useScanner ? "green" : 'red',
                    borderRadius:100,
                  marginRight:10, marginTop:30,}}
                      onPress={()=>{
                        this.setState({useScanner: !this.state.useScanner})
                      }}
                    >
                      <Text style={{ fontSize:12, color:"white", textAlign:"center"}}>
                       {translate("document detection")}
                      </Text>
                      </TouchableOpacity> 
               
                     
                        {this.renderScanButton()}
                  </View>
                  
                </>
              );
  }
  renderScanButton = ()=>{
    return(
      <TouchableOpacity
                      
      activeOpacity={0.8}
      style={{
      alignSelf:"center",
      justifyContent:"center", alignItems:"center",
      height:100, width:100, backgroundColor:'#f59b00',
    borderRadius:100}}
      onPress={this.capture}
    >
      <Text style={{ fontSize:22, color:"white"}}>
       {translate("Scan")}
      </Text>
      </TouchableOpacity>
    )
  }

  // Renders the camera controls or a loading/processing state
  renderCameraOverlay() {
    let loadingState = null;
    /* if (this.state.loadingCamera) {
      loadingState = (
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="white" />
            <Text style={styles.loadingCameraMessage}>Loading Camera</Text>
          </View>
        </View>
      );
    } else  */if (this.state.processingImage) {
      loadingState = (
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <View style={styles.processingContainer}>
              <ActivityIndicator color="#333333" size="large" />
              <Text style={{ color: '#333333', fontSize: 30, marginTop: 10 }}>{translate("Loading")}</Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <>
        {loadingState}
        <SafeAreaView style={[styles.overlay]}>
          {this.renderCameraControls()}
        </SafeAreaView>
      </>
    );
  }

  
  async handleScannedDocument(croppedImage, initialImage, infoObj) {  
    let img = this.state.useScanner && croppedImage || initialImage
    /* if(this.state.useScanner)this.deleteCachedImage(initialImage)
    else this.deleteCachedImage(croppedImage) */
    infoObj.pages.push({url: img});
    this.componentWillUnmount()
    this.props.navigation.navigate('ScanStack', {
      params: {infoObj: infoObj},
      screen: 'imageCrop',
    });
    
  }
    // Renders either the camera view, a loading state, or an error message
  // letting the user know why camera use is not allowed
  renderCameraView() {
    if (this.state.showScannerView) {
      const previewSize = this.getPreviewSize();
      let rectangleOverlay = null;
      if (!this.state.loadingCamera && !this.state.processingImage && this.state.useScanner) {
        rectangleOverlay = (
          <RectangleOverlay
            detectedRectangle={this.state.detectedRectangle}
            previewRatio={previewSize}
            backgroundColor="rgba(0, 71, 153, 0.2)"
            borderColor="rgb(255,181,6)"
            borderWidth={4}
          />
        );
      }

      // NOTE: I set the background color on here because for some reason the view doesn't line up correctly otherwise. It's a weird quirk I noticed.
      return (
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0)', position: 'relative', marginTop: previewSize.marginTop, marginLeft: previewSize.marginLeft, height: `${previewSize.height * 100}%`, width: `${previewSize.width * 100}%` }}>
          <Scanner
          onErrorProcessingImage={()=>{
            console.log("error processing image")
            this.setState({loadingCamera:false,
            processingImage:false})
          }}
            onPictureTaken={this.onPictureTaken}
            onPictureProcessed={({croppedImage, initialImage})=>{
              this.handleScannedDocument(croppedImage, initialImage, this.state.infoObj)
            }}
            enableTorch={this.state.flashEnabled}
            ref={this.state.ScannerRef}
            capturedQuality={0.5}
            onRectangleDetected={({ detectedRectangle }) => this.setState({ detectedRectangle })}
            onDeviceSetup={this.onDeviceSetup}
            onTorchChanged={({ enabled }) => this.setState({ flashEnabled: enabled })}
            style={styles.scanner}
          />
          {rectangleOverlay}
          <Animated.View style={{ ...styles.overlay, backgroundColor: 'white', opacity: this.state.overlayFlashOpacity }} />
          {this.renderCameraOverlay()}
        </View>
      );
    }

    let message = null;
    if (this.state.loadingCamera) {
      message = (
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="white" />
            <Text style={styles.loadingCameraMessage}>Loading Camera</Text>
          </View>
        </View>
      );
    } else {
      message = (
        <Text style={styles.cameraNotAvailableText}>
          {this.getCameraDisabledMessage()}
        </Text>
      );
    }

    return (
      <View style={styles.cameraNotAvailableContainer}>
        {message}
        <View style={styles.buttonBottomContainer}>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.props.onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonGroup}>
            {this.props.hideSkip ? null : (
              <TouchableOpacity
                style={[styles.button, { marginTop: 8 }]}
                onPress={this.props.onSkip}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Skip</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

    );
  }

  render() {
    this.setState({ didLoadInitialLayout: true });
    return (
      <View
      style={styles.container}
      onLayout={(event) => {
        // This is used to detect multi tasking mode on iOS/iPad
        // Camera use is not allowed
        this.props.onLayout(event);
        if (this.state.didLoadInitialLayout && Platform.OS === 'ios') {
          const screenWidth = Dimensions.get('screen').width;
          const isMultiTasking = (
            Math.round(event.nativeEvent.layout.width) < Math.round(screenWidth)
          );
          if (isMultiTasking) {
            this.setState({ isMultiTasking: true, loadingCamera: false });
          } else {
            this.setState({ isMultiTasking: false });
          }
        } else {
          this.setState({ didLoadInitialLayout: true });
        }
      }}
      
      >
        <StatusBar backgroundColor="black" barStyle="light-content" hidden={Platform.OS !== 'android'} />
        {this.renderCameraView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
    width: 65,
  },
  buttonActionGroup: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonBottomContainer: {
    alignItems: 'flex-end',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 25,
    position: 'absolute',
    right: 25,
  },
  buttonContainer: {
    bottom: 25,
    flexDirection: 'column',
    alignItems:"center",
    justifyContent: "center",
  },
  buttonGroup: {
    backgroundColor: '#00000080',
    borderRadius: 17,
  },
  buttonIcon: {
    color: 'white',
    fontSize: 22,
    marginBottom: 3,
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
  },
  buttonTopContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 25,
    position: 'absolute',
    right: 25,
    top: 40,
  },
  cameraButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    flex: 1,
  },
  cameraNotAvailableContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  cameraNotAvailableText: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
  cameraOutline: {
    borderColor: 'white',
    borderRadius: 50,
    borderWidth: 3,
    height: 70,
    width: 70,
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  flashControl: {
    alignItems: 'center',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    margin: 8,
    paddingTop: 7,
    width: 50,
  },
  loadingCameraMessage: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center', flex: 1, justifyContent: 'center',
  },
  overlay: {
    bottom: 0,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  processingContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(220, 220, 220, 0.7)',
    borderRadius: 16,
    height: 140,
    justifyContent: 'center',
    width: 200,
  },
  scanner: {
    flex: 1,
  },
});