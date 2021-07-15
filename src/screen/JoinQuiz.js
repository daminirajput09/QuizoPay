import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import Loader from '../components/Loader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Ionicon from 'react-native-vector-icons/Ionicons';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import AppHeader from '../components/AppHeader';
import EmptyScreen from '../components/EmptyScreen';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import CountDown from 'react-native-countdown-component';
import axiosClient from '../api/axios-client';
import Toast, {BaseToast} from 'react-native-toast-message';
import QuizModal from '../components/QuizModal';
import moment from 'moment';
import Modal from 'react-native-modalbox';

const JoinQuiz = ({navigation, route}) => {
  const {item, userId, Amount} = route.params;
  //console.log('params', item);
  const Tab = createMaterialTopTabNavigator();

  const isFocused = useIsFocused();
  const [loader, setLoader] = useState(true);
  const [Winnings, setWinnings] = useState([
    '1,00,000',
    '9,500',
    '5,000',
    '4,410',
  ]);
  const [LeaderBoard, setLeaderBoard] = useState([]);
  const [QuizPrizeDistribution, setQuizPrizeDistribution] = useState([]);
  const [btnHide, setBtnHide] = useState(false);

  const [Difference, setDifference] = useState();
  const [AmountModal, setAmountModal] = useState(false);
  const [Balance, setBalance] = useState(Amount);

  const successIcon = require('../../assets/close.png');

  const toastConfig = {
    success: ({text1, hide, ...rest}) => (
      <BaseToast
        {...rest}
        style={{borderRadius: 0, backgroundColor: '#2E8B57'}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 15,
        }}
        text1={text1}
        text2={null}
        trailingIcon={successIcon}
        onTrailingIconPress={hide}
      />
    ),
    error: ({text1, hide, ...rest}) => (
      <BaseToast
        {...rest}
        style={{borderRadius: 0, backgroundColor: '#D42F2F'}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 15,
        }}
        text1={text1}
        text2={null}
        trailingIcon={successIcon}
        onTrailingIconPress={hide}
      />
    ),
  };

  useEffect(() => {
    quizPriceDistribution();
    quizLeadersBoard();
    WalletBalance();
    setLoader(false);
  }, []);

  useEffect(() => {
    quizPriceDistribution();
    quizLeadersBoard();
    WalletBalance();
    setLoader(false);
  }, [isFocused]);

  useEffect(() => {
    const expDate = moment(item.startdate); // create moment from string with format
    const nowDate = moment(new Date()); // new moment -> today
    // const diff = expDate.diff(nowDate, 'seconds'); // returns 366
    setDifference(expDate.diff(nowDate, 'seconds'));
  }, [item]);

  const WalletBalance = () => {
    if(userId){
    const formData = new FormData();
    formData.append('userid', userId);
    axiosClient().post('wallet/getBalance', formData)
        .then(async (res) => {
            if (res.data.Error == 0) {
                setBalance(res.data.balance);
            } else if(res.data.Error == 1) {
                Toast.show({
                    text1: res.data.message,
                    type: 'error',
                    position: 'top',
                    visibilityTime: 4000,
                    autoHide: true,
                    topOffset: 0,
                    bottomOffset: 40,
                    leadingIcon: null
                });
            }
        }).catch((err) => {
            console.log('get Balance', err)
        })
    } else {
        Toast.show({
            text1: 'User Id not found!',
            type: 'error',
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 0,
            bottomOffset: 40,
            leadingIcon: null
        });
    }    
  }

  const quizLeadersBoard = () => {
    if (userId && item && item.key) {
      const formData = new FormData();
      formData.append('userid', userId);
      formData.append('quizkey', item.key);
      formData.append('start', 0);
      formData.append('limit', 20);
      axiosClient()
        .post('quizzes/getQuizLeadersBoard', formData)
        .then(res => {
          //console.log('get Quiz Leaders Board res',res.data);
          if (res.data.Error == 0) {
            setLeaderBoard(res.data.data);
          } else if (res.data.Error == 1) {
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
          setLoader(false);
          console.log(err);
        });
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
  };

  const quizPriceDistribution = () => {
    if (userId && item && item.key) {
      const formData = new FormData();
      formData.append('userid', userId);
      formData.append('quizkey', item.key);
      axiosClient()
        .post('quizzes/getQuizPrizeDistribution', formData)
        .then(res => {
          //console.log('get Quiz Prize Distribution res',res.data);
          if (res.data.Error == 0) {
            setQuizPrizeDistribution(res.data.data);
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
          setLoader(false);
          console.log(err);
        });
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
  };

  const onJoinQuiz = () => {
    console.log('Amount and entryfee', Balance, item.entryfee);
    if (Balance >= item.entryfee) {
      setLoader(true);
      if (userId && item && item.key) {
        const formData = new FormData();
        formData.append('userid', userId);
        formData.append('quizkey', item.key);
        axiosClient()
          .post('quizzes/joinQuiz', formData)
          .then(res => {
            setLoader(false);
            // console.log('join quiz res',res.data.data);
            if (res.data.Error == 0) {
              setBtnHide(true);
              Toast.show({
                text1: res.data.message,
                type: 'success',
                position: 'top',
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 0,
                bottomOffset: 40,
                leadingIcon: null,
              });
            } else if (res.data.Error == 1) {
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
            setLoader(false);
            console.log(err);
          });
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
    } else {
      setAmountModal(true);
    }
  };

  const FirstRoute = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          height: 50,
          backgroundColor: '#FAFAFA',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <Text style={styles.headBottom}>{'Rank'}</Text>
        <Text style={styles.headBottom}>{'Winnings'}</Text>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        style={{marginVertical: 10}}>
        {QuizPrizeDistribution &&
          QuizPrizeDistribution.length > 0 &&
          QuizPrizeDistribution.map((item, i) => (
            <View key={i}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 15,
                  paddingHorizontal: '2%',
                }}>
                <View style={{width: '45%', alignItems: 'flex-start'}}>
                  <Text
                    style={[
                      styles.headBottom,
                      {fontWeight: 'bold', paddingLeft: 10},
                    ]}>
                    <Text style={{color: 'grey'}}>#</Text>
                    {item.rank}
                  </Text>
                </View>
                <View style={{width: '50%', alignItems: 'flex-end'}}>
                  <Text style={[styles.headBottom, {fontWeight: 'bold'}]}>
                    <FontAwesomeIcon name="rupee" size={13} color="#000" />
                    {item.prize}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: '80%',
                  height: 0.5,
                  backgroundColor: '#BEBEBE',
                  alignSelf: 'center',
                }}
              />
            </View>
          ))}
      </ScrollView>
    </ScrollView>
  );

  const SecondRoute = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          height: 50,
          backgroundColor: '#FAFAFA',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <Text style={{color: '#909090'}}>
          {'All Teams (' + LeaderBoard.length + ')'}
        </Text>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        style={{marginVertical: 10}}>
        {LeaderBoard &&
          LeaderBoard.length > 0 &&
          LeaderBoard.map((item, i) => (
            <View key={i}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}>
                {item.profile_image ? (
                  <Image
                    source={{uri: item.profile_image}}
                    style={{
                      width: 35,
                      height: 35,
                      resizeMode: 'cover',
                      borderRadius: 100,
                      marginHorizontal: 10,
                    }}
                  />
                ) : (
                  <FontAwesomeIcon
                    name="user-circle"
                    size={35}
                    color="#999999"
                    style={{marginHorizontal: 10}}
                  />
                )}
                <View style={{width: '80%', justifyContent: 'center'}}>
                  <Text style={{fontFamily: 'SofiaProRegular', fontSize: 14}}>
                    {item.name}
                  </Text>
                  {/* <Text style={{color:'#BA9B76',fontSize:12}}>
                  <FontAwesomeIcon name='rupee' size={11} color='#BA9B76' style={{marginTop:8.5}} />
                  {'5150 referrel winnings'}
              </Text> */}
                </View>
              </View>
              <View
                style={{
                  width: '80%',
                  height: 0.5,
                  backgroundColor: '#BEBEBE',
                  alignSelf: 'center',
                }}
              />
            </View>
          ))}
      </ScrollView>
    </ScrollView>
  );

  return (
    <View style={{flex: 1}}>
      {loader ? (
        <Loader isLoading={loader} />
      ) : (
        <View style={{flex: 1}}>
          <AppHeader
            Header={item.name}
            onPress={() => navigation.push('Home')}
          />

          <QuizModal
            width={'100%'}
            item={item}
            nowDate={moment(new Date())}
            expDate={moment(item.startdate)}
            diff={Difference}
            // onPress = {() => {
            //     setQuizItem(item);
            //     item.join_id == null
            //     ? navigation.navigate('JoinQuiz', {userId: UserInfo.id, item: item})
            //     : setCountdownModal(true);
            // }}
            onFinish={() => {
              console.log('quiz time finish');
              // setQuizEnd(true);
            }}
            // onChange={until => {
            //     if (countdownModal == true && CurrentTime == 0) {
            //         console.log('until', until);
            //         setCurrentTime(until);
            //     }
            // }}
          />
          {/* <TouchableOpacity key={item}
            activeOpacity={0.7}
            style={styles.homeSectionView}>
            <View style={styles.firstRow}>
                <Text style={styles.firstRowText}>{item.name}</Text>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                    <EntypoIcon name='stopwatch' size={17} color='#000' style={{marginTop:1,marginRight:2}} />
                    <CountDown
                        until={(item.duration)*60}
                        // onFinish={() => alert('finished')}
                        // onPress={() => alert('hello')}
                        size={12}
                        timeToShow={['H','M', 'S']}
                        timeLabels={{h: null,m: null, s: null}}  
                        digitStyle={{backgroundColor: 'transparent',width:15}}
                        digitTxtStyle={{color: '#000'}}   
                        showSeparator                                                           
                    />
                </View>        
            </View>
            <View style={styles.secondRow}>
                <Text style={styles.secondRowText}>{item.totalspots+' Total spots'}</Text>
                <View style={styles.secondRowColumn}>
                    <Text style={[styles.secondRowColumnText,{ marginRight:5 }]}><Ionicon name='trophy-outline' size={15} color='#FFD93F' style={{marginTop:7}} />{' Play & Win : '}</Text>
                    <Text style={styles.secondRowColumnText}><FontAwesome5Icon name='coins' size={15} color='#FFD93F' style={{marginTop:7}} />{' '+item.prizepool}</Text>
                </View>
            </View>

            <View style={styles.thirdRow}>
                <View style={styles.thirdRowFirst}>
                    <OcticonsIcon name='primitive-dot' size={20} color='#6DBD5B' style={{marginRight:2}} />
                    <Text style={styles.thirdRowText}>{'9,500 user playing'}</Text>
                </View>  
                <View style={styles.thirdRowSecond}>
                    <Text style={styles.thirdRowText1}>{'Entry: '}<FontAwesome5Icon name='coins' size={14} color='#FFD93F' style={{marginTop:7}} />{' '+item.entryfee}</Text>
                </View>
                <View style={styles.thirdRowThird}>
                </View> 
            </View>
        </TouchableOpacity> */}

          <Tab.Navigator
            tabBarOptions={{
              activeTintColor: '#C61D24',
              inactiveTintColor: '#989898',
              indicatorStyle: {
                backgroundColor: 'transparent',
                borderBottomWidth: 3,
                borderBottomColor: '#C61D24',
              },
              labelStyle: {
                fontSize: 12,
                fontWeight: 'bold',
                fontFamily: 'GilroyMedium',
              },
              style: {
                height: 50,
              },
            }}>
            <Tab.Screen
              name="Winnings"
              component={
                QuizPrizeDistribution && QuizPrizeDistribution.length > 0
                  ? FirstRoute
                  : EmptyScreen
              } listeners={{ tabPress: e => { quizPriceDistribution(); }}}
            />
            <Tab.Screen
              name="Leaderboard"
              component={
                LeaderBoard && LeaderBoard.length > 0
                  ? SecondRoute
                  : EmptyScreen
              } listeners={{ tabPress: e => { quizLeadersBoard(); }}}
            />
          </Tab.Navigator>

          {!btnHide && (item && item.join_id == null)?
          <TouchableOpacity
            onPress={() => onJoinQuiz()}
            style={{
              width: '90%',
              alignSelf: 'center',
              height: 45,
              backgroundColor: '#D00412',
              marginBottom: 20,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 4,
            }}>
            <Text
              style={{
                fontSize: 14,
                color: '#fff',
                fontWeight: 'bold',
                fontFamily: 'GilroyMedium',
              }}>
              JOIN NOW
            </Text>
          </TouchableOpacity>
          :null}
        </View>
      )}

      <Modal
        style={[{width: '80%',paddingTop: 10,height: null}]}
        swipeToClose={true}
        swipeArea={10} // The height in pixels of the swipeable area, window height by default
        swipeThreshold={50} // The threshold to reach in pixels to close the modal
        isOpen={AmountModal}
        backdropOpacity={0.2}
        entry={'top'}
        backdropPressToClose={true}
        position={'center'}
        coverScreen={true}
        backdropColor={'#000'}
        onClosed={() => setAmountModal(false)}
        backButtonClose={true}>
        <View style={{alignItems:'center',padding:15}}>
            <View style={{marginVertical:0}}>
              <Text style={{color:'#000',fontSize:15,fontFamily:'GilroyMedium',textAlign:'center'}}>
                  You don't have enough amount to play this quiz!
              </Text>
              <TouchableOpacity onPress={()=> { setAmountModal(false); navigation.navigate('AddCash', {userId:userId ,Balance: Balance}); } } 
                  style={[styles.AddBtn]}>
                  <Text style={[styles.button]}>{'ADD NOW'}</Text>
              </TouchableOpacity>
            </View>
        </View>
      </Modal>

      <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
    </View>
  );
};
export default JoinQuiz;

