import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
  BackHandler,
  TextInput,
  ToastAndroid,
} from 'react-native';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Entypo';
import axiosClient from '../api/axios-client';
import Loader from '../components/Loader';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import CountDown from 'react-native-countdown-component';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Modal from 'react-native-modal'
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import { MyContext } from '../components/UseContext';
import HTML from "react-native-render-html";
import { IGNORED_TAGS, alterNode, makeTableRenderer } from 'react-native-render-html-table-bridge';
import WebView from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview';
import GestureRecognizer from 'react-native-swipe-gestures';

const windowWidth = Dimensions.get('window').width;

const QuizStart = ({ navigation, route }) => {
  const { userid, quizKey } = route.params;

  const { onReportQues } = useContext(MyContext)

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState([]);
  const [quizTime, setQuizTime] = useState();

  const [questions, setQuestions] = useState([]);
  const [serials, setSerials] = useState([]);
  const [quesIndex, setQuesIndex] = useState(0);
  const [langChange, setLangChange] = useState(true);

  const [optionArr, setOptionArr] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [rightAns, setRightAns] = useState(null);
  const [quesAnsDataArr, setQuesAnsDataArr] = useState([]);
  const [isRunning, setIsRunning] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [pauseModal, showPauseModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')
  const [tap, setTap] = useState(false)
  const [reportOption, setReportOption] = useState('')
  const [time, setTime] = useState()
  const [passageEng, setPassageEng] = useState(null)
  const [passageHin, setPassageHin] = useState(null)
  const [quesEng, setQuesEng] = useState(null)
  const [quesHin, setQuesHin] = useState(null)


  let flatListRef = React.createRef();
  let circularProgress = useRef();

  const configHTML = {
    WebViewComponent: WebView,
    tableStyleSpecs: {
      cellSpacingEm: 0.1,
      fitContainerWidth: true,
      fontSizePx: 10,
      width: 100
    }
  };

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
    const handle = BackHandler.addEventListener('hardwareBackPress', BackPress)

    return () => handle.remove();
  }, []);

  useEffect(() => {
    questionChange();
    if (questions.length > 0) {
      setPassageEng(questions[quesIndex].passage_english)
      setPassageHin(questions[quesIndex].passage_hindi)
      setQuesEng(questions[quesIndex].question_eng == "" ? null : questions[quesIndex].question_eng)
      setQuesHin(questions[quesIndex].question_hin == "" ? null : questions[quesIndex].question_hin)
    }
  }, [quesIndex || questions])

  const BackPress = () => {
    setIsRunning(false)
    showPauseModal(true)
    return true
  }

  const ReporValues = [
    { value: 'wrong_question', label: ' Wrong Question' },
    { value: 'wrong_answer', label: 'Wrong Answer' },
    { value: 'formatting_issue', label: 'Format Issue' },
    { value: 'no_solution', label: 'No Solution' },
    { value: 'wrong_translation', label: 'Wrong Translation' },
    { value: 'others', label: 'Others' }
  ]

  const onSelectReportOption = (value) => {
    setReportOption(value)
    // setTap(false)
    setShowModal(true)
  }

  const getQuizData = () => {
    if (userid && quizKey) {
      const formdata = new FormData();
      formdata.append('userid', userid);
      formdata.append('quiz_key', quizKey);
      axiosClient()
        .post('quizzes/practice', formdata)
        .then((res) => {
          //console.log('quiz start response', res);
          if (res.data.Error === 0) {
            const { quiz, questions, serials, LastActiveQuestion, timeremaining } = res.data.data
            // //console.log('quiz start time', timeremaining ? timeremaining : quiz.duration);
            // //console.log('serials in quiz', serials, JSON.stringify(serials).serials);

            setQuizData(quiz);
            setQuizTime(timeremaining ? timeremaining : quiz.duration);
            setQuestions(questions);
            setSerials(JSON.parse(serials)); //.serials
            setQuesIndex(LastActiveQuestion != null ? parseInt(LastActiveQuestion) : 0)
            setOptionArr(
              parseInt(res.data.data.questions[quesIndex].no_of_ans, 10),
            );
          } else {
            setQuizData([]);
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
    else {
      setIsVisible(true)
    }
  }

  const onSaveQuestion = (index) => {
    if (serials && serials.length > 0) {
      const findThisQues = serials.findIndex((e) => e.s == quesIndex + 1);
      const newStr = {
        's': quesIndex + 1,
        'GetClass': 'has_answered',
        'awnsered': index.toString(),
        'time': 0
      }
      serials[findThisQues] = newStr;
      setSerials(serials);
      // //console.log('on save question', serials);
    }
  }

  const SubmitQuiz = () => {

    const stringified = JSON.stringify(serials)
    if (userid && quizKey) {
      const fd = new FormData();
      fd.append('userid', userid);
      fd.append('quiz_key', quizKey);
      fd.append('serials', stringified);
      axiosClient().post('quizzes/submit', fd)
        .then((res) => {
          if (res.data.Error == 0) {
            navigation.navigate('QuizResult', { quizKey, key: 'QuizSection' })
          }
          //console.log(res)
        }).catch((err) => {
          //console.log(err)
        })
    }
  }

  const questionChange = () => {
    if (serials && serials.length > 0) {
      let findThisQues = serials.findIndex((e) => e.s == quesIndex + 1);
      if (findThisQues == -1) {
        setAnswer(null)
      } else {
        const getClass = serials[findThisQues].GetClass
        const getAns = serials[findThisQues].awnsered;
        if (getClass == "has_answered") { setAnswer(parseInt(getAns)) }
        else {
          setAnswer(null)
        }
      }
    }
  }

  const onPause = () => {
    //console.log('time remianing', time, JSON.stringify(serials));
    setIsRunning(false)
    const stringified = JSON.stringify(serials);
    let timeReamaining = time / 60
    const fd = new FormData();
    fd.append('userid', userid);
    fd.append('quiz_key', quizKey);
    fd.append('serials', stringified);
    fd.append('lastactivequestion', quesIndex.toString());
    fd.append('timeremaining', timeReamaining)
    axiosClient().post('quizzes/save', fd)
      .then((res) => {
        //console.log(res)
        if (res.data.Error == 0) {
          navigation.navigate('QuizSection')
        }
        showPauseModal(false);
        ToastAndroid.show(res.data.message, ToastAndroid.SHORT)
      }).catch((err) => {
        //console.log(err)
      })
  }


  const onChangeTime = (time, allTime) => {
    if (time == (allTime - 300)) {
      // //console.log('Time Matched!',time,allTime-300);
      Alert.alert('Your time is almost done!');
    }
  }

  const changeLang = () => {
    setLangChange(!langChange)
  }

  const onFinishQuizTime = () => {
    // console.log('quiz time finish');
    SubmitQuiz();
  }

  return (
    <>
      <View style={styles.mainContainer}>
        {/* <Header headerText={'Quiz'} onPress={() => navigation.goBack()} /> */}
        <View style={{
          width: '100%',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          backgroundColor: '#fff',
          paddingVertical: 7,
          marginTop: 7,
          alignItems: 'center'
        }}>
          <TouchableOpacity onPress={() => { setIsRunning(false); showPauseModal(true) }}>
            {quizTime ? <AnimatedCircularProgress
              size={30}
              width={3}
              fill={time}
              style={{ marginLeft: 10 }}
              ref={circularProgress}
              duration={(Number(quizTime)) * 60}
              tintColor="#D2D3D5"
              backgroundColor="#00AFEF"
              onChange={(value) => console.log('progress value', value)}>
              {
                (fill) =>
                (<><FontistoIcon name="pause" size={10} fill color="#BDBFC1" />
                </>)
              }
            </AnimatedCircularProgress> : null}
          </TouchableOpacity>
          {/* <View style={{ marginLeft: 10, width: '55%' }}>
            {quizTime ? <CountDown
              until={(Number(quizTime)) * 60}
              onFinish={() => onFinishQuizTime((Number(quizTime)) * 60)}
              size={13}
              onChange={(time) => { setTime(time) }}
              style={{ backgroundColor: '#fff', alignSelf: 'flex-start' }}
              digitStyle={{ backgroundColor: '#fff', width: 20 }}
              digitTxtStyle={{ color: '#000' }}
              timeToShow={['H', 'M', 'S']}
              timeLabels={{ m: '', s: '' }}
              separatorStyle={{ color: '#000' }}
              showSeparator
              running={isRunning}
            // showNewTime={(time) => showMainTime(time)}
            /> : null}
            <Text
              numberOfLines={1}
              style={{
                fontWeight: 'bold',
                color: '#000',
                fontSize: 12,
              }}>
              {quizData && quizData.name}
            </Text>
          </View> */}

          <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => changeLang()}>
            {langChange ? <Image source={require('../../assets/english.png')} style={{ width: 30, height: 30 }} resizeMode='center' /> : <Image source={require('../../assets/hindi.png')} style={{ width: 30, height: 30 }} resizeMode='center' />}
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setIsVisible(true)}>
            <Text>Submit</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <Loader isLoading={loading} />
        ) : (
          <GestureRecognizer
              onSwipe={(gestureState) => { console.log('swipe only') }}
              onSwipeLeft={(state) => { 
                if(quesIndex + 1 != questions.length){ onNext() }
              }}
              onSwipeRight={(state) => { onPrevious() }}
              // onSwipeUp={(gestureState) => { console.log('swipe up') }}
              // onSwipeDown={(gestureState) => { console.log('swipe down') }}
              config={config}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 10 }}>
            {serials && serials.length > 0 ? (
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
                  data={serials}
                  showsHorizontalScrollIndicator={false}
                  initialNumToRender={1}
                  renderItem={({ item, index }) => {
                    // console.log('serials', serials, questions[index].negativemarks,questions[index].marks);
                    return (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }} key={index}>
                        <TouchableOpacity
                          key={() => setQuesIndex(index)}
                          style={{
                            padding: 10,
                            flexDirection: 'row',
                            alignSelf: 'center',
                          }}
                          onPress={
                            () => setQuesIndex(index)
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
                              backgroundColor: //quesIndex == index ? '#4169E1' :
                                             item.GetClass == 'has_not_visited' || item.GetClass == 'has_not_visited solution_active'?
                                            '#E7E7E7'
                                            : item.GetClass == 'has_not_answered' ? 'darkgrey' : '#71D78B',
                                // quesIndex == index ? '#0B84FE' : '#fff',
                              borderWidth: 1,
                              borderColor: //quesIndex == index ? '#4169E1' : 
                                            item.GetClass == 'has_not_visited' || item.GetClass == 'has_not_visited solution_active'?
                                            'grey': item.GetClass == 'has_not_answered' ? '#fff' : '#71D78B',
                                // quesIndex == index ? '#0B84FE' : 'grey',
                              color: //quesIndex == index ? '#fff' : 
                                          item.GetClass == 'has_not_visited' || item.GetClass == 'has_not_visited solution_active'?
                                          'grey' : item.GetClass == 'has_not_answered' ? '#fff' : '#fff',
                                  //'grey',//quesIndex == index ? '#fff' : 'grey',
                              fontSize: 12,
                            }}>
                            {index + 1}
                          </Text>
                        </TouchableOpacity>
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
                <View style={{ width:'100%',flexDirection: 'row',alignItems:'flex-start' }}>
                  <View style={{width:'70%',flexDirection:'row',alignItems:'flex-start'}}>
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
                      marginBottom: 10,
                    }}>
                    {quesIndex + 1}
                  </Text>
                  <Text style={{ color: 'green', fontWeight: 'bold', paddingHorizontal: 5,marginLeft:10,marginTop:5 }}>
                      +{questions[quesIndex].marks}
                    </Text>
                    <Text style={{ color: 'red', fontWeight: 'bold', paddingHorizontal: 5, marginLeft: 5,marginTop:5 }}>
                      -{questions[quesIndex].negativemarks}
                    </Text>
                  </View>
                  <View style={{width:'30%',justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>
                    <TouchableOpacity onPress={() => setTap(!tap)}
                    style={{ marginLeft: 15 }}>
                    <Image
                      source={require('../../assets/report.png')}
                      style={{ height: 23, width: 23 }}
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                  </View>
                </View>
                {(passageEng != null || passageHin != null)
                  &&
                //   <HTML source={{
                //     html: langChange == true
                //       ? passageEng ?
                //         passageEng :
                //         passageHin
                //       : passageHin ?
                //         passageHin :
                //         passageEng
                // }} contentWidth={windowWidth - 30} {...htmlConfig} />
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
                    source={{ html: langChange == true
                            ? passageEng ?
                              passageEng :
                              passageHin
                            : passageHin ?
                              passageHin :
                              passageEng }}
                  />
                }
                {(quesEng != null || quesHin != null) &&
                // <HTML source={{
                //     html: langChange == true
                //       ? quesEng ?
                //         quesEng :
                //         quesHin
                //       : quesHin ?
                //         quesHin :
                //         quesEng
                // }} contentWidth={windowWidth - 30} {...htmlConfig} />
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
                    source={{ html: langChange == true
                            ? quesEng ?
                              quesEng :
                              quesHin
                            : quesHin ?
                              quesHin :
                              quesEng }}
                  />
                }
              </View>
              {tap &&
                <View style={{
                  backgroundColor: '#fff',
                  height: hp('32'),
                  width: wp('50'),
                  position: 'absolute',
                  elevation: 10,
                  right: 20,
                  top: 55,
                  zIndex: 99,
                  alignSelf: 'flex-end'
                }}>
                  {ReporValues.map((item, i) => (
                    <TouchableOpacity onPress={() => onSelectReportOption(item.value)} style={{ padding: 10 }}>
                      <Text>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>}
            </View>



            {langChange == true
              ? Array(optionArr)
                .fill()
                .map((val, i) => {
                  let char = String.fromCharCode(97 + i);
                  return (
                    <TouchableOpacity
                      onPress={() => { setAnswer(i); onSaveQuestion(i); setTap(false) }} //onSaveQuestion(i)
                      // disabled={answer != null || tap}
                      style={{
                        ...styles.options,
                        backgroundColor:
                          answer == null
                            ? '#fff'
                            : answer == i
                              ? '#D7E9DB'
                              : '#fff',
                        borderWidth: 1,
                        borderColor:
                          answer == null
                            ? '#fff'
                            : answer == i
                              ? 'green'
                              : '#fff',
                      }}>
                      <Text>{i + 1}. </Text>
                      {questions && questions[quesIndex] && questions[quesIndex].ans_eng_a != null &&
                      // <HTML source={{
                      //     html:
                      //     questions &&
                      //       questions[quesIndex] &&
                      //       questions[quesIndex][`ans_eng_${char}`] != ''
                      //       ? questions &&
                      //       questions[quesIndex] && questions[quesIndex][`ans_eng_${char}`]
                      //       : questions &&
                      //       questions[quesIndex] && questions[quesIndex][`ans_hin_${char}`],
                      // }} contentWidth={windowWidth - 50} {...htmlConfig} />
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
                        source={{ html: questions &&
                              questions[quesIndex] &&
                              questions[quesIndex][`ans_eng_${char}`] != ''
                              ? questions &&
                              questions[quesIndex] && questions[quesIndex][`ans_eng_${char}`]
                              : questions &&
                              questions[quesIndex] && questions[quesIndex][`ans_hin_${char}`], }}
                      />
                    }
                    </TouchableOpacity>
                  );
                })
              : Array(optionArr)
                .fill()
                .map((val, i) => {
                  let char = String.fromCharCode(97 + i);
                  return (
                    <TouchableOpacity
                      onPress={() => { setAnswer(i); onSaveQuestion(i); setTap(false) }}
                      // disabled={answer != null}
                      style={{
                        ...styles.options,
                        backgroundColor:
                          answer == null
                            ? '#fff'
                            : answer == i
                              ? '#D7E9DB'
                              : '#fff',
                        borderWidth: 1,
                        borderColor:
                          answer == null
                            ? '#fff'
                            : answer == i
                              ? 'green'
                              : '#fff',
                      }}>
                      <Text>{i + 1}. </Text>
                      {questions && questions[quesIndex] && questions[quesIndex].ans_eng_a != null &&
                      // <HTML source={{
                      //     html: questions &&
                      //     questions[quesIndex] &&
                      //     questions[quesIndex][`ans_hin_${char}`] != ''
                      //     ? questions &&
                      //     questions[quesIndex] && questions[quesIndex][`ans_hin_${char}`]
                      //     : questions &&
                      //     questions[quesIndex] && questions[quesIndex][`ans_eng_${char}`],
                      // }} contentWidth={windowWidth - 50} {...htmlConfig} />
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
                        source={{ html: questions &&
                              questions[quesIndex] &&
                              questions[quesIndex][`ans_hin_${char}`] != ''
                              ? questions &&
                              questions[quesIndex] && questions[quesIndex][`ans_hin_${char}`]
                              : questions &&
                              questions[quesIndex] && questions[quesIndex][`ans_eng_${char}`], }}
                      />}
                    </TouchableOpacity>
                  );
                })}
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

      <Modal isVisible={isVisible}
        animationType="slide"
        transparent={true}>
        <View style={styles.mainModalView}>
          <Text style={{
            paddingTop: 20,
            paddingHorizontal: 20,
            textAlign: 'center',
            fontSize: 16
          }}>Are you sure you want to submit the Quiz?</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity activeOpacity={0.5} style={{
              height: 40,
              width: 80,
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10
            }} onPress={() => { setIsVisible(false); SubmitQuiz() }}>
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
            }} onPress={() => setIsVisible(false)}>
              <Text>No</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 20 }}></View>
        </View>
      </Modal>
      <Modal isVisible={pauseModal}
        animationType="slide"
        transparent={true}>
        <View style={styles.mainModalView}>
          <Text style={{
            paddingTop: 20,
            paddingHorizontal: 20,
            textAlign: 'center',
            fontSize: 16
          }}>Are you sure you want to pause the Quiz?</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity activeOpacity={0.5} style={{
              height: 40,
              width: 80,
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10
            }} onPress={() => { onPause() }}>
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
            }} onPress={() => { setIsRunning(true); showPauseModal(false) }}>
              <Text>No</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 20 }}></View>
        </View>
      </Modal>
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

export default QuizStart;

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
