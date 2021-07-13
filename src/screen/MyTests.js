import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import axiosClient from '../api/axios-client';
import Toast, {BaseToast} from 'react-native-toast-message';
import AutoHeightWebView from 'react-native-autoheight-webview';
import Modal from 'react-native-modalbox';

const windowWidth = Dimensions.get('window').width;

const MyTests = ({navigation, route}) => {

  const { userid, quiz_key } = route.params;  

  const [isLoading, setIsLoading] = useState(true);

  const timerRef = useRef(null);

  const [seconds, setSeconds] = useState();
  const [option, setOption] = useState([1, 2, 3]);
  const [select, setSelect] = useState();
  const [clock, setClock] = useState(10);
  const [AllQuestion, setAllQuestion] = useState([]);
  const [AllQuizData, setAllQuizData] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [quizTime, setQuizTime] = useState();
  const [questions, setQuestions] = useState([]);
  const [serials, setSerials] = useState([]);
  const [quesIndex, setQuesIndex] = useState(0);
  const [langChange, setLangChange] = useState(true);
  const [optionArr, setOptionArr] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [quesEng, setQuesEng] = useState(null);
  const [quesHin, setQuesHin] = useState(null);
  const [TotalQuestion, setTotalQuestion] = useState(null);

  const [submitModal, setSubmitModal] = useState(false);
  const [icons, setIcons] = useState([
    'clock-time-one',
    'clock-time-two',
    'clock-time-three',
    'clock-time-four',
    'clock-time-five',
    'clock-time-six',
    'clock-time-seven',
    'clock-time-eight',
    'clock-time-nine',
    'clock-time-ten',
    'clock-time-eleven',
    'clock-time-twelve',
  ]);

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const successIcon = require('../../assets/close.png');

  const toastConfig = {
      success: ({ text1, hide, ...rest }) => (
        <BaseToast
          {...rest}
          style={{ borderRadius:0, backgroundColor:'#2E8B57' }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          text1Style={{
            fontSize: 15,
          }}
          text1={text1}
          text2={null}
          trailingIcon={successIcon}
          onTrailingIconPress={hide}
        />
      ),
      error: ({ text1, hide, ...rest }) => (
          <BaseToast
            {...rest}
            style={{ borderRadius:0, backgroundColor:'#D42F2F' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
              fontSize: 15,
            }}
            text1={text1}
            text2={null}
            trailingIcon={successIcon}
            onTrailingIconPress={hide}
          />
        )
  };

  useEffect(() => {
    // playBackgroundSound();
    fetchQuizData();
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      setSeconds();
      setOption([1,2,3]);
      setSelect();
      setClock(10);
      setAllQuestion([]);
      setAllQuizData([]);
      setQuizData([]);
      setQuizTime();
      setQuestions([]);
      setSerials([]);
      setQuesIndex(0);
      setLangChange(true);
      setOptionArr([]);
      setAnswer(null);
      setQuesEng(null);
      setQuesHin(null);
      setTotalQuestion(null);
    };
  }, []);

  const playSound = () => {
    var sound1 = new Sound(
      'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/pew2.aac',
      '',
      (error, sound) => {
        if (error) {
          alert('error' + error.message);
          return;
        }
        sound1.play(() => {
          sound1.release();
          // playSound();
        });
      },
    );
  };

  const playBackgroundSound = () => {
    var sound2 = new Sound(
      '../../assets/music/musicHeaven3.mp3',
      '',
      (error, sound) => {
        if (error) {
          alert('error' + error.message);
          return;
        }
        sound2.play(() => {
          // sound2.release();
          playBackgroundSound();
        });
      },
    );
  };

  useEffect(() => {
      if (seconds > 0) {
        timerRef.current = setTimeout(() => setSeconds(seconds - 1), 1000);
        if (clock == 0) {
          setClock(10);
        } else {
          setClock(clock - 1);
        }
      } else {
        if(seconds == 0){
          // playSound();
          onNextQuestion();
          // onSaveQuestion();
          setSeconds(quizData.questiontime);
        }
      }
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }  
      };  
  }, [seconds]);

  const handleBackPress = () => {
    if (navigation.isFocused()) {
      // BackHandler.exitApp();
      return true;
    }
  };

  const fetchQuizData = () => {
    const formData = new FormData();
    formData.append('userid', userid);
    formData.append('quiz_key', quiz_key);
    axiosClient()
      .post('quizzes/practice', formData)
      .then(async res => {
        console.log('quizzes res', res.data);
        console.log('serial data from api', JSON.parse(serials).serials);
        //console.log('all res', res.data.data.questions);
        setIsLoading(false);
        if (res.data.Error == 0) {
          setAllQuestion(res.data.data.questions);
          setAllQuizData(res.data.data);

          const {
            quiz,
            questions,
            serials,
            LastActiveQuestion,
            timeremaining,
            totalQuestions,
          } = res.data.data;
          setQuizData(quiz);
          setSeconds(quiz.questiontime);
          setQuizTime(quiz.duration); //timeremaining ? timeremaining : 
          setQuestions(questions);
          setSerials(JSON.parse(serials).serials);
          setQuesIndex(
            LastActiveQuestion != null ? parseInt(LastActiveQuestion) : 0,
          );
          setOptionArr(
            parseInt(res.data.data.questions[quesIndex].no_of_ans, 10),
          );
          // //console.log('no of ans', res.data.data.questions[quesIndex].no_of_ans, parseInt(res.data.data.questions[quesIndex].no_of_ans, 10));

          setTotalQuestion(totalQuestions);

          setQuesEng(questions[quesIndex].question_eng == "" ? null : questions[quesIndex].question_eng)
          setQuesHin(questions[quesIndex].question_hin == "" ? null : questions[quesIndex].question_hin)
    
        } else {
          setQuizData([]);
          setQuestions([]);
          setSerials([]);

          Toast.show({
            text1: res.data.message,
            type: 'error',
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 0,
            bottomOffset: 40,
            leadingIcon: null,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        //console.log('quizzes error', err);
      });
  };

  // const questionChange = () => {
  //   if (serials && serials.length > 0) {
  //     let findThisQues = serials.findIndex((e) => e.s == quesIndex + 1);
  //     if (findThisQues == -1) {
  //       setAnswer(null)
  //     } else {
  //       const getClass = serials[findThisQues].GetClass
  //       const getAns = serials[findThisQues].awnsered;
  //       if (getClass == "has_answered") { setAnswer(parseInt(getAns)) }
  //       else { setAnswer(null) }
  //     }
  //   }
  // }

  const onNextQuestion = () => {
    //console.log('next ques index', quesIndex, select);
    if (quesIndex + 1 != questions.length) {
      setQuesEng(questions[quesIndex + 1].question_eng == "" ? null : questions[quesIndex + 1].question_eng)
      setQuesHin(questions[quesIndex + 1].question_hin == "" ? null : questions[quesIndex + 1].question_hin)
      setQuesIndex(quesIndex + 1);
      setOptionArr(
        parseInt(questions[quesIndex + 1].no_of_ans, 10),
      );
      setAnswer(null);
      setSelect(null);
    } else {
      //console.log('serials arr', serials);
      //console.log('submit quiz now in next');
      submitQuiz();
    }
  }

  const onSaveQuestion = (index) => {

    //console.log('serials', serials);
    
    if (serials && serials.length > 0) {
      const findThisQues = serials.findIndex((e) => e.s == quesIndex + 1);
      const newStr = {
        's': quesIndex + 1,
        'GetClass': 'has_answered',
        'awnsered': index.toString(),
        'time': (quizData.questiontime) - seconds
      }
      serials[findThisQues] = newStr;
      console.log('push data', newStr);
      setSerials(serials);
      //console.log('new str is', newStr, 'find index is', findThisQues);
    }

  }

  const submitQuiz = () => {
    setIsLoading(true);
    const stringified = JSON.stringify(serials);
    
    //console.log('serial data', stringified);

    const formData = new FormData();
    formData.append('userid', userid);
    formData.append('quiz_key', quiz_key);
    formData.append('serials', stringified);
    axiosClient()
      .post('quizzes/submit', formData)
      .then(async res => {
        console.log('submit quiz res', res.data, formData, serials);
        setIsLoading(false);
        if (res.data.Error == 0) {
          //console.log('quiz submitted successfully');
          navigation.navigate('Home');
        } else {
          Toast.show({
            text1: res.data.message,
            type: 'error',
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 0,
            bottomOffset: 40,
            leadingIcon: null,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        //console.log('submit quiz error', err);
      });

  }

  return (
    <View style={styles.Container}>
      <StatusBar backgroundColor={'#252C49'} barStyle={'light-content'} />

      {quizData == null || isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={{bottom: 10}}>
          <View style={[styles.barView]}>
            <LinearGradient
              style={{
                width: `${(seconds / quizData.questiontime) * 100}%`,
                height: 33,
                borderTopLeftRadius: 25,
                borderTopRightRadius: seconds != quizData.questiontime ? 5 : 25,
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: seconds != quizData.questiontime ? 5 : 25,
              }}
              colors={['#F9506F', '#D65FB5', '#BC6BEB']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            />
            <Text style={styles.timerText}>{seconds}</Text>
            <MaterialIcon
              name={icons[clock]}
              size={20}
              color="#A6ADCA"
              style={styles.clock}
            />
          </View>

          <View style={styles.quesView}>
            <Text style={styles.ques}>Question {quesIndex + 1}</Text>
            <Text style={styles.quesNo}>/{TotalQuestion}</Text>
          </View>
          <View style={styles.borderView}></View>
          
            <View style={styles.quizQues}>
                {(quesEng != null || quesHin != null) && (
                  <AutoHeightWebView
                    style={{
                      width: windowWidth - 50,
                      opacity: 0.99,
                      minHeight: 1,
                    }}
                    files={[
                      {
                        href: 'cssfileaddress',
                        type: 'text/css',
                        rel: 'stylesheet',
                      },
                    ]}
                    customStyle={`* {
                            align-items: center;
                            padding: 0px;
                            margin: 0px;
                    } body {
                      color: #fff;
                      font-size: 18px;
                      font-weight: bold;
                      font-family: GilroyMedium;
                    }
                    table {
                      max-width: ${windowWidth - 50};
                      font-size: 10px;
                    } img {
                      max-width: ${windowWidth - 50};
                    }`}
                    files={[
                      {
                        href: 'cssfileaddress',
                        type: 'text/css',
                        rel: 'stylesheet',
                      },
                    ]}
                    source={{
                      html:
                        langChange == true
                          ? quesEng
                            ? quesEng
                            : quesHin
                          : quesHin
                          ? quesHin
                          : quesEng,
                    }}
                  />
                )}
                </View>

          {langChange == true
            ? Array(optionArr)
                .fill()
                .map((val, i) => {
                  let char = String.fromCharCode(97 + i);
                  return (
                    <TouchableOpacity
                      onPress={()=> { setSelect(i); onSaveQuestion(i) }}
                      style={[styles.optionView,{borderColor: select == i ? '#fff' : '#21496C'}]}>
                      <Text style={styles.option}>{i + 1}. </Text>
                      {questions &&
                        questions[quesIndex] &&
                        questions[quesIndex].ans_eng_a != null && (
                          <AutoHeightWebView
                            style={{
                              width: windowWidth - 50,
                              opacity: 0.99,
                              minHeight: 1,
                            }}
                            files={[
                              {
                                href: 'cssfileaddress',
                                type: 'text/css',
                                rel: 'stylesheet',
                              },
                            ]}
                            customStyle={`* { align-items: center; padding: 0px; margin: 0px; } 
                                          table { max-width: ${windowWidth - 50}; font-size: 10px; } 
                                          body { color: #fff; margin-left: 10px; line-height: 50px; }                                          
                                          img { max-width: ${windowWidth - 50}; }`}
                            files={[{ href: 'cssfileaddress', type: 'text/css', rel: 'stylesheet',}]}
                            source={{
                              html:
                                questions &&
                                questions[quesIndex] &&
                                questions[quesIndex][`ans_eng_${char}`] != ''
                                  ? questions &&
                                    questions[quesIndex] &&
                                    questions[quesIndex][`ans_eng_${char}`]
                                  : questions &&
                                    questions[quesIndex] &&
                                    questions[quesIndex][`ans_hin_${char}`],
                            }}
                          />
                        )}
                        {select == i?<Icon name='check-circle' size={25} color='#0E7DEA' />
                        :<Icon name='radio-button-unchecked' size={25} color='#21496C' />}
                    </TouchableOpacity>
                  );
                })
            : Array(optionArr)
                .fill()
                .map((val, i) => {
                  let char = String.fromCharCode(97 + i);
                  return (
                    <TouchableOpacity
                    onPress={()=>setSelect(i)}
                    style={[styles.optionView,{borderColor: select == i ? '#fff' : '#21496C'}]}>
                      <Text style={styles.option}>{i + 1}. </Text>
                      {questions &&
                        questions[quesIndex] &&
                        questions[quesIndex].ans_eng_a != null && (
                          <AutoHeightWebView
                            style={{
                              width: windowWidth - 50,
                              opacity: 0.99,
                              minHeight: 1,
                            }}
                            files={[
                              {
                                href: 'cssfileaddress',
                                type: 'text/css',
                                rel: 'stylesheet',
                              },
                            ]}
                            customStyle={`* { align-items: center; padding: 0px; margin: 0px; } 
                                          table { max-width: ${windowWidth - 50}; font-size: 10px; } 
                                          body { color: #fff; margin-left: 10px; line-height: 50px; }                                          
                                          img { max-width: ${windowWidth - 50}; }`}
                            files={[
                              {
                                href: 'cssfileaddress',
                                type: 'text/css',
                                rel: 'stylesheet',
                              },
                            ]}
                            source={{
                              html:
                                questions &&
                                questions[quesIndex] &&
                                questions[quesIndex][`ans_hin_${char}`] != ''
                                  ? questions &&
                                    questions[quesIndex] &&
                                    questions[quesIndex][`ans_hin_${char}`]
                                  : questions &&
                                    questions[quesIndex] &&
                                    questions[quesIndex][`ans_eng_${char}`],
                            }}
                          />
                        )}
                        {select == i?<Icon name='check-circle' size={25} color='#0E7DEA' />
                        :<Icon name='radio-button-unchecked' size={25} color='#21496C' />}
                    </TouchableOpacity>
                  );
                })}

          <TouchableOpacity
            onPress={() => { onNextQuestion(); setSeconds(quizData.questiontime); } }
            style={styles.btnVIew}>
            <Text style={styles.button}>Next</Text>
          </TouchableOpacity>

          <Modal
              style={{width: '100%',top:5,height: 400,borderTopLeftRadius:10,borderTopRightRadius:10,backgroundColor:'#fff'}}
              swipeToClose={true}
              swipeArea={10}
              swipeThreshold={50}
              isOpen={submitModal}
              backdropOpacity={0.5}
              entry={'top'}
              backdropPressToClose={true}
              position={'center'}
              backdropColor={'#000'}
              coverScreen={true}
              backButtonClose={true}>
              <View style={{flex:1}}>
                  {/* <View style={{}}></View> */}
              </View>
          </Modal>

        </ScrollView>
      )}

      <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
    </View>
  );
};
export default MyTests;

const styles = StyleSheet.create({
  timerText: {color: '#fff', fontSize: 16, alignSelf: 'center', bottom: 28},
  clock: {alignSelf: 'flex-end', bottom: 48, right: 15, height: 20, width: 20},
  quesView: {
    width: '85%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  ques: {
    color: '#8C95BE',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'GilroyMedium',
  },
  quesNo: {color: '#8C95BE', fontSize: 16, fontFamily: 'GilroyMedium'},
  borderView: {
    width: '85%',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: '#8C95BE',
    height: 15,
    alignSelf: 'center',
    borderRadius: 1,
  },
  quizQues: {
    width: '85%',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  quiz: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'GilroyMedium',
  },
  option: {color: '#fff', fontSize: 15, fontFamily: 'SofiaProRegular'},
  button: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'GilroyMedium',
  },

  Container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#252C49',
  },
  headerView: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'ios' ? hp('4') : 0,
    alignItems: 'center',
    paddingHorizontal: 5,
    // borderWidth:1,
    height: 50,
    backgroundColor: '#C61D24',
  },
  textHead: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
    textTransform: 'uppercase',
  },
  barView: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
    // alignItems:'center',
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#424363',
    marginTop: 50,
    paddingHorizontal: 2,
  },
  barStyle: {
    // transform: [{ rotate: '270deg' }],
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#424363',
    marginTop: 50,
    backgroundColor: '#252C49',
  },
  optionView: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 10,
    borderWidth: 3,
    // borderColor: '#21496C',
    height: 55,
    borderRadius: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  btnVIew: {
    width: '35%',
    alignSelf: 'center',
    marginVertical: 30,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#107FEB',
  },

  containerBar: {
    width: '100%',
    height: 40,
    padding: 3,
    borderColor: '#FAA',
    borderWidth: 3,
    borderRadius: 30,
    marginTop: 20,
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
    height: 30,
    borderRadius: 15,
    backgroundColor: 'green',
  },
  label: {
    fontSize: 23,
    color: 'black',
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
  },
});
