import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Image, Platform, StatusBar,StyleSheet, ScrollView, BackHandler } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../components/Loader';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';

const ManagePayment = ({ navigation }) => {

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
                        <Text style={styles.textHead}>{'manage payments'}</Text>
                    </View>
                </View>

                <ScrollView>
                    <View style={[{backgroundColor:'#fff',
                            flexDirection: 'row',
                            marginTop: Platform.OS === 'ios' ? hp('4') : 0,
                            alignItems: 'center',
                            paddingHorizontal: 5,}]}>
                        <TouchableOpacity
                            style={{width:'15%',alignItems:'center',justifyContent:'center'}}
                            onPress={() => navigation.goBack()}>
                            <Ionicon name='card' size={25} color='#0334A9' />
                        </TouchableOpacity>

                        <View style={{width:'75%',alignItems: 'flex-start',paddingRight:10,paddingVertical:12,justifyContent:'space-between'}}>
                            <Text style={{color:'#000',fontWeight:'bold'}}>{'Add/Remove Cards'}</Text>
                            <Text style={{fontSize:12}}>For seamless, convenient payments</Text>
                        </View>
                        <FeatherIcon name='chevron-right' size={22} color='#000' style={{alignSelf:'center'}} />
                    </View>

                    <View style={{width:'100%',height:2,backgroundColor:'#F5F5F5'}} />
                    <View style={[{backgroundColor:'#fff',
                            flexDirection: 'row',
                            marginTop: Platform.OS === 'ios' ? hp('4') : 0,
                            alignItems: 'center',
                            paddingHorizontal: 5,}]}>
                        <TouchableOpacity
                            style={{width:'15%',alignItems:'center',justifyContent:'center'}}
                            onPress={() => navigation.goBack()}>
                            <Ionicon name='card' size={25} color='#0334A9' />
                        </TouchableOpacity>

                        <View style={{width:'60%',alignItems: 'flex-start',paddingRight:10,paddingVertical:17,justifyContent:'space-between'}}>
                            <Text style={{color:'#000',fontWeight:'bold'}}>{'Paytm'}</Text>
                        </View>
                        <Text style={{color:'#000',fontWeight:'bold',fontSize:11}}>{'LINK ACCOUNT'}</Text>
                    </View>

                    <View style={{width:'100%',height:2,backgroundColor:'#F5F5F5'}} />
                    <View style={[{backgroundColor:'#fff',
                            flexDirection: 'row',
                            marginTop: Platform.OS === 'ios' ? hp('4') : 0,
                            alignItems: 'center',
                            paddingHorizontal: 5,}]}>
                        <TouchableOpacity
                            style={{width:'15%',alignItems:'center',justifyContent:'center'}}
                            onPress={() => navigation.goBack()}>
                            <Ionicon name='logo-amazon' size={25} color='#BF6D45' />
                        </TouchableOpacity>

                        <View style={{width:'60%',alignItems: 'flex-start',paddingRight:10,paddingVertical:17,justifyContent:'space-between'}}>
                            <Text style={{color:'#000',fontWeight:'bold'}}>{'AmazonPay'}</Text>
                        </View>
                        <Text style={{color:'#000',fontWeight:'bold',fontSize:11}}>{'LINK ACCOUNT'}</Text>
                    </View>

                </ScrollView>

            </View>}
        </>
    )
}
export default ManagePayment;

const styles = StyleSheet.create({

    headerView: {
        flexDirection: 'row',
        marginTop: Platform.OS === 'ios' ? hp('4') : 0,
        alignItems: 'center',
        paddingHorizontal: 5,
        // borderWidth:1,
        height: 50,
        backgroundColor:'#1A1A1A'
    },
    textHead: { fontSize: 18, textAlign: 'center',color:'#fff', textTransform:'uppercase',fontFamily:'GilroyMedium' },    
});