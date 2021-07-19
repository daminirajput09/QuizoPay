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
  ActivityIndicator,
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
import axiosClient from '../api/axios-client';
import Toast, {BaseToast} from 'react-native-toast-message';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountDown from 'react-native-countdown-component';
import moment from 'moment';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Tooltip } from 'react-native-elements';
import QuizModal from '../components/QuizModal';
import ModalComponent from '../components/ModalComponent';
import Modal from 'react-native-modal';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const MyQuiz = ({navigation, route}) => {
  const Tab = createMaterialTopTabNavigator();

  const isFocused = useIsFocused();
  const [loader, setLoader] = useState(false);
  const [LiveQuiz, setLiveQuiz] = useState([]);
  const [UpcomingQuiz, setUpcomingQuiz] = useState([]);
  const [User, setUser] = useState();
  const [countdownModal, setCountdownModal] = useState(false);
  const [QuizItem, setQuizItem] = useState([]);
  const [CurrentTime, setCurrentTime] = useState(0);
  const [Language, setLanguage] = useState();
  const [enableBtn, setEnableBtn] = useState(false);
  const [Balance, setBalance] = useState(0);

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
  
  useEffect(()=>{
    getUser();
  },[]);

  useEffect(() => {
    console.log('tab pressed!!!');
    const unsubscribe = navigation.addListener('tabPress', e => {
      // Prevent default behavior
      // e.preventDefault();
  
      console.log('tab pressed 1!!!',e);

      // Do something manually
      // ...
    });
  
    return unsubscribe;
  }, []);
  

  useEffect(() => {
    console.log('user and isfocused', User, isFocused);
    // getUser();
    if(User){
      setLoader(true);
      getLiveQuiz();
      getUpComingQuiz(); 
      WalletBalance(); 
    }
  }, [isFocused]);

  // useEffect(() => {
  //   getLiveQuiz();
  //   getUpComingQuiz();
  // }, [User]);

  const getUser = async () => {
    await AsyncStorage.getItem('userInfo', async(err, result) => {
        if (!err && result !== null) {
            setUser(JSON.parse(result))
            //console.log('userInfo res in quiz', result)
        } else {
            //console.log('userInfo err', err)
        }
        })
  }

  const getLiveQuiz = () => {
    if(User && User.id){
      const formData = new FormData();
      formData.append('userid', User.id);
      formData.append('start', 0);
      formData.append('limit', 20);
      axiosClient().post('quizzes/getMyQuizzes',formData)
      .then((res) => {
        setLoader(false);
        console.log('get live quiz res',res.data, formData);
        if(res.data.Error == 0){
          setLiveQuiz(res.data.data);
        } else if(res.data.Error == 1) {
          setLiveQuiz([]);
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
      }).catch((err) => {
          setLoader(false);
          setLiveQuiz([]);
          //console.log(err)
      })
    }
  }

  const getUpComingQuiz = () => {
    if(User && User.id){
      const formData = new FormData();
      formData.append('userid', User.id);
      formData.append('start', 0);
      formData.append('limit', 20);
      axiosClient().post('quizzes/getMyCompletedQuizzes',formData)
      .then((res) => {
        setLoader(false);
        console.log('get upcoming quiz res',res.data.data,formData);
        if(res.data.Error == 0){
          setUpcomingQuiz(res.data.data);
        } else if(res.data.Error == 1) {
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
      }).catch((err) => {
          setLoader(false);
          //console.log(err)
      })
    }  
  }

  const WalletBalance = () => {
    if(User && User.id){
    const formData = new FormData();
    formData.append('userid', User.id);
    axiosClient().post('wallet/getBalance', formData)
        .then(async (res) => {
          console.log('get balance', res.data);
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

  const MyLoader = () => {
    return(
      <SkeletonPlaceholder>
          {/* <SkeletonPlaceholder.Item width={"100%"} height={50} borderRadius={0} /> */}
          <SkeletonPlaceholder.Item width={"100%"} height={50} />
          <SkeletonPlaceholder.Item paddingHorizontal={15}>
              <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={10} />
              <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={20} />
              <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={10} />
              <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={10} />
              <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={10} />
          </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
  )}

  const FirstRoute = () => (
      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{marginVertical: 10}}>
          {/* {LiveQuiz && LiveQuiz.length>0 &&  */}
          {LiveQuiz.map((item, i) => {
            const expDate = moment(item.startdate); // create moment from string with format 
            const nowDate = moment(new Date()); // new moment -> today 
            const diff = expDate.diff(nowDate, 'seconds'); // returns 366 

            return (
              <QuizModal 
                key={i}
                width={'95%'}
                item={item}
                expDate={expDate}
                nowDate={nowDate}
                diff={diff}
                onPress = {() => { 
                  setQuizItem(item); 
                  setCountdownModal(true);
                }}
                // onPress = {() => {
                //     setQuizItem(item);
                //     item.join_id == null
                //     ? navigation.navigate('JoinQuiz', {userId: User.id, item: item})
                //     : setCountdownModal(true);
                // }}
                onFinish={() => {
                    //console.log('quiz time finish');
                    // setQuizEnd(true);
                }}
                // onChange={until => {
                    // if (countdownModal == true) {
                    //   //console.log('until', until);
                    //   setCurrentTime(until);
                    // }
                // }}
              />
          )})}
        </ScrollView>
      </ScrollView>
  );

  const SecondRoute = () => (
      // <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1,backgroundColor:'red'}}>
        
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{marginVertical: 10}}>
          {UpcomingQuiz && UpcomingQuiz.length>0 && UpcomingQuiz.map((item, i) => {
            const expDate = moment(item.startdate); // create moment from string with format 
            const nowDate = moment(new Date()); // new moment -> today 
            const diff = expDate.diff(nowDate, 'seconds'); // returns 366 

            return (
              <QuizModal 
                key={i}
                width={'95%'}
                item={item}
                expDate={expDate}
                nowDate={nowDate}
                notShow={true}
                diff={diff}
                onPress={()=> navigation.navigate('TopWinner',{User: User, quiz_key: item.key})}
                // onPress = {() => {
                //     setQuizItem(item);
                //     item.join_id == null
                //     ? navigation.navigate('JoinQuiz', {userId: User.id, item: item})
                //     : setCountdownModal(true);
                // }}
                // onFinish={() => {
                    //console.log('quiz time finish');
                    // setQuizEnd(true);
                // }}
                // onChange={until => {
                    // if (countdownModal == true) {
                      // //console.log('until', until);
                      // setCurrentTime(until);
                    // }
                // }}
            />
          )})}
        </ScrollView>
      
      // </ScrollView>
  );

  return (
    <View style={{flex: 1}}>
          <AppHeader
            Header={'My Quizzes'}
            onPress={() => navigation.push('Home')}
          />
        {loader ? (
            // <Loader isLoading={loader} />
            // <Modal isVisible={loader} style={{flex: 1,justifyContent:'center',alignItems:'center'}}>
            //     <ActivityIndicator color={"#A9A9A9"} size={'large'} />
            // </Modal>
            <MyLoader />
          ) : (
        <View style={{flex: 1}}>

          {/* <Tab.Navigator
            tabBarOptions={{
              activeTintColor: '#C61D24',
              inactiveTintColor: '#989898',
              indicatorStyle: {backgroundColor: 'transparent'},
              labelStyle: {
                fontSize: 12,
                fontWeight: 'bold',
                fontFamily: 'GilroyMedium',
              },
              style: {
                height: 50,
              },
            }}>
            <Tab.Screen name="Live" component={LiveQuiz && LiveQuiz.length>0?FirstRoute:EmptyScreen} />
            <Tab.Screen name="Completed" component={UpcomingQuiz && UpcomingQuiz.length>0? SecondRoute : EmptyScreen } />
          </Tab.Navigator> */}

          <Tab.Navigator
            tabBarOptions={{
              activeTintColor: '#C61D24',
              inactiveTintColor: '#989898',
              indicatorStyle: {backgroundColor: 'transparent',borderBottomWidth:3,borderBottomColor:'#C61D24'},
              labelStyle: {
                fontSize: 12,
                fontWeight: 'bold',
                fontFamily: 'GilroyMedium',
              },
              style: {
                height: 50,
              },
            }}>
            <Tab.Screen name="Live" component={LiveQuiz && LiveQuiz.length>0?FirstRoute:EmptyScreen}
            listeners={{ tabPress: e => { getLiveQuiz(); }}}
           />
            <Tab.Screen name="Completed" component={UpcomingQuiz && UpcomingQuiz.length>0? SecondRoute : EmptyScreen }
            listeners={{ tabPress: e => { getUpComingQuiz(); }}} />
          </Tab.Navigator>

          {/* {loader ? (
            // <Loader isLoading={loader} />
            // <Modal isVisible={loader} style={{flex: 1,justifyContent:'center',alignItems:'center'}}>
            //     <ActivityIndicator color={"#A9A9A9"} size={'large'} />
            // </Modal>
            <MyLoader />
          ) : ( */}

          <ModalComponent 
              userId={User && User.id}
              quizKey={QuizItem && QuizItem.key}
              countdownModal={countdownModal}
              QuizItem={QuizItem}
              CurrentTime={CurrentTime}
              Language={Language}
              onClosed={() => { setCountdownModal(false); setCurrentTime(0); } }
              distributionPlan={() => navigation.navigate('JoinQuiz', {userId: User.id, item: QuizItem, Amount:Balance}) }
              onValueChange={(itemValue, itemIndex) =>
                  setLanguage(itemValue)
              }
              // onPress={() =>
              //     navigation.navigate('MyTests', {
              //       userid: User.id,
              //       quiz_key: QuizItem.key,
              //     })
              // }
              onFinish={()=> setEnableBtn(true) }
              onPress={()=> 
                  // CurrentTime == 0
                  enableBtn
                  ? 
                  navigation.navigate('MyTests', { userid: User.id, quiz_key: QuizItem.key, })
                  : 
                  null 
              }
          />

        </View>

        )}

      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />

    </View>
  );
};
export default MyQuiz;

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
    marginBottom: 15
  },
  firstRow: {
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginTop: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
//   firstRowText: {
//     fontSize: 15,
//     color: '#000',
//     fontFamily: 'SofiaProRegular',
//   },
  firstRowText: { fontSize: 15, color: '#000',fontFamily:'SofiaProRegular' },
  secondRow: { width: '100%', paddingHorizontal: 10, justifyContent:'space-between', flexDirection:'row',alignItems:'center' },
  secondRowText: { fontSize: 12, color: '#A01319', fontFamily:'SofiaProRegular' },
  secondRowColumn: {backgroundColor:'#EEF1EF', flexDirection:'row',padding:2,borderRadius:4,marginVertical:2},
  secondRowColumnText: {fontSize: 12, color: '#000',fontFamily:'SofiaProRegular',},
  thirdRow: { width: '100%', paddingHorizontal: 10, paddingVertical:4, marginTop:5, justifyContent:'space-between', flexDirection:'row',backgroundColor:'#F5F5F5',borderBottomLeftRadius:10,borderBottomRightRadius:10 },
  thirdRowFirst: { width: '33%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start' },
  thirdRowSecond: { width: '33%',flexDirection:'row',alignItems:'center',justifyContent:'center' },
  thirdRowThird: { width: '33%',flexDirection:'row',alignItems:'center',justifyContent:'flex-end' },
  thirdRowText: { fontSize: 10, color: '#000',fontFamily:'SofiaProRegular'},
  thirdRowText1: { fontSize: 12, color: '#000',marginLeft:5,fontFamily:'SofiaProRegular'},
  thirdRowText2: {width:65,alignSelf:'center',height:25,justifyContent:'center',alignItems:'center',borderRadius:5,borderWidth:0.5,backgroundColor:'#009D38',borderColor:'#009D38'},
  playBtn: { fontSize: 10, color: '#fff',fontFamily:'SofiaProRegular'},


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

  homeSectionView: {
    width:'95%',
    backgroundColor: '#FFFFFF',
    borderColor: '#D5D5D5',
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
    alignSelf: 'center',
    marginBottom: 15
  },
});
