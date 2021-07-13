import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Platform, BackHandler, StyleSheet, ScrollView, Image } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Entypo';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from '../components/Loader';
import axiosClient from '../api/axios-client';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { Tooltip } from 'react-native-elements';
import {useIsFocused} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import Toast, {BaseToast} from 'react-native-toast-message';

const MyBalance = ({ navigation }) => {

    const [loading, setLoading] = useState(false)
    const [viewHide, setViewHide] = useState(true);
    const [Balance, setBalance] = useState(0);
    const [UserInfo, setUserInfo] = useState();
    const isFocused = useIsFocused();

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
        setViewHide(true);
    }, [isFocused]);

    // useEffect(() => {
    //     WalletBalance();
    // }, [UserInfo]);
    
    const getFcmToken = async () => {
        await AsyncStorage.getItem('userInfo', async(err, result) => {
            if (!err && result !== null) {
                setUserInfo(JSON.parse(result))
                WalletBalance(JSON.parse(result));
                // //console.log('userInfo data in my balance', result)
            } else {
                //console.log('userInfo err', err)
            }
            })
    }

    const WalletBalance = (userid) => {
        if(userid){
        const formData = new FormData();
        formData.append('userid', userid);
        axiosClient().post('wallet/getBalance', formData)
            .then(async (res) => {
                // //console.log('get Balance res', res.data, formData)
                if (res.data.Error == 0) {
                    setBalance(res.data.balance);
                } else if(res.data.Error == 1) {
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
                //console.log('get Balance', err)
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

    useEffect(() => {
        getFcmToken();
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }
    },[])

    const handleBackPress = () => {
        navigation.goBack();
        return true;
    };

    return (
        <>
            { loading ? <Loader isLoading={loading} /> : <View style={{ flex: 1 }}>
            <AppHeader Header={'My Balance'} onPress={() => navigation.goBack()} />

        <ScrollView keyboardShouldPersistTaps="always">

            <View style={[styles.outerView,{paddingBottom: 10}]}>

                <View style={{paddingVertical:7}}>
                    <Text style={[styles.walletModalText,{color:'grey',fontFamily:'GilroyMedium'}]}>Total balance</Text>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <FontAwesomeIcon name='rupee' size={16} color='#000' style={{marginTop:12}} />
                        <Text style={[styles.walletModalText,{marginTop:10,fontFamily:'SofiaProRegular'}]}>0</Text>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.navigate('AddCash', {userId:UserInfo.id ,Balance: Balance})} 
                        style={{width:100,alignSelf:'center',height:40,marginTop:5,justifyContent:'center',alignItems:'center',borderRadius:4,backgroundColor:'#109E38'}}>
                        <Text style={{ fontSize: 14, color: '#fff',borderRadius:5,fontWeight:'bold',fontFamily:'GilroyMedium'}}>{'ADD CASH'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{width:'90%',alignSelf:'center',height:0.5,backgroundColor:'grey',marginTop:15}} />
                <View style={{width:'90%',alignSelf:'center',marginTop:15,flexDirection:'row'}}>
                    <View style={{width:'70%',alignItems:'flex-start'}}>
                        <Text style={{textTransform:'uppercase',fontSize:10,fontFamily:'SofiaProRegular'}}>amount added (unutilised)</Text>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <FontAwesomeIcon name='rupee' size={13} color='#000' style={{marginTop:7}} />
                            <Text style={{textTransform:'uppercase',fontSize:14,fontWeight:'bold',marginTop:5,fontFamily:'SofiaProRegular'}}>0</Text>
                        </View>
                    </View>
                    <View style={{width:'30%',alignItems:'flex-end'}}>                        
                        <Tooltip
                        width={300}
                        height={45}
                        containerStyle={{borderRadius:4,paddingVertical:2}}
                        backgroundColor={'#2071E4'} 
                        popover={
                            <View><Text style={{fontSize:11,color:'#fff',textAlign:'center',fontFamily:'SofiaProRegular'}}>Money added by you that you can use to join conteacts, but can't withdraw</Text></View>
                        } overlayColor="transparent" skipAndroidStatusBar={true}>
                            <Ionicon name='md-information-circle-outline' size={20} color='#76A0DE' />
                        </Tooltip>
                    </View>
                </View>
                <View style={{width:'90%',alignSelf:'center',height:0.5,backgroundColor:'grey',marginTop:15}} />
                <View style={{width:'90%',alignSelf:'center',marginTop:15,flexDirection:'row'}}>
                    <View style={{width:'50%',alignItems:'flex-start'}}>
                        <Text style={{textTransform:'uppercase',fontSize:10,fontFamily:'SofiaProRegular'}}>winnings</Text>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <FontAwesomeIcon name='rupee' size={13} color='#000' style={{marginTop:7}} />
                            <Text style={{textTransform:'uppercase',fontSize:14,fontWeight:'bold',marginTop:5,fontFamily:'SofiaProRegular'}}>0</Text>
                        </View>
                        <Text style={{color:'#FFCA8F',fontSize:10,marginTop:5,fontFamily:'SofiaProRegular'}}>
                            Verify your account to be eligible to withdraw.
                        </Text>
                    </View>
                    <View style={{width:'40%',justifyContent:'flex-start'}}>
                        <TouchableOpacity onPress={()=>navigation.navigate('VerifyAccount')} 
                            style={{width:110,alignSelf:'center',height:35,justifyContent:'center',alignItems:'center',borderRadius:5,borderWidth:0.5}}>
                            <Text style={{ fontSize: 13, color: '#000',fontFamily:'SofiaProRegular'}}>
                                {'VERIFY NOW'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'10%',alignItems:'flex-end'}}>
                        <Tooltip
                        width={300}
                        height={45}
                        containerStyle={{borderRadius:4,paddingVertical:2}}
                        backgroundColor={'#2071E4'} 
                        popover={
                            <View><Text style={{fontSize:11,color:'#fff',textAlign:'center',fontFamily:'SofiaProRegular'}}>Money that you can withdraw or re-use to join any contests</Text></View>
                        } overlayColor="transparent" skipAndroidStatusBar={true}>
                            <Ionicon name='md-information-circle-outline' size={20} color='#76A0DE' />
                        </Tooltip>
                    </View>
                </View>
                <View style={{width:'90%',alignSelf:'center',height:0.5,backgroundColor:'grey',marginTop:15}} />
                <View style={{width:'90%',alignSelf:'center',marginTop:15,flexDirection:'row'}}>
                    <View style={{width:'70%',alignItems:'flex-start'}}>
                        <Text style={{textTransform:'uppercase',fontSize:10,fontFamily:'SofiaProRegular'}}>cash bonus</Text>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <FontAwesomeIcon name='rupee' size={13} color='#000' style={{marginTop:7}} />
                            <Text style={{textTransform:'uppercase',fontSize:14,fontWeight:'bold',marginTop:5,fontFamily:'SofiaProRegular'}}>0</Text>
                        </View>
                    </View>
                    <View style={{width:'30%',alignItems:'flex-end'}}>
                        <Tooltip
                        width={300}
                        height={45}
                        containerStyle={{borderRadius:4,paddingVertical:2}}
                        backgroundColor={'#2071E4'} 
                        popover={
                            <View><Text style={{fontSize:11,color:'#fff',textAlign:'center',fontFamily:'SofiaProRegular'}}>Money that you can use to join any public contests</Text></View>
                        } overlayColor="transparent" skipAndroidStatusBar={true}>
                            <Ionicon name='md-information-circle-outline' size={20} color='#76A0DE' />
                        </Tooltip>
                    </View>
                </View>
                {/* {viewHide?<View style={{width:'90%',alignSelf:'center',marginTop:10,flexDirection:'row',borderWidth:0.5,borderColor:'#109E38',borderRadius:4,padding:7}}>
                    <FontAwesomeIcon name="money" size={25} color="#356D0B" />
                    <View style={{width:'85%',alignSelf:'center',paddingHorizontal:5}}>
                        <Text style={{fontSize:10,fontFamily:'SofiaProRegular'}}>Maximum usable Cash Bonus per match = 10% of Entry Fees Know more</Text>
                    </View>
                    <TouchableOpacity onPress={()=> setViewHide(false)}>
                      <Ionicon name="close" size={22} color="grey" />
                    </TouchableOpacity>    
                </View>:null} */}

            </View>

            <TouchableOpacity style={[styles.outerView,{flexDirection:'row',height:55,justifyContent:'center',alignItems:'center'}]} onPress={()=>navigation.navigate('RecentTransactions')}>
                <View style={{width:'80%',paddingLeft:20}}>
                    <Text style={{fontSize:14,fontFamily:'GilroyMedium'}}>My Recent Transactions</Text>
                </View>
                <View style={{width:'20%',alignItems:'flex-end',paddingRight:15}}>
                    <Icon name='chevron-right' size={20} color='#A9A9A9' />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.outerView,{flexDirection:'row',height:55,justifyContent:'center',alignItems:'center'}]} onPress={()=>navigation.navigate('ManagePayment')}>
                <View style={{width:'80%',paddingLeft:20}}>
                    <Text style={{fontSize:14,fontFamily:'GilroyMedium'}}>Manage payments</Text>
                    <Text style={{fontSize:11,color:'#A0A0A0',fontFamily:'SofiaProRegular'}}>Add/Remove Cards, Wallet, etc.</Text>
                </View>
                <View style={{width:'20%',alignItems:'flex-end',paddingRight:15}}>
                    <Icon name='chevron-right' size={20} color='#A9A9A9' />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.outerView,{flexDirection:'row',height:55,justifyContent:'center',alignItems:'center'}]} onPress={()=>navigation.navigate('EarnMoney')}>
                <View style={{width:'80%',paddingLeft:20}}>
                    <Text style={{fontSize:14,fontFamily:'GilroyMedium'}}>Refer and Earn</Text>
                    <Text style={{fontSize:11,color:'#A0A0A0',fontFamily:'SofiaProRegular'}}>Invite a friend and earn up to <FontAwesomeIcon name='rupee' size={12} color='#A0A0A0' />200 cash bonus</Text>
                </View>
                <View style={{width:'20%',alignItems:'flex-end',paddingRight:15}}>
                    <Icon name='chevron-right' size={20} color='#A9A9A9' />
                </View>
            </TouchableOpacity>

        </ScrollView>

        <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />

        </View>}
        </>
    )
}
export default MyBalance;

const styles = StyleSheet.create({

    headerView: {
        flexDirection: 'row',
        marginTop: Platform.OS === 'ios' ? hp('4') : 0,
        alignItems: 'center',
        paddingHorizontal: 5,
        height: 50,
        backgroundColor:'#C61D24'
    },
    textHead: { 
        fontSize: 18, 
        textAlign: 'center',
        color:'#fff', 
        textTransform:'capitalize'
        ,fontFamily:'GilroyMedium'
    }, 
    outerView: {
        margin: 3,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2,
    },
    walletModalView: {
        width: '100%',
        height:430,
        paddingTop:10
    },
    walletModalText: {
        textAlign:'center',
        textTransform:'uppercase',
        fontSize:14
    }, 
});