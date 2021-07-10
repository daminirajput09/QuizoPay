import React, { useState, useContext } from 'react';
import { View, Text, StatusBar, Image, TouchableOpacity, ToastAndroid, Modal, StyleSheet, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../components/Header'
import Loader from '../components/Loader'
import { MyContext } from '../components/UseContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign'
import PaymentMethod from '../components/PaymentMethod'
import Passes from './Passes';
import axiosClient from '../api/axios-client';



const Checkout = ({ navigation, route }) => {

    const { selectedPass } = route.params
    const { userId } = useContext(MyContext)
    const [loading, setLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState()


    const Continue = () => {
        const fd = new FormData();
        fd.append('userid', userId);
        fd.append('passid', selectedPass.id);
        fd.append('couponid', appliedCoupon ? appliedCoupon.id : '');
        axiosClient().post('pass/initiatePayment', fd)
            .then((res) => {
                if (res.data.Error === 0) {
                    PaymentMethod(appliedCoupon ? appliedCoupon.newPrice : (selectedPass.amount - (selectedPass.amount * (selectedPass.offer / 100))).toFixed('2'),
                        selectedPass.name,
                        selectedPass.id,
                        'pass',
                        navigation)
                }
            }).catch((err) => {
                //console.log(err)
            })
    }

    const RemoveCoupon = () => {
        const fd = new FormData();
        fd.append('userid', userId);
        fd.append('passid', selectedPass.id);
        axiosClient().post('coupons/removeCoupon', fd)
            .then((res) => {
                if (res.data.Error === 0) {
                    setAppliedCoupon(null)
                    ToastAndroid.show('Coupon Removed!', ToastAndroid.SHORT)
                }
            }).catch((err) => {
                //console.log(err)
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f4fbfe' }}>
            <Header headerText={'Checkout'} onPress={() => navigation.goBack()} />
            <StatusBar backgroundColor={'#f4fbfe'} barStyle={'dark-content'} />
            {loading ? <Loader isLoading={loading} /> :
                <>
            <ScrollView contentContainerStyle={{flex:1}}>
                    <View style={{
                        alignItems: 'center',
                        marginTop: hp('5')
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 20
                            }}>
                                {selectedPass.name}
                            </Text>
                            <Image
                                source={require('../../assets/ticket.png')}
                                resizeMode='center'
                                style={{ height: 40, width: 40, marginTop: -8 }} />
                        </View>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 20
                        }}>{selectedPass.months} Months</Text>


                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                                ₹ {appliedCoupon ? appliedCoupon.newPrice : selectedPass.amount - (selectedPass.amount * (selectedPass.offer / 100)).toFixed('2')} </Text>
                            <Text style={{
                                color: '#868B85',
                                fontSize: 13,
                                alignSelf: 'flex-end',
                                textDecorationLine: 'line-through'
                            }}>₹ {selectedPass.amount}</Text>
                        </View>
                    </View>
                    <View style={{
                        borderBottomColor: '#D8D8D8',
                        borderBottomWidth: 5,
                        marginTop: hp('5')
                    }}></View>
                    <TouchableOpacity style={{
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        flexDirection: 'row',
                        height: 75
                    }}
                        disabled={appliedCoupon}
                        onPress={() => navigation.navigate('Coupon', { selectedPass, setAppliedCoupon, setModalVisible, setErrorMessage })}>
                        {/* <Icon name='tags' size={15} color='#000' /> */}
                        <Image source={require('../../assets/01.png')} style={{ height: 20, width: 20, bottom: 10, left: appliedCoupon ? 30 : 25 }} resizeMode='contain' />
                        <View style={{ paddingRight: wp('30') }}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 15,
                                textTransform: 'uppercase',
                                left: 30
                            }}>{appliedCoupon ? `'${appliedCoupon.couponcode}' Applied` : 'Apply Coupon'}</Text>
                            <Text style={{
                                color: '#55AA89'
                            }}>
                                {appliedCoupon ? 'Coupon applied successfully!' : 'Save extra, see coupons inside.'}
                            </Text>
                        </View>
                        {appliedCoupon ?
                            <TouchableOpacity onPress={RemoveCoupon}>
                                <Icon name='cancel' size={25} color='#000' style={{ paddingRight: 15 }} />
                            </TouchableOpacity>
                            :
                            <AntIcon name='right' size={18} color='#D8D8D8' style={{ right: 15 }} />
                        }
                    </TouchableOpacity>
                    <View style={{
                        borderBottomColor: '#D8D8D8',
                        borderBottomWidth: 5,
                        // marginTop: hp('5')
                    }}></View>

                    <View style={{
                        marginHorizontal: 20,
                        marginTop: hp('4')
                    }}>
                        <Text style={{ marginVertical: hp('1'), color: '#949494', fontWeight: 'bold' }}>Price Details</Text>
                        <View style={{ marginVertical: hp('1'), flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: 'bold' }}>Actual Price</Text>
                            <Text style={{ fontWeight: 'bold' }}>₹ {selectedPass.amount}</Text>
                        </View>
                        <View style={{ marginVertical: hp('1'), flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: 'bold' }}>Instant Discount</Text>
                            <Text style={{ fontWeight: 'bold', color: '#55AA89' }}>- ₹ {(selectedPass.amount * (selectedPass.offer / 100)).toFixed('2')}</Text>
                        </View>
                        <View style={{ marginVertical: hp('1'), flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: 'bold' }}>Coupon Discount</Text>
                            <Text style={{ fontWeight: 'bold', color: '#55AA89' }}>- ₹ {appliedCoupon ? appliedCoupon.couponDiscount.toFixed('2') : '0.00'} </Text>
                        </View>
                        <View style={{ marginVertical: hp('2'), borderBottomColor: '#D8D8D8', borderBottomWidth: 0.5 }}></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: 'bold' }}>To Be Paid</Text>
                            <Text style={{ fontWeight: 'bold' }}>₹ {appliedCoupon ? appliedCoupon.newPrice.toFixed('2') : (selectedPass.amount - (selectedPass.amount * (selectedPass.offer / 100))).toFixed('2')}</Text>
                        </View>
                    </View>
                    </ScrollView>
                    <TouchableOpacity style={{
                        height: 55,
                        width: wp('100'),
                        backgroundColor: '#55AA89',
                        justifyContent: 'center',
                        position:'absolute',
                        bottom:0
                        // marginTop: hp('25.3')
                    }} onPress={Continue}>

                        <Text style={{
                            color: '#fff',
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}>CONTINUE TO PAY</Text>

                    </TouchableOpacity>
                </>
            }
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{appliedCoupon ? 'Congratulations' : 'Sorry'}</Text>
                            {appliedCoupon ?
                                <>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>' {appliedCoupon && appliedCoupon.couponcode} ' Applied</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 10 }}>₹ {appliedCoupon && appliedCoupon.couponDiscount}</Text>
                                    <Text style={{ fontSize: 10 }}>Saving with this coupon</Text>
                                </> : <Text style={{ marginTop: 20, fontWeight: 'bold' }}>{errorMessage}</Text>}
                            <TouchableOpacity
                                // style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={{ ...styles.textStyle, color: appliedCoupon ? "#55AA89" : 'red', }}>CONTINUE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: hp('25')
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 55,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        marginTop: 45,
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        fontSize: 12,
        textAlign: "center"
    }
});

export default Checkout;