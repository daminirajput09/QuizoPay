import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Platform, StatusBar, StyleSheet, ScrollView,Image, Share, Linking, BackHandler } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Fontisto';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Loader from '../components/Loader';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Clipboard from '@react-native-community/clipboard';
import FontAwesomeIcon5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const EarnMoney = ({ navigation }) => {
    
    const [select, setSelect] = useState(false);
    const [loading, setLoading] = useState(false)

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

    const shareToWhatsAppFunc = (type) => {
        if(type == 'whatsapp'){
            Linking.openURL('whatsapp://send?text=' + 'ready to share.');
        } else if(type == 'messanger'){
            Linking.openURL('fb-messenger://share?link=' + 'https://play.google.com/');
        } else if(type == 'telegram'){
            Linking.openURL('tg://msg?text=' + 'ready to share.');
        }
    }

    const shareFunc = async () => {
        try {
            const result = await Share.share({
                message: 'App ready to share!' + '\n' + 'https://play.google.com/store/apps/details?id=com.allexamreview.exambook',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    //console.log('share result if', result.activityType,Share,result);
                } else {
                    //console.log('share result else', result);
                }
            } else if (result.action === Share.dismissedAction) {
                //console.log('share result else if', result);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <>
            { loading ? <Loader isLoading={loading} /> : <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={'#000'} barStyle={'light-content'} />

                <View style={styles.headerView}>
                    <TouchableOpacity
                        style={{width:'15%',alignItems:'center',justifyContent:'center'}}
                        onPress={() => navigation.goBack()}>
                        <Ionicon name='arrow-back-outline' size={20} color='#fff' />
                    </TouchableOpacity>

                    <View style={{width:'85%',alignItems: 'flex-start',paddingRight:10,justifyContent:'space-between',flexDirection:'row'}}>
                        <Text style={styles.textHead}>{'invite friends'}</Text>
                        <AntIcon name='questioncircleo' size={25} color='#fff' />
                    </View>
                </View>                
                
        <ScrollView keyboardShouldPersistTaps="always">

            <Image source={require('../../assets/dream.png')} style={{ height: 100, width: '80%',alignSelf:'center',marginVertical:25 }} />

            <View style={[{paddingBottom: 15,backgroundColor:'#fff'}]}>

                <View style={{width:'90%',padding:7,alignSelf:'center',marginTop:10,flexDirection:'row'}}>
                    <FontAwesomeIcon name="money" size={25} color="#356D0B" />
                    <View style={{width:'90%',alignSelf:'center',paddingHorizontal:5}}>
                        <Text style={{fontSize:15,fontWeight:'bold',fontFamily:'GilroyMedium'}}>
                            Double the discount, double the fun!
                        </Text>
                    </View>
                </View>

                <View style={{width:'90%',alignSelf:'center',marginTop:7}}>
                    <Text style={{fontSize:12,textAlign:'center',fontFamily:'SofiaProRegular'}}>
                        Get up to <FontAwesomeIcon name='rupee' size={12} color='#000' />200 in Cash Bonuses and gift your friend discount worth <FontAwesomeIcon name='rupee' size={12} color='#000' />200 for registering and playing with us!
                    </Text>
                </View>

                <View style={{width:'40%',alignSelf:'center',marginVertical:5,flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
                    <Ionicon name='md-information-circle-outline' size={25} color='#000' />
                    <Text style={[styles.walletModalText,{fontWeight:'bold',fontFamily:'GilroyMedium'}]}>HOW IT WORKS</Text>
                </View>
            </View>

            <View style={{width:'100%',height:15,backgroundColor:'#F6F6F6'}} />

            <View style={{width:'100%',paddingBottom: 15,backgroundColor:'#fff'}}>
                <View style={{width:'90%',height:45,marginVertical:10,paddingHorizontal:15,justifyContent:'space-between',alignItems:'center',flexDirection:'row',alignSelf:'center',borderWidth:1,borderRadius:10,borderStyle:'dotted'}}>
                    <Text style={{fontSize:13,fontWeight:'bold',fontFamily:'SofiaProRegular'}}>RAJDA1050UV</Text>    
                    <TouchableOpacity onPress={() => Clipboard.setString('RAJDA1050UV')}>
                        <FontAwesomeIcon5 name="copy" size={20} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* <TouchableOpacity style={{width:'85%',marginTop:5,alignItems:'center',flexDirection:'row',alignSelf:'center'}} onPress={()=>setSelect(!select)}>
                    {select?<MaterialIcon name='check-circle' size={25} color='#0E7DEA' />
                    :<MaterialIcon name='radio-button-unchecked' size={25} color='#21496C' />}
                    <Text style={{fontSize:13,marginLeft:5}}>हिंदी में शेयर करें</Text>    
                </TouchableOpacity> */}

                <TouchableOpacity onPress={() => navigation.navigate('Home')}
                    style={{width:'90%',alignSelf:'center',marginTop:10,backgroundColor:'#009D38',height:40,alignItems:'center',justifyContent:'center',borderRadius:5}}>
                    <Text style={{textTransform:'uppercase',fontSize:14,color:'#fff',fontWeight:'bold',fontFamily:'GilroyMedium'}}>
                        invite phone contacts
                    </Text>
                </TouchableOpacity>

                <View style={{width:'85%',marginTop:5,alignItems:'center',flexDirection:'row',alignSelf:'center',justifyContent:'center'}}>
                   <View style={{width:50,height:1,backgroundColor:'grey'}} />
                   <Text style={{margin:7,fontSize:11,fontFamily:'SofiaProRegular'}}>or share via</Text>
                   <View style={{width:50,height:1,backgroundColor:'grey'}} />
                </View>

                <View style={[{width:'60%',marginHorizontal:0,flexDirection:'row',height:55,alignItems:'center',justifyContent:'space-around',alignSelf:'center'}]}>
                    <TouchableOpacity onPress={()=> shareToWhatsAppFunc('whatsapp')}>
                        <FontAwesomeIcon name='whatsapp' size={33} color='#44B73F' />
                    </TouchableOpacity>    
                    <TouchableOpacity onPress={()=> shareToWhatsAppFunc('messanger')}>
                        <Icon name='messenger' size={30} color='#017DFF' />
                    </TouchableOpacity>    
                    <TouchableOpacity onPress={()=> shareToWhatsAppFunc('telegram')}>
                        <FontAwesomeIcon name='telegram' size={30} color='#33B9E8' />
                    </TouchableOpacity>    
                    <TouchableOpacity onPress={()=> shareFunc()}>
                        <Icon name='share' size={30} color='#666666' />
                    </TouchableOpacity>    
                </View>
                
            </View>

            <View style={[{marginHorizontal:0,marginVertical:10,flexDirection:'row',height:45,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}]}>
                <View style={{width:'20%',alignItems:'flex-end',paddingRight:15}}>
                    <MaterialIcon name='group-add' size={20} color='#000' />
                </View>
                <View style={{width:'85%'}}>
                    <Text style={{fontSize:13,fontWeight:'bold',fontFamily:'SofiaProRegular'}}>You haven't invited any friends yet!</Text>
                </View>
            </View>

            <View style={{width:'90%',alignSelf:'center',marginTop:20,marginBottom:10}}>
                <Text style={{fontSize:11,textAlign:'center',fontFamily:'SofiaProRegular'}}>  
                    Tap to view the <Text style={{fontWeight:'bold',fontFamily:'SofiaProRegular'}}>FairPlay</Text> rules for inviting friends
                </Text>
            </View>

        </ScrollView>

            </View>}
        </>
    )
}
export default EarnMoney;

const styles = StyleSheet.create({

    headerView: {
        flexDirection: 'row',
        marginTop: Platform.OS === 'ios' ? hp('4') : 0,
        alignItems: 'center',
        paddingHorizontal: 5,
        height: 50,
        backgroundColor:'#1A1A1A'
    },
    textHead: { 
        fontSize: 18, 
        textAlign: 'center',
        color:'#fff', 
        textTransform:'uppercase',
        fontFamily:'GilroyMedium'
    }, 
    outerView: {
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