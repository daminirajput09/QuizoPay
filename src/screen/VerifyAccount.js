import React, { useEffect, useState, useContext } from 'react'
import { BackHandler, Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar, Dimensions,Image } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontistoIcon from 'react-native-vector-icons/Zocial';
import Toast, {BaseToast} from 'react-native-toast-message';
import axiosClient from '../api/axios-client';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from '@react-navigation/native';
import Loading from '../components/Loader';
import AntIcon from 'react-native-vector-icons/AntDesign';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const windowHeight = Dimensions.get('window').height;

const VerifyAccount = ({ navigation, route }) => {

    const isFocused = useIsFocused();
    const [User, setUser] = useState();
    const [Loader, setLoader] = useState(true);

    const [UserDetails, setUserDetails] = useState();
    const [PANDetails, setPANDetails] = useState();
    const [BankDetails, setBankDetails] = useState();

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
        getUser();

        BackHandler.addEventListener('hardwareBackPress', backPress)

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backPress)
        }
    }, []);

    useEffect(() => {
        if(isFocused && User && User.id){
            VerifyDetails();
        }
    },[User, isFocused]);

    const backPress = () => {
        navigation.goBack();
        return true;
    }

    const getUser = async() => {
        await AsyncStorage.getItem('userInfo', async(err, result) => {
            if (!err && result !== null) {
                setUser(JSON.parse(result))
                //console.log('userInfo data in verify', result)
            } else {
                console.log('userInfo err', err)
            }
          })
    }

    const VerifyDetails = () => {

        if(User && User.id){

            const formData = new FormData();
            formData.append('userid', User.id);

            axiosClient().post('users/varifyDetails', formData)
              .then(async (res) => {
                //console.log('varifyDetails res', res.data, formData)

                setLoader(false);
                if (res.data.Error == 0) {
                    setUserDetails(res.data.data);
                    setPANDetails(res.data.data.pan_details);
                    setBankDetails(res.data.data.bank_details);
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
                console.log(err)
            })
        } else {
            Toast.show({
                text1: 'User Id not found!',
                type: 'error',
                position: 'top',
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 0,
                bottomOffset: 40,
                leadingIcon: null
            });
        }
    }

    const MyLoader = () => {
        return(
          <SkeletonPlaceholder>
              {/* <SkeletonPlaceholder.Item width={"100%"} height={50} borderRadius={0} /> */}
              <SkeletonPlaceholder.Item width={"100%"} height={50} />
              <SkeletonPlaceholder.Item paddingHorizontal={0}>
                  <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={5} />
                  <SkeletonPlaceholder.Item width={"100%"} height={2} borderRadius={4} marginTop={40} />
                  <SkeletonPlaceholder.Item width={"100%"} height={2} borderRadius={4} marginTop={60} />
                  <SkeletonPlaceholder.Item width={"100%"} height={2} borderRadius={4} marginTop={60} />
                  <SkeletonPlaceholder.Item width={"100%"} height={2} borderRadius={4} marginTop={60} />
                  <SkeletonPlaceholder.Item width={"100%"} height={2} borderRadius={4} marginTop={60} />
                  {/* <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={10} />
                  <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={10} /> */}
              </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
    )}

    return (
    <View style={{flex: 1,backgroundColor:'#F8FAF8'}}>
        <StatusBar backgroundColor={'#000000'} barStyle={'light-content'} />

        <View style={styles.headerView}>
            <TouchableOpacity
                style={{width:'15%',alignItems:'center',justifyContent:'center'}}
                onPress={() => navigation.goBack()}>
                <Ionicon name='arrow-back-outline' size={20} color='#fff' />
            </TouchableOpacity>

            <View style={{width:'85%',alignItems: 'flex-start'}}>
                <Text style={styles.textHead}>{'Verify Account'}</Text>
            </View>
        </View>

        {Loader ? (
                // <Loading isLoading={Loader} />
                <MyLoader />
        ) : (
        <ScrollView keyboardShouldPersistTaps="always">

            <View style={{backgroundColor:'#FFF6F9',width:'100%',flexDirection:'row',paddingVertical:10}}>
                <View style={{width:'70%',padding:10}}>
                    <Text style={{color:'#6B0F0F',fontWeight:'bold',fontSize:17,fontFamily:'GilroyMedium'}}>Get Verified</Text>
                    <Text style={{color:'#000',fontSize:14,fontFamily:'SofiaProRegular'}}>Withdraw winnings to your bank account instantly!</Text>
                </View>
                <View style={{width:'30%',padding:10,alignItems:'flex-end'}}>
                    <Image style={{width:60,height:60}} source={require('../../assets/verifiedImage.png')} />
                </View>
            </View>

            <View style={{backgroundColor:'#F5F5F5',width:'100%',height:10}} />

            <TouchableOpacity activeOpacity={UserDetails && UserDetails.mobile_varified == 1?1:0} onPress={()=> UserDetails && UserDetails.mobile_varified == 1 ?null:navigation.navigate('VerifyScreens',{param:'mobile',user: User})} style={{width:'100%',flexDirection:'row',paddingVertical:15,height:75}}>
                <View style={{width:'15%',alignItems:'center',justifyContent:'flex-start'}}>
                    <FontAwesomeIcon name="mobile-phone" size={30} color="#000" />
                </View>
                <View style={{width:'85%'}}>
                    <Text style={{color:'#000',fontSize:15,fontFamily:'SofiaProRegular'}}>Mobile Number</Text>
                    <Text style={{color:'#000',fontWeight:'bold',fontSize:14,fontFamily:'GilroyMedium'}}>
                        {UserDetails && UserDetails.mobileno}
                    </Text>
                    {UserDetails && UserDetails.mobile_varified == 0?
                    <View style={{width:80,height:20,backgroundColor:'#C2E8CF',justifyContent:'center',alignItems:'center',borderRadius:5,bottom:35,right:2,alignSelf:'center'}}>
                        <Text style={{fontSize: 10,color:'#348148',fontWeight:'bold',fontFamily:'SofiaProRegular'}}>NOT VERIFIED</Text>
                    </View>
                    :UserDetails && UserDetails.mobile_varified == 1?
                    <View style={{width:60,height:20,backgroundColor:'#C2E8CF',justifyContent:'center',alignItems:'center',borderRadius:5,bottom:35,right:15,alignSelf:'center'}}>
                        <Text style={{fontSize: 11,color:'#348148',fontWeight:'bold',fontFamily:'SofiaProRegular'}}>VERIFIED</Text>
                    </View>
                    :
                    <View style={{paddingHorizontal:5,height:20,backgroundColor:'#DBEBFF',justifyContent:'center',alignItems:'center',borderRadius:5,alignSelf:'center',bottom:35,right:15}}>
                        <Text style={{fontSize: 11,color:'#1B3965',fontWeight:'bold',fontFamily:'SofiaProRegular'}}>IN REVIEW</Text>
                    </View>}
                </View>
            </TouchableOpacity>
            <View style={{backgroundColor:'#F5F5F5',width:'100%',height:2}} />

            <TouchableOpacity  activeOpacity={UserDetails && UserDetails.email_varified == 1?1:0} onPress={()=> UserDetails && UserDetails.email_varified == 1 ?null: navigation.navigate('VerifyScreens',{param:'email',user: User})} style={{width:'100%',flexDirection:'row',paddingVertical:15,height:75}}>
                <View style={{width:'15%',alignItems:'center',justifyContent:'flex-start'}}>
                    <FontistoIcon name="email" size={20} color="#000" />
                </View>
                <View style={{width:'85%'}}>
                    <Text style={{color:'#000',fontSize:15,fontFamily:'SofiaProRegular'}}>Email Address</Text>
                    <Text style={{color:'#000',fontWeight:'bold',fontSize:14,fontFamily:'GilroyMedium'}}>
                        {UserDetails && UserDetails.email}
                    </Text>
                    {UserDetails && UserDetails.email_varified == 0?
                    <View style={{width:80,height:20,backgroundColor:'#C2E8CF',justifyContent:'center',alignItems:'center',borderRadius:5,bottom:35,right:12,alignSelf:'center'}}>
                        <Text style={{fontSize: 10,color:'#348148',fontWeight:'bold',fontFamily:'SofiaProRegular'}}>NOT VERIFIED</Text>
                    </View>
                    :UserDetails && UserDetails.email_varified == 1?
                    <View style={{width:60,height:20,backgroundColor:'#C2E8CF',justifyContent:'center',alignItems:'center',borderRadius:5,bottom:35,right:15,alignSelf:'center'}}>
                        <Text style={{fontSize: 11,color:'#348148',fontWeight:'bold',fontFamily:'SofiaProRegular'}}>VERIFIED</Text>
                    </View>
                    :
                    <View style={{paddingHorizontal:5,height:20,backgroundColor:'#DBEBFF',justifyContent:'center',alignItems:'center',borderRadius:5,alignSelf:'center',bottom:35,right:15}}>
                        <Text style={{fontSize: 11,color:'#1B3965',fontWeight:'bold',fontFamily:'SofiaProRegular'}}>IN REVIEW</Text>
                    </View>}
                </View>
            </TouchableOpacity>
            <View style={{backgroundColor:'#F5F5F5',width:'100%',height:2}} />

            <TouchableOpacity  style={{width:'100%',flexDirection:'row',paddingVertical:15}}>
                <View style={{width:'15%',alignItems:'center',justifyContent:'flex-start'}}>
                    <AntDesignIcon name="idcard" size={20} color="#000" />
                </View>
                <View style={{width:'63%'}}>
                    <Text style={{color:'#000',fontSize:15,fontFamily:'SofiaProRegular'}}>PAN Card</Text>
                    <Text style={{color:'#000',fontWeight:'bold',fontSize:14,fontFamily:'GilroyMedium'}}>CC*****7B</Text>
                    <Text style={{color:'#213D6A',fontSize:12,fontFamily:'SofiaProRegular'}}>Processing PAN Details...</Text>
                </View>
                {PANDetails && PANDetails.verified == 0 ?
                <TouchableOpacity onPress={()=> navigation.navigate('VerifyPAN',{reviewType: PANDetails.verified == 0?'notDone':PANDetails.verified == 1?'done':'inreview', data: PANDetails})}
                    style={{width:70,alignSelf:'center',height:35,justifyContent:'center',alignItems:'center',borderRadius:5,borderWidth:0.5}}>
                    <Text style={{ fontSize: 13, color: '#000',fontWeight:'bold',fontFamily:'GilroyMedium'}}>{'VERIFY'}</Text>
                </TouchableOpacity>:
                <TouchableOpacity onPress={()=> navigation.navigate('VerifyPAN',{reviewType: PANDetails.verified == 0?'notDone':PANDetails.verified == 1?'done':'inreview', data: PANDetails})}
                    style={{width:'22%',alignItems:'flex-end',paddingRight:5,justifyContent:'center'}}>
                    <EntypoIcon name="chevron-thin-right" size={25} color="#000" />
                </TouchableOpacity>}
            </TouchableOpacity>
            {PANDetails && PANDetails.verified == 0?
            <View style={{width:80,height:20,backgroundColor:'#C2E8CF',justifyContent:'center',alignItems:'center',borderRadius:5,bottom:70,right:15,alignSelf:'center'}}>
                <Text style={{fontSize: 10,color:'#348148',fontWeight:'bold',fontFamily:'SofiaProRegular'}}>NOT VERIFIED</Text>
            </View>
            :PANDetails && PANDetails.verified == 1?
            <View style={{width:60,height:20,backgroundColor:'#C2E8CF',justifyContent:'center',alignItems:'center',borderRadius:5,bottom:70,right:25,alignSelf:'center'}}>
                <Text style={{fontSize: 11,color:'#348148',fontWeight:'bold',fontFamily:'SofiaProRegular'}}>VERIFIED</Text>
            </View>
            :
            <View style={{paddingHorizontal:5,height:20,backgroundColor:'#DBEBFF',justifyContent:'center',alignItems:'center',borderRadius:5,alignSelf:'center',bottom:70,right:25}}>
                <Text style={{fontSize: 11,color:'#1B3965',fontWeight:'bold',fontFamily:'SofiaProRegular'}}>IN REVIEW</Text>
            </View>}
            {/* <View style={{paddingHorizontal:5,height:20,backgroundColor:'#DBEBFF',justifyContent:'center',alignItems:'center',borderRadius:5,alignSelf:'center',bottom:70,right:25}}>
                <Text style={{fontSize: 11,color:'#1B3965',fontWeight:'bold',fontFamily:'SofiaProRegular'}}>IN REVIEW</Text>
            </View> */}
            <View style={{backgroundColor:'#F5F5F5',width:'100%',height:2,marginTop:-15}} />

            <View style={{width:'100%',flexDirection:'row',paddingVertical:15}}>
                <View style={{width:'15%',alignItems:'center',justifyContent:'flex-start'}}>
                    <FontAwesomeIcon name="bank" size={20} color="#000" />
                </View>
                <View style={{width:'60%'}}>
                    <Text style={{color:'#000',fontSize:15,fontFamily:'GilroyMedium'}}>Bank Account</Text>
                    <Text style={{color:'#000',fontSize:13,fontFamily:'SofiaProRegular'}}>
                        For quick withdrawals to your bank account.
                    </Text>
                </View>
                <View style={{width:'25%',justifyContent:'center'}}>
                    <TouchableOpacity onPress={()=>navigation.navigate('VerifyBank',{reviewType: BankDetails.status == 'Review'?'inreview':BankDetails.status == 'done'?'done':'notDone', data: BankDetails})} 
                        style={{width:70,alignSelf:'center',height:35,justifyContent:'center',alignItems:'center',borderRadius:5,borderWidth:0.5}}>
                        <Text style={{ fontSize: 13, color: '#000',fontWeight:'bold',fontFamily:'GilroyMedium'}}>{'VERIFY'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            </ScrollView>)}
            
            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />

    </View>
    )
}
export default VerifyAccount;

const styles = StyleSheet.create({

    headerView: {
        flexDirection: 'row',
        marginTop: 0,
        alignItems: 'center',
        paddingHorizontal: 5,
        // borderWidth:1,
        height: 50,
        backgroundColor:'#1A1A1A'
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