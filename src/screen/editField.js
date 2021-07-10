import React, { useEffect, useState, useContext } from 'react'
import { BackHandler, Text, View, StyleSheet, ToastAndroid, Image, TouchableOpacity, ScrollView, Alert, StatusBar, Dimensions, } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { MyContext } from '../components/UseContext';
import Modal from 'react-native-modal';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import DefaultInput from '../components/DefaultInput';
import Toast, {BaseToast} from 'react-native-toast-message';
import AppHeader from '../components/AppHeader';
import axiosClient from '../api/axios-client';
import Loader from '../components/Loader';

const windowHeight = Dimensions.get('window').height;

const Register = ({ navigation, route }) => {

    const { param, user } = route.params;
    //console.log('come from', param, user);

    const [token, setToken] = useState('')
    const [mobNo, setMobNo] = useState('+91');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [secure, setSecure] = useState(false)
    const [loading, setLoading] = useState(false);

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
        // navigation.navigate('InfoSettings');
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
            navigation.navigate('AfterLoginOTP', {title: 'otp'})
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
                    navigation.navigate('OTPForVerification',{ user: user, mobile: realNumber })
                    // setMobNo('');
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
                //console.log('users sendOTP', err)
            })

            // navigation.navigate('AfterLoginOTP', {title: 'otp'})
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

            setLoading(true);

            const formData = new FormData();
            formData.append('userid', user.id);
            formData.append('oldpassword', oldPassword);
            formData.append('newpassword', newPassword);

            axiosClient().post('auth/changePassword', formData)
                .then(async (res) => {
                    //console.log('changePassword res', res.data, formData)
                    if (res.data.Error == 0) {
                        setLoading(false);
                        Toast.show({
                            text1: res.data.message,
                            type: 'success',
                            position: 'top',
                            visibilityTime: 4000,
                            autoHide: true,
                            topOffset: 0,
                            bottomOffset: 40,
                            leadingIcon: null
                        });
                    } else {
                        setLoading(false);
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
                    setLoading(false);
                    //console.log('changePassword error', err)
                })
            // navigation.navigate('InfoSettings')
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

        {/* <StatusBar backgroundColor={'#B0191E'} barStyle={'light-content'} />

        <View style={styles.headerView}>
            <TouchableOpacity
                style={{width:'15%',alignItems:'center',justifyContent:'center'}}
                onPress={() => navigation.navigate('InfoSettings')}>
                <Ionicon name='arrow-back-outline' size={20} color='#fff' />
            </TouchableOpacity>

            <View style={{width:'85%',alignItems: 'flex-start'}}>
                <Text style={styles.textHead}>
                    {param == 'email' ?'Enter New Email': param == 'password' ?'Change Password': param == 'mobile' ?'Enter New Mobile': null}
                </Text>
            </View>
        </View> */}

        {loading ? (
                <Loader isLoading={loading} />
        ) : (
        <ScrollView keyboardShouldPersistTaps="always">

        <View style={{
            paddingVertical:20,
            backgroundColor: '#fff'
        }}>    

                <View style={{width:'90%',alignSelf:'center'}}>
                    <Text style={{ fontSize: 16, color: '#000',textAlign:'left',fontFamily:'SofiaProRegular'}}>
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
                        <Text style={{textTransform:'uppercase',fontSize:14,color:'#fff',fontWeight:'bold',fontFamily:'GilroyBold'}}>GET OTP</Text>
                    </TouchableOpacity>
                    : param == 'password' ?
                    <TouchableOpacity onPress={() => changePassword()}
                        style={{width:'100%',marginTop:50,backgroundColor:'#009D38',height:40,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                        <Text style={{textTransform:'uppercase',fontSize:14,color:'#fff',fontWeight:'bold',fontFamily:'GilroyBold'}}>CHANGE PASSWORD</Text>
                    </TouchableOpacity>
                    : param == 'mobile' ?
                    <TouchableOpacity onPress={() => sentNumberOTP()}
                        style={{width:'100%',marginTop:50,backgroundColor:'#009D38',height:40,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                        <Text style={{textTransform:'uppercase',fontSize:14,color:'#fff',fontWeight:'bold',fontFamily:'GilroyBold'}}>GET OTP</Text>
                    </TouchableOpacity>
                    : null}

                </View>    

            </View>

            </ScrollView>)}
            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
    </View>
    )
}
export default Register;

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