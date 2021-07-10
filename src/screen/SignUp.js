import React, { useEffect, useState, useContext } from 'react'
import { TouchableWithoutFeedback, Keyboard, BackHandler, Text, View, StyleSheet, ActivityIndicator, Image, TouchableOpacity, ScrollView, Alert, StatusBar, Dimensions,ToastAndroid } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosClient from '../api/axios-client';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { MyContext } from '../components/UseContext';
import DeviceInfo from 'react-native-device-info';
// import {
//     GoogleSignin,
//     GoogleSigninButton,
//     statusCodes,
// } from 'react-native-google-signin';
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const SignUp = ({ navigation, route }) => {

    const [token, setToken] = useState('')
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        getToken();
        BackHandler.addEventListener('hardwareBackPress', backPress)

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backPress)
        }
    }, []);

    const backPress = () => {
        navigation.goBack();
    }

    const getToken = async () => {
        await AsyncStorage.getItem('token', (err, result) => {
            if (!err && result !== null) {
                setToken(JSON.parse(result))
            }
            else {
                console.log(err)
            }
        });
    }

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [number, setNumber] = useState('')
    const [password, setPassword] = useState('')
    const { userId } = useContext(MyContext)
    const [error, setError] = useState(false)


    const Next = () => {
        const formData = new FormData();
        formData.append('name', name)
        formData.append('email', email)
        formData.append('phonenumber', number)
        formData.append('password', password)
        formData.append('device_id', DeviceInfo.getDeviceId())
        formData.append('device_token', token)
        axiosClient().post('auth/register', formData)
            .then(async (res) => {
                //console.log(res.data, "res")
                if (res.data.Error == 0) {
                    await AsyncStorage.setItem('user', JSON.stringify(res.data.data))
                    if(res.data.data.iscourseselected == 'No'){
                        navigation.navigate('SelectCourse')
                    } else if(res.data.data.iscourseselected == 'Yes'){
                        navigation.navigate('Home')
                    }
                } else if (res.data.Error == 1) {
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT)
                }
            })
            .catch((err) => {
                console.log(err)
            })
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
                //console.log('Login with Gmail res', res)
                if (res.data.Error == 0) {
                    setLoader(false);
                    await AsyncStorage.setItem('user', JSON.stringify(res.data.data));
                    await AsyncStorage.setItem('isGoogleLogin', JSON.stringify(true));
                    navigation.navigate('SelectCourse')
                } else {
                    setLoader(false);
                }
            }).catch((err) => {
                console.log('Login with Gmail err',err)
            })
    }

    // const _signIn = async () => {
    //     setLoader(true);

    //     try {
    //       await GoogleSignin.hasPlayServices();
    //       const {accessToken, idToken} = await GoogleSignin.signIn();
    //       const credential = auth.GoogleAuthProvider.credential(
    //         idToken,
    //         accessToken,
    //       );
    //       let res = await auth().signInWithCredential(credential);

    //       callApi(
    //           res.additionalUserInfo.profile.given_name,
    //           res.additionalUserInfo.profile.email,
    //           res.additionalUserInfo.profile.picture,
    //           res.additionalUserInfo.profile.sub
    //       );

    //     } catch (error) {
    //         setLoader(false);
    //         console.log('error', error);
    //         if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //           alert('Cancel');
    //         } else if (error.code === statusCodes.IN_PROGRESS) {
    //           alert('Signin in progress');
    //         } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //           alert('PLAY_SERVICES_NOT_AVAILABLE');
    //         } else {
    //           alert('some other error happened');
    //         }
    //       }
    // };

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#f4fbfe'
        }}>
            <StatusBar backgroundColor={'#f4fbfe'} barStyle={'dark-content'} />
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10, marginTop: Platform.OS === 'ios' ? hp('4') : 0 }}>
                <Image source={require('../../assets/backIcon.png')} resizeMode='center' />
            </TouchableOpacity>
            <ScrollView keyboardShouldPersistTaps="always">
                <View style={styles.HeaderView}>
                    <Text style={{ color: '#f58020', fontSize: 25, fontWeight: '800' }}>Welcome to Exambook</Text>
                    <Text style={{ fontSize: 14, color: '#313131', marginTop: 4 }}>Provide your details to continue...</Text>
                </View>
                <View style={styles.middleView}>
                    <FormInput source={require('../../assets/user.png')}
                        placeholder={'Name'}
                        value={name}
                        resizeMode={'center'}
                        imageStyle={styles.imageStyle}
                        onChangeText={(text) => setName(text)} />

                    <FormInput source={require('../../assets/email.png')}
                        placeholder='E-Mail'
                        value={email}
                        keyboardType={'email-address'}
                        onChangeText={(text) => setEmail(text)}
                        imageStyle={[styles.imageStyle]}
                        resizeMode={'center'} />

                    <FormInput source={require('../../assets/phoneIcon.png')}
                        imageStyle={styles.imageStyle}
                        placeholder='Mobile Number'
                        keyboardType={'numeric'}
                        value={number}
                        resizeMode={'center'}
                        onChangeText={(text) => setNumber(text)} />

                    <FormInput source={require('../../assets/key-32.png')}
                        imageStyle={styles.imageStyle}
                        placeholder='Password'
                        value={password}
                        resizeMode={'center'}
                        onChangeText={(text) => setPassword(text)} />
                </View>
                <View style={styles.footerView}>
                    <Button backgroundColor={'#f58020'}
                        Label={'NEXT'}
                        borderRadius={4}
                        disabled={!name || !email || !number || !password}
                        onPress={Next} />
                </View>
                <View style={{alignItems:'center'}}>
                    <GoogleSigninButton
                        style={{width: windowWidth-30, height: 55,alignSelf:'center'}}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={_signIn}
                    />
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
export default SignUp;

const styles = StyleSheet.create({

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