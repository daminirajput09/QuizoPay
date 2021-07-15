import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
    BackHandler,
    StatusBar,
    RefreshControl,
    Linking,
    Share,
    Image,
    ActivityIndicator
} from 'react-native';
import axiosClient from '../api/axios-client';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../components/Loader';
import DeviceInfo from 'react-native-device-info';
import { checkVersion } from 'react-native-check-version';
import Modal from 'react-native-modalbox';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast, {BaseToast} from 'react-native-toast-message';
import FlatListSlider from '../components/rawFlatListSlider';
import Preview from '../components/ChildItem';
import { Tooltip } from 'react-native-elements';
import EmptyScreen from '../components/EmptyScreen';
import moment from 'moment';
import QuizModal from '../components/QuizModal';
import ModalComponent from '../components/ModalComponent';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Home = ({ navigation, route }) => {

    const isFocused = useIsFocused();
    const [sliderImages, setSliderImages] = useState([])
    const [loader, setLoader] = useState(false);
    const [QuizLoader, setQuizLoader] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [testSeries, setTestSeries] = useState([]);
    const [quizList, setQuizList] = useState([]);
    const [Count, setCount] = useState(null);
    const [homeSection, setHomeSection] = useState([]);
    const [walletModal, setWalletModal] = useState(false);
    const [viewHide, setViewHide] = useState(true);
    const [filterShow, setFilterShow] = useState(false);
    const [select, setSelect] = useState(null);
    const [UserInfo, setUserInfo] = useState();
    const [FcmToken, setFcmToken] = useState();
    const [duration, setDuration] = useState();
    const [courseId, setCourseId] = useState('All');
    const [Balance, setBalance] = useState(0);
    const [countdownModal, setCountdownModal] = useState(false);
    const [QuizItem, setQuizItem] = useState([]);
    const [CurrentTime, setCurrentTime] = useState(0);
    const [QuizEnd, setQuizEnd] = useState(false);
    const [Language, setLanguage] = useState();

    const [enableBtn, setEnableBtn] = useState(false);

    const [activeBar, setActiveBar] = useState('All');
    const [topTabBar, setTopTabBar] = useState(['All']);

    const [modal1, setModal1] = useState(false);
    const [option, setOption] = useState([
        {id: 1, icon: 'wallet', label: 'Transactional', subText: 'Updates on your withdrawals, added cash, etc.'},
        {id: 2, icon: 'gift', label: 'Promotional', subText: 'Updates on your offers, disocunts, etc.'},
        {id: 3, icon: 'trophy', label: 'Gameplay', subText: 'Updates on your joined matches, lineups, etc.'},
        {id: 4, icon: 'group', label: 'Social', subText: 'Updates on posts, groups, followers, etc.'},
        {id: 5, icon: 'user', label: 'Profile', subText: 'Updates on your level, account, etc.'},
    ]);

    // const topTabBar = ['SSC', 'BANKING', 'PO','SSC 1', 'PO 1','BANK 1','SSC 2']

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
    // for app update modal
    const [UpdateModalShow, setUpdateModalShow] = useState(false);
    const updateType = false;

    useEffect(() => {
        if (updateType == true) {
            setUpdateModalShow(true);
        }
    }, [updateType]);

    useEffect(() => {
        getFcmToken();
    }, [isFocused]);

    const onRefresh = useCallback(() => {
        imageSlider();
        getUpcomingQuizList('All');
        getFilterData();
    }, [FcmToken, UserInfo]);

    const getFcmToken = async () => {
        await AsyncStorage.getItem('fcmtoken', async(err, result) => {
            if (!err && result !== null) {
                // console.log('get fcm value', JSON.parse(result), DeviceInfo.getDeviceId());
                setFcmToken(JSON.parse(result))

                await AsyncStorage.getItem('userInfo', async(err, result) => {
                    if (!err && result !== null) {
                        setUserInfo(JSON.parse(result))
                        //console.log('userInfo data in home', result)
                    } else {
                        console.log('userInfo err', err)
                    }
                  })
              
            }
            else {
                console.log('fcmtoken err', err)
            }
        });
    }

    useEffect(() => {
        getFcmToken();
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
            setSliderImages([]); 
            
            setRefreshing(false); 
            setTestSeries([]); 
            setQuizList([]); 
        };
    }, []);

    useEffect(() => {
        imageSlider();
        getUpcomingQuizList('All');
        getFilterData();
        if(UserInfo && UserInfo.id){
          WalletBalance();
        }
    }, [FcmToken, UserInfo]);
 
    const handleBackPress = () => {
        if (navigation.isFocused()) {
            BackHandler.exitApp();
        }
    };

    const imageSlider = () => {
        setLoader(true);
        axiosClient().post('slider/get')
            .then((res) => {
                setLoader(false);
                if (res.data.Error === 0) {
                    setSliderImages(res.data.data)
                    //console.log('slider images',res.data.data);
                }
            }).catch((err) => {
                setLoader(false);
                console.log(err)
            })
    }

    const getUpcomingQuizList = (param) => {
        // setLoader(true);
        setQuizLoader(true);
        //   console.log('params', param, courseId);

      if(UserInfo && UserInfo.id){  
        const formData = new FormData();
        formData.append('userid', UserInfo.id);
        formData.append('start', 0);
        formData.append('limit', 20);
        if(param){ formData.append('courseid', param); } else { formData.append('courseid', courseId); }
        formData.append('subjectid', 'All');

        axiosClient().post('quizzes/get', formData)
            .then(async (res) => {
                console.log('get quizzes res', res.data.data, formData)
                if (res.data.Error == 0) {
                    setQuizLoader(false);
                    setHomeSection(res.data.data);
                } else if(res.data.Error == 1) {
                    setQuizLoader(false);
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
                } else { setQuizLoader(false); }
            }).catch((err) => {
                setQuizLoader(false); 
                console.log('get quizzes', err)
            })
       } else { setQuizLoader(false); }  
    }

    const getFilterData = () => {
        
        axiosClient().post('courses/getCourses')
            .then(async (res) => {
                console.log('get filter res', res.data)
                if (res.data.Error == 0) {
                    setTopTabBar(res.data.data);
                    setOption(res.data.data);
                } else if(res.data.Error == 1) {
                    console.log('get Courses error', res)
                }
            }).catch((err) => {
                console.log('get Courses', err)
            })
    }
    
    useEffect(() => {
        if (duration > 0) {
          setTimeout(() => setDuration(duration - 1), 1000);
        } else {
          setDuration(0);
        }
    },[duration]);

    const onApplyFilter = (id) => {
        //console.log('course id',id);
        setCourseId(id);
        getUpcomingQuizList(id);
        setFilterShow(false);
        // navigation.navigate('Home')
    }

    const WalletBalance = () => {
        if(UserInfo && UserInfo.id){
        const formData = new FormData();
        formData.append('userid', UserInfo.id);
        axiosClient().post('wallet/getBalance', formData)
            .then(async (res) => {
                //console.log('get Balance res', res.data, formData)
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
            <SkeletonPlaceholder.Item width={"100%"} marginTop={0} height={50} borderRadius={0} />
            <SkeletonPlaceholder.Item paddingHorizontal={15}>
                <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={10} />
                <SkeletonPlaceholder.Item width={"100%"} marginTop={20} height={50} />
                <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={20} />
                <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={10} />
                <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={10} />
                <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={10} />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    )}
    
    return (
        <View style={{flex:1}}>
            {isFocused ? (<StatusBar backgroundColor={'#598EF6'} barStyle={'light-content'} />) : null}
            {loader ? (
                // <Loader isLoading={loader} />
                <MyLoader />
            ) : (
                // <ImageBackground source={require('../../assets/splash/AppBg.jpg')} style={styles.ContainerBg}>
                <View style={styles.ContainerBg}>
                    <View style={styles.headerView}>
                        <TouchableOpacity
                            style={[styles.headerImg]}
                            onPress={() => navigation.toggleDrawer()}>
                            {UserInfo && UserInfo.profile_image?<Image source={{uri: UserInfo.profile_image}} style={{width:25,height:25,resizeMode:'cover',borderRadius:100}} />
                            :<FontAwesomeIcon name="user-circle-o" size={25} color="#fff" />}
                        </TouchableOpacity>

                        <View style={{width:'10%'}}>
                            <Image source={require('../../assets/splash/QuizApplogo.png')} style={{width:100,height:20,resizeMode:'cover'}} />
                        </View>

                        <View style={[styles.headerText]}>
                            {/* <Text
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                                style={styles.textHead}>
                                    Quizo
                            </Text> */}
                        </View>

                        <View style={styles.headerBar}>
                            <TouchableOpacity
                                style={{marginHorizontal:5}}
                                onPress={() =>
                                    // setModal1(true) 
                                    navigation.navigate('Notifications')
                                }>
                                <Image style={{width:20,height:20}} source={require('../../assets/bell.png')} />
                                {Count && Count != 0 && <View style={styles.notiView}>
                                    <Text style={[styles.notiCount,styles.SofiaFont]}>{Number(Count)}</Text>
                                </View>}
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => {setWalletModal(true); setViewHide(true)}}
                                style={[styles.walletView,{marginLeft:5}]}>
                                <View>
                                    <Image style={{width:20,height:20}} source={require('../../assets/wallet.png')} />
                                </View>
                            </TouchableOpacity>  
                        </View>         
                    </View>

                    {/* <MyLoader /> */}
                    <Modal
                        style={[styles.walletModalView,{height: null,top:50}]} //viewHide?430:380
                        swipeToClose={true}
                        swipeArea={10} // The height in pixels of the swipeable area, window height by default
                        swipeThreshold={50} // The threshold to reach in pixels to close the modal
                        isOpen={walletModal}
                        // onClosed={() => setWalletModal(!walletModal)}
                        backdropOpacity={0.2}
                        entry={'top'}
                        backdropPressToClose={true}
                        position={'top'}
                        coverScreen={true}
                        backdropColor={'#000'}
                        onClosed={()=> setWalletModal(false)}
                        backButtonClose={true}>
                        <View>
                            <Text style={styles.walletModalText}>Total balance</Text>
                            <View style={styles.walletAmount}>
                                <FontAwesomeIcon name='rupee' size={15} color='#000' style={{marginTop:10}} />
                                <Text style={[styles.walletModalText,styles.SofiaFont,{fontWeight:'bold',marginTop:5}]}>{Balance}</Text>
                            </View>
                            <TouchableOpacity onPress={()=> {
                                setWalletModal(false);
                                navigation.navigate('AddCash', {userId: UserInfo.id ,Balance: Balance})
                            }} 
                                style={styles.AddBtn}>
                                <Text style={[styles.button,styles.SofiaFont]}>{'ADD CASH'}</Text>
                            </TouchableOpacity>
                            <View style={styles.borderView} />
                            <View style={styles.modalFirstRow}>
                                <View style={styles.modalText}>
                                    <Text style={styles.modalTextValue}>amount added (unutilised)</Text>
                                    <View style={styles.modalAMount}>
                                        <FontAwesomeIcon name='rupee' size={13} color='#000' style={{marginTop:8.5}} />
                                        <Text style={styles.amount}>0</Text>
                                    </View>
                                </View>
                                <View style={styles.TooltipView}>
                                  
                                    <Tooltip
                                    width={300}
                                    height={45}
                                    containerStyle={{borderRadius:4,paddingVertical:2}}
                                    backgroundColor={'#2071E4'} 
                                    popover={
                                        // <Animatable.View animation="slideInDown" iterationCount={'infinite'} direction="alternate" easing={'ease'} duration={5000}>
                                        <View><Text style={styles.TooltipText}>Money added by you that you can use to join conteacts, but can't withdraw</Text></View>
                                        // </Animatable.View>  
                                    } overlayColor="transparent" skipAndroidStatusBar={true}>
                                        <Ionicon name='md-information-circle-outline' size={20} color='#76A0DE' />
                                    </Tooltip>
                                  
                                </View>
                            </View>
                            <View style={styles.borderView} />
                            <View style={styles.modalFirstRow}>
                                <View style={styles.modalText}>
                                    <Text style={styles.modalTextValue}>winnings</Text>
                                    <View style={styles.modalAMount}>
                                        <FontAwesomeIcon name='rupee' size={13} color='#000' style={{marginTop:8.5}} />
                                        <Text style={styles.amount}>0</Text>
                                    </View>
                                </View>
                                <View style={styles.TooltipView}>
                                    <Tooltip
                                    width={300}
                                    height={45}
                                    containerStyle={{borderRadius:4,paddingVertical:2}}
                                    backgroundColor={'#2071E4'} 
                                    popover={
                                        <View><Text style={{fontSize:11,color:'#fff',textAlign:'center',fontFamily:'SofiaProRegular'}}>Money that you can withdraw or re-use to join any contests</Text></View>
                                    } overlayColor="transparent" skipAndroidStatusBar={true}>
                                        <Ionicon name='md-information-circle-outline' size={20} color='#76A0DE' />
                                    </Tooltip>                                
                                </View>
                            </View>
                            <View style={styles.borderView} />
                            <View style={styles.modalFirstRow}>
                                <View style={styles.modalText}>
                                    <Text style={styles.modalTextValue}>cash</Text>
                                    {/* <Text style={{textTransform:'uppercase',fontSize:14,fontWeight:'bold',marginTop:5}}>$0</Text> */}
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <FontAwesomeIcon name='rupee' size={13} color='#000' style={{marginTop:7}} />
                                        <Text style={styles.amount}>{Balance}</Text>
                                    </View>
                                </View>
                                <View style={styles.TooltipView}>
                                    <Tooltip
                                    width={300}
                                    height={45}
                                    containerStyle={{borderRadius:4,paddingVertical:2}}
                                    backgroundColor={'#2071E4'} 
                                    popover={
                                        <View><Text style={{fontSize:11,color:'#fff',textAlign:'center',fontFamily:'SofiaProRegular'}}>Money that you can use to join any public contests</Text></View>
                                    } overlayColor="transparent" skipAndroidStatusBar={true}>
                                        <Ionicon name='md-information-circle-outline' size={20} color='#76A0DE' />
                                    </Tooltip>                                
                                </View>
                            </View>
                            {/* {viewHide?
                            <View style={{width:'90%',alignSelf:'center',marginTop:10,flexDirection:'row',borderWidth:0.5,borderColor:'#109E38',borderRadius:4,padding:7}}>
                                <FontAwesomeIcon name="money" size={25} color="#356D0B" />
                                <View style={{width:'85%',alignSelf:'center',paddingHorizontal:5}}>
                                    <Text style={{fontSize:10,fontFamily:'SofiaProRegular'}}>Maximum usable Cash Bonus per match = 10% of Entry Fees Know more</Text>
                                </View>
                                <TouchableOpacity onPress={()=> setViewHide(false)}>
                                  <Ionicon name="close" size={22} color="grey" />
                                </TouchableOpacity>
                            </View>:null} */}
                            <TouchableOpacity style={{alignSelf:'center',marginTop:10}} onPress={() => {setWalletModal(false); setViewHide(true)}}>
                                <Ionicon name="chevron-up" size={30} color="grey" />
                            </TouchableOpacity>
                        </View>
                    </Modal>

                    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} showsVerticalScrollIndicator={false}>

                            {sliderImages && sliderImages.length>0?<FlatListSlider
                                data={sliderImages}
                                width={windowWidth}
                                height={120}
                                timer={4000}
                                component={<Preview />}
                                onPress={item => { 
                                    sliderImages[item].link_url != '' && sliderImages[item].link_url != null ?
                                        Linking.openURL(sliderImages[item].link_url) : null }}
                                indicatorActiveWidth={40}
                                indicator
                                contentContainerStyle={{
                                }}
                            />:null}

                            <View style={{width:'90%',alignSelf:'center',marginTop: 15,paddingBottom:0.5,borderWidth:0.2,borderColor:'#A9A9A9'}}>
                            <ScrollView
                                horizontal={true}
                                // style={{width:'90%',alignSelf:'center'}}
                                // contentContainerStyle={{alignItems:'center'}}
                                showsHorizontalScrollIndicator={false}>
                                <TouchableOpacity
                                style={{
                                    width: 65,
                                    height: 50,
                                    backgroundColor: '#fff',
                                    borderRightWidth:0.2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderBottomWidth: 'All' == activeBar ? 5 : 0,
                                    borderBottomColor: '#598EF6'
                                }} onPress={()=> { setActiveBar('All'); getUpcomingQuizList('All'); } }>
                                <Image source={require('../../assets/drawericon/your_exmas_icon.png')} style={{ height: 25, width: 25 }} />
                                <Text style={{ color: '#000', fontWeight: 'bold',fontSize:8 }}>{'All'}</Text>
                                </TouchableOpacity>
                                {topTabBar.map((item, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={{
                                            width: 65,
                                            height: 50,
                                            backgroundColor: '#fff',
                                            borderRightWidth:0.2,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderBottomWidth: i == activeBar ? 5 : 0,
                                            borderBottomColor: '#598EF6'
                                        }} onPress={()=> { setActiveBar(i); getUpcomingQuizList(item.id); } }>
                                        {item.thumbnail?<Image source={{uri: item.thumbnail}} style={{ height: 20, width: 20 }} />
                                        :<Ionicon name='filter' size={20} color='#000' />}
                                        <Text style={{ color: '#000', fontWeight: 'bold',fontSize:8 }}>
                                            {item.coursename}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            </View>

                                {/* <View style={styles.upcomingView}>
                                    <Text style={styles.upcomingText}>
                                        Upcoming Quizzes
                                    </Text>
                                    <TouchableOpacity onPress={() => setFilterShow(true)}>
                                        <Ionicon name='filter' size={20} color='#000' style={{ marginRight:10 }} />
                                    </TouchableOpacity>
                                </View> */}

                                <View style={{flex: 1,justifyContent: "center",alignContent :'center'}}>
                                {QuizLoader ?
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center",marginTop: windowHeight/5}}>
                                    <ActivityIndicator color={"#A9A9A9"} size={'large'} />
                                </View>
                                :
                                <ScrollView
                                    showsHorizontalScrollIndicator={false}
                                    style={{marginVertical:10}}>
                                    {homeSection && homeSection.length>0 ? homeSection.map((item, i) => {

                                    const expDate = moment(item.startdate); // create moment from string with format 
                                    const nowDate = moment(new Date()); // new moment -> today 
                                    const diff = expDate.diff(nowDate, 'seconds'); // returns 366 

                                    // () => setCurrentTime(diff);
                                    // console.log('date remain', expDate.diff(nowDate, 'days'));
                                    return(
                                    <View key={i}>
                                    {/* {QuizEnd == true ? null :  */}
                                    <QuizModal 
                                        width={'95%'}
                                        item={item}
                                        nowDate={nowDate}
                                        expDate={expDate}
                                        diff={diff}
                                        onPress = {() => {
                                            setQuizItem(item);
                                            item.join_id == null
                                            ? navigation.navigate('JoinQuiz', {userId: UserInfo.id, item: item, Amount:Balance})
                                            : setCountdownModal(true);
                                        }} 
                                        onFinish={() => {
                                            console.log('quiz time finish');
                                            setQuizEnd(true);
                                        }}
                                        // onChange={until => {
                                        //     if (countdownModal == true && CurrentTime == 0) {
                                        //         console.log('until', until);
                                        //         setCurrentTime(until);
                                        //     }
                                        // }}
                                    />
                                    {/* } */}
                                        </View>
                                    )}) : <EmptyScreen />}
                                </ScrollView>}
                                </View>
                    
                        
                        {/* <ScrollView
                            showsHorizontalScrollIndicator={false}
                            style={{marginBottom:10}}>
                            {homeSection.map((item, i) => (
                                    <TouchableOpacity key={item}
                                       activeOpacity={1}
                                       style={{
                                        width:'90%',
                                        backgroundColor: '#FFFFFF',
                                        borderColor: '#D5D5D5',
                                        borderWidth: 1,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 4,
                                        elevation: 5,
                                        borderRadius: 10,
                                        alignItems: 'center',
                                        marginTop: 10,
                                        alignSelf: 'center',
                                    }}>
                                        <View style={{ width: '100%', padding: 10, marginTop: 5, justifyContent:'space-between', flexDirection:'row' }}>
                                            <Text style={{ fontSize: 13, color: '#000' }}>{'FanCode ESC T20 - Kiel'}</Text>
                                            <MaterialIcon name='bell-plus-outline' size={20} color='#000' />
                                        </View>
                                        <View style={{width:'93%', alignSelf:'center', height:0.5,backgroundColor:'#A8A8A8'}} />
                                        <View style={{ width: '100%', padding: 10, marginTop: 5, justifyContent:'space-between', flexDirection:'row' }}>
                                            <Text style={{ fontSize: 15, color: '#000' }}>{'Moorburger TSV'}</Text>
                                            <Text style={{ fontSize: 15, color: '#000' }}>{'First Contact'}</Text>
                                        </View>
                                        <View style={{ width: '100%', paddingHorizontal: 10,paddingVertical:7, justifyContent:'space-between', flexDirection:'row' }}>
                                            <View style={{ width: '40%', flexDirection:'row',alignItems:'center' }}>
                                                <Image source={require('../../assets/01.png')} style={{ height: 15, width: 25,marginRight:10 }} />
                                                <Text style={{ fontSize: 15, color: '#000', textTransform:'uppercase' }}>{'mtsv'}</Text>
                                            </View>
                                            <View style={{ width: '20%',alignItems:'center' }}>
                                                <Text style={{ fontSize: 15, color: '#A01319',fontWeight:'bold' }}>{'1h 39m'}</Text>
                                            </View>
                                            <View style={{ width: '40%', flexDirection:'row',justifyContent:'flex-end',alignItems:'center' }}>
                                                <Text style={{ fontSize: 15, color: '#000', textTransform:'uppercase',marginRight:10 }}>{'fct'}</Text>
                                                <Image source={require('../../assets/01.png')} style={{ height: 15, width: 25 }} />
                                            </View>
                                        </View>
                                        <View style={{ width: '100%', paddingHorizontal: 10,paddingVertical:7, marginTop: 5, justifyContent:'space-between', flexDirection:'row',backgroundColor:'#F5F5F5' }}>
                                            <View style={{ width: '50%', flexDirection:'row',alignItems:'center',justifyContent:'flex-start' }}>
                                                <View style={{paddingVertical:2,paddingHorizontal:7,borderWidth:0.5,borderColor:'#288D49'}}>
                                                    <Text style={{ fontSize: 12, color: '#288D49',fontWeight:'bold',borderRadius:10}}>{'MEGA'}</Text>
                                                </View>
                                                <Text style={{ fontSize: 14, color: '#000',fontWeight:'bold',marginLeft:10}}>{'1 Crore'}</Text>
                                            </View>    
                                            <View style={{ width: '50%', flexDirection:'row',alignItems:'center',justifyContent:'flex-end' }}>
                                                <FeatherIcon name='tv' size={18} color='#989898' style={{marginRight:10}} />
                                                <Ionicon name='shirt-outline' size={18} color='#989898' />
                                            </View>    
                                        </View>
                                    </TouchableOpacity>
                            ))}
                    </ScrollView> */}

                        {/* {quizList.length > 0 &&
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                    <View
                                        style={{
                                            height: hp('3'),
                                            width: wp('4'),
                                            backgroundColor: '#1E3173',
                                        }}
                                    />
                                    <Text style={{ fontSize: 20, width: wp('70'), fontWeight: Platform.OS === 'ios' ? '700' : 'bold', marginLeft: 10 }}>
                                        Popular Quizzes {'\n'}
                                        <Text style={{ fontSize: 10, fontWeight: 'normal', color: '#878380' }}>Explore App from here</Text>
                                    </Text>
                                    <TouchableOpacity style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }} onPress={() => navigation.navigate('QuizSection')}>
                                        <Text style={{ color: '#44ACD6' }}>View All</Text>
                                        <Ionicon name="md-arrow-forward" size={15} color="#44ACD6" style={{ marginLeft: 5 }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10, paddingBottom: 10 }}>
                                    {quizList.map((item, i) => (
                                        <>
                                            <View key={i} style={styles.listMainView}>
                                                <TouchableOpacity onPress={() => redirection(item)}>
                                                    <Text numberOfLines={1} style={styles.ListHeadText}>{item.name}</Text>
                                                    <View style={{ width: '100%', flexDirection: 'row' }}>
                                                        <View style={{ width: '60%', justifyContent: 'center' }}>
                                                            <Text style={styles.ListText}>{item.quizdate} | {item.totalquestions + 'Qs.' + item.duration + 'mins'}</Text>
                                                        </View>
                                                        <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                            <Text
                                                                style={{
                                                                    color: 'green',
                                                                    fontSize: 13,
                                                                }}>{item.quizresultid == null ? 'Start Now' : 'View Result'}</Text>
                                                            <Ionicon name="md-arrow-forward" size={15} color="green" style={{ marginLeft: 5 }} />
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={{
                                                    borderBottomWidth: 0.3,
                                                    borderBottomColor: '#E2DEDE',
                                                    paddingTop: 10
                                                }}></View>
                                            </View>

                                        </>
                                    ))}
                                </View>
                            </>} */}

                    </ScrollView>
                </View>
            )}


            {
                UpdateModalShow ? (
                    <Modal
                        isVisible={UpdateModalShow}
                        onBackdropPress={() => console.log('Can not close without update!')}>
                        <View style={styles.updateModalView}>
                            <Text style={styles.newVersionText}>New version is available!</Text>
                            <Text style={styles.appVersionText}>
                                {DeviceInfo.getApplicationName() +
                                    ' : ' +
                                    DeviceInfo.getVersion()}
                            </Text>
                            <TouchableOpacity
                                style={styles.btnView}
                                onPress={() => setUpdateModalShow(!UpdateModalShow)}>
                                <Text style={styles.btnText}>Update Now</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                ) : null
            }

                <Modal
                    style={{width: '100%',top:5,height: null,borderTopLeftRadius:10,borderTopRightRadius:10,backgroundColor:'#F3F3F3'}}
                    swipeToClose={true}
                    swipeArea={10}
                    swipeThreshold={50}
                    isOpen={filterShow}
                    backdropOpacity={0.5}
                    entry={'bottom'}
                    backdropPressToClose={true}
                    position={'bottom'}
                    backdropColor={'#000'}
                    coverScreen={true}
                    onClosed={()=> setFilterShow(false)}
                    backdrop={true}
                    backButtonClose={true}>
                    <View>
                        
                        <View style={styles.filterView}>
                            {/* <TouchableOpacity style={{width:'10%'}} onPress={()=>setFilterShow(false)}>
                                <AntDesignIcon name='close' size={20} color='#000' />
                            </TouchableOpacity> */}
                            <View style={{width:'70%'}}>
                                <Text style={{fontSize:16,fontFamily:'GilroyBold',marginLeft:15}}>Filters</Text>
                            </View>
                            <TouchableOpacity style={{width:'25%',alignItems:'flex-end'}} 
                                              onPress={()=>{setSelect(null); onApplyFilter('All') }}>
                                <Text style={{fontSize:16,fontFamily:'SofiaProRegular',color:'#bdc2c9'}}>RESET</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.ViewBorder} />

                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            style={{marginTop:20,backgroundColor:'#fff'}}>
                            {option.map((item, i) => (
                            <View key={i}>
                                <TouchableOpacity onPress={()=>{setSelect(i); console.log(i,'i'); onApplyFilter(option[i].id) }} style={styles.optionView}>
                                    <View style={{width:'10%',alignItems:'flex-start',justifyContent:'flex-start'}}>
                                        {/* {i == 0 ?<AntDesignIcon name={item.icon} size={20} color="#000" />
                                        : <FontAwesomeIcon name={item.icon} size={20} color="#000" />} */}
                                        <Image source={{uri: item.thumbnail}} style={{ height: 30, width: 30,borderRadius:100 }} />
                                    </View>
                                    <View style={{width:'80%'}}>
                                        <Text style={{color:'#000',fontSize:15,fontFamily:'GilroyMedium'}}>{item.coursename}</Text>
                                        {/* <Text style={{color:'#000',fontWeight:'bold',fontSize:10,fontFamily:'SofiaProRegular'}}>{item.coursename}</Text> */}
                                    </View>
                                    {select == i?<Ionicon name='radio-button-on' size={30} color='#000' />
                                    :<Ionicon name='radio-button-off' size={30} color='#21496C' />}
                                </TouchableOpacity>
                                <View style={{backgroundColor:'#F5F5F5',width:'100%',height:2}} />
                            </View>

                        ))}
                        </ScrollView>  

                        {/* <TouchableOpacity activeOpacity={1} onPress={() => onApplyFilter(option[select].id)}
                            style={[styles.ApplyBtn,{backgroundColor:select != null?'#009D38':'#DADADA'}]}>
                            <Text style={[styles.apply,{color:select != null?'#fff':'#939393'}]}>Apply</Text>
                        </TouchableOpacity>                       */}

                    </View>
                </Modal>

                <ModalComponent 
                    navigation={navigation}
                    userId={UserInfo && UserInfo.id}
                    quizKey={QuizItem && QuizItem.key}
                    countdownModal={countdownModal}
                    QuizItem={QuizItem}
                    CurrentTime={CurrentTime}
                    Language={Language ? Language : ''}
                    distributionPlan={() => navigation.navigate('JoinQuiz', {userId: UserInfo.id, item: QuizItem, Amount:Balance}) }
                    onClosed={() => { setCountdownModal(false); setCurrentTime(0); setLanguage(); } }
                    onValueChange={(itemValue, itemIndex) => {
                        console.log('picker ', itemValue, itemIndex)
                        setLanguage(itemValue)
                        }
                    }
                    onFinish={()=> setEnableBtn(true) }
                    onPress={()=> 
                        // CurrentTime == 0
                        // enableBtn
                        // ? 
                        navigation.navigate('MyTests', { userid: UserInfo.id, quiz_key: QuizItem.key, })
                        // : 
                        // null 
                    }
                    //     () =>
                    //     navigation.navigate('MyTests', {
                    //       userid: UserInfo.id,
                    //       quiz_key: QuizItem.key,
                    //     })
                    // }
                />

            <Modal
              style={{width: '80%',height: 150,borderTopLeftRadius:10,borderRadius:10,backgroundColor:'#fff'}}
              swipeToClose={true}
              swipeArea={10}
              swipeThreshold={50}
              isOpen={modal1}
              backdropOpacity={0.5}
              entry={'top'}
              backdropPressToClose={true}
              position={'center'}
              backdropColor={'#000'}
              coverScreen={true}
              backdropPressToClose={false}>
              <View style={{flex:1,alignItems:'center',padding:15}}>
                  <View style={{marginVertical:15}}>
                    <Text style={{color:'#000',fontSize:17,fontFamily:'GilroyMedium'}}>
                        Quiz Submitted successfully!
                    </Text>
                    <TouchableOpacity onPress={()=> setModal1(false) } 
                        style={[styles.AddBtn]}>
                        <Text style={[styles.button,styles.SofiaFont]}>{'Okay'}</Text>
                    </TouchableOpacity>
                  </View>
              </View>
            </Modal>

                <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />

        </View>
    );
};
export default Home;

const styles = StyleSheet.create({
    ContainerBg: {
        flex: 1,
        justifyContent: "center",
        width:windowWidth,
        height:windowHeight,
        resizeMode: "cover",
        backgroundColor:'#FAFAFA'
    },
    headerBar: {flexDirection:'row',width:'20%',justifyContent:'flex-end',alignItems:'center'},
    notiCount: {color:'#fff',fontSize:9},
    walletView: {
        paddingHorizontal:10,
        paddingVertical:7,
        borderRadius:4,
    },
    upcomingView: {width: '90%',marginLeft: 20,marginTop:20,justifyContent:'space-between',flexDirection:'row'},
    upcomingText: { fontSize: 16, textAlign:'left', fontWeight: Platform.OS === 'ios' ? '700' : 'bold',fontFamily:'GilroyMedium',color:'#000' },
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
    firstRow: { width: '100%', paddingVertical: 5, paddingHorizontal:15, marginTop: 5, justifyContent:'space-between', flexDirection:'row' },
    firstRowText: { fontSize: 15, color: '#000',fontFamily:'SofiaProRegular' },
    secondRow: { width: '100%', paddingHorizontal: 10, justifyContent:'space-between', flexDirection:'row',alignItems:'center' },
    secondRowText: { fontSize: 12, color: '#A01319', fontFamily:'SofiaProRegular' },
    secondRowColumn: {backgroundColor:'#EEF1EF', flexDirection:'row',padding:2,borderRadius:4,marginVertical:2},
    secondRowColumnText: {fontSize: 12, color: '#000',fontFamily:'SofiaProRegular',},
    thirdRow: { width: '100%', paddingHorizontal: 10, paddingVertical:4, marginTop:5, justifyContent:'space-between', flexDirection:'row',backgroundColor:'#F5F5F5',borderBottomLeftRadius:10,borderBottomRightRadius:10 },
    thirdRowFirst: { width: '25%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start' },
    thirdRowSecond: { width: '35%',flexDirection:'row',alignItems:'center',justifyContent:'center' },
    thirdRowThird: { width: '40%',flexDirection:'row',alignItems:'center',justifyContent:'flex-end' },
    thirdRowText: { fontSize: 10, color: '#000',fontFamily:'SofiaProRegular'},
    thirdRowText1: { fontSize: 12, color: '#000',marginLeft:5,fontFamily:'SofiaProRegular'},
    thirdRowText2: {width:65,alignSelf:'center',height:25,justifyContent:'center',alignItems:'center',borderRadius:5,borderWidth:0.5,backgroundColor:'#009D38',borderColor:'#009D38'},
    playBtn: { fontSize: 10, color: '#fff',fontFamily:'SofiaProRegular'},
    walletAmount: {flexDirection:'row',justifyContent:'center'},
    AddBtn: {width:100,alignSelf:'center',height:45,marginTop:10,justifyContent:'center',alignItems:'center',borderRadius:4,backgroundColor:'#109E38'},
    button: { fontSize: 15, color: '#fff',borderRadius:5},
    borderView: {width:'90%',alignSelf:'center',height:0.5,backgroundColor:'grey',marginTop:15},
    modalFirstRow: {width:'90%',alignSelf:'center',marginTop:15,flexDirection:'row'},
    modalText: {width:'70%',alignItems:'flex-start'},
    modalTextValue: {textTransform:'uppercase',fontSize:12,fontFamily:'SofiaProRegular'},
    modalAMount: {flexDirection:'row',justifyContent:'center'},
    amount: {textTransform:'uppercase',fontSize:14,fontWeight:'bold',marginTop:5,fontFamily:'SofiaProRegular'},
    TooltipView: {width:'30%',alignItems:'flex-end'},
    TooltipText: {fontSize:11,color:'#fff',textAlign:'center'},
    filterView: {width:'100%',alignSelf:'center',paddingTop:15,paddingHorizontal:10,flexDirection:'row',backgroundColor:'#F3F3F3',borderTopLeftRadius:10,borderTopRightRadius:10,flexDirection:'row',justifyContent:'flex-start'},
    resetBtn: {textTransform:'uppercase',fontSize:14,fontWeight:'bold',fontFamily:'SofiaProRegular',color:'#D1D1D1'},
    ViewBorder: {backgroundColor:'#F5F5F5',width:'100%',height:2},
    ApplyBtn: {width:'90%',marginTop:10,marginBottom:10,alignSelf:'center',height:45,alignItems:'center',justifyContent:'center',borderRadius:4},
    apply: {textTransform:'uppercase',fontSize:14,fontFamily:'GilroyMedium'},


    headerView: {
        flexDirection: 'row',
        marginTop:  0,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 5,
        // borderWidth:1,
        height: 50,
        backgroundColor:'#4782F5'
    },
    headerImg: { width:'12%',height: 25,justifyContent:'center',paddingLeft:10 },
    headerText: { width: '60%' },
    textHead: { fontSize: 18, textAlign: 'center',color:'#fff',fontFamily:'GilroyMedium' },
    textname: { fontSize: 20, fontWeight: 'bold',color:'#fff' },
    notiImg: {
        width: '10%',
        alignItems:'center'
        // marginLeft: wp('2'),
    },
    profileView: {
        // marginLeft: wp('2'),
        width:'10%',
        alignItems:'center',
    },
    profileImg: { height: 40, width: 40, borderRadius: 20 },
    dividerView: {
        marginTop: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: '#D2D2D2',
    },

    sectionText: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 10
    },
    sectionView: {
        width: '33%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 120,
    },
    sectionImage: { 
        width: 35, 
        height: 35 
    },
    walletModalView: {
        width: '100%',
        paddingTop:10
    },
    walletModalText: {
        textAlign:'center',
        textTransform:'uppercase',
        fontSize:18,
        fontFamily:'GilroyMedium'
    },
    newVersionText: { fontSize: 20, fontWeight: 'bold',fontFamily:'SofiaProRegular' },
    appVersionText: { fontSize: 14, fontWeight: 'bold',fontFamily:'SofiaProRegular' },
    btnView: { alignSelf: 'flex-end', marginTop: 20 },
    btnText: {
        fontSize: 14,
        color: '#119D90',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontFamily:'SofiaProRegular'
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
            height: 2
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        elevation: 5
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
        justifyContent:'center',
        alignItems:'center',
        width: 15,
        height: 15,
        borderRadius:20,
        backgroundColor:'red',
        position:'absolute',
        bottom:15,
        left:22
    },
    optionView: {
        width:'100%',
        alignSelf:'center',
        flexDirection:'row',
        // marginTop:10,
        // borderWidth:1,
        // borderColor:'#21496C',
        height:55,
        // borderRadius:20,
        justifyContent:'space-between',
        paddingHorizontal:15,
        alignItems:'center'
       },
       SofiaFont: {
        fontFamily:'SofiaProRegular'
    } 
});