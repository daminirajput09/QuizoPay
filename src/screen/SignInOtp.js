import React, { useEffect, useState } from 'react'
import { BackHandler, Text, View, StyleSheet, ActivityIndicator,TouchableOpacity, ScrollView,StatusBar, Keyboard } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import axiosClient from '../api/axios-client'
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AppHeader from '../components/AppHeader';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from 'react-native-device-info';
import Toast, {BaseToast} from 'react-native-toast-message';

const SignInOtp = ({ navigation, route }) => {

    const { mobile } = route.params;
    const [loader, setLoader] = useState(false);
    // const [mobNo, setMobNo] = useState('');
    const [seconds, setSeconds] = useState(30);
    // const [FcmToken ,setFcmToken] = useState();

    let otpInput = React.useRef();

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
        otpInput.focusField(0)

        // getFcmToken();        
        BackHandler.addEventListener('hardwareBackPress', backPress)

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backPress)
            setSeconds(0);
        }
    }, []);

    const backPress = () => {
        navigation.goBack();
        return true;
    }

    useEffect(() => {
      if (seconds > 0) {
        setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(0);
      }
    },[seconds]);

    const resendOTP = () => {
        const formData = new FormData();
        formData.append('mobile', mobile)

        axiosClient().post('auth/sendOTP', formData)
            .then((res) => {
                
                //console.log('login res', res.data, formData)
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
            }).catch((err) => {
                console.log(err)
            })
    }

    const sendOTPFunc = (code) => {

        //console.log('data', mobile, code);

        AsyncStorage.getItem('fcmtoken').then(tokenId => {
        //console.log('warn', tokenId);

        if(mobile && code && tokenId){
            setLoader(true);

            const formData = new FormData();
            formData.append('mobile', mobile);
            formData.append('otp', code);
            formData.append('device_id', DeviceInfo.getDeviceId());
            formData.append('device_token', tokenId);

            axiosClient().post('auth/verifyOTP', formData)
              .then(async (res) => {
                //console.log('verifyOTP res', res.data, formData)

                if (res.data.Error == 0) {
                    await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.data))
                    setLoader(false);
                    navigation.navigate('Home')
                } else {
                    setLoader(false);
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
                console.log(err)
                setLoader(false);
            })
        } else {
            Toast.show({
                text1: 'Token not found!',
                type: 'error',
                position: 'top',
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 0,
                bottomOffset: 40,
                leadingIcon: null
            });
        }
    
    }).catch(e => console.log(e))

    }

    return (

    <View style={{flex: 1,backgroundColor:'#F8FAF8'}}>

        <AppHeader Header={'LOG IN'} onPress={() => backPress()} />

        {loader?<Modal isVisible={loader}>
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>    
            <ActivityIndicator color={"#A9A9A9"} size={'large'} />
            </View>
        </Modal>:
        <ScrollView style={{flex:1}} keyboardShouldPersistTaps='handled' keyboardDismissMode='none'>

            <View style={{width:'90%',alignSelf:'center',alignItems:'flex-start',height:50,justifyContent:'center'}}>
                <Text style={{ fontSize: 15, color: '#000',fontFamily:'SofiaProRegular'}}>
                    OTP sent to {mobile}</Text>
            </View>    

            <View style={{
                width:'90%',
                height:120,
                marginBottom: 10,
                alignSelf:'center',
                alignItems:'center',
                backgroundColor:'#fff',
                borderRadius:5,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                justifyContent:'center'}}>
                <Text style={{fontSize:15,color:'#000',fontFamily:'SofiaProRegular'}}>
                    Enter the OTP you received
                </Text>
                <OTPInputView
                    style={{width: '90%', height: 50,marginTop:10}}
                    pinCount={6}
                    ref={input => otpInput = input}
                    autoFocusOnLoad={true}
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    onCodeFilled = {(code => {
                        //console.log(`Code is ${code}, you are good to go!`);
                        // title == 'login'? 
                        sendOTPFunc(code);
                        // navigation.navigate('Home')
                        // :navigation.navigate('InfoSettings')
                    })}
                />
            </View>

            <View style={{width:'90%',alignSelf:'center',alignItems:'center',marginTop:20}}>
                
                {seconds == 0 ?<Text style={{ fontSize: 15, color: '#000',fontFamily:'SofiaProRegular'}} onPress={()=> resendOTP()}>
                    Didn't receive the OTP ?
                    <Text style={{color:'#059DF8'}}> Resend OTP</Text>
                </Text>:
                <Text style={{ fontSize: 15, color: '#000',fontFamily:'SofiaProRegular'}}>
                    You should recieve the OTP in<Text style={{color:'#9F6165',fontWeight:'bold'}}>{' '+seconds} Second</Text>
                </Text>}

                {/* {title == 'login'? */}
                <Text style={{ fontSize: 15, color: '#7282AB',fontWeight:'bold',fontFamily:'GilroyMedium'}}>
                   Log in using email     
                </Text>
                {/* :
                <Text style={{ fontSize: 14, color: '#000',textAlign:'center',marginVertical:30}}>
                    Need help? <Text style={{color:'#059DF8'}}>Contact Us</Text>
                </Text>} */}
            </View>    

            </ScrollView>}

            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />

    </View>
    )
}
export default SignInOtp;

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
    textHead: { 
        fontSize: 18, 
        textAlign: 'center',
        color:'#fff',
        fontFamily:'GilroyMedium'
    },
    borderStyleBase: {
        width: 30,
        height: 45
      },
     
      borderStyleHighLighted: {
        borderColor: "#03DAC6",
      },
     
      underlineStyleBase: {
        width: 40,
        height: 40,
        borderWidth: 1,
        color:'#000'
      },
      underlineStyleHighLighted: {
        borderColor: "#03DAC6",
        color:'#000'
      },
    
});    