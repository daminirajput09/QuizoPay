import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    StatusBar,
    Platform
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicon from 'react-native-vector-icons/Ionicons';
import axiosClient from '../api/axios-client';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../components/Loader';
import Button from '../components/Button';
// import PaymentMethod from '../components/PaymentMethod';
import { MyContext } from '../components/UseContext';

const PayYourFee = ({ navigation, route }) => {

    const isFocused = useIsFocused();
    const { userId } = useContext(MyContext);
    const [selectedOption, showSelectedOption] = useState('Fee Distribution');
    const { hash, key } = route.params;
    const [courseDetail, setCourseDetail] = useState(null);
    const [fee, setFee] = useState();
    const [amount, setAmount] = useState();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCourseDetail();
    }, [userId]);

    const getCourseDetail = async () => {
        if (hash && userId) {
            const formData = new FormData();
            formData.append('userid', userId);
            formData.append('hash', hash);
            axiosClient()
                .post('courses/coursedetails', formData)
                .then(async (res) => {
                    //console.log(res, 'res')
                    if (res.data.Error == 0 && res.data.message == '') {
                        setCourseDetail(res.data.data);
                        const { _isremainingFee, coursefee, partialfee } = res.data.data
                        if (_isremainingFee !== null) {
                            setAmount(_isremainingFee.remainingAmount)
                        } else { setAmount(coursefee || partialfee) }
                        setIsLoading(false);
                    } else {
                        setCourseDetail(null);
                        setIsLoading(false);
                    }
                })
                .catch((err) => {
                    //console.log(err);
                });
        }
    };

    const detail = ['Fee Distribution', 'About Course', 'Courses Content'];

    const goBack = () => {
        if (key === 'Home') {
            navigation.navigate(key)
        } else if (key === 'MyVideoLectures') {
            navigation.navigate(key)
        } else {
            navigation.goBack();
        }
    }

    return (
        <>
            {isLoading ? <Loader isLoading={isLoading} /> :
                <View style={{ flex: 1, backgroundColor: '#F3FAFE' }}>
                    {isFocused ? <StatusBar backgroundColor={'#E87536'} barStyle={'dark-content'} /> : null}
                    {courseDetail !== null ? (
                        <ScrollView
                            keyboardShouldPersistTaps="never"
                            showsVerticalScrollIndicator={false}>
                            <View
                                style={{
                                    height: 400, //hp('51.5'),
                                    backgroundColor: '#E87536',
                                }}>
                                <TouchableOpacity

                                    style={{ paddingLeft: 10, marginTop: Platform.OS === 'ios' ? 30 : 1 }}

                                    onPress={goBack}>
                                    <Image
                                        source={require('../../assets/leftArrow.png')}
                                        resizeMode="center"
                                    />
                                </TouchableOpacity>

                                <Image
                                    source={{ uri: courseDetail.thumbnail }}
                                    resizeMode="contain"
                                    style={{
                                        alignSelf: 'center',
                                        height: 200, //hp('40'),
                                        width: 350, //wp('90'),
                                    }}
                                />
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: '#fff',
                                        fontSize: 23,
                                        fontWeight: '700',
                                    }}>
                                    {courseDetail.coursename}
                                </Text>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: '#fff',
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                    }}>
                                    {courseDetail.coursetitle}
                                </Text>
                                <View
                                    style={{
                                        alignSelf: 'center',
                                        marginTop: 15,
                                        backgroundColor: '#C9E1A6',
                                        width: 240, //wp('60'),
                                        alignItems: 'center',
                                        paddingVertical: 3,
                                    }}>
                                    <Text
                                        style={{ textAlign: 'center', fontSize: 13, fontWeight: '400' }}>
                                        1st Installment Fee: ₹{courseDetail.coursefee}
                                    </Text>
                                </View>
                                {courseDetail.partialfee !== '' && (
                                    <View
                                        style={{
                                            marginTop: Platform.OS === 'ios' ? 5 : 10,
                                            alignSelf: 'center',
                                            backgroundColor: '#C9E1A6',
                                            width: 240, //wp('60'),
                                            paddingVertical: 3,
                                            alignItems: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 13,
                                                fontWeight: '400',
                                            }}>
                                            Start with Partial Fee: ₹{courseDetail.partialfee}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {courseDetail._isremainingFee !== null ?
                                <>
                                    <View style={{ width: '95%', alignSelf: 'center', marginTop: 10 }}>
                                        <View style={styles.container}>
                                            <Text
                                                style={{ fontSize: 18, fontWeight: 'bold', paddingLeft: 10 }}>
                                                Your 1st Installment Fee
                </Text>
                                        </View>
                                        <View style={{
                                            marginTop: 10,
                                            paddingLeft: 20,

                                        }}>
                                            <Text style={styles.radioText}>
                                                ₹{courseDetail._isremainingFee.passAmount}.00 /-
                </Text>
                                        </View>
                                    </View>
                                    <View style={{ width: '95%', alignSelf: 'center', marginTop: 10 }}>
                                        <View style={styles.container}>
                                            <Text
                                                style={{ fontSize: 18, fontWeight: 'bold', paddingLeft: 10 }}>
                                                Deposited Fee
                </Text>
                                        </View>
                                        <View style={{
                                            marginTop: 10,
                                            paddingLeft: 20,

                                        }}>
                                            <Text style={styles.radioText}>
                                                ₹{courseDetail._isremainingFee.depositAmount} /-
                </Text>
                                        </View>
                                    </View>
                                    <View style={{ width: '95%', alignSelf: 'center', marginTop: 10 }}>
                                        <View style={styles.container}>
                                            <Text
                                                style={{ fontSize: 18, fontWeight: 'bold', paddingLeft: 10 }}>
                                                Remaining FEE
                </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                //   marginLeft: wp('12'),
                                                marginTop: 10, //hp('2'),
                                                //   alignItems: 'center',
                                                //   borderWidth:1,
                                                paddingLeft: 20,
                                                alignItems: 'center',
                                            }} onPress={() => {
                                                setFee('Remaining Fee');
                                                setAmount(courseDetail._isremainingFee.remainingAmount);
                                            }}>

                                            <View
                                                style={{
                                                    ...styles.radioCircle,
                                                    borderColor: fee === 'Remaining Fee' ? '#F58634' : '#BDBFC1',
                                                }}>
                                                {amount === courseDetail._isremainingFee.remainingAmount && <View style={styles.selectedRb} />}
                                            </View>
                                            <Text style={styles.radioText}>
                                                ₹{courseDetail._isremainingFee.remainingAmount}.00 /-
                </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                                : courseDetail.iscoursesubscribed === 'Yes' ?
                                    null
                                    :
                                    <>
                                        {courseDetail.partialfee !== null && courseDetail.partialfee !== '' && (
                                            <View style={{ width: '95%', alignSelf: 'center', marginTop: 10 }}>
                                                <View style={styles.container}>
                                                    <Text
                                                        style={{ fontSize: 18, fontWeight: 'bold', paddingLeft: 10 }}>
                                                        Pay Partial FEE
                </Text>
                                                </View>
                                                <TouchableOpacity
                                                    style={{
                                                        flexDirection: 'row',
                                                        //   marginLeft: wp('12'),
                                                        marginTop: 10, //hp('2'),
                                                        //   alignItems: 'center',
                                                        //   borderWidth:1,
                                                        paddingLeft: 20,
                                                        alignItems: 'center',
                                                    }} onPress={() => {
                                                        setFee('Partial Fee');
                                                        setAmount(courseDetail.partialfee);
                                                    }}>

                                                    <View
                                                        style={{
                                                            ...styles.radioCircle,
                                                            borderColor: fee === 'Partial Fee' ? '#F58634' : '#BDBFC1',
                                                        }}>
                                                        {amount === courseDetail.partialfee && <View style={styles.selectedRb} />}
                                                    </View>
                                                    <Text style={styles.radioText}>
                                                        ₹{courseDetail.partialfee}/-
                        </Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                        <View
                                            style={{
                                                marginVertical: 10,
                                                borderBottomColor: '#E7E8E9',
                                                borderBottomWidth: 1,
                                                marginHorizontal: 20,
                                            }}></View>
                                        <View style={{ width: '95%', alignSelf: 'center' }}>
                                            <View style={styles.container}>
                                                <Text style={{ fontSize: 18, fontWeight: 'bold', paddingLeft: 10 }}>
                                                    Pay Full FEE
                      </Text>
                                            </View>
                                            <TouchableOpacity
                                                style={{
                                                    // flexDirection: 'row',
                                                    // marginLeft: wp('12'),
                                                    // marginTop: hp('2'),
                                                    // alignItems: 'center',
                                                    flexDirection: 'row',
                                                    marginTop: 10, //hp('2'),
                                                    paddingLeft: 20,
                                                    alignItems: 'center',
                                                }} onPress={() => {
                                                    setFee('Full Fee');
                                                    setAmount(courseDetail.coursefee);
                                                }}>

                                                <View
                                                    style={{
                                                        ...styles.radioCircle,
                                                        borderColor: fee === 'Full Fee' ? '#F58634' : '#BDBFC1',
                                                    }}>
                                                    {amount === courseDetail.coursefee && <View style={styles.selectedRb} />}
                                                </View>
                                                <Text style={styles.radioText}>₹{courseDetail.coursefee}/-</Text>
                                            </TouchableOpacity>
                                            {courseDetail.classType == 'Online' && (
                                                <View>
                                                    <Text
                                                        style={{
                                                            color: '#ED3237',
                                                            fontSize: 16,
                                                            textDecorationLine: 'line-through',
                                                            textDecorationStyle: 'solid',
                                                            marginLeft: wp('21'),
                                                            marginTop: hp('1'),
                                                        }}>
                                                        ₹51000.00/-
                        </Text>
                                                    <View style={{ marginTop: hp('1'), paddingLeft: 10 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Note :</Text>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text>{'\u2022' + ' '}</Text>
                                                            <Text style={{}}>
                                                                If complete Fee is deposited in one installment at
                                                                admission time, 6000/- additional off will be given.
                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    </>}

                            {courseDetail.iscoursesubscribed == 'No' || courseDetail._isremainingFee !== null
                                &&
                                <View style={{ marginHorizontal: 20, marginTop: hp('4') }}>
                                    <Button backgroundColor={'#f58020'}
                                        Label={'PAY NOW'}
                                        onPress={() => PaymentMethod(amount, courseDetail.coursename, courseDetail.id, 'pass')}
                                        borderRadius={10}
                                        disabled={!amount} />
                                    <Ionicon name="md-arrow-forward" size={25} color="#fff" style={{ position: 'absolute', top: Platform.OS === 'ios' ? 16 : 17, right: '25%' }} />

                                </View>}

                            <ScrollView
                                style={{ marginTop: hp('4'), marginHorizontal: 20 }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}>
                                {detail.map((item, i) => (
                                    <>
                                        <TouchableOpacity
                                            key={i}
                                            style={{ flexDirection: 'row', alignItems: 'center' }}
                                            onPress={() => showSelectedOption(item)}>
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    color: selectedOption == item ? '#F58634' : '#000',
                                                }}>
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                        {i + 1 < detail.length ? <Text
                                            style={{
                                                fontSize: 18,
                                                color: '#F58634',
                                                marginHorizontal: 10,
                                            }}> | </Text> : null}
                                    </>
                                ))}
                            </ScrollView>
                            <View
                                style={{
                                    borderBottomWidth: 0.8,
                                    borderBottomColor: '#8A8D90',
                                    marginTop: 15,
                                }}></View>
                            {
                                selectedOption == 'Fee Distribution' && (
                                    <View style={{ height: hp('100') }}>
                                        <WebView
                                            source={{ html: courseDetail.fee_distribution }}
                                            renderLoading={isLoading}
                                            startInLoadingState />
                                    </View>
                                )

                            }
                            {selectedOption == 'About Course' && (
                                <View style={{ height: hp('100') }}>
                                    <WebView
                                        source={{ html: `${courseDetail.description}` }}
                                        renderLoading={isLoading}
                                        startInLoadingState />
                                </View>
                            )}
                            {selectedOption == 'Courses Content' && (
                                <View style={{ height: hp('100') }}>
                                    <WebView
                                        source={{ html: courseDetail.course_content }}
                                        renderLoading={isLoading}
                                        startInLoadingState />
                                </View>
                            )}
                            <View style={{ paddingBottom: 30 }}></View>
                        </ScrollView>
                    ) : (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <StatusBar backgroundColor={'#F3FAFE'} barStyle={'dark-content'} />
                                <Text style={{ fontSize: 25 }}>Admission Closed.</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.goBack()}
                                    style={{
                                        marginTop: hp('1'),
                                        height: hp('5'),
                                        width: wp('30'),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#92c7c4',
                                        borderRadius: 10,
                                    }}>
                                    <Text>Go Back</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                </View>}
        </>
    );
};
export default PayYourFee;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    radioText: {
        fontSize: 16,
        color: '#000',
        paddingLeft: 10,
    },
    radioCircle: {
        height: 18,
        width: 18,
        borderRadius: 100,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRb: {
        width: 8,
        height: 8,
        borderRadius: 25,
        backgroundColor: '#F58634',
    },
    result: {
        marginTop: 20,
        color: 'white',
        fontWeight: '600',
        backgroundColor: '#F3FBFE',
    },
    column: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: 10,
        marginHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    bullet: {
        width: 10,
    },
    bulletText: {
        flex: 1,
    },
});
