import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Image, Platform, StatusBar,StyleSheet, BackHandler } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../components/Loader';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import AppHeader from '../components/AppHeader';

const RecentTransactions = ({ navigation }) => {

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

                <AppHeader Header={'RECENT TRANSACTIONS'} onPress={() => navigation.goBack()} />

                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:15,fontFamily:'SofiaProRegular'}}>You haven't made any transactions yet</Text>
                </View>
            </View>}
        </>
    )
}
export default RecentTransactions;

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
    textHead: { fontSize: 18, textAlign: 'center',color:'#fff', textTransform:'uppercase',fontFamily:'GilroyMedium' },    
});