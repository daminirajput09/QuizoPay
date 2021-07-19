import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Image, Platform, StatusBar,Dimensions,ImageBackground,StyleSheet, ScrollView,BackHandler } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AppHeader from '../components/AppHeader';
import LinearGradient from 'react-native-linear-gradient';
import Toast, {BaseToast} from 'react-native-toast-message';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosClient from '../api/axios-client';
import Loader from '../components/Loader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useIsFocused} from '@react-navigation/native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const TopWinner = ({ navigation, route }) => {

    // const { User, quiz_key } = route.params;
    // console.log('params', User.id, quiz_key);
    const isFocused = useIsFocused();
    const TopTabBar = createMaterialTopTabNavigator();

    // const [loading, setLoading] = useState(false)
    // const [ActiveContest, setActiveContest] = useState('6lakh')
    const [loader, setLoader] = useState(true);
    const [TopWinners, setTopWinners] = useState([1,2,3,4]);
    const [UserId, setUserId] = useState();
    const [barItem, setBarItem] = useState(['BANK']);
    const [activeBar, setActiveBar] = useState(0);
    const [QuizRank, setQuizRank] = useState([1,2,3,4]);
    
    useEffect(() => {
        getWinners();
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }
    }, []);

    useEffect(() => { getWinners(); }, [isFocused]);

    const getWinners = () => {
        
        AsyncStorage.getItem('userInfo').then(user => {

        let userInfo = JSON.parse(user);

        console.log('user id is', userInfo.id);
        setUserId(userInfo.id);

        // if(User && User.id){
          const formData = new FormData();
          formData.append('userid', userInfo && userInfo.id); // User.id
          formData.append('quizkey', ''); // quiz_key
          axiosClient().post('quizzes/getCompletedQuizzes',formData)
          .then((res) => {
            setLoader(false);
            console.log('get winner res',res.data, formData);
            if(res.data.Error == 0){
                setBarItem(res.data.data);
                getQuizRanks(userInfo.id,res.data.data[0].key);
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
              console.log(err)
          })
        // }

      }).catch(e => console.log(e))

    }

      const getQuizRanks = (id,param) => {
        // if(User && User.id){

        // let key = barItem[param].key;
        // console.log('key in rank', key, barItem[param]);

          const formData = new FormData();
          formData.append('userid', id); // User.id
          formData.append('quizkey', param); // quiz_key
          axiosClient().post('quizzes/getQuizRanks',formData)
          .then((res) => {
            setLoader(false);
            console.log('getQuizRanks res',res.data, formData);
            if(res.data.Error == 0){
               setQuizRank(res.data.data);
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
              console.log(err)
          })
        // }
      }


    const handleBackPress = () => {
        navigation.goBack();
        return true;
    };

    const MyLoader = () => {
        return(
          <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={"100%"} height={50} />
              <SkeletonPlaceholder.Item width={"90%"} height={55} alignSelf={'center'} marginTop={10} />

              <SkeletonPlaceholder.Item paddingHorizontal={15} width={'100%'} alignItems={'flex-end'} flexDirection={'row'} justifyContent={'space-between'}>

                <SkeletonPlaceholder.Item width={'30%'} alignItems={'center'}>
                    <SkeletonPlaceholder.Item width={60} height={60} borderRadius={100} marginTop={10} />
                    <SkeletonPlaceholder.Item width={100} height={65} borderTopLeftRadius={4} borderTopRightRadius={4} marginTop={10} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={'30%'} alignItems={'center'}>
                <SkeletonPlaceholder.Item width={60} height={60} borderRadius={100} marginTop={10} />
                    <SkeletonPlaceholder.Item width={100} height={100} borderTopLeftRadius={4} borderTopRightRadius={4} marginTop={10} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={'30%'} alignItems={'center'}>
                <SkeletonPlaceholder.Item width={60} height={60} borderRadius={100} marginTop={10} />
                    <SkeletonPlaceholder.Item width={100} height={90} borderTopLeftRadius={4} borderTopRightRadius={4} marginTop={10} />
                </SkeletonPlaceholder.Item>

              </SkeletonPlaceholder.Item>

              <SkeletonPlaceholder.Item paddingHorizontal={0}>
                  <SkeletonPlaceholder.Item width={"100%"} height={55} borderRadius={4} />
                  <SkeletonPlaceholder.Item width={"100%"} height={70} borderRadius={4} marginTop={5} />
                  <SkeletonPlaceholder.Item width={"100%"} height={70} borderRadius={4} marginTop={5} />
                  <SkeletonPlaceholder.Item width={"100%"} height={70} borderRadius={4} marginTop={5} />
                  <SkeletonPlaceholder.Item width={"100%"} height={70} borderRadius={4} marginTop={5} />
                  <SkeletonPlaceholder.Item width={"100%"} height={70} borderRadius={4} marginTop={5} />
              </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
      )}

    const Route = () => (
            <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}} contentContainerStyle={{alignItems:'center'}}>

                <View style={{width:'100%',alignItems:'center',backgroundColor:'#4782F5',flexDirection:'row',paddingHorizontal:30}}>
                    <View style={{alignItems:'center',alignSelf:'flex-end'}}>
                        <View style={{width:60,height:60,borderRadius:100,backgroundColor:'#FFE5B9',justifyContent:'flex-end',alignItems:'center'}}>  
                            <Image source={require('../../assets/male.png')} style={{width:50,height:50,resizeMode:'cover',borderRadius:100}} />
                        </View>
                        <Text style={{fontFamily:'SofiaProRegular',fontSize:16,marginVertical:7,color:'#fff'}}>{'Sonali'}</Text>
                        <Text style={{fontFamily:'SofiaProRegular',fontSize:14,color:'#BA9B76'}}>{'430'}</Text>
                        <LinearGradient
                            start={{ x: 0.3, y: 0.8 }}
                            end={{ x: 0.3, y: 0 }}
                            colors={['#76A0FF', '#6190F9', '#5486F6']}
                            style={{
                                width:100,height:60,justifyContent:'center',alignItems:'center',borderTopLeftRadius:10,
                                marginTop:12
                            }}>
                            <Text style={{fontSize:30,color:'#9FB9FF',fontWeight:'bold'}}>{'3'}</Text>
                        </LinearGradient>
                    </View>
                    <View style={{alignItems:'center',alignSelf:'flex-end'}}>
                        <FontAwesome5Icon name='crown' size={25} color='#F7CF4D' style={{transform: [{ rotate: '330deg' }],right:20,top:5}} />
                        <View style={{width:60,height:60,borderRadius:100,backgroundColor:'#A7E4FF',justifyContent:'flex-end',alignItems:'center'}}>  
                            <Image source={require('../../assets/male.png')} style={{width:50,height:50,resizeMode:'cover',borderRadius:100}} />
                        </View>
                        <Text style={{fontFamily:'SofiaProRegular',fontSize:16,marginVertical:7,color:'#fff'}}>{'Subodh'}</Text>
                        <Text style={{fontFamily:'SofiaProRegular',fontSize:14,color:'#BA9B76'}}>{'550'}</Text>
                        <LinearGradient
                            start={{ x: 0.3, y: 0.8 }}
                            end={{ x: 0.3, y: 0 }}
                            colors={['#76A0FF', '#6190F9', '#5486F6']}
                            style={{
                                width:100,height:100,justifyContent:'center',alignItems:'center',borderTopLeftRadius:10,
                                borderTopRightRadius:10,marginTop:12
                            }}>
                            <Text style={{fontSize:55,color:'#9FB9FF',fontWeight:'bold'}}>{'1'}</Text>
                        </LinearGradient>
                    </View>
                    <View style={{alignItems:'center',alignSelf:'flex-end'}}>
                        {/* <FontAwesomeIcon name='user-circle' size={60} color='#fff' style={styles.winnerImage} /> */}
                        <View style={{width:60,height:60,borderRadius:100,backgroundColor:'#FFDD00',justifyContent:'flex-end',alignItems:'center'}}>  
                            <Image source={require('../../assets/male.png')} style={{width:50,height:50,resizeMode:'cover',borderRadius:100}} />
                        </View>
                        <Text style={{fontFamily:'SofiaProRegular',fontSize:16,marginVertical:7,color:'#fff'}}>{'Prbodh'}</Text>
                        <Text style={{fontFamily:'SofiaProRegular',fontSize:14,color:'#BA9B76'}}>{'480'}</Text>
                        <LinearGradient
                            start={{ x: 0.3, y: 0.8 }}
                            end={{ x: 0.3, y: 0 }}
                            colors={['#76A0FF', '#6190F9', '#5486F6']}
                            style={{
                                width:100,height:90,justifyContent:'center',alignItems:'center',borderTopLeftRadius:10,
                                borderTopRightRadius:10,marginTop:12
                            }}>
                            <Text style={{fontSize:40,color:'#9FB9FF',fontWeight:'bold'}}>{'2'}</Text>
                        </LinearGradient>
                    </View>
                </View>

                <View style={{width:'100%',flexDirection:'row',height:50,backgroundColor:'#FAFAFA',justifyContent:'space-between',alignItems:'center',paddingHorizontal:10}}>
                    <Text style={styles.headBottom}>{'Rank'}</Text>
                    {/* <Text style={styles.headBottom}>{'Influencer'}</Text> */}
                    <Text style={styles.headBottom}>{'prize'}</Text>
                </View>

                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    style={{marginVertical: 0}}>
                    {TopWinners.map((item, i) => (
                    <View>
                        <View style={{width:'100%',flexDirection:'row',alignItems:'center',paddingVertical:20,paddingHorizontal:10}}>
                            <View style={{width:'5%',alignItems:'flex-start'}}>
                                <Text style={[styles.headBottom,{fontWeight:'bold'}]}>{'#1'}</Text>
                            </View>
                            <View style={{width:'80%',flexDirection:'row',alignItems:'center',paddingLeft:15}}>
                                <FontAwesomeIcon name='user-circle' size={40} color='#999999' style={styles.winnerImage} />
                                <View style={{marginLeft:10}}>
                                    <Text style={{fontFamily:'SofiaProRegular',fontSize:14}}>{'Subodh'}</Text>
                                    {/* <Text style={{color:'#BA9B76',fontSize:12}}>
                                        <FontAwesomeIcon name='rupee' size={11} color='#BA9B76' style={{marginTop:8.5}} />
                                        {'5150 referrel winnings'}
                                    </Text> */}
                                </View>
                            </View>
                            <View style={{width:'15%',alignItems:'center'}}>
                                <Text style={[styles.headBottom,{fontWeight:'bold'}]}>{'₹1000'}</Text>
                            </View>
                        </View>
                    <View style={{width:'100%',height:1,backgroundColor:'lightgrey'}} />
                    </View>
                    ))}
                </ScrollView>

            </ScrollView>
    );
    
    return (
        <View style={{flex:1}}>
        {loader ? (
            // <Loader isLoading={loader} />
            <MyLoader />
        ) : (
        <View style={{flex:1}}>

                <View>
                    <StatusBar backgroundColor={'#4782F5'} barStyle={'light-content'} />
                    <View style={styles.headerView}>
                        <TouchableOpacity
                            style={{width:'15%',alignItems:'center',justifyContent:'center'}}
                            onPress={() => handleBackPress()}>
                            <Ionicon name='arrow-back-outline' size={20} color='#fff' />
                        </TouchableOpacity>

                        <View style={{width:'85%',alignItems: 'flex-start'}}>
                            <Text style={styles.textHead}>{'Top Winners'}</Text>
                        </View>
                    </View>
                </View>


                <View style={{backgroundColor:'#4782F5',width:'100%',height:100,position:'absolute',top:45}} />

                {/* {TopSection && TopSection.length>0 ? */}
                {/* <TopTabBar.Navigator
                    tabBarOptions={{
                        scrollEnabled: true,
                        activeTintColor: '#4782F5',
                        inactiveTintColor: '#fff',
                        indicatorStyle: {
                            backgroundColor: '#fff',
                            height: 47,
                            top: 1,
                            borderRadius:8,
                            width: 115,
                        }, //transparent
                        labelStyle: {
                            fontSize: 13,
                            fontWeight: 'bold',
                            fontFamily: 'GilroyMedium',
                        },
                        tabStyle: {
                            width: 115,
                        },
                        style: {
                            height: 50,
                            width: '95%',
                            marginVertical:2,
                            alignSelf:'center',
                            borderWidth:0.5,
                            borderColor:'#fff',
                            borderRadius:10,
                            backgroundColor:'#476EDC',
                        },
                    }}>
                    {barItem.map((item, i) => (
                        <TopTabBar.Screen key={i} name={item} component={Route} />
                    ))}
                </TopTabBar.Navigator> */}
                {/* :null} */}
                {/* <TopTabBar.Screen name="16 - 22 MAR" component={Route} />
                <TopTabBar.Screen name="9 - 15 MAR" component={Route} /> */}

                <View style={{
                    width:'95%',
                    alignSelf:'center',
                    marginTop: 25,
                    top: -10,
                    backgroundColor:'#476EDC',
                    // height: 47,
                    borderRadius:10,
                    // top: 1,
                    borderWidth:1,
                    borderColor:'#fff',
                    padding:1.5,
                    zIndex:1
                }}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        {barItem && barItem.length>0 ? barItem.map((item, i) => (
                            <TouchableOpacity
                                key={i}
                                activeOpacity={0.5}
                                style={{
                                    width: 113,
                                    height: 50,
                                    backgroundColor: '#fff',
                                    // borderRightWidth:0.2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: i == activeBar ? '#fff' : '#476EDC',
                                    borderRadius:10
                                }} onPress={()=> { setActiveBar(i); getQuizRanks(barItem[i].key); } }>
                                <Text style={{ color: i == activeBar ? '#476EDC' : '#fff', fontWeight: 'bold',fontSize:14 }}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        )): null }
                    </ScrollView>
                </View>

                <Route />

        </View>
        )}
        </View>
    )
}
export default TopWinner;

const styles = StyleSheet.create({

    headerView: {
        flexDirection: 'row',
        marginTop: Platform.OS === 'ios' ? hp('4') : 0,
        alignItems: 'center',
        paddingHorizontal: 5,
        // borderWidth:1,
        height: 50,
        backgroundColor:'#4782F5'
    },
    textHead: { fontSize: 18, textAlign: 'center',color:'#fff',fontFamily:'GilroyMedium' },  

    mainRow: { backgroundColor:'#1A0059'},
    emptyRowText: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
      color: '#fff',
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
  
    headBottom: {
        color:'#000',
        fontFamily:'SofiaProRegular',
        textTransform: 'capitalize'
    },
});