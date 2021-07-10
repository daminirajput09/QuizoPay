import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axiosClient from '../api/axios-client';
import Header from '../components/Header';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyContext } from '../components/UseContext';

const MyVideoLectures = ({ navigation, route }) => {
    const { user } = useContext(MyContext);
    const [subscribedData, setSubscribedData] = useState([]);
    const [lectDates, setLectDates] = useState([]);
    const [allVideos, setAllVideos] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState();
    const [selectedDate, setSelectedDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('')
    const [hash, setHash] = useState('')

    useEffect(() => {
        subscribedCourses();
    }, [user]);


    const subscribedCourses = () => {
        if (user && user.id) {
            const formData = new FormData();
            formData.append('userid', user.id);
            axiosClient()
                .post('videoclasses/getSubscribedCourses', formData)
                .then((res) => {
                    //console.log(res, "courses")
                    if (res.data.Error == 0) {
                        setSubscribedData(res.data.data);
                        const { courseid, hash } = res.data.data[0];
                        getVideosDate(courseid);
                        setSelectedCourse(courseid);
                        setHash(hash)
                        setIsLoading(false);
                    }
                    else {
                        setIsLoading(false)
                        setMessage(res.data.message)
                    }
                })
                .catch((err) => {
                    setIsLoading(false);
                    //console.log(err);
                });
        }
    };

    const getVideosDate = (courseid) => {
        const formData = new FormData();
        formData.append('userid', user.id);
        formData.append('courseid', courseid);
        axiosClient()
            .post('videoclasses/getLectDates', formData)
            .then((res) => {
                if (res.data.Error == 0) {
                    setLectDates(res.data.data);
                    const { date } = res.data.data[0];
                    getAllVideos(courseid, date);
                    setSelectedDate(date);
                } else {
                    setLectDates([]);
                    setAllVideos([]);
                }
            })
            .catch((err) => {
                //console.log(err);
            });
    };

    const getAllVideos = (courseid, date) => {
        const formData = new FormData();
        formData.append('userid', user.id);
        formData.append('courseid', courseid);
        formData.append('lectdate', date);
        axiosClient()
            .post('videoclasses/getAllVideos', formData)
            .then((res) => {
                if (res.data.Error == 0) {
                    setAllVideos(res.data.data);
                }
            })
            .catch((err) => {
                //console.log(err);
            });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f4fbfe' }}>
            <Header
                headerText={'My Video Lectures'}
                onPress={() => navigation.goBack()}
            />
            {isLoading ? (
                <Loader isLoading={isLoading} />
            ) : message ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{message}</Text>
            </View>)
                    : (
                        <>
                            <View style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: 15 }}>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}>
                                    {subscribedData.map((item, i) => (
                                        <>
                                            <TouchableOpacity
                                                key={i}
                                                style={{
                                                    height: hp('4.5'),
                                                    backgroundColor:
                                                        selectedCourse == item.courseid ? '#F58634' : '#000',
                                                    minWidth: wp('35'),
                                                    borderRadius: 5,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                                onPress={() => {
                                                    getVideosDate(item.courseid);
                                                    setSelectedCourse(item.courseid);
                                                    setHash(item.hash)
                                                }}>
                                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                                    {item.coursescategory}
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={{ marginLeft: 10 }}></View>
                                        </>
                                    ))}
                                </ScrollView>

                                {subscribedData.length > 2 && <TouchableOpacity>
                                    <Image source={require('../../assets/greater.png')} resizeMode='center' />
                                </TouchableOpacity>}
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: hp('1'), marginHorizontal: 20 }}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {lectDates.map((item, i) => (
                                        <TouchableOpacity key={i} onPress={() => { getAllVideos(item.courseid, item.date); setSelectedDate(item.date) }}
                                            style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 14, color: selectedDate == item.date ? '#F58634' : '#000', fontWeight: '300' }}>
                                                {item.datelabel}
                                            </Text>
                                            {i + 1 < lectDates.length && <Text style={{ fontSize: 14, color: '#D2D3D5', marginHorizontal: 10 }}>
                                                |
                            </Text>}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                {lectDates.length > 3 && <TouchableOpacity>
                                    <Image source={require('../../assets/greater.png')} resizeMode='center' />
                                </TouchableOpacity>}
                            </View>
                            <View style={{ borderBottomWidth: 0.8, borderBottomColor: '#727376' }}>
                            </View>
                            {
                                lectDates.length == 0 && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 25 }}>No Records Found.</Text>
                                </View>
                            }
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={allVideos}
                                renderItem={({ item, i }) => {
                                    return (
                                        <>
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => navigation.navigate('Lecture', { item, userid: user.id, hash })}
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    marginHorizontal: 15,
                                                }}>
                                                <Image
                                                    source={{ uri: item.thumbnail }}
                                                    resizeMode="contain"
                                                    style={{
                                                        height: hp('15'),
                                                        width: wp('35'),
                                                    }}
                                                />
                                                <View style={{ marginLeft: 15, width: wp('35') }}>
                                                    <Text style={{ color: '#0271B8', fontSize: 14 }}>
                                                        {item.subjectname}
                                                    </Text>
                                                    {/* <Text style={{ color: '#0271B8', fontSize: 14 }}>Physics</Text> */}
                                                    <Text style={{ fontSize: 14 }}>{item.topic}</Text>
                                                    {/* <Text style={{ fontSize: 14 }}>Electroagnetic induction.</Text> */}
                                                </View>
                                                <Image
                                                    source={require('../../assets/play.png')}
                                                    resizeMode="center"
                                                />
                                            </TouchableOpacity>
                                            <View
                                                style={{
                                                    borderBottomWidth: 0.8,
                                                    borderBottomColor: '#D2D3D5',
                                                }}></View>
                                        </>
                                    );

                                }}
                                keyExtractor={(item, index) => index.toString()}
                            ></FlatList>
                        </>)
            }

        </View >

    )
}
export default MyVideoLectures
