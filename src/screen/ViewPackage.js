import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axiosClient from '../api/axios-client';
import { WebView } from 'react-native-webview';
import Loader from '../components/Loader';
// import PaymentMethod from '../components/PaymentMethod';


const ViewPackage = ({ navigation, route }) => {
    const { userid, package_id, image } = route.params;
    const [testPackage, setPackage] = useState({});
    const [subPackage, setSubPackage] = useState({});
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        viewTestPackage();
    }, []);

    const viewTestPackage = () => {
        setLoader(true)
        const formData = new FormData();
        formData.append('userid', userid);
        formData.append('package_id', package_id);
        axiosClient().post('testseries/viewTestSeries', formData)
            .then((res) => {
                if (res.data.Error == 0) {
                    setPackage(res.data.data.package[0])
                    setSubPackage(res.data.data.subpackages)
                    setLoader(false)
                }
            }).catch((err) => {
                console.log(err);
            })
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                flexDirection: 'row',
                height: hp('7'),
                marginTop: Platform.OS == 'ios' ? hp('4') : 0,
                alignItems: 'center',
                backgroundColor: '#F1EDEC'
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../../assets/backIcon.png')}
                        resizeMode='center' />
                </TouchableOpacity>
                <Text
                    style={{
                        color: '#259AE5',
                        fontSize: 17,
                        marginLeft: wp('23'),
                        fontWeight: '500'
                    }}>
                    View Packages
                </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{
                    marginHorizontal: 20,
                    marginTop: 20,
                    height: hp('35'),
                    backgroundColor: '#fff',
                    shadowColor: '#000000',
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowRadius: 5,
                    shadowOpacity: 1.0,
                    elevation: 10
                }}>
                    <Image source={{ uri: image }} resizeMode='stretch' style={{ height: hp('28') }} />
                    <View style={{ marginHorizontal: 15, marginVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        {testPackage.is_purchased === 'Yes' ?
                            <Text style={{ color: '#FA1D24', fontWeight: 'bold', fontSize: 17 }}>Purchased</Text>
                            : <Text style={{ color: '#FA1D24', fontWeight: 'bold', fontSize: 17 }}>Package Price :- {testPackage.price ? '₹' + testPackage.price : 'FREE'}</Text>
                        }
                        {testPackage.type === "PAID" && testPackage.is_purchased === "No" ? <TouchableOpacity style={{ backgroundColor: '#F3B717', height: hp('3.5'), width: wp('28'), justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}
                            onPress={() => PaymentMethod(testPackage.price, testPackage.name, package_id, 'test')}>
                            <Text style={{ color: '#1B1B12' }}>BUY NOW</Text>
                        </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#F3B717',
                                    height: hp('3.5'),
                                    width: wp('28'),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 5
                                }} 
                                // onPress={() => navigation.navigate('MyTestPackages', { userid, id: package_id })}
                                >
                                <Text style={{ color: '#1B1B12' }}>START NOW</Text>
                            </TouchableOpacity>}
                    </View>
                </View>
                <Text style={{ color: '#3973AB', marginLeft: 25, fontSize: 18, fontWeight: '700', marginTop: 30 }}>{testPackage.name}</Text>
                <View style={{ height: hp('15'), marginTop: 20 }}>
                    {loader ?
                        <Loader isLoading={loader} />
                        :
                        <WebView source={{ html: testPackage.description }}></WebView>
                    }
                </View>
                {subPackage.length > 0 && subPackage.map((item, i) => (
                    <>
                        <View style={{ marginTop: hp('1'), borderBottomColor: '#E3E3E3', borderBottomWidth: 2 }}></View>

                        <View style={{ backgroundColor: '#DEB74E', marginTop: hp('2'), height: hp('4'), justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#3B2C37' }}>{item.name}</Text>
                        </View>
                        <View style={{ marginTop: hp('1'), borderBottomColor: '#E3E3E3', borderBottomWidth: 2 }}></View>
                        <View style={{ height: hp('200'), marginTop: hp('2') }}>
                            {loader ?
                                <Loader isLoading={loader} />
                                :
                                <WebView source={{ html: item.description }} />
                            }
                        </View>
                    </>
                ))}

            </ScrollView>


        </View>
    )
}
export default ViewPackage;