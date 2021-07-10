import React, { useEffect, useState } from 'react'
import { BackHandler, Text, View, StyleSheet, ActivityIndicator,TouchableOpacity, ScrollView,StatusBar, Dimensions,ToastAndroid } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import Ionicon from 'react-native-vector-icons/Ionicons';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AppHeader from '../components/AppHeader';

const AfterLoginOTP = ({ navigation, route }) => {

    // const { title } = route.params;
    const [loader, setLoader] = useState(false);
    const [mobNo, setMobNo] = useState('');
    let otpInput = React.useRef();

    useEffect(() => {
        otpInput.focusField(0)
        BackHandler.addEventListener('hardwareBackPress', backPress)

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backPress)
        }
    }, []);

    const backPress = () => {
        navigation.goBack();
    }

    const [seconds, setSeconds] = useState(30);
  
    useEffect(() => {
      if (seconds > 0) {
        setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(0);
      }
    },[seconds]);

    return (
    <View style={{flex: 1,backgroundColor:'#F8FAF8'}}>
        {/* <StatusBar backgroundColor={'#B0191E'} barStyle={'light-content'} />

        <View style={styles.headerView}>
            <TouchableOpacity
                style={{width:'15%',alignItems:'center',justifyContent:'center'}}
                onPress={() => {navigation.navigate('editField',{param:'email'})}}>
                <Ionicon name='arrow-back-outline' size={20} color='#fff' />
            </TouchableOpacity>

            <View style={{width:'85%',alignItems: 'flex-start'}}>
                <Text style={styles.textHead}>{'Enter OTP'}</Text>
            </View>
        </View> */}

        <AppHeader Header={'Enter OTP'}
            onPress={() => {navigation.navigate('editField',{param:'email'})}} />

        <ScrollView keyboardShouldPersistTaps="always">

            <View style={{width:'90%',alignSelf:'center',alignItems:'flex-start',height:50,justifyContent:'center'}}>
                <Text style={{ fontSize: 15, color: '#000'}}>OTP sent to {'rajdatacube@gmail.com'}</Text>
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
                <Text style={{fontSize:15,color:'#000'}}>
                    Enter the OTP you received
                </Text>
                <OTPInputView
                    style={{width: '90%', height: 50,marginTop:10}}
                    pinCount={6}
                    autoFocusOnLoad={true}
                    ref={input => otpInput = input}
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    onCodeFilled = {(code => {
                        //console.log(`Code is ${code}, you are good to go!`);
                        navigation.navigate('InfoSettings')
                    })}
                />
            </View>

            <View style={{width:'90%',alignSelf:'center',alignItems:'center',marginTop:20}}>
                
                {seconds == 0 ?<Text style={{ fontSize: 15, color: '#000'}}>
                    Didn't receive the OTP ?
                    <Text style={{color:'#059DF8'}}> Resend OTP</Text>
                </Text>:
                <Text style={{ fontSize: 15, color: '#000'}}>
                    You should recieve the OTP in 
                    <Text style={{color:'#9F6165',fontWeight:'bold'}}>{' '+seconds} Second</Text>
                </Text>}

                <Text style={{ fontSize: 14, color: '#000',textAlign:'center',marginVertical:30}}>
                    Need help? <Text style={{color:'#059DF8'}}>Contact Us</Text>
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
export default AfterLoginOTP;

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