const styles = StyleSheet.create({
  mainCon: {
    width: '95%',
    backgroundColor: '#FFFFFF',
    borderColor: '#D5D5D5',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  firstRow: {
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginTop: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  firstRowText: {fontSize: 15, color: '#000', fontFamily: 'SofiaProRegular'},
  secondRow: {
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondRowText: {
    fontSize: 12,
    color: '#A01319',
    fontFamily: 'SofiaProRegular',
  },
  secondRowColumn: {
    backgroundColor: '#EEF1EF',
    flexDirection: 'row',
    padding: 2,
    borderRadius: 4,
    marginVertical: 2,
  },
  secondRowColumnText: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'SofiaProRegular',
  },
  thirdRow: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  thirdRowFirst: {
    width: '33%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  thirdRowSecond: {
    width: '33%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thirdRowThird: {
    width: '33%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  thirdRowText: {fontSize: 10, color: '#000', fontFamily: 'SofiaProRegular'},
  thirdRowText1: {
    fontSize: 12,
    color: '#000',
    marginLeft: 5,
    fontFamily: 'SofiaProRegular',
  },
  thirdRowText2: {
    width: 65,
    alignSelf: 'center',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 0.5,
    backgroundColor: '#009D38',
    borderColor: '#009D38',
  },
  playBtn: {fontSize: 10, color: '#fff', fontFamily: 'SofiaProRegular'},

  imageBg: {flex: 1, justifyContent: 'center', resizeMode: 'cover'},
  mainRow: {flex: 1, width: '100%', padding: 20},
  emptyRowText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#000',
  },
  emptyRowImage: {
    height: 250,
    width: '80%',
    alignSelf: 'center',
    marginVertical: 25,
  },
  emptyRowBtn: {
    width: '70%',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#009D38',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  emptyRowBtnText: {fontWeight: 'bold', fontSize: 12, color: '#fff'},

  headerView: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'ios' ? hp('4') : 0,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    // borderWidth:1,
    height: 50,
    backgroundColor: '#C61D24',
  },
  headerImg: {
    width: '15%',
    height: 25,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  headerText: {width: '85%'},
  textHead: {
    fontSize: 18,
    textAlign: 'left',
    color: '#fff',
    fontFamily: 'GilroyMedium',
  },
  textname: {fontSize: 20, fontWeight: 'bold', color: '#fff'},
  notiImg: {
    width: '10%',
    // marginLeft: wp('2'),
  },
  profileView: {
    // marginLeft: wp('2'),
    width: '10%',
    alignItems: 'center',
  },
  profileImg: {height: 40, width: 40, borderRadius: 20},
  dividerView: {
    marginTop: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D2D2D2',
  },

  sectionText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  sectionView: {
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
  },
  sectionImage: {
    width: 35,
    height: 35,
  },
  walletModalView: {
    width: '100%',
    height: 430,
    paddingTop: 10,
  },
  walletModalText: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 18,
  },
  newVersionText: {fontSize: 20, fontWeight: 'bold'},
  appVersionText: {fontSize: 14, fontWeight: 'bold'},
  btnView: {alignSelf: 'flex-end', marginTop: 20},
  btnText: {
    fontSize: 14,
    color: '#119D90',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  imageBox: {
    backgroundColor: '#fff',
    height: 80,
    width: 80,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 5,
  },
  listMainView: {
    backgroundColor: '#fff',
    // padding: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    alignSelf: 'center',
    justifyContent: 'center',
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
    color: 'grey',
  },
  notiView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 15,
    height: 15,
    borderRadius: 20,
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 15,
    left: 22,
  },
  AddBtn: {
    width:100,
    alignSelf:'center',
    height:45,
    marginTop:20,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:4,
    backgroundColor:'#109E38'
  },
  button: { 
    fontSize: 15, 
    color: '#fff',
    borderRadius:5
  },

});
