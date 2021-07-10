import React, { useContext, useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { Image, View, Text, Platform, Linking } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import DeviceInfo from 'react-native-device-info';
import Splash from './screen/Splash';
import Login from './screen/Login';
// import IntroScreen from './screen/Intro';
import Home from './screen/Home';
import MyTests from './screen/MyTests';
import Saved from './screen/Saved'
import { MyContext } from './components/UseContext'
import Doubt from './screen/Doubt';
import MyVideoLectures from './screen/MyVideoLectures';
import MyProfile from './screen/MyProfile';
import BuyVideo from './screen/BuyVideoLecture';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import ViewPackage from './screen/ViewPackage';
import PayYourFee from './screen/PayYourFee';
import SignUp from './screen/SignUp';
import SelectCourse from './screen/SelectCourse';
import Passes from './screen/Passes';
import Checkout from './screen/Checkout';
import Coupon from './screen/Coupon';
import VideoSolution from './screen/VideoSolution';
import TopperList from './screen/TopperList';
import Promo from './screen/Promo';
import Settings from './screen/Settings'
import Transaction from './screen/Transaction'
import Profile from './screen/Profile';
import YourExams from './screen/YourExams';
import SubExams from './screen/SubExams';
import Account from './screen/Account';
import ViewSavedQuestion from './screen/ViewSavedQuestion';
import OrderSummary from './screen/OrderSummary';
import Exams from './screen/Exams';
import ExamCategory from './screen/ExamCategory';
import ViewExamCategory from './screen/ViewExamCategory';
import Blog from './screen/Blog';
import { WebView } from 'react-native-webview'
import MyDoubts from './screen/MyDoubts';
import ViewDoubt from './screen/ViewDoubt';
import Register from './screen/Register';
import SignIn from './screen/SignIn';
import SignInOtp from './screen/SignInOtp';
import AddCash from './screen/AddCash';
import MyQuiz from './screen/MyQuiz';
import RecentTransactions from './screen/RecentTransactions';
import ManagePayment from './screen/ManagePayment';
import AfterLoginOTP from './screen/AfterLoginOTP';

import QuizSection from './screen/QuizSection';
import QuizStart from './screen/QuizStart';
import BlogPost from './screen/BlogPost';
import QuizResult from './screen/QuizResult';
import QuizSolution from './screen/QuizSolution';
import AllExamReview from './screen/AllExamReview';
import Feedback from './screen/Feedback';
import AttemptedQuiz from './screen/AttemptedQuiz';
import axiosClient from './api/axios-client';
import ForgotPassword from './screen/ForgotPassword';
import Notifications from './screen/Notifications';
import ViewNotification from './screen/ViewNotification';
import MyBalance from './screen/MyBalance'; 
import MyCoupons from './screen/MyCoupons';
import EarnMoney from './screen/EarnMoney';
import InfoSettings from './screen/InfoSettings';
import editField from './screen/editField';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import PrivavySettings from './screen/PrivavySettings';
import Winner from './screen/Winner';
import AllWinners from './screen/AllWinners';
import VerifyAccount from './screen/VerifyAccount';
import VerifyScreens from './screen/VerifyScreens';
import OTPForVerification from './components/OTPForVerification';
import VerifyPAN from './screen/VerifyPAN';
import VerifyBank from './screen/VerifyBank';
import SpinWin from './screen/SpinWin';
import TopWinner from './screen/TopWinner';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Store from './screen/Store';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from 'react-native-google-signin';
import { firebase } from '@react-native-firebase/auth';
import JoinQuiz from './screen/JoinQuiz';

const { Navigator, Screen } = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

let userData = null;

const AppNavigator = () => {

    return (
        <NavigationContainer>
            <Navigator headerMode='none' initialRouteName='Splash'>
                <Screen name='Splash' component={Splash} />
                {/* <Screen name='Intro' component={IntroScreen} /> */}
                <Screen name='Login' component={Login} />
                <Screen name='Home' component={myDrawer} />
                <Screen name='MyProfile' component={myDrawer} />
                <Screen name='MyTests' component={MyTests} />
                {/* <Screen name='ViewPackage' component={ViewPackage} /> */}
                {/* <Screen name='PayYourFee' component={PayYourFee} /> */}
                <Screen name='SignUp' component={SignUp} />
                {/* <Screen name='SelectCourse' component={SelectCourse} /> */}
                {/* <Screen name='Passes' component={Passes} /> */}
                {/* <Screen name='Checkout' component={Checkout} /> */}
                {/* <Screen name='Coupon' component={Coupon} /> */}
                {/* <Screen name='VideoSolution' component={VideoSolution} /> */}
                {/* <Screen name='TopperList' component={TopperList} /> */}
                {/* <Screen name='Promo' component={Promo} /> */}
                <Screen name='Profile' component={Profile} />
                {/* <Screen name='YourExams' component={YourExams} /> */}
                {/* <Screen name='SubExams' component={SubExams} /> */}
                {/* <Screen name='Account' component={Account} /> */}
                {/* <Screen name='ViewSavedQuestion' component={ViewSavedQuestion} /> */}
                {/* <Screen name='OrderSummary' component={OrderSummary} /> */}
                {/* <Screen name='Exams' component={Exams} /> */}
                {/* <Screen name='ExamCategory' component={ExamCategory} /> */}
                {/* <Screen name='ViewCategory' component={ViewExamCategory} /> */}
                {/* <Screen name='Blog' component={Blog} /> */}
                {/* <Screen name='BlogPost' component={BlogPost} /> */}
                {/* <Screen name='QuizSection' component={QuizSection} /> */}
                {/* <Screen name='QuizStart' component={QuizStart} /> */}
                {/* <Screen name='QuizResult' component={QuizResult} /> */}
                {/* <Screen name='QuizSolution' component={QuizSolution} /> */}
                {/* <Screen name='Feedback' component={Feedback} /> */}
                {/* <Screen name='AttemptedQuiz' component={AttemptedQuiz} /> */}
                {/* <Screen name='MyDoubts' component={MyDoubts} /> */}
                {/* <Screen name='ViewDoubt' component={ViewDoubt} /> */}
                <Screen name='ForgotPassword' component={ForgotPassword} />
                <Screen name='Notifications' component={Notifications} />
                <Screen name='ViewNotification' component={ViewNotification} />
                <Screen name='Register' component={Register} />
                <Screen name='SignIn' component={SignIn} />
                <Screen name='SignInOtp' component={SignInOtp} />
                <Screen name='AddCash' component={AddCash} />
                <Screen name='MyBalance' component={MyBalance} />
                <Screen name='MyCoupons' component={MyCoupons} />
                <Screen name='EarnMoney' component={EarnMoney} />
                <Screen name='InfoSettings' component={InfoSettings} />
                <Screen name='editField' component={editField} />
                <Screen name='MyQuiz' component={MyQuiz} />
                <Screen name='RecentTransactions' component={RecentTransactions} />
                <Screen name='ManagePayment' component={ManagePayment} />
                <Screen name='AfterLoginOTP' component={AfterLoginOTP} />
                <Screen name='PrivavySettings' component={PrivavySettings} />
                <Screen name='Winner' component={Winner} />
                <Screen name='AllWinners' component={AllWinners} />
                <Screen name='VerifyAccount' component={VerifyAccount} />
                <Screen name='VerifyScreens' component={VerifyScreens} />
                <Screen name='OTPForVerification' component={OTPForVerification} />
                <Screen name='VerifyPAN' component={VerifyPAN} />
                <Screen name='VerifyBank' component={VerifyBank} />
                <Screen name='SpinWin' component={SpinWin} />
                <Screen name='TopWinner' component={TopWinner} />
                <Screen name='Store' component={Store} />
                <Screen name='JoinQuiz' component={JoinQuiz} />
            </Navigator>
        </NavigationContainer>
    )
}

function MyTabs({ navigation }) {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let image;
                if (route.name == 'Home') {
                    image = focused ?
                    <Image source={require('../assets/bottomicons/home.png')} style={{width:20,height:20,resizeMode:'cover'}} />
                    : <Image source={require('../assets/bottomicons/homeBlack.png')} style={{width:20,height:20,resizeMode:'cover'}} />
                } else if (route.name == 'MyQuiz') {
                    image = focused ?
                    <Image source={require('../assets/bottomicons/Quiz.png')} style={{width:20,height:20,resizeMode:'cover'}} />
                    : <Image source={require('../assets/bottomicons/QuizBlack.png')} style={{width:20,height:20,resizeMode:'cover'}} />
                        // <Ionicon name='trophy-outline' size={20} color='#C61D24' />
                        // : <Ionicon name='trophy-outline' size={20} color='#000' />
                } else if (route.name == 'Doubt') {
                    image = focused ?
                    <Image source={require('../assets/bottomicons/Quiz.png')} style={{width:20,height:20,resizeMode:'cover'}} />
                    : <Image source={require('../assets/bottomicons/QuizBlack.png')} style={{width:20,height:20,resizeMode:'cover'}} />
                } else if (route.name == 'MyProfile') {
                    image = focused ?
                    <Ionicon name='newspaper-outline' size={20} color='#C61D24' />
                    : <Ionicon name='newspaper-outline' size={20} color='#000' />
                } else if(route.name == 'Winners') {
                    image = focused ?
                    <Image source={require('../assets/bottomicons/winner.png')} style={{width:20,height:20,resizeMode:'cover'}} />
                    : <Image source={require('../assets/bottomicons/winnerBlack.png')} style={{width:20,height:20,resizeMode:'cover'}} />
                }
                 else if(route.name == 'Store') {
                    image = focused ?
                    <Image source={require('../assets/bottomicons/Store.png')} style={{width:20,height:20,resizeMode:'cover'}} />
                    : <Image source={require('../assets/bottomicons/StoreBlack.png')} style={{width:20,height:20,resizeMode:'cover'}} />
                }
                return image;
            },
        })}
            tabBarOptions={{
                activeTintColor: '#759DFC',
                labelStyle: {
                    fontSize: 12,
                    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
                    paddingBottom: Platform.OS === 'android' ? hp('1') : 0
                },
                // activeBackgroundColor: 'red',
                // inactiveBackgroundColor: 'red',          
                style: {
                    height: Platform.OS === 'android' ? 55 : 75,
                }
            }}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="MyQuiz" options={{
                tabBarLabel: 'My Quizzes'
            }} component={MyQuiz} />
            <Tab.Screen name="Winners" options={{
                tabBarLabel: 'Winners'
            }} component={TopWinner} />
            <Tab.Screen name="Store" options={{
                tabBarLabel: 'Store'
            }} component={Store} />
            {/* <Drawer.Screen name={"SpinWin"} component={SpinWin} options={{
                drawerLabel: () => (<Text>{'Spin & Wheel'}</Text>),
                drawerIcon: ({ focused, size }) => (
                    <MaterialIcon name='ship-wheel' size={22} color='#000' style={{alignSelf:'center'}} />
                )
            }}></Drawer.Screen> */}
            {/* <Tab.Screen name="Doubt" options={{
                tabBarLabel: 'Chat'
            }} component={Doubt} /> */}
            {/* <Tab.Screen name="MyProfile" options={{
                tabBarLabel: 'Feed'
            }} component={MyProfile} /> */}
        </Tab.Navigator>
    );
}

