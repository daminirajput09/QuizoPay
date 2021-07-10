import React, { useEffect, useState, useContext, useRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    ScrollView,
    FlatList,
    Dimensions,
    BackHandler,
    TextInput,
    ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import FeIcon from 'react-native-vector-icons/Feather';
import BookIcon from 'react-native-vector-icons/FontAwesome';


import axiosClient from '../api/axios-client';
import Loader from '../components/Loader';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal'
import { MyContext } from '../components/UseContext';
// import HTML from "react-native-render-html";
import { IGNORED_TAGS, alterNode, makeTableRenderer } from 'react-native-render-html-table-bridge';
import WebView from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import GestureRecognizer from 'react-native-swipe-gestures';

const windowWidth = Dimensions.get('window').width;

const QuizSolution = ({ navigation, route }) => {
    const { userid, quizKey } = route.params;
    const { onReportQues } = useContext(MyContext)
    const [loading, setLoading] = useState(true);
    const [quizname, setQuizname] = useState('');
    const [questions, setQuestions] = useState([]);
    const [serials, setSerials] = useState([]);
    const [quesIndex, setQuesIndex] = useState(0);
    const [langChange, setLangChange] = useState(true);
    const [solutionHindi, setSolutionHindi] = useState("")
    const [solutionEng, setSolutionEng] = useState("")

    const [optionArr, setOptionArr] = useState();
    const [answer, setAnswer] = useState(null);
    const [rightAns, setRightAns] = useState(null);
    const [quesAnsDataArr, setQuesAnsDataArr] = useState([]);
    const [isRunning, setIsRunning] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const [passageEng, setPassageEng] = useState(null)
    const [passageHin, setPassageHin] = useState(null)
    const [quesEng, setQuesEng] = useState(null)
    const [quesHin, setQuesHin] = useState(null)
    const [height, setHeight] = useState()
    const [tap, setTap] = useState(false)
    const [reportOption, setReportOption] = useState('')
    const [message, setMessage] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [bookMark, setBookMark] = useState(false)

    let flatListRef = React.createRef();
    const ReporValues = [
        { value: 'wrong_question', label: ' Wrong Question' },
        { value: 'wrong_answer', label: 'Wrong Answer' },
        { value: 'formatting_issue', label: 'Format Issue' },
        { value: 'no_solution', label: 'No Solution' },
        { value: 'wrong_translation', label: 'Wrong Translation' },
        { value: 'others', label: 'Others' }
    ]

    const configHTML = {
        WebViewComponent: WebView,
        tableStyleSpecs: {
            cellSpacingEm: 0.1,
            fitContainerWidth: true,
            fontSizePx: 10,
            width: 100
          }
    };

    const classesStyles = { 
        'sub': { fontSize: 9, lineHeight: 37 },
        'sup': { fontSize: 10, lineHeight: 18 },
    }
    

    const renderers = {
        table: makeTableRenderer(configHTML)
    };

    const htmlConfig = {
        alterNode,
        renderers,
        ignoredTags: IGNORED_TAGS
    };

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };
    
    useEffect(() => {
        getQuizData();
        const handle = BackHandler.addEventListener('hardwareBackPress', navigateBack)

        return () => handle.remove()
    }, []);

    const navigateBack = () => {
        navigation.goBack()
        return true
    }

    useEffect(() => {
        if (questions.length > 0) {
            setOptionArr(parseInt(questions[quesIndex].no_of_ans, 10))
            setAnswer(questions[quesIndex].awnsered)
            setRightAns(questions[quesIndex].right_ans)
            setSolutionHindi(questions[quesIndex].solution_hin != "" ? questions[quesIndex].solution_hin : null);
            setSolutionEng(questions[quesIndex].solution_eng != "" ? questions[quesIndex].solution_eng : null);
            setPassageEng(questions[quesIndex].passage_english != "" ? questions[quesIndex].passage_english : null)
            setPassageHin(questions[quesIndex].passage_hindi != "" ? questions[quesIndex].passage_hindi : null)
            setQuesEng(questions[quesIndex].question_eng == "" ? null : questions[quesIndex].question_eng)
            setQuesHin(questions[quesIndex].question_hin == "" ? null : questions[quesIndex].question_hin)
            setBookMark(questions[quesIndex].bookmark == null ? false : true)
        }
    }, [quesIndex || questions])

    useEffect(() => {
        changeHeight()
    }, [solutionEng || solutionHindi])

    const getQuizData = () => {
        if (userid && quizKey) {
            const formdata = new FormData();
            formdata.append('userid', userid);
            formdata.append('quiz_key', quizKey);
            axiosClient()
                .post('quizzes/getSolution', formdata)
                .then((res) => {
                    //console.log('quiz start response', res.data.data);
                    if (res.data.Error === 0) {
                        setQuizname(res.data.data.quizname);
                        setQuestions(res.data.data.questions);
                        setOptionArr(
                            parseInt(res.data.data.questions[0].no_of_ans, 10)
                        );
                        setRightAns(res.data.data.questions[0].right_ans)
                        setAnswer(res.data.data.questions[0].awnsered)
                        setSolutionHindi(res.data.data.questions[0].solution_hin);
                        setSolutionEng(res.data.data.questions[0].solution_eng);
                    } else {
                        setQuizname('');
                        setQuestions([]);
                        setSerials([]);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    //console.log('quiz start error', err);
                });
        }
    };

    const onSelectReportOption = (value) => {
        setReportOption(value)
        // setTap(false)
        setShowModal(true)
    }


    const scrollToIndexQuestion = (index) => {
        flatListRef.scrollToIndex({ animated: true, index: index });
    }

    const onPrevious = () => {
        if (quesIndex > 0) {
            setQuesIndex(quesIndex - 1);
            setAnswer(null);
            scrollToIndexQuestion(quesIndex - 1)
        }
    }

    const onNext = async () => {
        if (quesIndex + 1 != questions.length) {
            setQuesIndex(quesIndex + 1);
            setAnswer(null);
            scrollToIndexQuestion(quesIndex + 1)
        }
    }


    const changeLang = () => {
        setLangChange(!langChange)
    }

    const changeHeight = () => {
        if (solutionEng == null || solutionHindi == null) {
            setHeight(2)
        }
        else {
            setHeight()
        }
    }

    const onBookMarkQues = (questionid) => {
        // setIsLoading(true);
        if (userid !== null && questionid !== null) {
            const formData = new FormData();
            formData.append('userid', userid);
            formData.append('questionid', questionid);
            // //console.log('question bookmark response', userid, questionid);
            axiosClient()
                .post('questions/bookmark', formData)
                .then((res) => {
                    // setIsLoading(false);
                    if (res.data.Error == 0 && res.data.message == "Bookmark Added") {
                        setBookMark(true);
                        const change = [...questions]
                        change[quesIndex].bookmark = '1'
                        setQuestions(change)
                    }
                    else {
                        setBookMark(false);
                        const change = [...questions]
                        change[quesIndex].bookmark = null
                        setQuestions(change)
                    }
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT)
                })
                .catch((err) => {
                    ToastAndroid.show(err, ToastAndroid.SHORT)
                    //console.log('question bookmark error', err);
                });
        }
    };

    return (
        <>
            <View style={styles.mainContainer}>
                {/* <Header headerText={'Quiz'} onPress={() => navigation.goBack()} /> */}
                <TouchableOpacity activeOpacity={2} //onPress={() => setTap(false)}
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    paddingVertical: 7,
                    marginTop: 7,
                    alignItems: 'center'
                }}>
                    <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => { navigation.goBack(); return true; }}>
                        <FeIcon name='arrow-left' size={20} color='#000' />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 10, width: '70%' }}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                color: '#000',
                                fontSize: 14,
                                textAlign: 'center'
                            }}>
                            {quizname}
                        </Text>
                    </View>

                    <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => changeLang()}>
                        {langChange ? <Image source={require('../../assets/english.png')} style={{ width: 30, height: 30 }} resizeMode='center' /> : <Image source={require('../../assets/hindi.png')} style={{ width: 30, height: 30 }} resizeMode='center' />}
                    </TouchableOpacity>
                </TouchableOpacity>
                {loading ? (
                    <Loader isLoading={loading} />
                ) : (
                    <GestureRecognizer
                    // onSwipe={(gestureState) => { //console.log('swipe only') }}
                    onSwipeLeft={(state) => { 
                        if(quesIndex + 1 != questions.length){ onNext() }
                    }}
                    onSwipeRight={(state) => { onPrevious() }}
                    config={config}> 
                    <ScrollView>
                        {/* <TouchableOpacity activeOpacity={2} onPress={() => setTap(false)}> */}

                        
                            {questions && questions.length > 0 ? (
                                <View
                                    style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                        backgroundColor: '#fff',
                                        alignSelf: 'center',
                                        marginTop: 10,
                                    }}>
                                    <FlatList
                                        ref={(ref) => {
                                            flatListRef = ref;
                                        }}
                                        keyExtractor={(item, index) => index.toString()}
                                        horizontal={true}
                                        data={questions}
                                        showsHorizontalScrollIndicator={false}
                                        initialNumToRender={1}
                                        renderItem={({ item, index }) => {
                                            // //console.log('questions list', questions);
                                            return (
                                                <View
                                                    style={{
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }} key={index}>
                                                    {item.GetClass == 'has_answered' || (item.GetClass == 'has_marked' && item.awnsered !== null) ?
                                                            item.awnsered == item.right_ans ? 
                                                            <TouchableOpacity
                                                                key={() => setQuesIndex(index)}
                                                                style={{
                                                                    padding: 10,
                                                                    flexDirection: 'row',
                                                                    alignSelf: 'center',
                                                                }}
                                                                onPress={
                                                                    () => { setQuesIndex(index); }
                                                                    // { setSubjectIndexResult(index); setQuestionIndex(0); setFilterIndex(0); setQuesAnsData(examSections[index].questions); }
                                                                }>
                                                                <Text
                                                                    style={{
                                                                        fontWeight: 'bold',
                                                                        textAlign: 'center',
                                                                        textAlignVertical: 'center',
                                                                        borderRadius: 30 / 2,
                                                                        height: 30,
                                                                        width: 30,
                                                                        backgroundColor:'#71D78B',
                                                                            // item.right_ans == item.awnsered ? 'green' ? ,
                                                                            // quesIndex == index ? '#0B84FE' : '#fff',
                                                                        borderWidth: 1,
                                                                        borderColor: '#71D78B',
                                                                            // quesIndex == index ? '#0B84FE' : 'grey',
                                                                        color: '#fff', //quesIndex == index ? '#fff' : 'grey',
                                                                        fontSize: 12,
                                                                    }}>
                                                                    {index + 1}
                                                                </Text>
                                                                {/* {index + 1 < questions.length && (<View style={{ height: '60%', width: 1, backgroundColor: 'grey', marginLeft: 15, alignSelf: 'center' }} />)} */}
                                                            </TouchableOpacity>
                                                            :
                                                            <TouchableOpacity
                                                                key={() => setQuesIndex(index)}
                                                                style={{
                                                                    padding: 10,
                                                                    flexDirection: 'row',
                                                                    alignSelf: 'center',
                                                                }}
                                                                onPress={
                                                                    () => { setQuesIndex(index); }
                                                                }>
                                                                <Text
                                                                    style={{
                                                                        fontWeight: 'bold',
                                                                        textAlign: 'center',
                                                                        textAlignVertical: 'center',
                                                                        borderRadius: 30 / 2,
                                                                        height: 30,
                                                                        width: 30,
                                                                        backgroundColor: '#CB2627',
                                                                        borderWidth: 1,
                                                                        borderColor: '#CB2627',
                                                                        color: '#fff',
                                                                        fontSize: 12,
                                                                    }}>
                                                                    {index + 1}
                                                                </Text>
                                                            </TouchableOpacity>
                                                            :
                                                            item.GetClass == 'has_not_answered' || item.GetClass == 'has_not_visited' || item.GetClass == 'has_not_visited solution_active' || (item.GetClass == 'has_marked' && item.awnsered == null)?
                                                            <TouchableOpacity
                                                                key={() => setQuesIndex(index)}
                                                                style={{
                                                                    padding: 10,
                                                                    flexDirection: 'row',
                                                                    alignSelf: 'center',
                                                                }}
                                                                onPress={
                                                                    () => { setQuesIndex(index); }
                                                                }>
                                                                <Text
                                                                    style={{
                                                                        fontWeight: 'bold',
                                                                        textAlign: 'center',
                                                                        textAlignVertical: 'center',
                                                                        borderRadius: 30 / 2,
                                                                        height: 30,
                                                                        width: 30,
                                                                        backgroundColor: '#E7E7E7',
                                                                        borderWidth: 1,
                                                                        borderColor: 'grey',
                                                                        color: 'grey',
                                                                        fontSize: 12,
                                                                    }}>
                                                                    {index + 1}
                                                                </Text>
                                                            </TouchableOpacity>
                                                            : 
                                                            <TouchableOpacity
                                                                key={() => setQuesIndex(index)}
                                                                style={{
                                                                    padding: 10,
                                                                    flexDirection: 'row',
                                                                    alignSelf: 'center',
                                                                }}
                                                                onPress={
                                                                    () => { setQuesIndex(index); }
                                                                }>
                                                                <Text
                                                                    style={{
                                                                        fontWeight: 'bold',
                                                                        textAlign: 'center',
                                                                        textAlignVertical: 'center',
                                                                        borderRadius: 30 / 2,
                                                                        height: 30,
                                                                        width: 30,
                                                                        backgroundColor: '#E7E7E7',
                                                                        borderWidth: 1,
                                                                        borderColor: 'grey',
                                                                        color: 'grey',
                                                                        fontSize: 12,
                                                                    }}>
                                                                    {index + 1}
                                                                </Text>
                                                            </TouchableOpacity>}
                                                </View>
                                            );
                                        }}
                                    />
                                </View>
                            ) : null}

                            <View
                                style={{
                                    width: '100%',
                                    backgroundColor: '#fff',
                                    alignSelf: 'center',
                                    marginTop: 20,
                                    alignItems: 'center',
                                    paddingVertical: 10,
                                }}>
                                <View style={{ width: '92%', alignSelf: 'center' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between',width:'100%',alignItems:'flex-start' }}>
                                        <View style={{ width: '80%',flexDirection:'row' }}>
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    textAlignVertical: 'center',
                                                    borderRadius: 30 / 2,
                                                    height: 30,
                                                    width: 30,
                                                    backgroundColor: 'grey',
                                                    color: '#fff',
                                                    fontSize: 12,
                                                    marginBottom: 10
                                                }}>
                                                {quesIndex + 1}
                                            </Text>
                                            <Text style={{ color: 'green', fontWeight: 'bold', paddingHorizontal: 5,marginLeft:10,marginTop:5 }}>
                                            +{questions[quesIndex].marks}
                                            </Text>
                                            <Text style={{ color: 'red', fontWeight: 'bold', paddingHorizontal: 5,marginTop:5 }}>
                                            -{questions[quesIndex].negativemarks}
                                            </Text>
                                        </View>
                                        <View style={{justifyContent:'space-between',alignItems:'center',flexDirection:'row',width: '20%'}}>
                                            <TouchableOpacity onPress={() => onBookMarkQues(questions[quesIndex].id)}>
                                                {/* {bookMark ? <BookIcon name="star" size={20} fill color="#ECDD35" /> : <BookIcon name="star-o" size={20} color='#000' />} */}
                                                {bookMark ? <FontIcon name="bookmark" size={20} fill color="grey" />:<FontIcon name="bookmark-o" size={20} color="#000" />}
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setTap(!tap)} style={{ marginLeft: 15 }}>
                                                <Image source={require('../../assets/report.png')} style={{ height: 23, width: 23 }} resizeMode='contain' />
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                    {(passageEng != null || passageHin != null)
                                        &&
                                        // <HTML source={{
                                        //     html: langChange == true
                                        //         ? passageEng ?
                                        //             passageEng :
                                        //             passageHin
                                        //         : passageHin ?
                                        //             passageHin :
                                        //             passageEng
                                        // }} contentWidth={windowWidth - 30} {...htmlConfig} baseFontStyle={{lineHeight: 30}} tagsStyles={classesStyles} />
                                        <AutoHeightWebView
                                            style={{ width: windowWidth - 50,opacity: 0.99,minHeight: 1 }}
                                            files={[{
                                                href: 'cssfileaddress',
                                                type: 'text/css',
                                                rel: 'stylesheet'
                                            }]}
                                            customStyle={`* {
                                                    align-items: center;
                                                    padding: 0px;
                                                    margin: 0px;
                                            }
                                            table {
                                                max-width: ${windowWidth - 50};
                                                font-size: 10px;
                                              } img {
                                                max-width: ${windowWidth - 50};
                                              }`}
                                            source={{  html: langChange == true
                                                ? passageEng ?
                                                    passageEng :
                                                    passageHin
                                                : passageHin ?
                                                    passageHin :
                                                    passageEng }}
                                        />
                                    }
                                    {/* <HTML source={{
                                       html: langChange == true
                                           ? quesEng ?
                                               quesEng :
                                               quesHin
                                           : quesHin ?
                                               quesHin :
                                               quesEng
                                    }} contentWidth={windowWidth - 30} {...htmlConfig} baseFontStyle={{lineHeight: 30}} tagsStyles={classesStyles} /> */}
                                    <AutoHeightWebView
                                            style={{ width: windowWidth - 50,opacity: 0.99,minHeight: 1 }}
                                            files={[{
                                                href: 'cssfileaddress',
                                                type: 'text/css',
                                                rel: 'stylesheet'
                                            }]}
                                            customStyle={`* {
                                                    align-items: center;
                                                    padding: 0px;
                                                    margin: 0px;
                                            }table {
                                                max-width: ${windowWidth - 50};
                                                font-size: 10px;
                                              } img {
                                                max-width: ${windowWidth - 50};
                                              }`}
                                            files={[{
                                                href: 'cssfileaddress',
                                                type: 'text/css',
                                                rel: 'stylesheet'
                                            }]}
                                            source={{  html: langChange == true
                                                ? quesEng ?
                                                    quesEng :
                                                    quesHin
                                                : quesHin ?
                                                    quesHin :
                                                    quesEng }}
                                        />
                                </View>
                            </View>

                            {tap && (
                            <Modal
                                visible={tap}
                                animationType="fade"
                                transparent={true}
                                coverScreen={true}
                                hardwareAccelerated={true}
                                onBackdropPress={() => {
                                    setTap(false);
                                }}
                                onSwipeMove={() => {
                                    setTap(false);
                                }}
                                style={{flex: 1, alignItems: 'center'}}
                                onRequestClose={() => {
                                    setTap(false);
                                }}>
                                <View
                                style={{
                                    backgroundColor: '#fff',
                                    height: hp('32'),
                                    width: wp('50'),
                                    position: 'absolute',
                                    elevation: 10,
                                    right: 20,
                                    top: hp('17'),
                                    zIndex: 1,
                                    alignSelf: 'flex-end'
                                }}>
                                {ReporValues.map((item, i) => (
                                    <TouchableOpacity
                                    key={i}
                                    onPress={() => onSelectReportOption(item.value)}
                                    style={{padding: 10}}>
                                    <Text>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                                </View>
                            </Modal>
                            )}
                            {/* {tap &&
                                <View style={{
                                    backgroundColor: '#fff',
                                    height: hp('32'),
                                    width: wp('50'),
                                    position: 'absolute',
                                    elevation: 10,
                                    right: 20,
                                    top: hp('17'),
                                    zIndex: 1,
                                    alignSelf: 'flex-end'
                                }}>
                                    {ReporValues.map((item, i) => (
                                        <TouchableOpacity
                                            onPress={() => onSelectReportOption(item.value)}
                                            style={{ padding: 10 }}>
                                            <Text>{item.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>} */}


                            {langChange == true
                                ? Array(optionArr)
                                    .fill()
                                    .map((val, i) => {
                                        let char = String.fromCharCode(97 + i);
                                        return (
                                            <View
                                                style={{
                                                    ...styles.options,
                                                    backgroundColor:
                                                        i.toString() == rightAns
                                                            ? '#D7E9DB'
                                                            : i.toString() == answer
                                                                ? '#F3DDE0'
                                                                : '#fff',
                                                    borderWidth: 1,
                                                    borderColor:
                                                        i.toString() == rightAns
                                                            ? 'green'
                                                            : answer == i.toString()
                                                                ? 'red'
                                                                : '#fff',
                                                }}>
                                                <Text>{i + 1}. </Text>
                                                {/* <HTML source={{
                                                     html:
                                                     questions &&
                                                         questions[quesIndex] &&
                                                         questions[quesIndex][`ans_eng_${char}`] != ''
                                                         ? questions &&
                                                         questions[quesIndex] && questions[quesIndex][`ans_eng_${char}`]
                                                         : questions &&
                                                         questions[quesIndex] && questions[quesIndex][`ans_hin_${char}`],
                                                }} contentWidth={windowWidth - 60} {...htmlConfig} baseFontStyle={{lineHeight: 30}} tagsStyles={classesStyles} /> */}
                                                <AutoHeightWebView
                                                    style={{ width: windowWidth - 80,opacity: 0.99,minHeight: 1 }}
                                                    files={[{
                                                        href: 'cssfileaddress',
                                                        type: 'text/css',
                                                        rel: 'stylesheet'
                                                    }]}
                                                    customStyle={`* {
                                                            align-items: center;
                                                            padding: 0px;
                                                            margin: 0px;
                                                    }table {
                                                        max-width: ${windowWidth - 80};
                                                        font-size: 10px;
                                                      } img {
                                                        max-width: ${windowWidth - 80};
                                                      }`}
                                                    files={[{
                                                        href: 'cssfileaddress',
                                                        type: 'text/css',
                                                        rel: 'stylesheet'
                                                    }]}
                                                    source={{  html: questions &&
                                                        questions[quesIndex] &&
                                                        questions[quesIndex][`ans_eng_${char}`] != ''
                                                        ? questions &&
                                                        questions[quesIndex] && questions[quesIndex][`ans_eng_${char}`]
                                                        : questions &&
                                                        questions[quesIndex] && questions[quesIndex][`ans_hin_${char}`], }}
                                                />
                                                {i.toString() == rightAns ?
                                                    <AntIcon name='check' size={20} color='green' style={{ right: 10,position:'absolute', top:20 }} />
                                                    : i.toString() == answer
                                                        ?
                                                        <AntIcon name='close' size={20} color='red' style={{ right: 10,position:'absolute', top:20 }} /> : null
                                                }
                                            </View>
                                        );
                                    })
                                : Array(optionArr)
                                    .fill()
                                    .map((val, i) => {
                                        let char = String.fromCharCode(97 + i);
                                        return (
                                            <View
                                                style={{
                                                    ...styles.options,
                                                    backgroundColor:
                                                        i.toString() == rightAns
                                                            ? '#D7E9DB'
                                                            : i.toString() == answer
                                                                ? '#F3DDE0'
                                                                : '#fff',
                                                    borderWidth: 1,
                                                    borderColor:
                                                        i.toString() == rightAns
                                                            ? 'green'
                                                            : answer == i.toString()
                                                                ? 'red'
                                                                : '#fff',
                                                }}>
                                                <Text>{i + 1}. </Text>
                                                {/* <HTML source={{
                                                     html: questions &&
                                                     questions[quesIndex] &&
                                                     questions[quesIndex][`ans_hin_${char}`] != ''
                                                     ? questions &&
                                                     questions[quesIndex] && questions[quesIndex][`ans_hin_${char}`]
                                                     : questions &&
                                                     questions[quesIndex] && questions[quesIndex][`ans_eng_${char}`],
                                                }} contentWidth={windowWidth - 60} {...htmlConfig} baseFontStyle={{lineHeight: 30}} tagsStyles={classesStyles} /> */}
                                                <AutoHeightWebView
                                                    style={{ width: windowWidth - 80,opacity: 0.99,minHeight: 1 }}
                                                    files={[{
                                                        href: 'cssfileaddress',
                                                        type: 'text/css',
                                                        rel: 'stylesheet'
                                                    }]}
                                                    customStyle={`* {
                                                            align-items: center;
                                                            padding: 0px;
                                                            margin: 0px;
                                                    }table {
                                                        max-width: ${windowWidth - 80};
                                                        font-size: 10px;
                                                      } img {
                                                        max-width: ${windowWidth - 80};
                                                      }`}
                                                    files={[{
                                                        href: 'cssfileaddress',
                                                        type: 'text/css',
                                                        rel: 'stylesheet'
                                                    }]}
                                                    source={{  html: questions &&
                                                        questions[quesIndex] &&
                                                        questions[quesIndex][`ans_hin_${char}`] != ''
                                                        ? questions &&
                                                        questions[quesIndex] && questions[quesIndex][`ans_hin_${char}`]
                                                        : questions &&
                                                        questions[quesIndex] && questions[quesIndex][`ans_eng_${char}`], }}
                                                />
                                                { i.toString() == rightAns
                                                    ?
                                                    <AntIcon name='check' size={20} color='green' style={{ right: 10,position:'absolute', top:20 }} />
                                                    :
                                                    answer == i.toString() ?
                                                        <AntIcon name='close' size={20} color='red' style={{ right: 10,position:'absolute', top:20 }} /> : null}
                                            </View>
                                        );
                                    })}

                            <View style={styles.solutionContainer}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold',marginLeft:10 }}>Solution: {parseInt(rightAns, 10) + 1}</Text>
                                {solutionEng == '' && solutionHindi == '' ?
                                <AutoHeightWebView
                                style={{ width: windowWidth - 50,opacity: 0.99,minHeight: 1 }}
                                files={[{
                                    href: 'cssfileaddress',
                                    type: 'text/css',
                                    rel: 'stylesheet'
                                }]}
                                customStyle={`* {
                                        font-family: 'Times New Roman';
                                        // align-items: center;
                                        // padding: 0px;
                                        // margin: 0px;
                                }table {
                                    max-width: ${windowWidth - 50};
                                    font-size: 10px;
                                  } img {
                                    max-width: ${windowWidth - 50};
                                  }`}
                                source={{  html: `<div></div>` }}
                            />   
                            :
                                <View style={{ marginTop: 20,marginBottom:60,width:'95%',alignSelf:'center' }}>
                                    {langChange ?
                                        // <HTML source={{ html: solutionEng ? solutionEng : solutionHindi }} contentWidth={windowWidth - 30} {...htmlConfig} baseFontStyle={{lineHeight: 30}} tagsStyles={classesStyles} />
                                        <AutoHeightWebView
                                                    style={{ width: windowWidth - 20,opacity: 0.99,minHeight: 1 }}
                                                    files={[{
                                                        href: 'cssfileaddress',
                                                        type: 'text/css',
                                                        rel: 'stylesheet'
                                                    }]}n 
                                                    customStyle={`* {
                                                            font-family: 'Times New Roman';
                                                    } table {
                                                        max-width: ${windowWidth - 50};
                                                        font-size: 10px;
                                                      } img {
                                                        max-width: ${windowWidth - 50};
                                                      }`}
                                                    source={{  html: solutionEng ? solutionEng : solutionHindi }}
                                                />
                                        :
                                        // <HTML source={{ html: solutionHindi ? solutionHindi : solutionEng }} contentWidth={windowWidth - 30} {...htmlConfig} baseFontStyle={{lineHeight: 30}} tagsStyles={classesStyles} />
                                        <AutoHeightWebView
                                                    style={{ width: windowWidth - 20,opacity: 0.99,minHeight: 1 }}
                                                    files={[{
                                                        href: 'cssfileaddress',
                                                        type: 'text/css',
                                                        rel: 'stylesheet'
                                                    }]}
                                                    customStyle={`* {
                                                            // align-items: center;
                                                            // padding: 0px;
                                                            // margin: 0px;
                                                            font-family: 'Times New Roman';
                                                    }table {
                                                        max-width: ${windowWidth - 50};
                                                        font-size: 10px;
                                                      } img {
                                                        max-width: ${windowWidth - 50};
                                                      }`}
                                                    source={{  html: solutionHindi ? solutionHindi : solutionEng }}
                                                />
                                    }
                                </View>}
                            </View>
                        {/* </TouchableOpacity> */}
                    </ScrollView>
                    </GestureRecognizer>
            )}
            </View>

            <View style={{ width: '100%', flexDirection: 'row', height: 50, bottom: 0 }}>
                <TouchableOpacity
                    style={{
                        width: '50%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'grey',
                    }} onPress={() => onPrevious()}>
                    <Icon name={'arrow-long-left'} size={17} color={'#fff'} />
                    <Text style={{ marginLeft: 10, color: '#fff', fontSize: 15 }}>
                        Previous
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        width: '50%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'grey',
                        marginLeft: 2
                    }} onPress={() => onNext()}>
                    <Text style={{ marginRight: 10, color: '#fff', fontSize: 15 }}>
                        Next
                    </Text>
                    <Icon name={'arrow-long-right'} size={17} color={'#fff'} />
                </TouchableOpacity>
            </View>
            <Modal
                isVisible={showModal}
                animationType="fade"
                transparent={true}
                coverScreen={true}
                style={{ alignItems: 'center', }}
                onRequestClose={() => {
                    setShowModal(false)
                }}>
                <View style={{
                    width: '95%',
                    height: 230,
                    backgroundColor: '#fff',
                    justifyContent: 'flex-start'
                }}>
                    <TouchableOpacity
                        onPress={() => setShowModal(false)}
                        style={{ alignSelf: 'flex-end', padding: 10, bottom: 5 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>X</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, textAlign: 'center' }}>Report here...</Text>
                    <TextInput
                        value={message}
                        onChangeText={text => setMessage(text)}
                        multiline={true}
                        style={styles.modalTextInput} />
                    <TouchableOpacity
                        style={{
                            height: hp('5'),
                            backgroundColor: 'grey',
                            width: wp('30'),
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center', marginTop: 20
                        }} onPress={() => {
                            onReportQues(questions[quesIndex].id, reportOption, message);
                            setShowModal(false);
                            setTap(false);
                        }}>
                        <Text style={{ color: '#fff' }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    );
};

export default QuizSolution;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    listStyle: {
        height: 228,
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
        width: '60%',
    },
    headerText: {
        width: '100%',
        marginTop: 10,
        fontSize: 15,
        paddingLeft: 20,
        flexDirection: 'row',
    },
    options: {
        width: '95%',
        alignSelf: 'center',
        marginTop: 10,
        paddingLeft: 20,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: -1,
    },
    mainModalView: { backgroundColor: '#fff', borderRadius: 5, justifyContent: 'space-between', alignItems: 'center', height: '20%', width: '100%' },
    solutionContainer: {
        width: '100%',
        backgroundColor: '#fff',
        marginTop: 20,
        paddingVertical: 10,
        // paddingLeft: 20
    },
    modalTextInput: {
        width: '90%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'grey',
        height: 60,
        borderRadius: 10,
        marginTop: 10
    }
});
