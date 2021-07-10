import React, { useEffect, useState, useContext } from 'react'
import { Switch, BackHandler, Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar, Dimensions,ToastAndroid } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosClient from '../api/axios-client';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import DefaultInput from '../components/DefaultInput';
import DateTimePickerModal, { Header, headerStyles } from "react-native-modal-datetime-picker";
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import AppHeader from '../components/AppHeader';
import Loader from '../components/Loader';
import { useIsFocused } from '@react-navigation/native';
import Toast, {BaseToast} from 'react-native-toast-message';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const InfoSettings = ({ navigation, route }) => {

    const isFocused = useIsFocused();
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [gender, setGender] = useState('Male');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('**********')
    const [DOB, setDOB] = useState('')
    const [mobNo, setMobNo] = useState('')

    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [pinCode, setPinCode] = useState('')
    const [country, setCountry] = useState('')
    const [reigon, setReigon] = useState({ label: '', value: '' })

    const [isEnabled1, setIsEnabled1] = useState(false);
    const toggleSwitch1 = () => setIsEnabled1(previousState => !previousState);
    const [isEnabled2, setIsEnabled2] = useState(false);
    const toggleSwitch2 = () => setIsEnabled2(previousState => !previousState);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [User, setUser] = useState();
    
    const RegionData = [
        { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
        { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
        { label: 'Assam', value: 'Assam' },
        { label: 'Bihar', value: 'Bihar' },
        { label: 'Chhattisgarh', value: 'Chhattisgarh' },
        { label: 'Goa', value: 'Goa' },
        { label: 'Gujarat', value: 'Gujarat' },
        { label: 'Haryana', value: 'Haryana' },
        { label: 'Himachal Pradesh', value: 'Himachal Pradesh' },
        { label: 'Jharkhand', value: 'Jharkhand' },
        { label: 'Karnataka', value: 'Karnataka' },
        { label: 'Kerala', value: 'Kerala' },
        { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
        { label: 'Maharashtra', value: 'Maharashtra' },
        { label: 'Manipur', value: 'Manipur' },
        { label: 'Meghalaya', value: 'Meghalaya' },
        { label: 'Mizoram', value: 'Mizoram' },
        { label: 'Nagaland', value: 'Nagaland' },
        { label: 'Odisha', value: 'Odisha' },
        { label: 'Punjab', value: 'Punjab' },
        { label: 'Rajasthan', value: 'Rajasthan' },
        { label: 'Tamil Nadu', value: 'Tamil Nadu' },
        { label: 'Telangana', value: 'Telangana' },
        { label: 'Tripura', value: 'Tripura' },
        { label: 'Gujrat', value: 'Gujrat' },
        { label: 'Uttarakhand', value: 'Uttarakhand' },
        { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
        { label: 'West Bengal', value: 'West Bengal' },
    ];

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

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        hideDatePicker();
        let NewDate = moment(new Date(date)).format("DD/MM/YYYY")
        setDOB(NewDate)
    };

    useEffect(() => {
        getUser();

        BackHandler.addEventListener('hardwareBackPress', backPress)

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backPress)
        }
    }, []);

    useEffect(() => {
        if(isFocused && User && User.id){
            getSettings();
        }
    },[User, isFocused]);

    const backPress = () => {
        navigation.goBack();
        return true;
    }

    const getUser = async() => {
        await AsyncStorage.getItem('userInfo', async(err, result) => {
            if (!err && result !== null) {
                setUser(JSON.parse(result))
                //console.log('userInfo data in verify', result)
            } else {
                //console.log('userInfo err', err)
            }
          })
    }

    const getSettings = () => {
        if(User && User.id){
        const formData = new FormData();
        formData.append('userid', User.id);
        axiosClient().post('users/userInfo', formData)
            .then(async (res) => {
                //console.log('get userInfo res', res.data, formData)
                if (res.data.Error == 0) {
                    setLoading(false);
                    setName(res.data.data.name);
                    setEmail(res.data.data.email);
                    // setPassword(res.data.data.name);
                    setMobNo(res.data.data.phonenumber);
                    setDOB(res.data.data.dob);
                    setGender(res.data.data.gender);
                    setAddress(res.data.data.address);
                    setCity(res.data.data.city);
                    setPinCode(res.data.data.pincode);
                    setReigon(res.data.data.state);
                    setCountry(res.data.data.country);
                } else {
                    setLoading(false);
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
                setLoading(false);
                //console.log('get userInfo', err)
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

    const updateSettings = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('userid', User.id);
        formData.append('name', name);
        formData.append('dob', DOB);
        formData.append('gender', gender);
        formData.append('address', address);
        formData.append('city', city);
        formData.append('state', reigon);
        formData.append('pincode', pinCode);
        formData.append('country', country);
        axiosClient().post('users/updateUserInfo', formData)
            .then(async (res) => {
                setLoading(false);
                //console.log('get updateUserInfo res', res.data, formData)
                if (res.data.Error == 0) {
                    Toast.show({
                        text1: res.data.message,
                        type: 'success',
                        position: 'top',
                        visibilityTime: 4000,
                        autoHide: true,
                        topOffset: 0,
                        bottomOffset: 40,
                        leadingIcon: null
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
                        leadingIcon: null
                    });
                }
            }).catch((err) => {
                setLoading(false);
                //console.log('get updateUserInfo error', err)
            })
    }


    return (
    <View style={{flex: 1,backgroundColor:'#F8FAF8'}}>

        <AppHeader Header={'My Info & Settings'} onPress={() => backPress()} />

        {loading ? (
                <Loader isLoading={loading} />
        ) : (

        <ScrollView keyboardShouldPersistTaps="always">

        <View style={{
            paddingVertical:20,
            backgroundColor: '#fff',
        }}>

                <View style={{width:'90%',alignSelf:'center'}}>
                    <DefaultInput
                        label={'Name'}
                        value={name}
                        onChangeText={text => setName(text)}
                        keyboardType={'default'}
                        bgColor={'#fff'}
                    />

                    <View style={{marginTop:20}} />
                    <DefaultInput
                        label={'Email'}
                        value={email}
                        onChangeText={text => setEmail(text)}
                        keyboardType={'email-address'}
                        bgColor={'#fff'}
                        editable={false}
                    />
                    <Text style={styles.SubText} onPress={()=>navigation.navigate('editField',{param:'email'})}>Change</Text>

                    <View style={{marginTop:20}} />
                    <DefaultInput
                        label={'Password'}
                        value={password}
                        onChangeText={text => setPassword(text)}
                        keyboardType={'default'}
                        bgColor={'#fff'}
                        secureTextEntry={true}
                        editable={false}
                    />
                    <Text style={styles.SubText} onPress={()=>navigation.navigate('editField',{param:'password', user: User})}>Change</Text>

                    <View style={{marginTop:20}} />
                    <TouchableOpacity onPress={()=>setDatePickerVisibility(true)}>
                        <DefaultInput
                            label={'Date of Birth'}
                            value={DOB}
                            onChangeText={text => setDOB(text)}
                            keyboardType={'default'}
                            bgColor={'#fff'}
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

                    <View style={{marginTop:30}} />

                    <Text style={{ fontSize: 16, color: '#000',fontFamily:'GilroyMedium'}}>Gender</Text>
                    
                    <View style={{width:'100%',alignSelf:'center',marginTop:10,flexDirection:'row'}}>
                        <TouchableOpacity onPress={()=>setGender('Male')} style={{width:'48%',borderWidth:1.5,alignItems:'flex-start',marginRight:'4%',borderRadius:5,borderColor:gender=='Male'?'#45A84E':'#E8E8E8',backgroundColor:gender=='Male'?'#E8F7DA':'#fff'}}>
                            <View style={{width:'90%',height:40,alignItems:'center',flexDirection:'row',justifyContent:'flex-start'}}>
                                <MaterialIcon name='gender-male' size={20} color={gender=='Male'?'#45A84E':'#8E8E8E'} style={{marginHorizontal:10}} />
                                <Text style={{ fontSize: 15, color: '#000',fontFamily:'GilroyMedium'}}>Male</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>setGender('Female')} style={{width:'48%',borderWidth:1.5,alignItems:'flex-start',borderRadius:5,borderColor:gender=='Female'?'#45A84E':'#E8E8E8',backgroundColor:gender=='Female'?'#E8F7DA':'#fff'}}>
                            <View style={{width:'90%',height:40,alignItems:'center',flexDirection:'row',justifyContent:'flex-start'}}>
                                <MaterialIcon name='gender-female' size={20} color={gender=='Female'?'#45A84E':'#8E8E8E'} style={{marginHorizontal:10}} />
                                <Text style={{ fontSize: 15, color: '#000',fontFamily:'GilroyMedium'}}>Female</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                <View style={{marginTop:20}} />
                <DefaultInput
                    label={'Phone Number'}
                    value={mobNo}
                    onChangeText={text => setMobNo(text)}
                    keyboardType={'number-pad'}
                    bgColor={'#fff'}
                    editable={false}
                />
                <Text style={styles.SubText} onPress={()=>navigation.navigate('editField',{param:'mobile', user: User})}>Change</Text>

                </View>    

                <View style={[{marginTop:25,paddingVertical: 25,paddingLeft:15,backgroundColor: '#F5F5F5',width:'100%',flexDirection:'row',height:55,justifyContent:'center',alignItems:'center'}]}>
                    <TouchableOpacity onPress={()=> navigation.navigate('PrivavySettings')} style={{width:'80%',paddingLeft:20,flexDirection:'row'}}>
                        <Text style={{fontSize:15,fontWeight:'bold',fontFamily:'GilroyBold'}}>Privacy Settings</Text>
                        <View style={{width:40,height:20,backgroundColor:'#139B3F',justifyContent:'center',alignItems:'center',borderRadius:5,bottom:10,marginLeft:5}}>
                            <Text style={{fontSize: 11,color:'#fff',fontFamily:'GilroyMedium'}}>NEW</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{width:'20%',alignItems:'flex-end',paddingRight:15}}>
                        <EntypoIcon name='chevron-right' size={25} color='#000' />
                    </View>
                </View>

                <View style={[{paddingLeft:15,width:'100%',flexDirection:'row',height:60,justifyContent:'center',alignItems:'center',borderRadius:10}]}>
                    <View style={{width:'80%',paddingLeft:20,flexDirection:'row'}}>
                        <Text style={{fontSize:16,fontFamily:'GilroyMedium'}}>Allow SMS Notifications</Text>
                    </View>
                    <View style={{width:'20%',alignItems:'flex-end',paddingRight:15}}>
                        <Switch
                            trackColor={{ false: "#CCCCCC", true: "#CCCCCC" }}
                            thumbColor={isEnabled1 ? "#000" : "#F5F5F5"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch1}
                            value={isEnabled1}
                        />
                    </View>
                </View>

                <View style={[{marginTop:10,paddingLeft:15,width:'100%',flexDirection:'row',height:60,justifyContent:'center',alignItems:'center',borderRadius:10}]}>
                    <View style={{width:'80%',paddingLeft:20}}>
                        <View style={{width:'100%',flexDirection:'row'}}>
                            <Text style={{fontSize:16,fontFamily:'GilroyMedium'}}>Make Me Discoverable</Text>
                            <View style={{width:40,height:20,backgroundColor:'#139B3F',justifyContent:'center',alignItems:'center',borderRadius:5,bottom:10,marginLeft:5}}>
                                <Text style={{fontSize: 12,color:'#fff',fontFamily:'GilroyMedium'}}>NEW</Text>
                            </View>
                        </View>
                        <Text style={{fontSize:12,fontFamily:'SofiaProRegular'}}>
                            Friend can find and follow you when they sync their phone contacts.
                        </Text>
                    </View>
                    <View style={{width:'20%',alignItems:'flex-end',paddingRight:15}}>
                        <Switch
                            trackColor={{ false: "#CCCCCC", true: "#CCCCCC" }}
                            thumbColor={isEnabled2 ? "#000" : "#F5F5F5"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch2}
                            value={isEnabled2}
                        />
                    </View>
                </View>
                
                <View style={{marginTop:10,width:'90%',alignSelf:'center'}}>
                    <DefaultInput
                        label={'Address'}
                        value={address}
                        onChangeText={text => setAddress(text)}
                        keyboardType={'default'}
                        bgColor={'#fff'}
                    />

                    <View style={{marginTop:20}} />
                    <DefaultInput
                        label={'City'}
                        value={city}
                        onChangeText={text => setCity(text)}
                        keyboardType={'default'}
                        bgColor={'#fff'}
                    />

                    <View style={{marginTop:20}} />
                    <DefaultInput
                        label={'Pin code'}
                        value={pinCode}
                        onChangeText={text => setPinCode(text)}
                        keyboardType={'number-pad'}
                        bgColor={'#fff'}
                    />
                    <View style={{marginTop:20}} />

                    <RNPickerSelect
                        value={reigon}
                        onValueChange={(value) => setReigon(value)}
                        placeholder={{}}
                        items={RegionData}
                        textInputProps={{
                            style: {
                                color:'#000',
                                borderBottomWidth:1, 
                                borderColor:'#000'
                            }
                        }}
                        style={{ placeholder: { paddingLeft: 10, color: '#000', borderBottomWidth:1, borderColor:'#000' }, inputAndroid: { paddingLeft: 10, color: '#000', borderBottomWidth:1, borderColor:'#000' } }}
                        useNativeAndroidPickerStyle={false}              
                    />

                    <View style={{marginTop:20}} />
                    <DefaultInput
                        label={'Country'}
                        value={country}
                        onChangeText={text => setCountry(text)}
                        keyboardType={'default'}
                        bgColor={'#fff'}
                    />

                    <View style={{width:'100%',alignSelf:'center',marginTop:40,flexDirection:'row'}}>
                        <TouchableOpacity onPress={()=>navigation.navigate('Register')} style={{width:'48%',alignItems:'flex-start',marginRight:'4%'}}>
                            <View style={{width:'90%',height:40,alignItems:'center',flexDirection:'row',justifyContent:'flex-start'}}>
                                <AntDesignIcon name='poweroff' size={14} color={'#000'} style={{marginHorizontal:10}} />
                                <Text style={{ fontSize: 12, color: '#000',fontWeight:'bold',fontFamily:'GilroyMedium'}}>LOGOUT</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>navigation.navigate('Register')} style={{width:'48%',alignItems:'flex-end'}}>
                            <View style={{width:'90%',height:40,alignItems:'center',flexDirection:'row',justifyContent:'flex-end'}}>
                                <Text style={{ fontSize: 12, color: '#000',fontWeight:'bold',fontFamily:'GilroyMedium'}}>SUSPEND ACCOUNT</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>


                <TouchableOpacity onPress={() => updateSettings()}
                    style={{width:'45%',alignSelf:'center',marginTop:20,backgroundColor:'#009D38',height:40,alignItems:'center',justifyContent:'center',borderRadius:5}}>
                    <Text style={{fontWeight:'bold',fontSize:13,color:'#fff',fontFamily:'GilroyMedium'}}>UPDATE PROFILE</Text>
                </TouchableOpacity>
                
            </View>

            </ScrollView>)}
            
            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />

    </View>
    )
}
export default InfoSettings;

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
    SubText: { fontSize: 14, color: '#000',alignSelf:'flex-end',right:10,bottom:30,fontFamily:'SofiaProRegular'}

});    