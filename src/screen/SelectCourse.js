import React, { useEffect, useState, useContext } from 'react'
import { TouchableWithoutFeedback, Keyboard, Text, View, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosClient from '../api/axios-client';
// import Icon from 'react-native-vector-icons/Feather';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { MyContext } from '../components/UseContext';
import Icon from 'react-native-vector-icons/AntDesign'

// import React, { useEffect, useState } from 'react';
// import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
// import Header from '../components/Header'
// import Icon from 'react-native-vector-icons/AntDesign'
// import axiosClient from '../api/axios-client'
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SelectCourse = ({ navigation, route }) => {

//     const [exams, setExams] = useState([])

//     useEffect(() => {
//         getCourses();
//     }, []);

//     const getCourses = () => {
//         const fd = new FormData();
//         axiosClient().post('courses/getCourses')
//             .then((res) => {
//                 //console.log(res, "res1")
//                 if (res.data.Error == 0) {
//                     setExams(res.data.data)
//                 }
//             }).catch((err) => {
//                 //console.log(err)
//             })
//     }

//     return (
//         <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
//             <ImageBackground
//                 source={require('../../assets/exam_bg.jpg')} style={{ height: '100%', width: '100%' }}>
//                 <TouchableOpacity style={styles.container} onPress={() => navigation.goBack()}>
//                     <Icon name='arrowleft' size={20} color='#fff' style={{ marginLeft: 20 }} />
//                 </TouchableOpacity>
//                 <Text style={[styles.textStyle]}>
//                     {/* Select Courses */}
//                 </Text>
//                 <View style={{ bottom: 10 }}>
//                     <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 17 }}>Exams are you preparing for?</Text>
//                     <Text style={{ textAlign: 'center', color: '#fff' }}>You can select multiple options.</Text>
//                 </View>
//                 <ScrollView style={{ marginTop: hp('14') }}>
//                     {exams.map((item, i) => {
//                         return (
//                             <TouchableOpacity
//                                 key={i}
//                                 style={{
//                                     height: 90,
//                                     backgroundColor: '#fff',
//                                     marginVertical: 15,
//                                     flexDirection: 'row',
//                                     width: '92%',
//                                     alignSelf: 'center',
//                                     elevation: 20,
//                                     alignItems: 'center',
//                                     // justifyContent: 'space-around'
//                                 }} onPress={() => navigation.navigate('SubExams', { courseid: item.id })}>
//                                 <Image
//                                     source={{ uri: item.thumbnail }}
//                                     style={{
//                                         borderColor: '#000',
//                                         height: '100%',
//                                         width: '20%',
//                                         alignSelf: 'flex-start',
//                                         marginHorizontal: 10
//                                     }}
//                                     resizeMode='contain'
//                                 />
//                                 <View style={{ marginHorizontal: 10, width: 190 }}>
//                                     <Text style={{
//                                         ...styles.sliderText, fontSize: 15
//                                     }}>{item.coursename}</Text>
//                                     <Text style={{
//                                         marginTop: 5,
//                                         color: '#919295', fontSize: 12
//                                     }}>RRB NTPC, RRC GROUP D</Text>
//                                 </View>
//                                 <View>
//                                     <Icon name='right' size={20} />
//                                 </View>
//                             </TouchableOpacity>
//                         )
//                     })}
//                 </ScrollView>
                {/* <View style={{ marginTop: hp('10') }} >
                    <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 12 }}>By signing up, you agree to our <Text style={{ color: '#f58020' }}> Privacy Policy </Text> and <Text style={{ color: '#f58020' }}> Terms and Conditions.</Text></Text>
                    <TouchableOpacity style={{
                        backgroundColor: '#f58020',
                        height: hp('8'),
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row'
                    }}
                        disabled={!medium}
                        onPress={startLearning}>
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Start Learning</Text>
                        <Ionicon name="md-arrow-forward" size={25} color="#fff" />
                    </TouchableOpacity>
                </View> */}
    //         </ImageBackground>

    //     </View>
    // )


    const [options, showOptions] = useState()
    const [value, setValue] = useState()
    const { user, getData } = useContext(MyContext)
    const [data, setData] = useState([])
    const [medium, setMedium] = useState('')
    const [subCourses, setSubCourses] = useState([])


    useEffect(() => {
        getData();
    }, [])

    useEffect(() => {
        axiosClient().post('courses/getCourses')
            .then((res) => {
                if (res.data.Error == 0) {
                    setData(res.data.data)
                }
            }).catch((err) => {
                //console.log(err)
            })
    }, [user]);

    const selectMedium = ['Hindi', 'English'];

    const getSubCourses = (id) => {
        const fd = new FormData();
        fd.append('userid', user.id);
        fd.append('courseid', id)
        axiosClient().post('courses/getSubCourses', fd)
            .then((res) => {
                if (res.data.Error === 0) {
                    setSubCourses(res.data.data)
                }
            }).catch((err) => {
                //console.log(err)
            })
    }

    const startLearning = () => {
        const formData1 = new FormData();
        formData1.append('userid', user.id);
        formData1.append('courseid', value);
        axiosClient().post('courses/update', formData1)
            .then((res) => {
                //console.log('update api', res);
                if (res.data.Error == 0) {
                    navigation.navigate('Home')
                }
            }).catch((err) => {
                //console.log(err)
            })
        const formData = new FormData();
        formData.append('userid', user.id);
        formData.append('medium', medium);
        axiosClient().post('courses/startLearning', formData)
            .then(async (res) => {
                if (res.data.Error == 0) {
                    navigation.navigate('Home')
                }
            }).catch((err) => {
                //console.log(err)
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
                {/* <TouchableOpacity style={styles.container} onPress={() => navigation.goBack()}>
                    <Icon name='arrowleft' size={20} color='#000' style={{ marginLeft: 20 }} />
                </TouchableOpacity> */}
                {/* <Text style={[styles.textStyle]}>
                    Exams
                </Text> */}
                <View>
                    <Text style={{ textAlign: 'center', color: '#000', fontWeight: 'bold', fontSize: 17 }}>Exams are you preparing for?</Text>
                    <Text style={{ textAlign: 'center', color: '#000' }}>You can select multiple options.</Text>
                </View>
                <ScrollView style={{ marginTop: hp('2') }}>
                    {data.map((item, i) => {
                        return (
                            <TouchableOpacity
                                key={i}
                                style={{
                                    height: 90,
                                    backgroundColor: '#fff',
                                    marginTop: 10,
                                    marginBottom: 5,
                                    flexDirection: 'row',
                                    width: '92%',
                                    alignSelf: 'center',
                                    elevation: 20,
                                    alignItems: 'center',
                                    // justifyContent: 'space-around'
                                }} onPress={() => navigation.navigate('SubExams', { courseid: item.id })}>
                                <Image
                                    source={{ uri: item.thumbnail }}
                                    style={{
                                        borderColor: '#000',
                                        height: '100%',
                                        width: '20%',
                                        alignSelf: 'flex-start',
                                        marginHorizontal: 10
                                    }}
                                    resizeMode='contain'
                                />
                                <View style={{ marginHorizontal: 10, width: 190 }}>
                                    <Text style={{
                                        ...styles.sliderText, fontSize: 15
                                    }}>{item.coursename}</Text>
                                    <Text style={{
                                        marginTop: 5,
                                        color: '#919295', fontSize: 12
                                    }}>RRB NTPC, RRC GROUP D</Text>
                                </View>
                                <View>
                                    <Icon name='right' size={20} />
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
                <View style={{ marginTop:10 }} >
                         <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 12 }}>By signing up, you agree to our <Text style={{ color: '#f58020' }}> Privacy Policy </Text> and <Text style={{ color: '#f58020' }}> Terms and Conditions.</Text></Text>
                         <TouchableOpacity style={{
                             backgroundColor: '#f58020',
                             height: hp('8'),
                             borderRadius: 10,
                             alignItems: 'center',
                             justifyContent: 'center',
                             flexDirection: 'row'
                         }}
                             // disabled={!medium}
                             onPress={startLearning}>
                             <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Start Learning</Text>
                             <Ionicon name="md-arrow-forward" size={25} color="#fff" />
                         </TouchableOpacity>
                     </View>
        </View>
        // <View style={{ flex: 1, backgroundColor: '#f4fbfe' }}>
        //     <ScrollView keyboardShouldPersistTaps="always">
        //         <View style={{ marginHorizontal: 20 }}>
        //             <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: hp('5%') }}>
        //                 <Image source={require('../../assets/backIcon.png')} resizeMode='center' />
        //             </TouchableOpacity>
        //             <View style={{ marginTop: hp('5%') }}>
        //                 <Text style={{ fontSize: 22 }}>Hello, <Text style={{ fontSize: 25, fontWeight: '800' }}>{user.firstname + " " + user.lastname}</Text></Text>
        //                 <Text style={{ fontSize: 12, color: '#313131', marginTop: 3 }}>Help us find a classroom for you</Text>
        //             </View>
        //             <Text style={{ fontSize: 18, fontWeight: '800', marginTop: hp('6') }}>Select Your Course</Text>
        //             <View style={{ marginTop: hp('4') }}>
        //                 {data.map((course, i) => (
        //                     <>
        //                         <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: hp('1') }}>
        //                             <Text style={{ fontSize: 18, fontWeight: '800' }}>{course.coursename}</Text>
        //                             <TouchableOpacity style={{ justifyContent: 'center' }}
        //                                 onPress={() => {
        //                                     setValue('');
        //                                     showOptions(course.coursename);
        //                                     getSubCourses(course.id)
        //                                 }}>
        //                                 {options == course.coursename ?
        //                                     // <Image source={require('../../assets/minus.png')} resizeMode='center' />
        //                                     <Icon name="minus" size={20} color="#000" /> :
        //                                     // <Image source={require('../../assets/plus.png')} resizeMode='center' />
        //                                     <Icon name="plus" size={20} color="#000" />}
        //                             </TouchableOpacity>
        //                         </View>
        //                         {options == course.coursename &&
        //                             <View style={{ marginTop: 20 }}>
        //                                 {subCourses.map(res => {
        //                                     return (
        //                                         <TouchableOpacity key={res.id} style={styles.container} onPress={() => {
        //                                             setValue(res.id);
        //                                         }}>
        //                                             <View
        //                                                 style={{ ...styles.radioCircle, borderColor: value === res.id ? '#F58634' : '#BDBFC1' }}>
        //                                                 {value === res.id && <View style={styles.selectedRb} />}
        //                                             </View>
        //                                             <Text style={styles.radioText}>{res.coursescategory}</Text>
        //                                         </TouchableOpacity>
        //                                     )
        //                                 })}
        //                             </View>}
        //                     </>
        //                 ))}
        //             </View>

        //             <View style={{ marginTop: hp('10') }} >
        //                 <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 12 }}>By signing up, you agree to our <Text style={{ color: '#f58020' }}> Privacy Policy </Text> and <Text style={{ color: '#f58020' }}> Terms and Conditions.</Text></Text>
        //                 <TouchableOpacity style={{
        //                     backgroundColor: '#f58020',
        //                     height: hp('8'),
        //                     borderRadius: 10,
        //                     alignItems: 'center',
        //                     justifyContent: 'center',
        //                     flexDirection: 'row'
        //                 }}
        //                     // disabled={!medium}
        //                     onPress={startLearning}>
        //                     <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Start Learning</Text>
        //                     <Ionicon name="md-arrow-forward" size={25} color="#fff" />
        //                 </TouchableOpacity>
        //             </View>
        //         </View>
        //     </ScrollView>
        // </View>
    )
}
export default SelectCourse;

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: wp('20')
    },
    radioText: {
        fontSize: 16,
        color: '#000',
        paddingLeft: 20
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
    // container: {
    //     flexDirection: 'row', width: '100%',
    //     marginTop: Platform.OS == 'ios' ? 40 : 5,
    //     // alignItems: 'center'
    // },
    // textStyle: {
    //     width: '90%',
    //     marginLeft: 50,
    //     color: '#fff',
    //     bottom: 20
    // },
    // imageStyle: {
    //     width: 20,
    //     height: 20,
    //     left: 20,
    // },
    // style1: {
    //     fontWeight: 'bold'
    // },
    // sliderText: {
    //     fontSize: 14,
    //     fontWeight: 'bold',
    // },
})