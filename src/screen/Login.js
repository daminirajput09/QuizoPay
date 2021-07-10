import React, { useEffect, useRef, useState } from 'react'
import { Text, View, StyleSheet, Keyboard, TouchableOpacity, ScrollView, StatusBar, Dimensions, Platform, BackHandler, ActivityIndicator } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';
import axiosClient from '../api/axios-client'
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import {
//     GoogleSignin,
//     GoogleSigninButton,
//     statusCodes,
// } from 'react-native-google-signin';
import auth from '@react-native-firebase/auth';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Modal from 'react-native-modal';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [secureText, setSecureText] = useState(true)
    const [focus1, setFocus1] = useState('#f58020')
    const [focus2, setFocus2] = useState('#9da7b4')
    const [token, setToken] = useState('')
    // const isMountedRef = useRef(null);
    const [loggedIn, setloggedIn] = useState(false);
    const [userInfo, setuserInfo] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        // isMountedRef.current = true;
        // getToken();
    
        // GoogleSignin.configure({
        //   scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
        //   webClientId:
        //     '647665900436-ufeb0uqbolp2p0ok746cmukf7r87h5qp.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        //   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        // });

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
            // isMountedRef.current = false;
        }
    }, [])

    const getToken = async () => {
        await AsyncStorage.getItem('token', (err, result) => {
                // if(isMountedRef.current){
                
                    if (!err && result !== null) {
                        setToken(JSON.parse(result))
                    }
                    else {
                        //console.log(err)
                    }
            // }
        });
    }

    const callApi = (name, emailId, picture, sub) => {

        const formData = new FormData();
        formData.append('name', name)
        formData.append('email', emailId.toLocaleLowerCase())
        formData.append('profile_url', picture)
        formData.append('oauth_uid', sub)
        formData.append('device_id', DeviceInfo.getDeviceId())
        formData.append('device_token', token)

        axiosClient().post('auth/gmailLogin', formData)
            .then(async (res) => {
                //console.log('Login with Gmail res', res.data.data)
                if (res.data.Error == 0) {
                    setLoader(false);
                    await AsyncStorage.setItem('user', JSON.stringify(res.data.data));
                    await AsyncStorage.setItem('isGoogleLogin', JSON.stringify(true));
                    if(res.data.data.iscourseselected == 'No'){
                        navigation.navigate('SelectCourse')
                    } else if(res.data.data.iscourseselected == 'Yes'){
                        navigation.navigate('Home')
                        //console.log('login navigate to home');
                    }
                } else {
                    setLoader(false);
                }
            }).catch((err) => {
                //console.log('Login with Gmail err',err)
            })
    }

    // const _signIn = async () => {
    //     setLoader(true);

    //     try {
    //       await GoogleSignin.hasPlayServices();
    //       const {accessToken, idToken} = await GoogleSignin.signIn();
    //       setloggedIn(true);
    //       const credential = auth.GoogleAuthProvider.credential(
    //         idToken,
    //         accessToken,
    //       );
    //       let res = await auth().signInWithCredential(credential);

    //     //   //console.log('loggedIn',loggedIn, res.additionalUserInfo.profile);
    //       //console.log('name', res.additionalUserInfo.profile.given_name);
    //       //console.log('profile_url', res.additionalUserInfo.profile.picture);
    //       //console.log('email', res.additionalUserInfo.profile.email);
    //       //console.log('oauth_uid', res.additionalUserInfo.profile.sub);
    //       callApi(
    //           res.additionalUserInfo.profile.given_name,
    //           res.additionalUserInfo.profile.email,
    //           res.additionalUserInfo.profile.picture,
    //           res.additionalUserInfo.profile.sub
    //       );

    //     } catch (error) {
    //         setLoader(false);
    //         //console.log('error', error);
    //         if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //           // user cancelled the login flow
    //           alert('Cancel');
    //         } else if (error.code === statusCodes.IN_PROGRESS) {
    //           alert('Signin in progress');
    //           // operation (f.e. sign in) is in progress already
    //         } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //           alert('PLAY_SERVICES_NOT_AVAILABLE');
    //           // play services not available or outdated
    //         } else {
    //           // some other error happened
    //           alert('some other error happened');
    //         }
    //       }
    // };

    const handleBackPress = () => {
        if (navigation.isFocused()) {
            BackHandler.exitApp()
        }
    }

    const login = () => {
        Keyboard.dismiss();
        const formData = new FormData();
        formData.append('email', email.toLocaleLowerCase())
        formData.append('password', password)
        formData.append('device_id', DeviceInfo.getDeviceId())
        formData.append('device_token', token)
        axiosClient().post('auth/login', formData)
            .then(async (res) => {
                //console.log('login res', res.data.data)
                if (res.data.Error == 0) {
                        await AsyncStorage.setItem('user', JSON.stringify(res.data.data));
                        setEmail('');
                        setPassword('');
                        setSecureText(true)
                        navigation.navigate('Home')
                } else {
                    setError(true)
                    setErrorMessage(res.data.message)
                }
            }).catch((err) => {
                //console.log('login err',err)
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f4fbfe' }}>
            <StatusBar backgroundColor={'#f4fbfe'} barStyle={'dark-content'} />
            <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center' }}
                keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <Text style={{ color: '#f58020', fontSize: 23, fontWeight: 'bold' }}>
                        Student Login
                    </Text>
                    <Text style={{ fontSize: 12, color: '#313131', marginTop: 10 }}>
                        Provide username {'&'} password for secure login.
                    </Text>
                </View>
                <View style={styles.middleView}>
                    <FormInput source={require('../../assets/user.png')}
                        placeholder={'User / Form No'}
                        value={email}
                        autoFocus={true}
                        borderBottomColor={focus1}
                        imageStyle={styles.imageStyle}
                        onFocus={() => setFocus1('#f58020')}
                        onBlur={() => setFocus1('#9da7b4')}
                        onChangeText={(text) => { setError(false); setEmail(text) }} />
                    <View style={{ flexDirection: 'row' }}>
                        <FormInput source={require('../../assets/key-32.png')}
                            secureTextEntry={secureText}
                            placeholder='Password'
                            value={password}
                            autoFocus={false}
                            borderBottomColor={focus2}
                            imageStyle={styles.imageStyle}
                            onFocus={() => setFocus2('#f58020')}
                            onBlur={() => setFocus2('#9da7b4')}
                            onChangeText={(text) => { setError(false); setPassword(text) }} />
                        <TouchableOpacity style={{
                            position: 'absolute',
                            right: 10,
                            marginTop: 35
                        }}
                            onPress={() => { setSecureText(!secureText) }}>
                            {/* <Image
                                source={!secureText ? require('../../assets/01.png') : require('../../assets/eyeclose.png')}
                                resizeMode='center'
                                style={{ height: 25, width: 25, marginLeft: 20, marginTop: 5, marginRight: 20 }}
                            /> */}
                            {!secureText ?
                                <Icon name="eye" size={20} color="#BDBDBE"
                                    style={{ marginLeft: 20, marginTop: 5, marginRight: 20 }} />
                                :
                                <Icon name="eye-slash" size={20} color="#BDBDBE"
                                    style={{ marginLeft: 20, marginTop: 5, marginRight: 20 }} />}
                        </TouchableOpacity>
                    </View>
                    {error && <Text style={{
                        color: 'red',
                        marginTop: 5,
                        marginLeft: 20
                    }}>{errorMessage}</Text>}
                </View>
                <View style={styles.bottomView} >
                    <Button backgroundColor={'#475e88'}
                        Label={'Login'}
                        borderRadius={10}
                        disabled={!email || !password}
                        onPress={login} />
                        <View style={{alignItems:'center'}}>
                            <GoogleSigninButton
                                style={{width: windowWidth-30, height: 55,alignSelf:'center'}}
                                size={GoogleSigninButton.Size.Wide}
                                color={GoogleSigninButton.Color.Dark}
                                onPress={_signIn}
                            />
                        </View>
                        {/* <View style={styles.buttonContainer}>
                        {!loggedIn && <Text>You are currently logged out</Text>}
                        {loggedIn && (
                            <TouchableOpacity onPress={signOut}>
                            <Text>LogOut</Text>
                            </TouchableOpacity>
                        )}
                        </View> */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ textAlign: 'center', color: '#9da7b4' }}>
                            New Here ?
                        <Text style={{ color: '#313131' }}> Click here for</Text></Text>
                        <Text style={{
                            color: 'red',
                            fontSize: 22,
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}
                            onPress={() => navigation.navigate('SignUp')}>
                            New Registration
                        </Text>
                    </View>
                    <TouchableOpacity style={{marginTop: 10}} onPress={()=> navigation.navigate('ForgotPassword')}>
                        <Text style={{ fontSize: 16, color: '#f58020',textAlign:'center'}}>
                            Forgot Password
                        </Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.footerDivider} />
                <View style={styles.footerText}>
                    <Text style={{ marginTop: 12, fontSize: 11, textAlign: 'center' }}>
                        By proceeding, you agree to our <Text style={{ color: '#f58020' }}>
                            Terms and Conditions</Text>
                        <Text>{' & '}</Text>
                        <Text style={{ color: '#f58020' }}>
                            Privacy Policy.
                        </Text>
                    </Text>
                </View>
            </ScrollView>
            
            <Modal isVisible={loader}>
              <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>    
                <ActivityIndicator color={"#A9A9A9"} size={'large'} />
              </View>
            </Modal>
        </View>
    )
}
export default Login

const styles = StyleSheet.create({

    imageStyle: {
        width: 20,
        height: 20,
        alignSelf: 'flex-end',
        marginBottom: 10,
        left: 20
    },
    headerView: {
        // marginHorizontal: 20, marginTop: hp('15%')
        width: '93%',
        alignSelf: 'center',
        justifyContent: 'flex-end',
        // marginTop:50
        height: windowHeight / 3,
        paddingBottom: 50
    },
    middleView: {
        // marginTop: 60
        width: '100%',
        height: windowHeight / 4,
        // alignSelf:'center',
    },
    bottomView: {
        // marginHorizontal: 20, 
        // marginTop: hp('6')
        width: '93%',
        height: windowHeight / 3.5,
    },
    footerDivider: {
        borderBottomWidth: 0.3,
        borderBottomColor: '#9da7b4',
        // marginTop: error ? hp('12') : hp('13'),
    },
    footerText: {
        width: '93%',
        alignSelf: 'center',
        justifyContent:'flex-start',
        // height: windowHeight / 2,
        justifyContent: 'flex-end',
        //paddingBottom: Platform.OS === 'android' ? 10 : 0,
        marginTop: Platform.OS === 'ios' ? 10 : 5,
        // borderWidth:1,
    },
});