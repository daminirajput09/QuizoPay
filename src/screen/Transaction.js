import React, { useEffect, useState, useContext } from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axiosClient from '../api/axios-client';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { MyContext } from '../components/UseContext';

const Transaction = ({ navigation }) => {
    const { userId } = useContext(MyContext);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getTransactions()
    }, [userId]);

    const getTransactions = () => {
        if (userId) {
            const formData = new FormData();
            formData.append('userid', userId);
            axiosClient().post('transactions/get', formData)
                .then((res) => {
                    //console.log(res)
                    if (res.data.Error == 0) {
                        setTransactions(res.data.data);
                        setIsLoading(false);
                    }
                }).catch((err) => {
                    //console.log(err);
                })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <Header headerText={'Transactions'} onPress={() => navigation.goBack()} />
            {isLoading ? <Loader isLoading={isLoading} /> :
                <FlatList
                    data={transactions}
                    renderItem={({ item }) => (
                        <View>
                            <TouchableOpacity style={{ marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between' }}
                                onPress={() => navigation.navigate('OrderSummary', item)}>
                                <View>
                                    <Text style={{ fontSize: 16, marginTop: hp('3') }}>{item.passname}</Text>
                                    {item.transactionid && <Text style={{ fontSize: 16, color: '#94989B', marginTop: hp('1') }}>{item.transactionid}</Text>}
                                    <View style={{ flexDirection: 'row', marginVertical: hp('2') }}>
                                        <Text style={{ fontSize: 16, color: item.status == "Pending" ? '#D84C66' : 'green' }}>{item.status}</Text>
                                        <View style={{
                                            height: '100%',
                                            width: 1,
                                            backgroundColor: '#94989B',
                                            marginHorizontal: wp('3')
                                        }} />
                                        <Text style={{ fontSize: 16, color: '#94989B' }}>{item.date}</Text>
                                    </View>
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <Image source={require('../../assets/right-arrow.png')} resizeMode='center' />
                                </View>
                            </TouchableOpacity>
                            <View style={{ borderBottomColor: '#D2D2D2', borderBottomWidth: 0.5 }} />
                        </View>
                    )} />}
        </View>
    )
}
export default Transaction;