const HomeStack = createStackNavigator();
const WinnerStack = createStackNavigator();
const SettingStack = createStackNavigator();

function HomeStackScreen() {
    return (
        <HomeStack.Navigator screenOptions={{
            headerShown: false,
            headerMode: 'none',
            // headerStyle: {backgroundColor:'red'}
        }}>
            <HomeStack.Screen name="Home" component={MyTabs} />
        </HomeStack.Navigator>
    )
}

function WinnerStackScreen() {
    return (
        <WinnerStack.Navigator screenOptions={{
            headerShown: false,
            headerMode: 'none',
            // headerStyle: {backgroundColor:'red'}
        }}>
            <WinnerStack.Screen name="TopWinner" component={MyTabs} />
        </WinnerStack.Navigator>
    )
}

// function SettingStackScreen() {
//     return (
//         <SettingStack.Navigator screenOptions={{
//             headerShown: false,
//             headerMode: 'none'
//         }}>
//             <SettingStack.Screen name="MyProfile" component={MyTabs} />

//         </SettingStack.Navigator>
//     )
// }

// const checkGoogleLogin = async () => {
//     await AsyncStorage.getItem('isGoogleLogin', (err, result) => {
//         //console.log('output is ', err, result);
//         if (!err && result !== null) {
//             response = JSON.parse(result);
//             //console.log('resutl is', result);
//             let revoke = GoogleSignin.revokeAccess();
//             let signOut = GoogleSignin.signOut();  
//             AsyncStorage.removeItem('isGoogleLogin');  
//             //console.log('signout', revoke, signOut);
//             // throw err;
//         }
//         else {
//             //console.log(err)
//         }
//     });
// }

