import React, { useEffect, useState, useContext } from 'react'
import { BackHandler, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, StatusBar, Dimensions,Alert, Keyboard } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { MyContext } from '../components/UseContext';
import Modal from 'react-native-modal';
import axiosClient from '../api/axios-client'
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import DefaultInput from '../components/DefaultInput';
import AppHeader from '../components/AppHeader';
// import Modal from 'react-native-modalbox';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast, {BaseToast} from 'react-native-toast-message';
import Loader from '../components/Loader';
// import {
//     GoogleSignin,
//     GoogleSigninButton,
//     statusCodes,
// } from 'react-native-google-signin';
import auth from '@react-native-firebase/auth';
import DeviceInfo from 'react-native-device-info';
// import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { useIsFocused } from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;

const SignIn = ({ navigation, route }) => {

    const isFocused = useIsFocused();
    const [token, setToken] = useState('')
    const [loader, setLoader] = useState(true);
    const [mobNo, setMobNo] = useState('');
    // const { userId } = useContext(MyContext)

    const [disableBtn, setDisableBtn] = useState(false);
    const [FcmToken, setFcmToken] = useState();

    const successIcon = require('../../assets/close.png');

    const toastConfig = {
        success: ({ text1, hide, ...rest }) => (
          <BaseToast
            {...rest}
            style={{ borderRadius:0, backgroundColor:'#2E8B57' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
              fontSize: 15,
            }}
            text1={text1}
            text2={null}
            trailingIcon={successIcon}
            onTrailingIconPress={hide}
          />
        ),
        error: ({ text1, hide, ...rest }) => (
            <BaseToast
              {...rest}
              style={{ borderRadius:0, backgroundColor:'#D42F2F' }}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              text1Style={{
                fontSize: 15,
              }}
              text1={text1}
              text2={null}
              trailingIcon={successIcon}
              onTrailingIconPress={hide}
            />
          )
    };

    useEffect(() => {
        getFcmToken();
        googleSignInFunc();
        
        BackHandler.addEventListener('hardwareBackPress', backPress)

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backPress)
        }
    }, []);

    useEffect(()=>{
        setLoader(true);
        getFcmToken();
    },[isFocused]);

    const getFcmToken = async () => {
        await AsyncStorage.getItem('fcmtoken', (err, result) => {
            if (!err && result !== null) {
                //console.log('get fcm value in login', JSON.parse(result));
                setFcmToken(JSON.parse(result));
                setLoader(false);
            }
            else {
                //console.log('fcmtoken err in login', err, result)
                setLoader(false);
            }
        });
    }

    const loginFunc = () => {

        setDisableBtn(true);

      if(mobNo && mobNo.length == 10){

        const formData = new FormData();
        formData.append('mobile', mobNo)

        axiosClient().post('auth/sendOTP', formData)
            .then((res) => {
                
                //console.log('login res', res.data, formData)
                if (res.data.Error == 0) {
                    navigation.navigate('SignInOtp', {mobile: mobNo});
                    setDisableBtn(false);
                    setMobNo('');
                } else {
                    Toast.show({
                        text1: res.data.message,
                        type: 'error',
                        position: 'top',
                        visibilityTime: 4000,
                        autoHide: true,
                        topOffset: 0,
                        bottomOffset: 40,
                        leadingIcon: null
                    });
                    setDisableBtn(false);
                }
            }).catch((err) => {
                // setLoader(false);
                 setDisableBtn(false);
                //console.log(err)
            })

      }   
    }

    const googleSignInFunc = () => {
        // GoogleSignin.configure({
        //     scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
        //     webClientId: '309964270624-ntttogiaokglmk7vl1kquhk28vrd5j8j.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        //     offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        //     hostedDomain: '', // specifies a hosted domain restriction
        //     loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
        //     forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
        //     accountName: '', // [Android] specifies an account name on the device that should be used
        //     iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        //     googleServicePlistPath: '', // [iOS] optional, if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
        //   });

        try {
            GoogleSignin.configure({
                scopes: ['email'],
                webClientId: '309964270624-ntttogiaokglmk7vl1kquhk28vrd5j8j.apps.googleusercontent.com',
                offlineAccess: false,
                hostedDomain: '',
                loginHint: '',
                forceConsentPrompt: true,
                accountName: '',
            });
        } catch ({ message }) { console.log('configure error', message) }
    }

    // const signOutWithGoogle = async() => {
    //     try {
    //         await GoogleSignin.revokeAccess();
    //         await GoogleSignin.signOut();
    //         setUserDetails(null); // Remember to remove the user from your app's state as well
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // const signInWithFacebook = (error, result) => {
    //     (error, result) => {
    //         if (error) {
    //           console.log("login has error: " + result.error);
    //         } else if (result.isCancelled) {
    //           console.log("login is cancelled.");
    //         } else {
    //           AccessToken.getCurrentAccessToken().then(
    //             (data) => {
    //               console.log(data.accessToken.toString())
    //             }
    //           )
    //         }
    //       }
    // }

    const signInWithGoogle = async () => {

        try {
            GoogleSignin.hasPlayServices().then(() => {
                GoogleSignin.signOut().then(() => {
                    GoogleSignin.signIn().then((result) => {
                        
                        //console.log('result google',result.user);
                        callGoogleApi(result.user);

                        GoogleSignin.signOut()
                    }).catch((error) => {
                        //console.log(error, "error catch")
                        alert(error);
                    })
                })
            })
        } catch (error) {
            //console.log(error, "error")
            // cb(false);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                alert('User Cancelled!');
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                alert('Signin in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                alert('Play services not avaiable!');
            } else {
                // some other error happened
                alert('some other error happened!');
            }
        }

            // try {
            //   await GoogleSignin.hasPlayServices();
            //   const {accessToken, idToken} = await GoogleSignin.signIn();

            //   const credential = auth.GoogleAuthProvider.credential(
            //     idToken,
            //     accessToken,
            //   );
            //   let res = await auth().signInWithCredential(credential);

            // //   setUserDetails(res);              
            //   console.log('google login res',res);

            //   callGoogleApi(res.additionalUserInfo.profile);
    
            // } catch (error) {
            //     setLoader(false);
            //     console.log('error', error);
            //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            //       // user cancelled the login flow
            //       alert('Cancel');
            //     } else if (error.code === statusCodes.IN_PROGRESS) {
            //       alert('Signin in progress');
            //       // operation (f.e. sign in) is in progress already
            //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            //       alert('PLAY_SERVICES_NOT_AVAILABLE');
            //       // play services not available or outdated
            //     } else {
            //       // some other error happened
            //       alert('some other error happened');
            //     }
            //   }
      }; 

    const callGoogleApi = (res) => {

        const formData = new FormData();
        formData.append('name', res.name);
        formData.append('email', res.email);
        formData.append('profile_url', res.photo);
        formData.append('oauth_uid', res.id);
        formData.append('device_id', DeviceInfo.getDeviceId());
        formData.append('device_token', FcmToken);
        // setLoader(true);

        axiosClient().post('auth/gmailLogin', formData)
            .then(async (res) => {
                //console.log('get gmailLogin res', res.data, formData)
                setLoader(false); 
                if (res.data.Error == 0) {
                    await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.data))
                    navigation.navigate('Home')
                } else {
                    Toast.show({
                        text1: res.data.message,
                        type: 'error',
                        position: 'top',
                        visibilityTime: 4000,
                        autoHide: true,
                        topOffset: 0,
                        bottomOffset: 40,
                        leadingIcon: null
                    });
                }
            }).catch((err) => {
                setLoader(false); 
                //console.log('get gmailLogin', err)
            })
    }  

    const backPress = () => {
        navigation.goBack();
    }

    // const sendOtp = () => {
    //     navigation.navigate('SignInOtp'
    //     // , {title: 'login'}
    //     )
    // }

    return (
    <View style={{flex: 1,backgroundColor:'#F8FAF8'}}>

        <AppHeader Header={'LOG IN'} onPress={() => navigation.goBack()} />

        {loader ? (
            <Modal isVisible={loader} style={{flex: 1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator color={"#A9A9A9"} size={'large'} />
            </Modal>
        ) : (
        <ScrollView keyboardShouldPersistTaps="always">

        <View style={{
            // flex: 1,
            margin: 12,
            backgroundColor: '#fff',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        }}>


            <View style={{width:'90%',alignSelf:'center',marginTop:20,flexDirection:'row'}}>
                {/* <View style={{width:'48%',borderWidth:0.5,alignItems:'center',marginRight:'4%',borderRadius:5,borderColor:'grey'}}>
                  <View style={{width:'90%',height:40,alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                      <AntDesignIcon name='facebook-square' size={20} color='#000' style={{marginRight:10}} />
                      <Text style={{ fontSize: 15, color: '#4460A0',fontWeight:'bold'}}>Facebook</Text>
                  </View>
                </View> */}

                <View style={{width:'100%',borderWidth:0.5,alignItems:'center',borderRadius:5,borderColor:'grey'}}>
                  <TouchableOpacity style={{width:'90%',height:40,alignItems:'center',flexDirection:'row',justifyContent:'center'}} onPress={() => signInWithGoogle()}>
                      <AntDesignIcon name='google' size={20} color='#EB4739' style={{marginRight:10}} />
                      <Text style={{ fontSize: 15, color: '#EB4739',fontWeight:'bold'}}>Google</Text>
                  </TouchableOpacity>
                </View>

            </View>

            {/* <LoginButton
                onLoginFinished={(error, data) => {
                    alert(JSON.stringify(error || data, null, 2));
                }}
            /> */}

                <View style={{width:'100%',alignItems:'center',height:50,justifyContent:'center'}}>
                    <Text style={{ fontSize: 17, color: '#000'}}>or</Text>
                </View>    

                <View style={{width:'90%',alignSelf:'center'}}>
                    <DefaultInput
                        label={'Mobile no'}
                        value={mobNo}
                        maxLength={10}
                        onChangeText={text => setMobNo(text)}
                        keyboardType={'number-pad'}
                        bgColor={'#F2F4F2'}
                    />

                    {!disableBtn?
                    <TouchableOpacity activeOpacity={mobNo?0:1} onPress={()=>mobNo?loginFunc():null}
                        style={{width:'100%',marginTop:20,backgroundColor:mobNo?'#009D38':'#D8D9D8',height:45,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                        <Text style={{textTransform:'uppercase',fontSize:14,color:mobNo?'#fff':'#A6A7A5'}}>next</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity activeOpacity={1}
                        style={{width:'100%',marginTop:20,backgroundColor:'#D8D9D8',height:45,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                        <Text style={{textTransform:'uppercase',fontSize:14,color:'#A6A7A5',top:17}}>next</Text>
                        <ActivityIndicator style={{bottom:10}} size="large" color="#A9A9A9" />
                    </TouchableOpacity>}

                    <Text style={{ fontSize: 14, color: '#000',textAlign:'center',marginVertical:30}} onPress={()=>navigation.navigate('Register')}>
                        Not a member? <Text style={{fontWeight:'bold'}}>Register</Text>
                    </Text>
                </View>    

            </View>

            </ScrollView>)}

            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />

    </View>
    )
}
export default SignIn;

const styles = StyleSheet.create({

    headerView: {
        flexDirection: 'row',
        marginTop: Platform.OS === 'ios' ? hp('4') : 0,
        alignItems: 'center',
        paddingHorizontal: 5,
        // borderWidth:1,
        height: 50,
        backgroundColor:'#C61D24'
    },
    textHead: { fontSize: 18, textAlign: 'center',color:'#fff',fontFamily:'GilroyMedium' },
    imageStyle: {
        width: 25,
        height: 25,
        alignSelf: 'flex-end',
        marginBottom: 10,
        left: 20
    },
    HeaderView: {
        width: '93%',
        alignSelf: 'center',
        height: Platform.OS === 'ios' ? windowHeight / 3.5 : windowHeight / 3.5,
        justifyContent: 'flex-end',
        paddingBottom: 20,
        // borderWidth:1,
    },
    middleView: {
        width: '100%',
        height: windowHeight / 3,
        // borderWidth:1,
    },
    footerView: {
        width: '93%',
        height: windowHeight / 5,
        // borderWidth:1,
        alignSelf: 'center',
        justifyContent: 'center',
        position:'relative',
        top: 35
    },

});    