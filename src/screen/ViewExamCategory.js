import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import axiosClient from '../api/axios-client';
import Header from '../components/Header'
import { MyContext } from '../components/UseContext';
import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/Feather';
import Pass from '../components/Pass'

const ViewExamCategory = ({ navigation, route }) => {

    const { coursescategory, examid } = route.params;
    const { userId } = useContext(MyContext)
    const [tests, setTests] = useState([])
    const [quiz, setQuiz] = useState([])
    const [loader, setLoader] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')


    useEffect(() => {
        viewExamCategory();
        getQuizCategory();
    }, []);

    const viewExamCategory = () => {
        const fd = new FormData();
        fd.append('userid', userId);
        fd.append('examcatid', examid);
        axiosClient().post('exams/viewExamsCategory', fd)
            .then((res) => {
                if (res.data.Error == 0) {
                    setTests(res.data.testseries);
                    // setQuiz(res.data.quizzes);
                }
                else {
                    setErrorMessage(res.data.message);
                    setTests([])
                    setQuiz([])
                }
                // setLoader(false)
                //console.log(res)
            }).catch((err) => {
                console.log(err)
                setLoader(false)
            })
    }

    const getQuizCategory = () => {
        const fd = new FormData();
        fd.append('userid', userId);
        fd.append('start', 0);
        fd.append('limit', 20);
        fd.append('courseid', examid);
        fd.append('subjectid', 'All');
        axiosClient().post('quizzes/getCategorywise', fd)
            .then((res) => {
                //console.log('categery quiz res', res)
                if (res.data.Error == 0) {
                    setQuiz(res.data.data);
                }
                else {
                    setErrorMessage(res.data.message);
                    setQuiz([])
                }
                setLoader(false)
            }).catch((err) => {
                console.log(err)
            })
    }

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

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <Header headerText={coursescategory} onPress={() => navigation.goBack()} />
            {loader ? <Loader isLoading={loader} /> :
                tests ?
                    <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
                        <View style={{ paddingLeft: 20, marginTop: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}> Test Series </Text>
                        </View>
                        {tests.map((item, i) => (
                            <TouchableOpacity
                                activeOpacity={1}
                                style={{
                                    width: '90%',
                                    height: 145,
                                    backgroundColor: '#fff',
                                    borderRadius: 10,
                                    marginHorizontal: 10,
                                    elevation: 5,
                                    marginTop: 15,
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    justifyContent: 'space-between'
                                }} 
                                // onPress={() => navigation.navigate('MyTestPackages', { userid: userId, id: item.id })}
                                >
                                <View style={{ marginTop: 20 }}>
                                    <Text
                                        ellipsizeMode='tail'
                                        style={{
                                            ...styles.sliderText,
                                        }}>{item.name}</Text>
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            color: 'grey',
                                            fontSize: 13,
                                            textAlign: 'center'
                                        }}>{item.coursename}</Text>
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            marginTop: 11,
                                            color: 'green',
                                            fontSize: 12,
                                            fontWeight: 'bold',
                                            textAlign: 'center'
                                        }}>{item.totaltest} Total Tests | {item.totalfreetest} Free</Text>
                                </View>
                                <View style={{
                                    backgroundColor: '#50AFE4',
                                    height: 50,
                                    width: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderBottomLeftRadius: 10,
                                    borderBottomRightRadius: 10
                                }}>
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>View Test Series</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        <View style={{ marginHorizontal: 20, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', top: 8 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}> PASSES </Text>
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }} onPress={() => navigation.navigate('Passes')}>
                                <Text style={{ color: '#44ACD6' }}>View All</Text>
                                <Icon name="arrow-right" size={15} color="#44ACD6" style={{ marginLeft: 5 }} />
                            </TouchableOpacity>
                        </View>
                        <Pass navigation={navigation} />

                        {quiz && <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}> QUIZZES </Text>
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }} onPress={() => navigation.navigate('QuizSection')}>
                                <Text style={{ color: '#44ACD6' }}>View All</Text>
                                <Icon name="arrow-right" size={15} color="#44ACD6" style={{ marginLeft: 5 }} />
                            </TouchableOpacity>
                        </View>}
                        {quiz && quiz.map((item, i) => (
                            <View key={i}>
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
                    </ScrollView>
                    :
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{errorMessage}</Text>
                    </View>
            }
        </View>
    )
}

export default ViewExamCategory;
const styles = StyleSheet.create({
    sliderText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: "center"
    },
    headerText: {
        width: '100%',
        marginTop: 10,
        fontSize: 15,

        flexDirection: 'row'
    },
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
    headerText: {
        width: '100%',
        marginTop: 10,
        fontSize: 15,
        paddingLeft: 20,
        flexDirection: 'row',
    },
})