const Logout = ({navigation}) => { 
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
        //console.log('user logged in',user)
        // signOutWithGoogle();
        } else {
            //console.log('user not logged in')
        }
    });
    AsyncStorage.removeItem('userInfo');
    navigation.navigate('SignIn');
    return true;
}

// const signOutWithGoogle = async() => {
//     try {
//         await GoogleSignin.revokeAccess();
//         await GoogleSignin.signOut();
//     } catch (error) {
//         console.error(error);
//     }
// }

const getUserData = async() => {
    await AsyncStorage.getItem('userInfo', async(err, result) => {
    if (!err && result !== null) {
        userData = JSON.parse(result);
        //console.log('userInfo data', result, userData)
    } else {
        //console.log('userInfo err', err)
    }
    })
}

const myDrawer = ({ navigation }) => {

    const { user } = useContext(MyContext);

    // const drawerLabelPass = () => {
    //     return(
    //         <View style={{flexDirection:'row',width:300}}>
    //             <View style={{width:'30%'}}>
    //             <Text style={{fontWeight:'bold'}}>Pass</Text>
    //             </View>
    //             {leftdays != null?<View style={{width:'35%'}}>
    //             <Text style={{fontWeight:'bold',textAlign:'center',borderStyle: 'dashed',borderRadius: 1,borderWidth:1}}>{leftdays?leftdays:'365'} Days left</Text>
    //             </View>:null}
    //         </View>
    //         )
    // }

    // const label = () => {
    //     return(
    //         <View style={{flexDirection:'row'}}>
    //         <Text style={{color:'#000',fontWeight:'bold'}}>Earn </Text>
    //         <FontAwesomeIcon name='rupee' size={15} color='#000' style={{marginTop:3}} />
    //         <Text style={{color:'#000',fontWeight:'bold'}}>200</Text>
    //     </View>
    //     )
    // }
    
    return (
        <Drawer.Navigator screenOptions={{}} drawerContentOptions={{
            activeTintColor: '#000', /* font color for active screen label */
            activeBackgroundColor: '#fff', /* bg color for active screen */
            inactiveTintColor: '#000', /* Font color for inactive screens' labels */
            labelStyle: { color: 'red',fontWeight:'normal' },
          }}
        drawerStyle={{margin:0,padding:0}} drawerContent={props => <CustomDrawerContent {...props} user={user} navigation={navigation} />} drawerPosition={'left'}>
            <Drawer.Screen name="Home" component={HomeStackScreen}
                options={{
                    drawerLabel: () => (<Text>{'Home'}</Text>),
                    drawerIcon: ({ focused, size }) => (
                        <Image source={require('../assets/drawericon/home.png')} style={{ height: 20, width: 20 }} />
                    )
                }} ></Drawer.Screen>
            {/* <Drawer.Screen name="Passes" component={Passes}
                options={{
                    drawerLabel: drawerLabelPass,
                    labelStyle: { fontWeight: 'bold' },
                    drawerIcon: ({ focused, size }) => (
                        // <View style={{width:'100%',backgroundColor:'red',flexDirection:'row'}}>
                           <Image source={require('../assets/drawericon/pass.png')} style={{ height: 20, width: 20 }} />
                        //    <Text>{drawerLabelPass}</Text>
                        // </View>
                    )
                }}></Drawer.Screen>
            <Drawer.Screen name="Saved" component={Saved}
                options={{
                    drawerLabel: 'Saved',
                    labelStyle: { fontWeight: 'bold' },
                    drawerIcon: ({ focused, size }) => (
                        <Image source={require('../assets/drawericon/saved.png')} style={{ height: 20, width: 20 }} />
                    )
                }}></Drawer.Screen>
            <Drawer.Screen name='Promo' component={Promo}
                options={{
                    drawerLabel: 'Promo',
                    labelStyle: { fontWeight: 'bold' },
                    drawerIcon: ({ focused, size }) => (
                        <Image source={require('../assets/drawericon/promo_two.png')} style={{ height: 20, width: 20 }} />
                    )
                }}></Drawer.Screen>
            <Drawer.Screen name='AllExamReview' component={AllExamReview}
                options={{
                    drawerLabel: 'All Exam Review',
                    labelStyle: { fontWeight: 'bold' },
                    drawerIcon: ({ focused, size }) => (
                        <Image source={require('../assets/drawericon/1.png')} style={{ height: 20, width: 20 }} />
                    )
                }}></Drawer.Screen>
            <Drawer.Screen name="Shareapp" initialParams={{ screenName: 'shareApp' }} component={Home} options={{
                drawerLabel: 'Referral',
                labelStyle: { fontWeight: 'bold' },
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/drawericon/share.png')} style={{ height: 20, width: 20 }} />
                )
            }}></Drawer.Screen>

            */}

            <Drawer.Screen name='MyBalance' component={MyBalance}
                options={{
                    drawerLabel: () => (<Text>{'My Balance'}</Text>),
                    // labelStyle: { fontWeight: 'bold' },
                    drawerIcon: ({ focused, size }) => (
                        <Image source={require('../assets/drawericon/transition.png')} style={{ height: 20, width: 20 }} />
                    )
                }}></Drawer.Screen>
            <Drawer.Screen name="EarnMoney" component={EarnMoney} options={{
                drawerLabel: () => (<Text>{'Earn'}</Text>),//label,
                // labelStyle: { fontWeight: 'bold' },
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/drawericon/help.png')} style={{ height: 20, width: 20 }} />
                )
            }}></Drawer.Screen>
            <Drawer.Screen name="MyCoupons" component={MyCoupons} options={{
                drawerLabel: () => (<Text>{'My Coupons'}</Text>),
                // labelStyle: { fontWeight: 'bold' },
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/drawericon/feed.png')} style={{ height: 20, width: 20 }} />
                )
            }}></Drawer.Screen>
            <Drawer.Screen name='InfoSettings' component={InfoSettings}
                options={{
                    drawerLabel: () => (<Text>{'My Info & Settings'}</Text>),
                    // labelStyle: { fontWeight: 'bold' },
                    drawerIcon: ({ focused, size }) => (
                        <Image source={require('../assets/drawericon/settings.png')} style={{ height: 20, width: 20 }} />
                    )
            }}></Drawer.Screen> 
            {/* <Drawer.Screen name={"SpinWin"} component={SpinWin} options={{
                drawerLabel: () => (<Text>{'Spin & Wheel'}</Text>),
                drawerIcon: ({ focused, size }) => (
                    <MaterialIcon name='ship-wheel' size={22} color='#000' style={{alignSelf:'center'}} />
                )
            }}></Drawer.Screen> */}
            <Drawer.Screen name="Logout" component={Logout} options={{
                drawerLabel: () => (<Text>Logout</Text>),
                // labelStyle: { fontWeight: 'bold' },
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/logoutD.png')} style={{ height: 20, width: 20 }} />
                )
            }}></Drawer.Screen>
            <Drawer.Screen name="spinYourLuck" component={SpinWin} options={{
                drawerLabel: () => (<Image source={require('../assets/spinSection.jpg')} style={{ height: 70, width: '100%' }} />),
                // drawerIcon: ({ focused, size }) => (
                    // <Image source={require('../assets/spinSection.jpg')} style={{ height: 20, width: 20 }} />
                // )
            }}></Drawer.Screen>

        </Drawer.Navigator >
    )
}

