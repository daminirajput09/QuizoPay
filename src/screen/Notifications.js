import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StatusBar
} from 'react-native';
import axiosClient from '../api/axios-client';
import {useIsFocused} from '@react-navigation/native';
import Loader from '../components/Loader';
// import {MyContext} from '../components/UseContext';
import Header from '../components/Header';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { WebView } from 'react-native-webview'
import Ionicon from 'react-native-vector-icons/Ionicons';
import AppHeader from '../components/AppHeader';

const windowWidth = Dimensions.get('window').width;

const Notifications = ({navigation, route}) => {

  // const { user } = useContext(MyContext);
  const isFocused = useIsFocused();
  const [loader, setLoader] = useState(false);
  const [List, setList] = useState([]);

  useEffect(() => {
        // getNotifications();
        // markAsRead();

        return () => {
            setList([]); 
        };
    }, []);

  //   const getNotifications = () => {
  //       if (user && user.id) {
  //           const formdata = new FormData();
  //           formdata.append('userid', user.id);
  //           axiosClient()
  //               .post('notification/get', formdata)
  //               .then((res) => {
  //                   setLoader(false);
  //                   console.log('noti response', res);
  //                   if (res.data.data !== 'Notification not found' && res.data.Error === 0) {
  //                       setList(res.data.data);
  //                   } else {
  //                       setList([]);
  //                   }
  //               })
  //               .catch((err) => {
  //                   setLoader(false);
  //                   console.log('noti error', err);
  //               });
  //       }
  //   }

  //   const markAsRead = () => {
  //     if (user && user.id) {
  //         const formdata = new FormData();
  //         formdata.append('userid', user.id);
  //         axiosClient()
  //             .post('notification/dismissedAnnouncements', formdata)
  //             .then((res) => {
  //                 // setLoader(false);
  //                 console.log('dismissed Announcements response', res);
  //                 if (res.data.Error === 0) {
  //                     // setList(res.data.data);
  //                 } else {
  //                     // setList([]);
  //                 }
  //             })
  //             .catch((err) => {
  //                 setLoader(false);
  //                 console.log('dismissed Announcements error', err);
  //             });
  //     }
  // }

  return (
    <View style={{flex: 1,backgroundColor:'#F8FAF8'}}>
        {/* <StatusBar backgroundColor={'#B0191E'} barStyle={'light-content'} />

        <View style={styles.headerView}>
            <TouchableOpacity
                style={{width:'15%',alignItems:'center',justifyContent:'center'}}
                onPress={() => navigation.goBack()}>
                <Ionicon name='arrow-back-outline' size={20} color='#fff' />
            </TouchableOpacity>

            <View style={{width:'85%',alignItems: 'flex-start'}}>
                <Text style={styles.textHead}>notifications</Text>
            </View>
        </View> */}
        <AppHeader Header={'NOTIFICATIONS'} onPress={() => navigation.goBack()} />

      {loader ? (
          <Loader isLoading={loader} />
      ) : (
    <ScrollView style={{marginVertical: 10, paddingBottom: 10}}>
      
      {List ?
      List && List.map((item, i) => (
        <View key={i}>
          <View style={styles.listMainView}>
            <TouchableOpacity onPress={() => redirection(item)}>
              <Text numberOfLines={1} style={styles.ListHeadText}>
                {item.name}
              </Text>
                <View style={{width: '100%'}}>
                  <WebView source={{ html: item.message }}
                      style={{width: windowWidth - 60, height:30, alignSelf:'center',opacity: 0.99,minHeight: 1, marginTop:10}}
                      renderLoading={ActivityIndicatorLoadingView} 
                      startInLoadingState={true}  
                      javaScriptEnabled={true}
                      domStorageEnabled={true}         
                  />
                  {/* <AutoHeightWebView
                        renderLoading={ActivityIndicatorLoadingView}
                        startInLoadingState={true}
                        style={{ width: windowWidth - 60, alignSelf:'center',opacity: 0.99,minHeight: 1, marginTop:10 }}
                        files={[{
                            href: 'cssfileaddress',
                            type: 'text/css',
                            rel: 'stylesheet'
                        }]}
                        customStyle={`
                        * {
                            font-family: 'Times New Roman';
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            max-line: 2;
                            font-size: 12px;
                        }
                        span:after {
                            content: "...";
                          }
                        table {
                            max-width: ${windowWidth - 60};
                            font-size: 10px;
                        }
                        img {
                            max-width: ${windowWidth - 60};
                        }`}
                        source={{ html: item.message }}
                    /> */}
                  <Text style={[styles.ListText,{textAlign:'right',fontSize:11}]}>
                    {item.dateadded} 
                  </Text>             
                </View>
            </TouchableOpacity>
            <View
              style={{
                borderBottomWidth: 0.3,
                borderBottomColor: '#E2DEDE',
                paddingTop: 10,
              }}></View>
          </View>
        </View>
      ))
    :
      <Text style={{marginTop:50,textAlign:'center', fontSize:15, fontWeight:'bold'}}>
        Notification not found!
      </Text>
    }
    </ScrollView>
    )}
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'ios' ? hp('4') : 0,
    alignItems: 'center',
    paddingHorizontal: 5,
    // borderWidth:1,
    height: 50,
    backgroundColor:'#C61D24'
  },
  textHead: { fontSize: 18, textAlign: 'center',color:'#fff', textTransform:'uppercase',fontFamily:'GilroyMedium' },
    mainContainer: {
        flex:1,
        justifyContent:'center'
    },
    listMainView: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        borderColor: '#D5D5D5',
        marginTop: 5,
        width:' 100%'
    },
    ListHeadText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#000',
    },
    ListText: {
        fontSize: 12,
        marginTop: 5,
        color: 'grey',
    },
});    