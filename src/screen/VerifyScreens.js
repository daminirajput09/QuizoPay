import React, { useEffect, useState, useContext } from 'react'
import { BackHandler, Text, View, StyleSheet, ToastAndroid, Image, TouchableOpacity, ScrollView, Alert, StatusBar, Dimensions, } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DefaultInput from '../components/DefaultInput';
import Toast, {BaseToast} from 'react-native-toast-message';
import AppHeader from '../components/AppHeader';
import axiosClient from '../api/axios-client';

const windowHeight = Dimensions.get('window').height;

const VerifyScreens = ({ navigation, route }) => {

    const { param, user } = route.params;

    const [loader, setLoader] = useState(false);
    const [mobNo, setMobNo] = useState('+91');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [secure, setSecure] = useState(false)
    
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
        BackHandler.addEventListener('hardwareBackPress', backPress)

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backPress)
        }
    }, []);

    const backPress = () => {
        navigation.goBack();
        return true;
    }

    
     
    const sentOTP = () => {
        if(!email){
            Toast.show({
                text1: "Email can't be empty!",
                type: 'error',
                position: 'top',
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 0,
                bottomOffset: 40,
                leadingIcon: null
              });
        } else {
            navigation.navigate('OTPForVerification',{ user: user })
        }
    }

    const sentNumberOTP = () => {
        if(mobNo.length < 10){
            Toast.show({
                text1: "Mobile number can't be empty!",
                type: 'error',
                position: 'top',
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 0,
                bottomOffset: 40,
                leadingIcon: null
              });
        } else {

            var realNumber = mobNo.slice(-10);

            const formData = new FormData();
            formData.append('mobile', realNumber);
    
            axiosClient().post('users/sendOTP',formData)
            .then((res) => {
                //console.log('users sendOTP res',res.data);
                if (res.data.Error === 0) {
                    setMobNo('');
                    navigation.navigate('OTPForVerification',{ user: user, mobile: realNumber })
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
                console.log('users sendOTP', err)
            })
        }
    }

    const changePassword = () => {
        if(!oldPassword || !newPassword || !confirmPassword || (newPassword !== confirmPassword)){
            Toast.show({
                text1: "Password is not correct!",
                type: 'error',
                position: 'top',
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 0,
                bottomOffset: 40,
                leadingIcon: null
              });
        } else {
            navigation.navigate('VerifyAccount')
        } 
    }

    return (
    <View style={{flex: 1,backgroundColor:'#F8FAF8'}}>

        {param == 'email' ?<AppHeader Header={'Enter New Email'}
        onPress={() => backPress()} />
        : param == 'password' ?
        <AppHeader Header={'Change Password'}
        onPress={() => backPress()} />
        : param == 'mobile' ?
        <AppHeader Header={'Enter New Mobile'}
        onPress={() => backPress()} />
        :null}

        <ScrollView keyboardShouldPersistTaps="always">

        <View style={{
            paddingVertical:20,
            backgroundColor: '#fff'
        }}>    

                <View style={{width:'90%',alignSelf:'center'}}>
                    <Text style={{ fontSize: 16, color: '#000',textAlign:'left'}}>
                        {param == 'email' ?
                         'Enter the new email you would like to use.'
                         : param == 'password' ?
                         'Your password must be 8 to 16 character with 1 number, 1 alphabet & 1 symbal'
                         : param == 'mobile' ?
                         'Enter the new mobile number you would like to use.'
                         : null}
                    </Text>

                    <View style={{marginTop:40}} />    
                    {
                    param == 'mobile' ?
                    <DefaultInput
                        label={'New Mobile'}
                        value={mobNo}
                        onChangeText={text => setMobNo(text)}
                        keyboardType={'number-pad'}
                        bgColor={'#fff'}
                        maxLength={13}
                    />
                    : param == 'email' ?
                    <DefaultInput
                        label={'New Email'}
                        value={email}
                        onChangeText={text => setEmail(text)}
                        keyboardType={'email-address'}
                        bgColor={'#fff'}
                    />
                    : param == 'password' ?
                    <View>
                        <DefaultInput
                            label={'old password'}
                            value={oldPassword}
                            onChangeText={text => setOldPassword(text)}
                            keyboardType={'default'}
                            bgColor={'#F5F5F5'}
                        />
                        <View style={{marginTop:15}} />
                        <DefaultInput
                            label={'new password'}
                            value={newPassword}
                            onChangeText={text => setNewPassword(text)}
                            keyboardType={'default'}
                            bgColor={'#F5F5F5'}
                        />

                        <View style={{marginTop:15}} />
                        <DefaultInput
                            label={'confirm password'}
                            value={confirmPassword}
                            onChangeText={text => setConfirmPassword(text)}
                            keyboardType={'default'}
                            bgColor={'#F5F5F5'}
                        />
                    </View>    
                    :null}

                    {param == 'email' ?
                    <TouchableOpacity onPress={() => sentOTP()}
                        style={{width:'100%',marginTop:50,backgroundColor:'#009D38',height:40,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                        <Text style={{textTransform:'uppercase',fontSize:14,color:'#fff',fontWeight:'bold'}}>GET OTP</Text>
                    </TouchableOpacity>
                    : param == 'password' ?
                    <TouchableOpacity onPress={() => changePassword()}
                        style={{width:'100%',marginTop:50,backgroundColor:'#009D38',height:40,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                        <Text style={{textTransform:'uppercase',fontSize:14,color:'#fff',fontWeight:'bold'}}>CHANGE PASSWORD</Text>
                    </TouchableOpacity>
                    : param == 'mobile' ?
                    <TouchableOpacity onPress={() => sentNumberOTP()}
                        style={{width:'100%',marginTop:50,backgroundColor:'#009D38',height:40,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                        <Text style={{textTransform:'uppercase',fontSize:14,color:'#fff',fontWeight:'bold'}}>GET OTP</Text>
                    </TouchableOpacity>
                    : null}

                </View>    

            </View>

            </ScrollView>
            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
    </View>
    )
}
export default VerifyScreens;

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
    toastStyle: {
        width:'100%',
    }

});    