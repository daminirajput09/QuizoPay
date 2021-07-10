import React, { useEffect, useState, useContext } from 'react'
import { TouchableWithoutFeedback, TextInput, BackHandler, Text, View, StyleSheet, ActivityIndicator, Image, TouchableOpacity, ScrollView, Alert, StatusBar, Dimensions,ToastAndroid } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosClient from '../api/axios-client';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { MyContext } from '../components/UseContext';
import DeviceInfo from 'react-native-device-info';
// import {
//     GoogleSignin,
//     GoogleSigninButton,
//     statusCodes,
// } from 'react-native-google-signin';
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import DefaultInput from '../components/DefaultInput';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import DateTimePickerModal, { Header, headerStyles } from "react-native-modal-datetime-picker";
import moment from 'moment';
import FontistoIcon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast, {BaseToast} from 'react-native-toast-message';
// import Loader from '../components/Loader';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const VerifyPAN = ({ navigation, route }) => {

    const { reviewType, data } = route.params;
    //console.log('review type', reviewType, data);

    const [name, setName] = useState(data && data.name);
    const [PANNumber, setPANNumber] = useState(data && data.pannumber);
    const [DOB, setDOB] = useState(data && data.dob)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [filePath, setFilePath] = useState({ uri: data && data.pan_url });
    const [userInfo, setUserInfo] = useState('')

    const [editName, setEditName] = useState(false);
    const [editPAN, setEditPAN] = useState(false);
    const [editDOB, setEditDOB] = useState(false);
    const [editImage, setEditImage] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);
    // const [Loading, setLoading] = useState(true);

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
        getUserDetails();

        BackHandler.addEventListener('hardwareBackPress', backPress)

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backPress)
        }
    }, []);

    const backPress = () => {
        navigation.goBack();
        return true;
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        hideDatePicker();
        let NewDate = moment(new Date(date)).format("DD/MM/YYYY")
        setDOB(NewDate)
    };

    const chooseFile = (type) => {
        setFilePath({})
        let options = {
            mediaType: type,
            maxWidth: 1000,
            maxHeight: 1000,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            //console.log('img res 1', response.uri);
            setFilePath(response);
            // saveImage(response)
        });
    };

    const getUserDetails = async() => {
        await AsyncStorage.getItem('userInfo', async(err, result) => {
            if (!err && result !== null) {
                setUserInfo(JSON.parse(result))
                //console.log('userInfo data', result)
            } else {
                console.log('userInfo err', err)
            }
          })
    }

    const savePANDetails = () => {
        
        setEditName(true); setEditPAN(true); setEditDOB(true); setEditImage(true); setDisableBtn(true);


        const formData = new FormData();
        formData.append('userid', userInfo.id);
        formData.append('name', name);
        formData.append('pannumber', PANNumber);
        formData.append('dob', DOB);
        formData.append('file', {
            name: filePath.fileName,
            type: filePath.type,
            uri: filePath.uri
        })

        axiosClient().post('users/updatePan', formData)
            .then(async (res) => {
                //console.log('update PAN Details res', res.data, formData)
                if (res.data.Error == 0) {
                    Toast.show({
                        text1: res.data.message,
                        type: 'success',
                        color: '#50C878',
                        position: 'top',
                        visibilityTime: 4000,
                        autoHide: true,
                        topOffset: 0,
                        bottomOffset: 40,
                        leadingIcon: null
                    });
                    // navigation.navigate('VerifyAccount')
                } else {
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
                console.log('update PAN Details error', err)
            })
            
    }

    return (
    <View style={{flex: 1,backgroundColor:'#F8FAF8'}}>
        <StatusBar backgroundColor={'#000'} barStyle={'light-content'} />

        <View style={styles.headerView}>
            <TouchableOpacity
                style={{width:'15%',alignItems:'center',justifyContent:'center'}}
                onPress={() => navigation.goBack()}>
                <Ionicon name='arrow-back-outline' size={20} color='#fff' />
            </TouchableOpacity>

            <View style={{width:'85%',alignItems: 'flex-start'}}>
                <Text style={styles.textHead}>Verify PAN Card</Text>
            </View>
        </View>


        {/* {Loading ? (
                <Loader isLoading={Loader} />
        ) : ( */}
        <ScrollView keyboardShouldPersistTaps="always">

        <View style={{ padding: 12,backgroundColor: '#fff' }}>

                <View style={{width:'100%',alignSelf:'center',marginTop:20}}>

                    {reviewType == 'inreview'?
                    <View style={{width:'100%',backgroundColor:'#DAEBFC',padding:12,borderRadius:4,marginBottom:20}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <EntypoIcon name="back-in-time" size={23} color="#11356F" />
                            <Text style={{color:'#1C3F71',fontWeight:'bold',fontSize:14,paddingLeft:10,fontFamily:'GilroyMedium'}}>Verification in review...</Text>
                        </View>
                        <Text style={{color:'#1C3F71',fontSize:12,marginTop:5,fontFamily:'SofiaProRegular'}}>PAN details are under review</Text>
                    </View>:null}

                    <DefaultInput
                        label={'Name'}
                        value={name}
                        onChangeText={text => setName(text)}
                        keyboardType={'default'}
                        bgColor={'#F8F8F8'}
                        autoCapitalize = 'characters'
                        editable={reviewType == ('inreview' || 'done')|| editName?false:true}
                    />
                    <Text style={{ fontSize: 12, color: '#000',textAlign:'left',fontFamily:'SofiaProRegular'}}>Enter your Full Name as on PAN Card</Text>

                    <View style={{marginTop:15}} />
                    <DefaultInput
                        label={'PAN Number'}
                        value={PANNumber}
                        onChangeText={text => setPANNumber(text)}
                        keyboardType={'default'}
                        autoCapitalize = 'characters'
                        bgColor={'#F8F8F8'}
                        editable={reviewType == ('inreview' || 'done')|| editPAN?false:true}
                    />
                    <Text style={{ fontSize: 12, color: '#000',textAlign:'left',fontFamily:'SofiaProRegular'}}>Enter your 10-digit PAN </Text>

                    <View style={{marginTop:15}} />
                        <TouchableOpacity activeOpacity={reviewType == ('inreview' || 'done')|| editDOB?1:0} onPress={()=> reviewType == ('inreview' || 'done')|| editDOB?null:setDatePickerVisibility(true) }>
                            <DefaultInput
                                label={'Date of Birth'}
                                value={DOB}
                                onChangeText={text => setDOB(text)}
                                keyboardType={'default'}
                                bgColor={'#F8F8F8'}
                                editable={false}
                            />
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                customHeaderIOS={(props) => <Header {...props} style={{color:'red'}} />}
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                            />
                        </TouchableOpacity>
                    <Text style={{ fontSize: 11, color: '#000',textAlign:'left',fontFamily:'SofiaProRegular'}}>
                        Enter your DOB as on the PAN Card
                    </Text>

                    {reviewType == ('inreview' || 'done')|| editImage?
                    <TouchableOpacity activeOpacity={1} style={{width:'100%',flexDirection:'row',marginTop:20,height:45,alignItems:'center',justifyContent:'flex-start'}}>
                        <EntypoIcon name="attachment" size={20} color="#000" style={{transform: [{ rotate: '90deg'}]}} />
                        <Text style={{textTransform:'uppercase',fontSize:14,color:'#000',marginLeft:10,fontFamily:'SofiaProRegular'}}>PAN CARD</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => chooseFile('photo')} activeOpacity={0.5} style={{width:'100%',flexDirection:'row',marginTop:20,height:45,alignItems:'center',justifyContent:'center',borderRadius:4,borderWidth:0.7,borderColor:'lightgrey'}}>
                        <AntDesignIcon name="idcard" size={20} color="#000" />
                        <Text style={{textTransform:'uppercase',fontSize:14,color:'#000',fontWeight:'bold',marginLeft:10,fontFamily:'GilroyMedium'}}>UPLOAD PAN PROOF</Text>
                    </TouchableOpacity>}

                    {filePath.uri != ''?<Image
                        source={{ uri: filePath.uri }}
                        style={{ height: 100, width: 100,marginTop:5,alignSelf:'center' }}
                        resizeMode='contain' />:null}

                </View>    

            </View>

            <View style={{width:'90%',alignSelf:'center',marginTop:30,backgroundColor:'#F8F8F8'}}>
                <Text style={{ fontSize: 14, color: '#000',textAlign:'left',fontWeight:'bold',fontFamily:'GilroyMedium'}}>IMPORTANT</Text>

                <View style={{flexDirection:'row',marginTop:10}}>
                    <EntypoIcon name="dot-single" size={20} color="#000" />
                    <Text style={{ fontSize: 11, color: '#000',textAlign:'left',fontFamily:'SofiaProRegular'}}>
                        Full Name on PAN card and bank account must match 
                    </Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <EntypoIcon name="dot-single" size={20} color="#000" />
                    <Text style={{ fontSize: 11, color: '#000',textAlign:'left',fontFamily:'SofiaProRegular'}}>
                        It takes max 1 working dat to get PAN verified 
                    </Text>
                </View>
            </View>


            </ScrollView>

            {reviewType == ('inreview' || 'done') || disableBtn?null:<View style={{backgroundColor:'#fff',width:'100%',paddingBottom:10}}>
                <TouchableOpacity activeOpacity={name && PANNumber && DOB?0:1} onPress={() => name && PANNumber && DOB?savePANDetails():null}
                    style={{width:'90%',alignSelf:'center',marginTop:20,backgroundColor:name && PANNumber && DOB?'#009D38':'#DADADA',height:45,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                    <Text style={{textTransform:'uppercase',fontSize:15,color:name && PANNumber && DOB?'#fff':'#000',fontFamily:'GilroyMedium'}}>submit details</Text>
                </TouchableOpacity>
            </View>}

            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />

    </View>
    )
}
export default VerifyPAN;

const styles = StyleSheet.create({

    headerView: {
        flexDirection: 'row',
        marginTop: Platform.OS === 'ios' ? hp('4') : 0,
        alignItems: 'center',
        paddingHorizontal: 5,
        // borderWidth:1,
        height: 50,
        backgroundColor:'#1A1A1A'
    },
    textHead: { fontSize: 18, textAlign: 'center',color:'#fff',fontFamily:'GilroyMedium' },
    imageStyle: {
        width: 25,
        height: 25,
        alignSelf: 'flex-end',
        marginBottom: 10,
        left: 20
    },
    HeaderView: {
        width: '93%',
        alignSelf: 'center',
        height: Platform.OS === 'ios' ? windowHeight / 3.5 : windowHeight / 3.5,
        justifyContent: 'flex-end',
        paddingBottom: 20,
        // borderWidth:1,
    },
    middleView: {
        width: '100%',
        height: windowHeight / 3,
        // borderWidth:1,
    },
    footerView: {
        width: '93%',
        height: windowHeight / 5,
        // borderWidth:1,
        alignSelf: 'center',
        justifyContent: 'center',
        position:'relative',
        top: 35
    },

});    