import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
// import { Overlay } from 'react-native-elements';
import {useContext} from 'react';
import {MyContext} from '../components/UseContext';
import {ToastAndroid} from 'react-native';
import axiosClient from '../api/axios-client';
import Loader from '../components/Loader';
import HTML from 'react-native-render-html';
import {
  IGNORED_TAGS,
  alterNode,
  makeTableRenderer,
} from 'react-native-render-html-table-bridge';
import WebView from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview';
import FontIcon from 'react-native-vector-icons/FontAwesome';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ViewSavedQuestion = ({navigation, route}) => {
  const {id, i} = route.params;
  const {onReportQues, userId, langChange, setLangChange} = useContext(
    MyContext,
  );
  const [item, setItem] = useState({});
  const [answer, setAnswer] = useState(null);
  const [tap, setTap] = useState(false);
  const [reportOption, setReportOption] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [bookMark, setBookMark] = useState(true);
  const [loader, setLoader] = useState(true);
  const [num, setNum] = useState();
  let [rightAns, setRightAns] = useState();

  const ReporValues = [
    {value: 'wrong_question', label: 'Wrong Question'},
    {value: 'wrong_answer', label: 'Wrong Answer'},
    {value: 'formatting_issue', label: 'Format Issue'},
    {value: 'no_solution', label: 'No Solution'},
    {value: 'wrong_translation', label: 'Wrong Translation'},
    {value: 'others', label: 'Others'},
  ];

  const configHTML = {
    WebViewComponent: WebView,
    tableStyleSpecs: {
      cellSpacingEm: 0.1,
      fitContainerWidth: true,
      fontSizePx: 10,
      width: 100,
    },
  };

  const classesStyles = {
    sub: {fontSize: 9, lineHeight: 37},
    sup: {fontSize: 10, lineHeight: 18},
  };

  const renderers = {
    table: makeTableRenderer(configHTML),
  };

  const htmlConfig = {
    alterNode,
    renderers,
    ignoredTags: IGNORED_TAGS,
  };

  const onSelectReportOption = (value) => {
    setReportOption(value);
    setTap(false);
    setShowModal(true);
  };

  useEffect(() => {
    viewSavedQues();
  }, []);

  const viewSavedQues = () => {
    setLoader(true);
    const fd = new FormData();
    fd.append('userid', userId);
    fd.append('questionid', id);
    axiosClient()
      .post('questions/viewSavedQuestions', fd)
      .then((res) => {
        if (res.data.Error === 0) {
          setItem(res.data.data[0]);
          const {no_of_ans, right_ans} = res.data.data[0];
          //console.log(no_of_ans, right_ans, '123');
          setNum(parseInt(no_of_ans), 10);
          setRightAns(parseInt(right_ans, 10));
        }
        setLoader(false);
        //console.log(res, 'res');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onBookMarkQues = (questionid) => {
    // setIsLoading(true);
    if (userId !== null && questionid !== null) {
      const formData = new FormData();
      formData.append('userid', userId);
      formData.append('questionid', questionid);
      //console.log('question bookmark response', userId, questionid);
      axiosClient()
        .post('questions/bookmark', formData)
        .then((res) => {
          // setIsLoading(false);
          if (res.data.Error == 0 && res.data.message == 'Bookmark Added') {
            setBookMark(true);
          } else {
            setBookMark(false);
            navigation.goBack();
          }
          ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
        })
        .catch((err) => {
          ToastAndroid.show(err, ToastAndroid.SHORT);
          console.log('question bookmark error', err);
        });
    }
  };

  return (
    <View
      onPress={() => setTap(false)}
      style={{flex: 1, backgroundColor: '#F9F5F2'}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Header
          headerText={'Saved Question'}
          onPress={() => {
            navigation.goBack();
            return true;
          }}
        />
        <TouchableOpacity
          style={styles.subContainer}
          onPress={() => setLangChange(!langChange)}>
          {langChange ? (
            <Image
              source={require('../../assets/english.png')}
              style={{width: 30, height: 30}}
              resizeMode="center"
            />
          ) : (
            <Image
              source={require('../../assets/hindi.png')}
              style={{width: 30, height: 30}}
              resizeMode="center"
            />
          )}
        </TouchableOpacity>
      </View>
      {loader ? (
        <Loader isLoading={loader} />
      ) : (
        <View style={{flex: 1}}>
          <ScrollView style={{flex: 1}}>
            <View style={styles.questContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '95%',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    width: '82%',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={styles.questIndex}>
                    <Text style={{color: '#fff', fontSize: 16}}>{i + 1}</Text>
                  </View>

                  <Text style={styles.positive}>+{item.marks}</Text>
                  <Text style={styles.negetive}>-{item.negativemarks}</Text>
                </View>
                <TouchableOpacity onPress={() => onBookMarkQues(item.id)}>
                  {bookMark ? (
                    <FontIcon name="bookmark" size={22} fill color="grey" />
                  ) : (
                    <FontIcon name="bookmark-o" size={22} color="#000" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setTap(!tap)}
                  style={{marginLeft: 15}}>
                  <Image
                    source={require('../../assets/04.png')}
                    style={{height: 23, width: 23}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.quest}>
                {(item.passage_english != null ||
                  item.passage_hindi != null) && (
                  // <HTML source={{
                  //     html: langChange == true
                  //         ? item.passage_english ?
                  //             item.passage_english :
                  //             item.passage_hindi
                  //         : item.passage_hindi ?
                  //             item.passage_hindi :
                  //             item.passage_english
                  // }} contentWidth={windowWidth - 30}
                  // containerStyle={{marginBottom: 20}} {...htmlConfig} baseFontStyle={{lineHeight: 30}} tagsStyles={classesStyles} />
                  <AutoHeightWebView
                    style={{width: windowWidth - 40,opacity: 0.99,minHeight: 1}}
                    files={[
                      {
                        href: 'cssfileaddress',
                        type: 'text/css',
                        rel: 'stylesheet',
                      },
                    ]}
                    customStyle={`
                                        * {
                                            font-family: 'Times New Roman';
                                        }
                                        table {
                                            max-width: ${windowWidth - 40};
                                            font-size: 10px;
                                        }
                                        img {
                                            max-width: ${windowWidth - 40};
                                        }`}
                    source={{
                      html:
                        langChange == true
                          ? item.passage_english
                            ? item.passage_english
                            : item.passage_hindi
                          : item.passage_hindi
                          ? item.passage_hindi
                          : item.passage_english,
                    }}
                  />
                )}
                {/* <HTML source={{
                                        html: langChange == true ?
                                        item.question_eng ?
                                            item.question_eng
                                            : item.question_hin
                                        :
                                        item.question_hin
                                            ? item.question_hin
                                            : item.question_eng
                                    }} contentWidth={windowWidth - 30} {...htmlConfig} baseFontStyle={{lineHeight: 30}} tagsStyles={classesStyles} /> */}
                <AutoHeightWebView
                  style={{width: windowWidth - 40,opacity: 0.99,minHeight: 1}}
                  files={[
                    {
                      href: 'cssfileaddress',
                      type: 'text/css',
                      rel: 'stylesheet',
                    },
                  ]}
                  customStyle={`
                                        * {
                                            font-family: 'Times New Roman';
                                        }
                                        table {
                                            max-width: ${windowWidth - 40};
                                            font-size: 10px;
                                        }
                                        img {
                                            max-width: ${windowWidth - 40};
                                        }`}
                  source={{
                    html:
                      langChange == true
                        ? item.question_eng
                          ? item.question_eng
                          : item.question_hin
                        : item.question_hin
                        ? item.question_hin
                        : item.question_eng,
                  }}
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
                    top: 55,
                    zIndex: 99,
                    alignSelf: 'flex-end',
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
            {item.type == 'Single'
              ? langChange == true
                ? Array(num)
                    .fill()
                    .map((val, i) => {
                      let char = String.fromCharCode(97 + i);
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => {
                            setAnswer(i);
                            setTap(false);
                          }}
                          disabled={answer != null || tap}
                          style={{
                            ...styles.options,
                            backgroundColor:
                              answer == null
                                ? '#fff'
                                : i == rightAns
                                ? '#D7E9DB'
                                : answer == i
                                ? '#F3DDE0'
                                : '#fff',
                          }}>
                          {/* <View style={answer == i + 1 ? styles.selectRadioCircle : styles.radioCircle}> */}
                          <View
                            style={{
                              width: 30,
                              height: 30,
                              borderWidth: 1.5,
                              borderRadius: 100,
                              borderColor: 'grey',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text style={{fontWeight: 'bold'}}>{i + 1}</Text>
                          </View>
                          {/* </View> */}
                          {/* <HTML source={{ html: item[`ans_eng_${char}`] !== "" ? item[`ans_eng_${char}`] : item[`ans_hin_${char}`] }} contentWidth={windowWidth - 60} {...htmlConfig} baseFontStyle={{lineHeight: 30}} tagsStyles={classesStyles} /> */}
                          <AutoHeightWebView
                            style={{
                              width: windowWidth - 80,
                              marginTop: 5,
                              marginLeft: 7,opacity: 0.99,minHeight: 1
                            }}
                            files={[
                              {
                                href: 'cssfileaddress',
                                type: 'text/css',
                                rel: 'stylesheet',
                              },
                            ]}
                            customStyle={`
                                                * {
                                                    font-family: 'Times New Roman';
                                                }
                                                table {
                                                    max-width: ${windowWidth - 80};
                                                    font-size: 10px;
                                                } img {
                                                    max-width: ${windowWidth - 80};
                                                }`}
                            source={{
                              html:
                                item[`ans_eng_${char}`] !== ''
                                  ? item[`ans_eng_${char}`]
                                  : item[`ans_hin_${char}`],
                            }}
                          />
                          {answer == null ? null : i == rightAns ? (
                            <AntIcon
                              name="check"
                              size={20}
                              color="green"
                              style={{right: 15, position: 'absolute', top: 12}}
                            />
                          ) : answer == i ? (
                            <AntIcon
                              name="close"
                              size={20}
                              color="red"
                              style={{right: 15, position: 'absolute', top: 12}}
                            />
                          ) : null}
                        </TouchableOpacity>
                      );
                    })
                : Array(num)
                    .fill()
                    .map((val, i) => {
                      let char = String.fromCharCode(97 + i);
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => {
                            setAnswer(i);
                            setTap(false);
                          }}
                          disabled={answer != null}
                          style={{
                            ...styles.options,
                            backgroundColor:
                              answer == null
                                ? '#fff'
                                : i == rightAns
                                ? '#D7E9DB'
                                : answer == i
                                ? '#F3DDE0'
                                : '#fff',
                          }}>
                          <View
                            style={{
                              width: 30,
                              height: 30,
                              borderWidth: 1.5,
                              borderRadius: 100,
                              borderColor: 'grey',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text style={{fontWeight: 'bold'}}>{i + 1}</Text>
                          </View>
                          <View style={{width: wp('78')}}>
                            {/* <HTML source={{ html: item[`ans_hin_${char}`] != "" ? item[`ans_hin_${char}`] : item[`ans_eng_${char}`] }} contentWidth={windowWidth - 50} {...htmlConfig} baseFontStyle={{lineHeight: 30}} tagsStyles={classesStyles} /> */}
                            <AutoHeightWebView
                              style={{
                                width: windowWidth - 80,
                                marginTop: 5,
                                marginLeft: 7,opacity: 0.99,minHeight: 1
                              }}
                              files={[
                                {
                                  href: 'cssfileaddress',
                                  type: 'text/css',
                                  rel: 'stylesheet',
                                },
                              ]}
                              customStyle={`
                                                    * {
                                                        font-family: 'Times New Roman';
                                                    }
                                                    table {
                                                        max-width: ${
                                                          windowWidth - 80
                                                        };
                                                        font-size: 10px;
                                                    } img {
                                                        max-width: ${
                                                          windowWidth - 80
                                                        };
                                                    }`}
                              source={{
                                html:
                                  item[`ans_hin_${char}`] != ''
                                    ? item[`ans_hin_${char}`]
                                    : item[`ans_eng_${char}`],
                              }}
                            />
                          </View>
                          {answer == null ? null : i == rightAns ? (
                            <AntIcon
                              name="check"
                              size={20}
                              color="green"
                              style={{right: 15, position: 'absolute', top: 12}}
                            />
                          ) : answer == i ? (
                            <AntIcon
                              name="close"
                              size={20}
                              color="red"
                              style={{right: 15, position: 'absolute', top: 12}}
                            />
                          ) : null}
                        </TouchableOpacity>
                      );
                    })
              : item.type == 'Multiple'
              ? langChange == true
                ? Array(num)
                    .fill()
                    .map((val, i) => {
                      let char = String.fromCharCode(97 + i);
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => {
                            setAnswer(i);
                            setTap(false);
                          }}
                          disabled={answer != null}
                          style={{
                            ...styles.options,
                            backgroundColor:
                              answer == null
                                ? '#fff'
                                : i == rightAns
                                ? '#D7E9DB'
                                : answer == i
                                ? '#F3DDE0'
                                : '#fff',
                          }}>
                          <View
                            style={{
                              width: 30,
                              height: 30,
                              borderWidth: 1.5,
                              borderRadius: 100,
                              borderColor: 'grey',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text style={{fontWeight: 'bold'}}>{i + 1}</Text>
                          </View>
                          {/* <HTML source={{ html: item[`ans_eng_${char}`] !== "" ? item[`ans_eng_${char}`] : item[`ans_hin_${char}`] }} contentWidth={windowWidth - 60} {...htmlConfig} baseFontStyle={{lineHeight: 30}} tagsStyles={classesStyles} /> */}
                          <AutoHeightWebView
                            style={{
                              width: windowWidth - 80,
                              marginTop: 5,
                              marginLeft: 7,opacity: 0.99,minHeight: 1
                            }}
                            files={[
                              {
                                href: 'cssfileaddress',
                                type: 'text/css',
                                rel: 'stylesheet',
                              },
                            ]}
                            customStyle={`
                                                    * {
                                                        font-family: 'Times New Roman';
                                                    }
                                                    table {
                                                        max-width: ${
                                                          windowWidth - 80
                                                        };
                                                        font-size: 10px;
                                                    } img {
                                                        max-width: ${
                                                          windowWidth - 80
                                                        };
                                                    }`}
                            source={{
                              html:
                                item[`ans_eng_${char}`] !== ''
                                  ? item[`ans_eng_${char}`]
                                  : item[`ans_hin_${char}`],
                            }}
                          />
                          {answer == null ? null : i == rightAns ? (
                            <AntIcon
                              name="check"
                              size={20}
                              color="green"
                              style={{right: 15, position: 'absolute', top: 12}}
                            />
                          ) : answer == i ? (
                            <AntIcon
                              name="close"
                              size={20}
                              color="red"
                              style={{right: 15, position: 'absolute', top: 12}}
                            />
                          ) : null}
                        </TouchableOpacity>
                      );
                    })
                : Array(num)
                    .fill()
                    .map((val, i) => {
                      let char = String.fromCharCode(97 + i);
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => {
                            setAnswer(i);
                            setTap(false);
                          }}
                          disabled={answer != null}
                          style={{
                            ...styles.options,
                            backgroundColor:
                              answer == null
                                ? '#fff'
                                : i == rightAns
                                ? '#D7E9DB'
                                : answer == i
                                ? '#F3DDE0'
                                : '#fff',
                          }}>
                          <View
                            style={{
                              width: 30,
                              height: 30,
                              borderWidth: 1.5,
                              borderRadius: 100,
                              borderColor: 'grey',
                            }}>
                            <Text style={{fontWeight: 'bold'}}>{i + 1}</Text>
                          </View>
                          {/* <HTML source={{ html: item[`ans_hin_${char}`] != "" ? item[`ans_hin_${char}`] : item[`ans_eng_${char}`] }} contentWidth={windowWidth - 30} {...htmlConfig} baseFontStyle={{lineHeight: 30}} tagsStyles={classesStyles} /> */}
                          <AutoHeightWebView
                            style={{
                              width: windowWidth - 50,
                              marginTop: 5,
                              marginLeft: 7,opacity: 0.99,minHeight: 1
                            }}
                            files={[
                              {
                                href: 'cssfileaddress',
                                type: 'text/css',
                                rel: 'stylesheet',
                              },
                            ]}
                            customStyle={`
                                                    * {
                                                        font-family: 'Times New Roman';
                                                    }
                                                    table {
                                                        max-width: ${
                                                          windowWidth - 50
                                                        };
                                                        font-size: 10px;
                                                    } img {
                                                        max-width: ${
                                                          windowWidth - 50
                                                        };
                                                    }`}
                            source={{
                              html:
                                item[`ans_hin_${char}`] != ''
                                  ? item[`ans_hin_${char}`]
                                  : item[`ans_eng_${char}`],
                            }}
                          />
                          {answer == null ? null : i == rightAns ? (
                            <AntIcon
                              name="check"
                              size={20}
                              color="green"
                              style={{right: 15, position: 'absolute', top: 12}}
                            />
                          ) : answer == i ? (
                            <AntIcon
                              name="close"
                              size={20}
                              color="red"
                              style={{right: 15, position: 'absolute', top: 12}}
                            />
                          ) : null}
                        </TouchableOpacity>
                      );
                    })
              : item.type == 'Text' && (
                  // for text answer
                  <View style={styles.textInput}>
                    <TextInput
                      placeholder={'Write answer here!'}
                      // value={textAnswer}
                      // onChangeText={(text) => setTextAnswer(text)}
                      maxLength={5}
                      keyboardType={'numeric'}
                      autoFocus={true}
                      // onEndEditing={() => { onSaveAndNextQuestion(undefined, ''); }}
                    />
                  </View>
                )}
            {answer !== null && (
              <View style={styles.solutionContainer}>
                <Text style={{fontSize: 15, fontWeight: 'bold',marginLeft:10}}>
                  Solution: {rightAns + 1}
                </Text>
                <View style={{marginTop: 20,width:'95%',alignSelf:'center'}}>
                  {
                    langChange ? (
                      // <HTML source={{ html: item.solution_eng ? item.solution_eng : item.solution_hin }} contentWidth={windowWidth - 30} {...htmlConfig} baseFontStyle={{lineHeight: 30}} tagsStyles={classesStyles} />
                      <AutoHeightWebView
                        style={{width: windowWidth - 20,opacity: 0.99,minHeight: 1}}
                        files={[
                          {
                            href: 'cssfileaddress',
                            type: 'text/css',
                            rel: 'stylesheet',
                          },
                        ]}
                        customStyle={`
                                            * {
                                                font-family: 'Times New Roman';
                                            }
                                            table {
                                                max-width: ${windowWidth - 50};
                                                font-size: 10px;
                                            } img {
                                                max-width: ${windowWidth - 70};
                                            }`}
                        source={{
                          html: item.solution_eng
                            ? item.solution_eng
                            : item.solution_hin,
                        }}
                      />
                    ) : (
                      <AutoHeightWebView
                        style={{width: windowWidth - 20,opacity: 0.99,minHeight: 1}}
                        files={[
                          {
                            href: 'cssfileaddress',
                            type: 'text/css',
                            rel: 'stylesheet',
                          },
                        ]}
                        customStyle={`
                                            * {
                                                font-family: 'Times New Roman';
                                            }
                                            table {
                                                max-width: ${windowWidth - 50};
                                                font-size: 10px;
                                            } img {
                                                max-width: ${windowWidth - 70};
                                            }`}
                        source={{
                          html: item.solution_hin
                            ? item.solution_hin
                            : item.solution_eng,
                        }}
                      />
                    )
                    // <HTML source={{ html: item.solution_hin ? item.solution_hin : item.solution_eng }} contentWidth={windowWidth - 30} {...htmlConfig} baseFontStyle={{lineHeight: 30}} tagsStyles={classesStyles} />
                  }
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      )}
      <Modal
        visible={showModal}
        animationType="fade"
        transparent={true}
        coverScreen={true}
        hardwareAccelerated={true}
        onBackdropPress={() => {
          setShowModal(false);
        }}
        onSwipeMove={() => {
          setShowModal(false);
        }}
        style={{flex: 1, alignItems: 'center'}}
        onRequestClose={() => {
          setShowModal(false);
        }}>
        <View
          style={{
            width: '95%',
            height: 230,
            backgroundColor: '#fff',
            justifyContent: 'flex-start',
          }}>
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            style={{alignSelf: 'flex-end', padding: 10, bottom: 5}}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>X</Text>
          </TouchableOpacity>
          <Text style={{fontSize: 16, textAlign: 'center'}}>
            Report here...
          </Text>
          <TextInput
            value={message}
            onChangeText={(text) => setMessage(text)}
            multiline={true}
            style={styles.modalTextInput}
          />
          <TouchableOpacity
            style={{
              height: hp('5'),
              backgroundColor: 'grey',
              width: wp('30'),
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 20,
            }}
            onPress={() => {
              onReportQues(item.id, reportOption, message);
              setShowModal(false);
              setTap(false);
            }}>
            <Text style={{color: '#fff'}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
export default ViewSavedQuestion;

const styles = StyleSheet.create({
  subContainer: {
    right: 13,
  },
  questContainer: {
    width: '100%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    // marginTop: 20,
    alignItems: 'center',
    paddingVertical: 10,
  },
  questIndex: {
    height: 30,
    width: 30,
    backgroundColor: 'grey',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  positive: {
    color: 'green',
    fontWeight: 'bold',
    paddingHorizontal: 5,
    marginLeft: 10,
  },
  negetive: {
    color: 'red',
    fontWeight: 'bold',
    paddingHorizontal: 5,
    marginLeft: 5,
  },
  quest: {
    width: '92%',
    alignSelf: 'center',
    marginTop: 7,
  },
  options: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    paddingLeft: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    zIndex: -1,
    alignItems:'center'
  },
  textInput: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingVertical: 15,
  },
  solutionContainer: {
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 20,
    paddingVertical: 10,
    // paddingLeft: 20,
  },
  modalTextInput: {
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    height: 60,
    borderRadius: 10,
    marginTop: 10,
  },
});
