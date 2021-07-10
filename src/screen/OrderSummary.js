import React from 'react'
import {

    Text,
    View
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';



const OrderSummary = ({ navigation, route }) => {
    const item = route.params;
    //console.log(item)
    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <Header headerText={'Order Summary'} onPress={() => navigation.goBack()} />
            <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 25 }}>
                {item.status === "Active" ?
                    <View style={{ backgroundColor: '#449E58', padding: 35, borderRadius: 100 }}>
                        <Icon name="check" size={50} color="#fff" />
                    </View>
                    : item.status == "Pending" ?
                        <View style={{ backgroundColor: '#F4C345', padding: 35, borderRadius: 100 }}>
                            <MaterialIcon name="pending" size={50} color="#fff" />
                        </View>
                        :
                        <View style={{ backgroundColor: '#ED3836', padding: 35, borderRadius: 100 }}>
                            <MaterialIcon name="close" size={50} color="#fff" />
                        </View>}
            </View>
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Payment of ₹{item.paidamount} {item.status == 'Active' ? 'successfull' : item.status == 'Pending' ? item.status : item.status}!</Text>
            <View style={{ flexDirection: 'row', marginVertical: hp('3'), justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, color: '#94989B' }}>{item.transactionid}</Text>
                <View style={{
                    height: '100%',
                    width: 1,
                    backgroundColor: '#94989B',
                    marginHorizontal: wp('2')
                }} />
                <Text style={{ fontSize: 16, color: '#94989B' }}>{item.date}</Text>
            </View>
            <View style={{ borderBottomColor: '#94989B', borderBottomWidth: 0.5 }} />
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: hp('4'),
                marginHorizontal: 20,
                justifyContent: 'space-between'
            }}>
                <Text style={{ fontSize: 16 }}>1. {item.passname}</Text>
                <Text style={{ color: '#94989B', fontSize: 16 }}>₹ {item.amount}</Text>
            </View>
            <View style={{ borderBottomColor: '#94989B', borderBottomWidth: 0.5 }} />
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                marginTop: hp('5')
            }}>
                <Text style={{ color: '#94989B', fontSize: 16 }}>Discount</Text>
                <Text style={{ fontSize: 16, color: '#94989B' }}>-₹ {(item.amount - item.paidamount)}</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                marginTop: hp('2')
            }}>
                <Text style={{ color: '#94989B', fontSize: 16 }}>Total</Text>
                <Text style={{ fontSize: 16, color: '#94989B' }}>₹ {item.paidamount}</Text>
            </View>
            <View style={{ borderBottomColor: '#94989B', borderBottomWidth: 0.5, marginTop: hp('2') }} />
            <View style={{
                flexDirection: 'row',
                marginVertical: hp('5'),
                marginHorizontal: 20,
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>You Paid</Text>
                <Text style={{ fontSize: 18 }}>₹ {item.paidamount}</Text>
            </View>
        </View>
    )
}
export default OrderSummary;