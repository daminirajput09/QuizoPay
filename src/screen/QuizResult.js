import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, BackHandler, Platform } from 'react-native'
import axiosClient from '../api/axios-client';
import Header from '../components/Header'
import { MyContext } from '../components/UseContext';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Pass from '../components/Pass'
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';


const QuizResult = ({ navigation, route }) => {
    const { quizKey, key } = route.params;
    const { userId } = useContext(MyContext)
    const [analysedData, setAnalysedData] = useState({})
    const [quizList, setQuizList] = useState([]);

    useEffect(() => {
        if (key == undefined) {

        }
        else {
            const handle = BackHandler.addEventListener('hardwareBackPress', navigateBack)

            return () => handle.remove()
        }
    }, [])

    useEffect(() => {
        getAnalysis();
        getQuizList();
    }, [quizKey]);

    const getAnalysis = () => {
        const fd = new FormData();
        fd.append('userid', userId);
        fd.append('quiz_key', quizKey);
        axiosClient().post('quizzes/analysis', fd)
            .then((res) => {
                if (res.data.Error == 0) {
                    setAnalysedData(res.data.data)
                }
                //console.log(res)
            }).catch((err) => {
                //console.log(err)
            })
    }

    const getQuizList = () => {
        if (userId) {
            const formdata = new FormData();
            formdata.append('userid', userId);
            formdata.append('start', 0);
            formdata.append('limit', 3);
            formdata.append('courseid', 'All');
            formdata.append('subjectid', 'All');
            axiosClient()
                .post('quizzes/get', formdata)
                .then((res) => {
                    //console.log('quiz response', res);
                    if (res.data.Error === 0) {
                        setQuizList(res.data.data);
                    } else {
                        setQuizList([]);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    //console.log('quiz error', err);
                });
        }
    };

    const redirection = (item) => {
        if (item.quizresultid == null) {
            navigation.navigate('QuizStart', {
                userid: userId,
                quizKey: item.key,
            })
        }
        else {
            navigation.navigate('QuizResult', { quizKey: item.key })
        }
    }

    const navigateBack = () => {
        if (key == undefined) {
            // navigation.goBack();
            navigation.navigate('QuizSection')
        } else {
            navigation.navigate(key, { reload: true })
        }
        return true
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <StatusBar backgroundColor='#4888F4' barStyle='light-content' />
            <ScrollView>
                <View style={{
                    backgroundColor: '#4888F4',
                    height: hp('58')
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginLeft: 20, width: '18%' }} onPress={()=> { navigateBack(); return true; }}>
                            <Icon name='arrow-left' size={20} color='#fff' />
                        </TouchableOpacity>
                        <Text style={{
                            color: '#fff',
                            textAlign: 'center',
                            marginTop: 10,
                            fontWeight: 'bold'
                        }}>Thank You For Taking Live Quiz</Text>
                    </View>
                    <View style={{
                        marginTop: 20,
                        backgroundColor: '#fff',
                        height: hp('15'),
                        width: wp('90'),
                        alignSelf: 'center',
                        borderRadius: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <View style={{ padding: 20 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, }}>Rank</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 17, paddingVertical: 5 }}>{analysedData && analysedData.rank && analysedData.rank[0] && analysedData.rank[0].rank}<Text style={{ fontSize: 15, fontWeight: 'normal' }}>/{analysedData && analysedData.avgmarks && analysedData.avgmarks[0] && analysedData.avgmarks[0].total_students}</Text></Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 4 }}>
                                <Image source={require('../../assets/participants.png')} style={{ height: 20, width: 20 }} />
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{analysedData && analysedData.avgmarks && analysedData.avgmarks[0] && analysedData.avgmarks[0].total_students} Participants</Text>
                            </View>
                        </View>
                        <View style={{ right: 20 }}>
                            <Image source={require('../../assets/gold-madal.png')} style={{ height: 70, width: 70 }} />
                        </View>
                    </View>
                    <View style={{
                        marginTop: 10,
                        backgroundColor: '#fff',
                        height: hp('22'),
                        width: wp('90'),
                        alignSelf: 'center',
                        borderRadius: 10,
                        justifyContent: 'space-around'
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text>Wrong</Text>
                            <Text>Correct</Text>
                            <Text>Skipped</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text>{analysedData.incorrect}</Text>
                            <Text>{analysedData.correct}</Text>
                            <Text>{analysedData.unattemeted}</Text>
                        </View>
                        <View style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: '#E2DEDE',
                            marginHorizontal: 20
                        }}></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', bottom: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={require('../../assets/12.png')} style={{ height: 18, width: 18 }} />
                                <Text style={{ marginLeft: 4 }}>Attempts:<Text style={{ fontWeight: 'bold' }}> {analysedData.attemeted}</Text></Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={require('../../assets/marks.png')} style={{ height: 18, width: 18 }} />
                                <Text style={{ marginLeft: 4 }}>Marks:<Text style={{ fontWeight: 'bold' }}> {analysedData.obtain_marks}</Text>/{analysedData.max_marks}</Text>
                            </View>
                        </View>
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text>Accuracy: 0%</Text>
                            <Text>Speed: 0Q/Min</Text>
                        </View> */}
                    </View>
                    <TouchableOpacity style={{
                        height: hp('5'),
                        width: wp('40'),
                        backgroundColor: '#fff',
                        alignSelf: 'center',
                        borderRadius: 4,
                        marginTop: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} onPress={() => navigation.navigate('QuizSolution', { quizKey, userid: userId })}>
                        <Text style={{ fontWeight: 'bold' }}>SOLUTION</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginHorizontal: 20, flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', top: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>PASSES</Text>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => navigation.navigate('Passes')}>
                        <Text style={{ color: '#44ACD6' }}>View All</Text>
                        <Icon name={'arrow-right'} size={15} color='#44ACD6' />
                    </TouchableOpacity>
                </View>

                <Pass navigation={navigation} />

                <View style={{ marginHorizontal: 20, flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>QUIZZES</Text>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => navigation.navigate('QuizSection')}>
                        <Text style={{ color: '#44ACD6' }}>View All</Text>
                        <Icon name={'arrow-right'} size={15} color='#44ACD6' />
                    </TouchableOpacity>
                </View>

                <View style={{ paddingBottom: 10 }}>
                    {quizList.map((item, index) => (
                        <View key={index}>
                            <TouchableOpacity
                                style={styles.listMainView}
                                onPress={() => redirection(item)}>
                                <Text style={styles.ListHeadText}>{item.name}</Text>
                                <View style={{ width: '100%', flexDirection: 'row' }}>
                                    <View style={{ width: '60%', justifyContent: 'center' }}>
                                        <Text style={styles.ListText}>{item.quizdate}</Text>
                                        <Text style={styles.ListText}>{item.totalquestions + 'Qs.' + item.duration + 'mins'}</Text>
                                    </View>
                                    <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Text
                                            style={{
                                                color: 'green',
                                                fontSize: 13,
                                            }}>{item.quizresultid == null ? 'Start Now' : 'View Result'}</Text>
                                        <Icon name={'arrow-right'} size={17} color={'green'} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </View>
    )
}
export default QuizResult

const styles = StyleSheet.create({
    listMainView: {
        backgroundColor: '#fff',
        marginTop: 15,
        padding: 10,
        width: '95%',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        elevation: 10,
        borderColor: '#D5D5D5',
    },
    ListHeadText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#000',
    },
    ListText: {
        fontSize: 12,
        marginTop: 5,
        color: '#000',
        width: '60%'
    },
})