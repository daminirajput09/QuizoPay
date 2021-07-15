import React, { useEffect, useState, useContext } from 'react'
import { BackHandler, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import DefaultInput from '../components/DefaultInput';
import AppHeader from '../components/AppHeader';
import axiosClient from '../api/axios-client'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Clipboard from '@react-native-community/clipboard';
import FontAwesomeIcon5 from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info';
import Toast, {BaseToast} from 'react-native-toast-message';

const windowHeight = Dimensions.get('window').height;

const Register = ({ navigation, route }) => {

    const [loader, setLoader] = useState(false);
    const [referralCode, setReferralCode] = useState('');
    const [userName, setUserName] = useState('');
    const [mobNo, setMobNo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [secure, setSecure] = useState(false)
    
    const [FcmToken ,setFcmToken] = useState();

    const [ShowContext, setShowContext] = useState(false);

    const [disableBtn, setDisableBtn] = useState(false);

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

        BackHandler.addEventListener('hardwareBackPress', backPress)

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backPress)
        }
    }, []);

    const backPress = () => {
        if(ShowContext == true){
            setShowContext(false);
        } else {
            navigation.goBack();
            return true;
        }
    }

    const getFcmToken = async () => {
        await AsyncStorage.getItem('fcmtoken', (err, result) => {
            if (!err && result !== null) {
                //console.log('get fcm value', JSON.parse(result), DeviceInfo.getDeviceId());
                setFcmToken(JSON.parse(result))
            }
            else {
                //console.log('fcmtoken err', err)
            }
        });
    }

    const PasteCode = async () => {
        const text = await Clipboard.getString()
        setReferralCode(text)
    }    

    const RegisterFunc = () => {

        setDisableBtn(true);

        const formData = new FormData();
        formData.append('name', userName)
        formData.append('email', email.toLocaleLowerCase())
        formData.append('phonenumber', mobNo)
        formData.append('password', password)
        formData.append('device_id', DeviceInfo.getDeviceId())
        formData.append('device_token', FcmToken)
        formData.append('referral_code', referralCode)
                
        axiosClient().post('auth/register', formData)
            .then(async (res) => {
                //console.log('register res', res, formData)
                if (res.data.Error == 0) {
                    await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.data))
                    setEmail('');
                    setUserName('');
                    setMobNo('');
                    setPassword('');
                    setReferralCode('');
                    setSecure(true)
                    setDisableBtn(false);
                    navigation.navigate('Home')
                } else {
                    setDisableBtn(false);
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
                //console.log(err)
                setDisableBtn(false);
            })
    }

    const EnterCode = () => {
        setShowContext(true);
    }


    return (
    <View style={{flex: 1,backgroundColor:'#F8FAF8'}}>
        {/* <StatusBar backgroundColor={'#B0191E'} barStyle={'light-content'} />

        <View style={styles.headerView}>
            <TouchableOpacity
                style={{width:'15%',alignItems:'center',justifyContent:'center'}}
                onPress={() => navigation.goBack()}>
                <Ionicon name='arrow-back-outline' size={20} color='#fff' />
            </TouchableOpacity>

            <View style={{width:'85%',alignItems: 'flex-start'}}>
                <Text style={styles.textHead}>Register {'&'} Play</Text>
            </View>
        </View> */}
        <AppHeader Header={'Register & Play'} onPress={() => backPress()} />

        <ScrollView keyboardShouldPersistTaps="always" style={{flex:1}}>

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


            {ShowContext == false &&
            <>
            <View style={{width:'90%',alignSelf:'center',marginTop:20,flexDirection:'row'}}>
                <View style={{width:'48%',borderWidth:0.5,alignItems:'center',marginRight:'4%',borderRadius:5,borderColor:'grey'}}>
                  <View style={{width:'90%',height:40,alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                      <AntDesignIcon name='facebook-square' size={20} color='#000' style={{marginRight:10}} />
                      <Text style={{ fontSize: 15, color: '#4460A0',fontWeight:'bold'}}>Facebook</Text>
                  </View>
                </View>

                <View style={{width:'48%',borderWidth:0.5,alignItems:'center',borderRadius:5,borderColor:'grey'}}>
                  <View style={{width:'90%',height:40,alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                      <AntDesignIcon name='google' size={20} color='#EB4739' style={{marginRight:10}} />
                      <Text style={{ fontSize: 15, color: '#EB4739',fontWeight:'bold'}}>Google</Text>
                  </View>
                </View>
            </View>


                <View style={{width:'100%',alignItems:'center',height:50,justifyContent:'center'}}>
                    <Text style={{ fontSize: 17, color: '#000'}}>or</Text>
                </View>
            </>
            }  

                <View style={{width:'90%',alignSelf:'center'}}>
    
                    {ShowContext && 
                    <>
                    <View style={{marginTop:15}} />
                    <DefaultInput
                        label={'Rseferral Code'}
                        value={referralCode}
                        onChangeText={text => setReferralCode(text)}
                        keyboardType={'default'}
                        bgColor={'#F2F4F2'}
                    />
                    <TouchableOpacity onPress={() => PasteCode()} style={{alignSelf:'flex-end',bottom:35,right:10}}>
                        <FontAwesomeIcon5 name="copy" size={20} color="#000" />
                    </TouchableOpacity>
                    </>}

                    <DefaultInput
                        label={'Name'}
                        value={userName}
                        onChangeText={text => setUserName(text)}
                        keyboardType={'default'}
                        bgColor={'#F2F4F2'}
                    />

                    <View style={{marginTop:15}} />

                    <DefaultInput
                        label={'Mobile no.'}
                        value={mobNo}
                        maxLength={10}
                        onChangeText={text => setMobNo(text)}
                        keyboardType={'number-pad'}
                        bgColor={'#F2F4F2'}
                    />
                    <Text style={{ fontSize: 12, color: '#000',textAlign:'left'}}>You will recieve an OTP for verification</Text>

                    <View style={{marginTop:15}} />
                    <DefaultInput
                        label={'Email'}
                        value={email}
                        onChangeText={text => setEmail(text)}
                        keyboardType={'email-address'}
                        bgColor={'#F2F4F2'}
                    />
                    <Text style={{ fontSize: 12, color: '#000',textAlign:'left'}}>No spam, We promise!</Text>

                    <View style={{marginTop:15}} />
                        <DefaultInput
                            label={'Password'}
                            value={password}
                            onChangeText={text => setPassword(text)}
                            keyboardType={'default'}
                            bgColor={'#F2F4F2'}
                            secureTextEntry={secure}
                        />
                        {secure?
                        <TouchableOpacity onPress={()=>setSecure(false)} style={{alignSelf:'flex-end',right:10,bottom:30}}>  
                            <FontAwesome5Icon name='eye-slash' size={20} color='#000' />
                        </TouchableOpacity>
                        :<TouchableOpacity onPress={()=>setSecure(true)} style={{alignSelf:'flex-end',right:10,bottom:30}}>
                            <FontAwesome5Icon name='eye' size={20} color='#000' />
                        </TouchableOpacity>}
                    <Text style={{ fontSize: 11, color: '#000',textAlign:'left',bottom:15}}>
                        Must be 8 to 16 character with 1 number, 1 alphabet {'&'} 1 symbal
                    </Text>

                    {!disableBtn?<TouchableOpacity activeOpacity={mobNo && email && password?0:1} onPress={() => mobNo && email && password?RegisterFunc():null}
                        style={{width:'100%',marginTop:20,backgroundColor:mobNo && email && password?'#009D38':'#D8D9D8',height:45,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                        <Text style={{textTransform:'uppercase',fontSize:14,color:mobNo && email && password?'#fff':'#A6A7A5'}}>Register</Text>
                    </TouchableOpacity>:
                    <TouchableOpacity activeOpacity={1}
                        style={{width:'100%',marginTop:20,backgroundColor:'#D8D9D8',height:45,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                        <Text style={{textTransform:'uppercase',fontSize:14,color:'#A6A7A5',top:17}}>Register</Text>
                        <ActivityIndicator style={{bottom:10}} size="large" color="#A9A9A9" />
                    </TouchableOpacity>}

                    <Text style={{ fontSize: 14, color: '#000',textAlign:'center',marginVertical:30}}>
                        By registering, I agree to Quizo <Text style={{fontWeight:'bold'}}>T{'&'}Cs</Text>
                    </Text>
                </View>    

            </View>

            {ShowContext == false &&
            <View style={{width:'90%',alignSelf:'center',flexDirection:'row',flex:1,alignItems:'flex-end',marginBottom:20}}>
              <TouchableOpacity style={{width:'50%',alignItems:'flex-start'}} onPress={()=> EnterCode()}>
                <Text style={{color:'grey',fontSize:15}}>Have a refreal code?</Text>
                <Text style={{color:'#000',fontWeight:'bold',fontSize:15}}>Enter Code</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{width:'50%',alignItems:'flex-end'}} onPress={()=>navigation.navigate('SignIn')}>
                <Text style={{color:'grey',fontSize:15}}>Already a user?</Text>
                <Text style={{color:'#000',fontWeight:'bold',fontSize:15}}>Log In</Text>
              </TouchableOpacity>
            </View>}

            </ScrollView>

           

            <Modal isVisible={loader}>
              <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>    
                <ActivityIndicator color={"#A9A9A9"} size={'large'} />
              </View>
            </Modal>

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

});    