function CustomDrawerContent(props) {
    const { user, navigation } = props;

    getUserData()

    return (
            <DrawerContentScrollView {...props} style={{marginTop:-5}}>
                <View style={{
                    flexDirection: 'row',
                    // justifyContent: 'space-between',
                    paddingVertical: 15,
                    paddingHorizontal:5,
                    backgroundColor:'#1A1A1A',
                }}>
                    {userData && userData.profile_image?<Image source={{uri: userData.profile_image}} style={{width:50,height:50,resizeMode:'cover',borderRadius:100}} />
                    :<FontAwesomeIcon name="user-circle-o" size={50} color="#fff" />}
                    <View style={{ width:'70%',marginTop: 8,marginLeft:10 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold',color: '#fff',fontFamily:'GilroyMedium' }}>{userData && userData.firstname}</Text>
                        <Text style={{ fontSize: 13,color: '#fff',fontFamily:'GilroyMedium' }}>{userData && userData.mobile}</Text>
                    </View>
                    <FeatherIcon name='chevron-right' size={22} color='#fff' style={{alignSelf:'center'}} />
                </View>
                {/* <View style={{ marginVertical: hp('1'), borderBottomWidth: 0.8, borderBottomColor: '#E1E5E7' }}>
                </View> */}
                <DrawerItemList {...props} labelStyle={{ fontWeight: 'bold', lineHeight: 15 }} style={{}} />
                <View style={{ alignItems: 'center', marginVertical: hp('1') }}>
                    <Text style={{ fontSize: 13, color: '#838383' }}>App Version {DeviceInfo.getVersion()}</Text>
                </View>
            </DrawerContentScrollView>
    );
}

// function myDrawer2() {
//     return (
//         <Drawer2.Navigator screenOptions={{
//         }} drawerStyle={{
//         }} initialRouteName={"Questions"}
//             drawerContent={props => <CustomQuestionDrawer {...props} propName={'val1'} />} drawerPosition={'right'}>
//             <Drawer2.Screen name="Questions" component={Questions} />
//         </Drawer2.Navigator>
//     )
// }

// function myDrawer3() {
//     return (
//         <Drawer3.Navigator screenOptions={{
//         }} drawerStyle={{
//         }} initialRouteName={"ResultSolutions"}
//             drawerContent={props => <SolutionDrawer {...props} propName={'val1'} />} drawerPosition={'right'}>
//             <Drawer3.Screen name="ResultSolutions" component={ResultSolutions} />
//         </Drawer3.Navigator>
//     )
// }

export default AppNavigator;