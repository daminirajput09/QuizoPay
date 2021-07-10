import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StatusBar, Modal, StyleSheet, Alert, Pressable, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../components/Header'
import Loader from '../components/Loader'
import { MyContext } from '../components/UseContext';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntIcon from 'react-native-vector-icons/AntDesign'
import axiosClient from '../api/axios-client';


const Coupon = ({ navigation, route }) => {

    const { selectedPass, setAppliedCoupon, setModalVisible, setErrorMessage } = route.params
    const { userId } = useContext(MyContext)
    const [loading, setLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [coupon, setCoupon] = useState('')
    const regex = /(<([^>]+)>)/ig;

    useEffect(() => {
        getCoupons();
    }, [])

    const getCoupons = () => {
        if (userId && selectedPass.id) {
            const fd = new FormData();
            fd.append('userid', userId);
            fd.append('passid', selectedPass.id)
            axiosClient().post('coupons/get', fd)
                .then((res) => {
                    if (res.data.Error == 0) {
                        setCoupons(res.data.data)
                    }
                    else {
                        setCoupons([])
                    }
                    //console.log(res)
                }).catch((err) => {
                    //console.log(err)
                })
        }
    }

    const applyCoupon = (couponCode) => {
        if (userId && selectedPass.id && couponCode) {
            const fd = new FormData();
            fd.append('userid', userId);
            fd.append('passid', selectedPass.id)
            fd.append('couponcode', couponCode)
            axiosClient().post('coupons/applyCoupon', fd)
                .then((res) => {
                    if (res.data.Error == 0) {
                        setAppliedCoupon(res.data.data)
                        navigation.goBack()
                        setModalVisible(true)
                    }
                    else {
                        setErrorMessage(res.data.message)
                        navigation.goBack()
                        setModalVisible(true)
                    }
                    //console.log(res)
                }).catch((err) => {
                    //console.log(err)
                })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f4fbfe' }}>
            <Header headerText={'Apply Coupon'} onPress={() => navigation.goBack()} />
            <StatusBar backgroundColor={'#f4fbfe'} barStyle={'dark-content'} />
            {loading ? <Loader isLoading={loading} /> :
                <>
                    <View style={{
                        marginHorizontal: 20,
                        marginTop: hp('5'),
                        height: 50,
                        borderWidth: 0.5,
                        borderColor: '#B0B0B0',
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center'

                    }}>
                        <TextInput
                            style={{
                                marginLeft: 10,
                                width: wp('70')
                            }}
                            placeholder='Enter Coupon Code Here...'
                            value={coupon}
                            onChangeText={(text) => setCoupon(text)}
                        />
                        <TouchableOpacity onPress={() => applyCoupon(coupon)} disabled={!coupon}>
                            <Text style={{ color: '#55AA89', fontWeight: 'bold', textTransform: 'uppercase' }}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        borderBottomColor: '#D8D8D8',
                        borderBottomWidth: 5,
                        marginTop: hp('3')
                    }}></View>
                    { coupons.length > 0 ?

                        <View style={{
                            marginHorizontal: 20,
                            marginTop: hp('1')
                        }}>
                            <Text style={{ marginVertical: hp('1'), color: '#949494', fontWeight: 'bold' }}>Best Coupons For You</Text>

                            <FlatList
                                data={coupons}
                                style={{ marginTop: 20, }}
                                renderItem={({ item, index }) => (
                                    <View key={index}>
                                        <View style={{
                                            marginHorizontal: 20,
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                        }}>
                                            <View style={{ width: wp('62') }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold' }}>{item.coupon_title}</Text>
                                                    <Text style={{
                                                        fontWeight: 'bold',
                                                        marginLeft: 10,
                                                        height: 25,
                                                        backgroundColor: '#E7D5AD',
                                                        paddingHorizontal: 10,
                                                        borderRadius: 10,
                                                        borderColor: '#ECA942',
                                                        borderWidth: 1,
                                                        borderStyle: 'dashed',
                                                        textAlign: 'center',
                                                        padding: 2
                                                    }}>{item.coupon_code}</Text>
                                                </View>
                                                <Text
                                                    style={{
                                                        marginTop: 10,
                                                        color: '#A5A5A5',
                                                        marginLeft: 10
                                                    }}>{item.description.replace(regex, '')}</Text>
                                            </View>

                                            <TouchableOpacity onPress={() => applyCoupon(item.coupon_code)}>
                                                <Text style={{ color: '#55AA89', fontWeight: 'bold', textTransform: 'uppercase' }}>Apply</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginVertical: hp('2'), borderBottomColor: '#D8D8D8', borderBottomWidth: 0.5 }}></View>

                                    </View>
                                )}
                            />
                        </View>
                        :
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('5') }}>
                            <Text style={{ fontWeight: 'bold', color: '#949494' }}>Coupons Not Found!</Text>
                            <Image source={require('../../assets/iconn.png')} />
                        </View>
                    }
                </>
            }

        </View>

    )
}



export default Coupon;