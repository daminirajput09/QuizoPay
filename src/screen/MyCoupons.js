import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Platform, BackHandler, StyleSheet, ScrollView, Image } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Entypo';
import Loader from '../components/Loader';
import DefaultInput from '../components/DefaultInput';
import AppHeader from '../components/AppHeader';

const MyCoupons = ({ navigation }) => {
    const [loading, setLoading] = useState(false)
    const [amount, setAmount] = useState('');

    useEffect(() => {
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

        <AppHeader Header={'Offers & Coupons'} onPress={() => navigation.goBack()} />

        <ScrollView keyboardShouldPersistTaps="always">

            <View style={[styles.outerView]}>
                <Text style={{fontSize:15,fontWeight:'bold',fontFamily:'GilroyMedium'}}>Have a Coupon Code?</Text>
                
                <View style={{width:'100%',flexDirection:'row',marginTop:15}}>
                    <View style={{width:'50%',justifyContent:'flex-end',height:40}}>
                        <DefaultInput
                            label={'Enter Coupon Code'}
                            value={amount}
                            bgColor={'#fff'}
                            onChangeText={text => setAmount(text)}
                            keyboardType={'number-pad'}
                        />
                    </View>
                    <View style={{width:'50%',alignItems:'flex-end'}}>
                        <TouchableOpacity activeOpacity={amount?0:1} style={{width:130,alignSelf:'center',height:45,justifyContent:'center',alignItems:'center',borderRadius:5,backgroundColor:amount?'#148835':'#DADADA'}}>
                            <Text style={{ fontSize: 14, color: amount?'#fff':'grey',fontFamily:'GilroyMedium'}}>
                                {'APPLY CODE'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

            <View style={{backgroundColor:'#F0EFF4',width:'100%',padding:20}}>
                <Text style={{fontSize:14,textAlign:'center',marginTop:20,fontFamily:'SofiaProRegular'}}>
                    You have no active Promition Coupons at the moment
                </Text>
                <Image source={require('../../assets/dream.png')} style={{ height: 200, width: '80%',alignSelf:'center',marginVertical:25 }} />
                <Text style={{fontSize:14,textAlign:'center',marginTop:20,fontFamily:'SofiaProRegular'}}>
                    Keep an eye out for promotions and offers for exciting rewards!
                </Text>
            </View>

            <View style={[{paddingLeft:15,backgroundColor: '#fff',width:'100%',flexDirection:'row',height:50,justifyContent:'center',alignItems:'center',alignSelf:'center'}]}>
                <View style={{width:'80%',paddingLeft:20}}>
                    <Text style={{fontSize:15,fontWeight:'bold',fontFamily:'SofiaProRegular'}}>Inactive</Text>
                </View>
                <View style={{width:'20%',alignItems:'flex-end',paddingRight:15}}>
                    <Icon name='chevron-right' size={25} color='#000' />
                </View>
            </View>

        </ScrollView>

            </View>}
        </>
    )
}
export default MyCoupons;

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
        paddingVertical: 25,
        paddingLeft:15,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        // borderWidth:0.5,
    },
    walletModalView: {
        width: '100%',
        height:430,
        paddingTop:10
    },
    walletModalText: {
        textAlign:'center',
        textTransform:'uppercase',
        fontSize:19
    }, 
});