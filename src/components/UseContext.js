import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import axiosClient from '../api/axios-client';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MyContext = React.createContext()

export const MyProvider = (props) => {

    const [TestDetails, setTestDetails] = useState([]);
    const [Testsections, setTestsections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState();
    const [index, setIndex] = useState(0);
    const [subjectIndex, setSubjectIndex] = useState(0);
    const [testData, setTestData] = useState([]);
    const [testQuestion, setTestQuestion] = useState([]);
    const [testSerials, setTestSerials] = useState([]);
    const [langChange, setLangChange] = useState(true);
    const [markThisQuesArr, setMarkThisQuesArr] = useState([]);
    const [optionsData, setOptionsData] = useState([]);
    const [examKey, setExamKey] = useState('')
    const [userId, setUserId] = useState()
    const [subPackageId, setSubPackageId] = useState()
    const [totalDuration, setTotalDuration] = useState(null);

    const [quesAnsDataArr, setQuesAnsDataArr] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const [RemainingTime, setRemainingTime] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const [testId, setTestId] = useState('')

    const tableData = [];

    // result variables
    const [langChangeResult, setLangChangeResult] = useState(true);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [subjectIndexResult, setSubjectIndexResult] = useState(0);
    const [examDetails, setExamDetails] = useState([]);
    const [examSections, setExamSections] = useState([]);

    const [drawerIndex, setDrawerIndex] = useState(0);

    const [testData1, setTestData1] = useState(['Section']);
    const [testData2, setTestData2] = useState(['Answered']);
    const [testData3, setTestData3] = useState(['Not Answered']);
    const [testData4, setTestData4] = useState(['Marked']);
    const [testData5, setTestData5] = useState(['Not Visited']);
    const [testData6, setTestData6] = useState(['Total']);

    const [CloseModalYes, setCloseModalYes] = useState('No');
    const [CloseModalNo, setCloseModalNo] = useState('');
    const [submitMessage, setSubmitMessage] = useState('')

    const [user, setUser] = useState({})

    const [passes, setPasses] = useState([])
    const [changeFromDrawer, setChangeFromDrawer] = useState('')
    const [iFromDrawer, setIfromDrawer] = useState(0)
    const [bookMark, setBookMark] = useState(true)
    const [sectionWiseTimer, setSectionWiseTimer] = useState(null)

    const [pauseModal, showPauseModal] = useState(false)

    const setDataInLocalArr = (data) => {
        // debugger
        // console.log('set data in local arr', data[0].duration);
        if(data == null){
            ToastAndroid.show('Some error occured!', ToastAndroid.SHORT)
        } else {
            let k = 0;
            for (let i = 0; i < data.length; i++) {

                

                for (let j = 0; j < data[i].serials.length; j++) {
// console.log('all question answer is', data[i].serials[j].awnsered, 'question is', j);
                    let newStr = {
                        's': data[i].serials[j].s,
                        'subject': i + 1,
                        'GetClass': data[i].serials[j].GetClass?data[i].serials[j].GetClass:null,
                        'awnsered': data[i].serials[j].awnsered?data[i].serials[j].awnsered:null,
                        'time': data[i].serials[j].time?data[i].serials[j].time:null,
                        'bookMark': null,
                        'LastActiveQuestion': null,//data[i].LastActiveQuestion,
                        'Active': data[i].Active
                    }
                    // console.log('last active question and time spent',Number(data[i].LastActiveQuestion)-1, data[i].serials[j].time);
                    quesAnsDataArr[k] = newStr;
                    setQuesAnsDataArr(quesAnsDataArr);
                    k++;
                } // inner loop

                if(data[i].Active == 'Yes'){
                    setIndex(Number(data[i].LastActiveQuestion)-1);
                    setSubjectIndex(data[i].subjectSerial);
                }
            // console.log('Arr pushed in ques and ans arr', quesAnsDataArr);
            } // outer loop
        }    
    }

    const onBookMarkQues = (questionid) => {
        if (userId !== null && questionid !== null) {
            const formData = new FormData();
            formData.append('userid', userId);
            formData.append('questionid', questionid);
            axiosClient()
                .post('questions/bookmark', formData)
                .then((res) => {
                    // setIsLoading(false);
                    if (res.data.Error == 0 && res.data.message == "Bookmark Added") {
                        setBookMark(true);
                    }
                    else {
                        setBookMark(false);
                    }
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT)
                })
                .catch((err) => {
                    ToastAndroid.show(err, ToastAndroid.SHORT)
                    console.log('question bookmark error', err);
                });
        }
    };

    const onReportQues = (questionid, reporttype, message) => {
        setIsLoading(true);
        if (userId !== null && questionid !== null) {
            const formData = new FormData();
            formData.append('userid', userId);
            formData.append('questionid', questionid);
            formData.append('examid', '0');
            formData.append('type', 'test');
            formData.append('reporttype', reporttype);
            formData.append('message', message);
            axiosClient()
                .post('questions/report', formData)
                .then((res) => {
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT)
                    setIsLoading(false);
                    // console.log('question report response', res);
                })
                .catch((err) => {
                    setIsLoading(false);
                    console.log('question report error', err);
                });
        }
    };


    const callResultApi = () => {
        setSubjectIndexResult(0);
        setQuestionIndex(0);
        getExamResultSections();
        getSolutionTestData();
    };

    const getExamResultSections = () => {
        const formData = new FormData();
        formData.append('userid', userId);
        formData.append('exam_key', examKey);
        formData.append('subpackageid', subPackageId);

        axiosClient()
            .post('resultAnalysis/getSections', formData)
            .then((res) => {
                // console.log('result solution res', res.data.data[0], userId, examKey)
                // setIsLoading(false);
                if (res.data.Error == 0) {
                    setExamDetails(res.data.data[0].testDetails);
                    // setExamSections(res.data.data[0].testsections);
                }
                else { setMessage(res.data.message) }
            })
            .catch((err) => {
                console.log('result solution error', err);
            });
    }

    const getSolutionTestData = () => {

        const formData = new FormData();
        formData.append('userid', userId);
        formData.append('exam_key', examKey);
        formData.append('subpackageid', subPackageId);
        formData.append('attemetNo', 0);

        axiosClient()
            .post('resultAnalysis/solutionTestData', formData)
            .then((res) => {
                // console.log('result solution data res', res.data.data, userId, examKey)
                if (res.data.Error == 0) {
                    setExamSections(res.data.data);
                }
                else { setMessage(res.data.message) }
                // setIsResultLoading(false);
            })
            .catch((err) => {
                // setIsResultLoading(false);
                // console.log('result solution data error', err);
            });
    }

    useEffect(() => {
        return () => {
            setTestDetails([]);
            setTestsections([]);
            setIsLoading(false);
            setSelectedCourse();
            setIndex(0);
            setSubjectIndex(0);
            setTestData([]);
            setTestQuestion([]);
            setTestSerials([]);
            setLangChange(true);
            setMarkThisQuesArr([]);
            setOptionsData([]);
            setExamKey('');
            setUserId();
            setSubPackageId();
            setTotalDuration(null);
            setQuesAnsDataArr([]);
            setIsVisible(false);
            setRemainingTime(0);
            setIsRunning(true);
            setTestId('');
            setLangChangeResult(false);
            setQuestionIndex(0);
            setSubjectIndexResult(0);
            setExamDetails([]);
            setExamSections([]);
            setDrawerIndex(0);
            setCloseModalYes('No');
            setCloseModalNo('');
            setSubmitMessage('')
            // setUser({})
            // setPasses([])
            setChangeFromDrawer('')
            setIfromDrawer(0)
            setBookMark(true)
            setSectionWiseTimer(null)
            showPauseModal(false)
        }
    }, [])

    const getData = async () => {
        // console.log('get data called');
        try {
            await AsyncStorage.getItem('user', (err, result) => {
                if (!err && result !== null) {
                    const user = JSON.parse(result)
                    setUserId(user.id)
                    setUser(user)
                }
                else {
                    console.log(err)
                }
            })
        } catch (e) {
            console.log(e);
        }
    };

    const getPass = () => {
        // console.log('get Pass called');
        axiosClient().post('pass/get')
            .then((res) => {
                if (res.data.Error === 0) {
                    setPasses(res.data.data)
                }
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
    }

    const changeLangResult = () => {
        setLangChangeResult(!langChangeResult)
    }

    const showMainTime = (time) => {
        if (isRunning == false) {
            let seconds = Number(time[1]) * 3600 + Number(time[2]) * 60 + Number(time[3]);
            setRemainingTime(seconds);
        }
    }


    const getExamGo = () => {
        if (examKey && userId) {
            const formData = new FormData();
            formData.append('userid', userId);
            formData.append('subpackageid', subPackageId);
            formData.append('examkey', examKey);
            axiosClient()
                .post('starttest/go', formData)
                .then((res) => {
                    // console.log('exam go response', res.data.data[0]);
                    if (res.data.Error == 0) {
                        getTestQuestions(res.data.data[0].testDetails[0]);
                        setTestDetails(res.data.data[0].testDetails[0]);
                        setTestsections(res.data.data[0].testsections);
                        setSelectedCourse(res.data.data[0].testsections[0])
                        // setTotalDuration(res.data.data[0].testDetails[0].duration);
                    }
                })
                .catch((err) => {
                    setIsLoading(false);
                    console.log('exam go error', err);
                });
        }
    };

    const _onPressSubmitBtn = () => {

        if (examKey && userId) {
            let stringify = JSON.stringify(testData);

            const formData = new FormData();
            formData.append('userid', userId);
            formData.append('exam_key', examKey);
            formData.append('testData', stringify);
            formData.append('timeremaining', RemainingTime);
            formData.append('subpackageid', subPackageId);
            axiosClient()
                .post('starttest/submitResult', formData)
                .then((res) => {
                    if (res.data.Error === 0) {
                        setSubmitMessage(res.data.message);
                    }
                    else {
                        Alert.alert(res.data.message);
                        setSubmitMessage(res.data.message);
                    }
                    // console.log('exam submit response', res);
                })
                .catch((err) => {
                    console.log('exam submit error', err);
                });
        } else {
            console.log('exam key and userid not found!');
        }
    }

    const getTestQuestions = (examData) => {

        if (examKey && userId && subPackageId) {
            const formData = new FormData();
            formData.append('userid', userId);
            formData.append('subpackageid', subPackageId);
            formData.append('examkey', examKey);
            axiosClient().post('starttest/gettestdata', formData)
                .then((res) => {
                    console.log("question res", res.data.data, examData);
                    if (res.data.Error == 0) {
                        setDataInLocalArr(res.data.data);
                        setTestData(res.data.data);
                        setTestQuestion(res.data.data.map((item) => item.questions));
                        setTestSerials(res.data.data.map((item) => item.serials));
                        setSectionWiseTimer(res.data.data[0].duration!=null?0:null);
                        if(examData.timeremaining != 'undefined' && examData.timeremaining != '' && examData.timeremaining != 'NaN' && examData.timeremaining != null && examData.timeremaining != 0){
                        // if(examData.timeremaining == null || examData.timeremaining == '0' || examData.timeremaining == ''){
                            console.log('set time remaining',examData.timeremaining);
                            setTotalDuration(Number.parseInt(examData.timeremaining));
                        } else {
                            setTotalDuration((Number.parseInt(examData.duration)) * 60);
                            // console.log('set duration',examData.duration);
                        }
                        setIsLoading(false);
                    }
                    else { setIsLoading(false); }
                }).catch((err) => {
                    console.log(err)
                    setIsLoading(false);
                })
        }
    }

    const createTable = () => {

        setTestData1(['Section']);
        setTestData2(['Answered']);
        setTestData3(['Not Answered']);
        setTestData4(['Marked']);
        setTestData5(['Not Visited']);
        setTestData6(['Total']);

        for (let i = 0; i < testData.length; i++) {
            let subName = testData && testData[i] && testData[i].name;
            let findAttempt = testData && testData[i] && testData[i].serials && testData[i].serials.filter((e) => e.GetClass == 'has_answered').length;
            let findNotVisited = testData && testData[i] && testData[i].serials && testData[i].serials.filter((e) => e.GetClass == 'has_not_visited').length;
            let findNotAnswered = testData && testData[i] && testData[i].serials && testData[i].serials.filter((e) => e.GetClass == 'has_not_answered').length;
            let findMarked = testData && testData[i] && testData[i].serials && testData[i].serials.filter((e) => e.GetClass == 'has_marked').length;

            setTestData1(testData1 => testData1.concat(subName.toString()));
            setTestData2(testData2 => testData2.concat(findAttempt.toString()));
            setTestData3(testData3 => testData3.concat(findNotAnswered.toString()));
            setTestData4(testData4 => testData4.concat(findMarked.toString()));
            setTestData5(testData5 => testData5.concat(findNotVisited.toString()));
            setTestData6(testData6 => testData6.concat((findAttempt + findNotAnswered + findMarked + findNotVisited).toString()));

        }
        setIsVisible(true);
    }

    const onTestSubmitYes = () => {
        setCloseModalYes('Yes'); 
        setCloseModalNo('No');
    }

    const SubmitModal = () => {
        // let hours = Math.floor(RemainingTime / 3600);
        // let minutes = Math.floor((RemainingTime - (hours * 3600)) / 60);
        // let seconds = RemainingTime - (hours * 3600) - (minutes * 60);
        return (
            <Modal isVisible={isVisible}>
                <View style={styles.mainModalView}>
                    <View style={styles.headModalView}>
                        <Text style={styles.headText}>Test summary</Text>
                    </View>

                    <View style={{ flexDirection: 'row', paddingBottom: 15 }}>
                        <View style={{ flexDirection: 'column' }}>
                            {testData1.map((item, index) => {
                                return (
                                    <TouchableOpacity style={styles.tableBox}>
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ textAlign: 'center', fontSize: 10 }}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            {testData2.map((item, index) => {
                                return (
                                    <TouchableOpacity style={styles.tableBox}>
                                        <Text style={{ textAlign: 'center', fontSize: 10 }}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            {testData3.map((item, index) => {
                                return (
                                    <TouchableOpacity style={styles.tableBox}>
                                        <Text style={{ textAlign: 'center', fontSize: 10 }}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            {testData4.map((item, index) => {
                                return (
                                    <TouchableOpacity style={styles.tableBox}>
                                        <Text style={{ textAlign: 'center', fontSize: 10 }}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            {testData5.map((item, index) => {
                                return (
                                    <TouchableOpacity style={styles.tableBox}>
                                        <Text style={{ textAlign: 'center', fontSize: 10 }}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            {testData6.map((item, index) => {
                                return (
                                    <TouchableOpacity style={styles.tableBox}>
                                        <Text style={{ textAlign: 'center', fontSize: 10 }}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                    <Text style={styles.middleText}>
                        Once you click submit, you will {'\n'} not be able to change your answers...
                    </Text>
                    {/* <View style={styles.timeView}>
                        <Text style={{ fontSize: 17, color: '#fff' }}>Time Remaining :</Text>
                        <Text style={styles.timeText}>{hours + ':' + minutes + ':' + seconds}</Text>
                    </View> */}
                    <Text style={{ marginVertical: 10 }}>Do you want to submit the test?</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity activeOpacity={0.5} style={{
                            height: 40,
                            width: 80,
                            borderWidth: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10
                        }} onPress={() => onTestSubmitYes()}>
                            <Text>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5} style={{
                            height: 40,
                            width: 80,
                            borderWidth: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                            marginLeft: 20
                        }} onPress={() => { setCloseModalNo('No'); setCloseModalYes('No'); }}>
                            <Text>No</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 20 }}></View>
                </View>
            </Modal>
        )
    }

    const contextValue = {
        TestDetails,
        Testsections, selectedCourse, setSelectedCourse,
        testQuestion, testSerials, isLoading, setIsLoading,
        index, setIndex, subjectIndex, setSubjectIndex,
        langChange, setLangChange,
        markThisQuesArr, setMarkThisQuesArr,
        optionsData, setOptionsData, setExamKey, examKey,
        quesAnsDataArr, setQuesAnsDataArr,
        SubmitModal, createTable,
        isVisible, setIsVisible,
        setUserId, userId,
        testData, setTestData,
        _onPressSubmitBtn,
        RemainingTime, setRemainingTime,
        isRunning, setIsRunning,
        showMainTime,
        CloseModalYes, setCloseModalYes,
        CloseModalNo, setCloseModalNo, getData,
        submitMessage,
        changeFromDrawer,
        setChangeFromDrawer,
        iFromDrawer, setIfromDrawer, bookMark, onReportQues,
        langChangeResult, setLangChangeResult,
        questionIndex, setQuestionIndex,
        subjectIndexResult, setSubjectIndexResult,
        examDetails, setExamDetails,
        examSections, setExamSections,
        changeLangResult,
        callResultApi,
        drawerIndex, setDrawerIndex,
        user, passes, setSubPackageId, subPackageId,
        onBookMarkQues, testId, setTestId, getExamGo, setTestDetails,
        totalDuration, setTotalDuration,
        sectionWiseTimer, setSectionWiseTimer,
        getData, getPass,
        pauseModal, showPauseModal
    };

    return (
        <MyContext.Provider value={contextValue}>
            {props.children}
        </MyContext.Provider>
    )

}

const styles = StyleSheet.create({
    // modal style
    headT: { width: '100%', height: 40, backgroundColor: '#f1f8ff' },
    wrapperT: { flexDirection: 'row', width: '100%' },
    titleT: { width: '20%', backgroundColor: '#f6f8fa' },
    rowT: { height: 28 },
    textT: { textAlign: 'center' },

    mainModalView: { backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', width: '100%', alignSelf: 'center' },
    headModalView: { backgroundColor: 'grey', alignItems: 'center', justifyContent: 'center', width: '100%', marginVertical: 10, paddingVertical: 5 },
    headText: { fontSize: 27, textTransform: 'uppercase', color: '#fff' },
    tableView: { width: 500, alignSelf: 'center', height: 200, }, //'98%'
    middleText: { fontSize: 16, color: '#000', textAlign: 'center', marginVertical: 10 },
    timeView: { backgroundColor: 'grey', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', paddingVertical: 7, flexDirection: 'row', paddingHorizontal: 20, borderRadius: 10 },
    timeText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
    submitView: { width: '100%', backgroundColor: '#78B685', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 30, paddingVertical: 10 },
    submitText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },

    tableBox: { width: 55, height: 30, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
});