import React, { useEffect, useState } from 'react'
import { BackHandler, Text, View, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions, Image } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import DefaultInput from '../components/DefaultInput';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast, {BaseToast} from 'react-native-toast-message';
import axiosClient from '../api/axios-client';

const windowHeight = Dimensions.get('window').height;

const VerifyBank = ({ navigation, route }) => {

    const { reviewType, data } = route.params;
    //console.log('review type in bank', reviewType, data);

    const [AccountNumber, setAccountNumber] = useState(data && data.account_number);
    const [ConfirmAccountNumber, setConfirmAccountNumber] = useState(data && data.account_number);
    const [IFSCCode, setIFSCCode] = useState(data && data.ifsc_code);
    const [BankName, setBankName] = useState(data && data.bank_name);
    const [BranchName, setBranchName] = useState(data && data.branch_name);
    const [State, setState] = useState(data && data.state)
    const [filePath, setFilePath] = useState({ uri: data && data.bank_proof_url });

    const [userInfo, setUserInfo] = useState('')
    
    const [Editable, setEditable] = useState(false)

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

    const chooseFile = (type) => {
        setFilePath({ uri: ''})
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

    const saveBankDetails = () => {
        
        setEditable(true);

        if(AccountNumber === ConfirmAccountNumber){

        const formData = new FormData();
        formData.append('userid', userInfo.id);
        formData.append('account_number', AccountNumber);
        formData.append('ifsc_code', IFSCCode);
        formData.append('bank_name', BankName);
        formData.append('branch_name', BranchName);
        formData.append('state', State);
        formData.append('file', {
            name: filePath.fileName,
            type: filePath.type,
            uri: filePath.uri
        })

        axiosClient().post('users/updateBankDetails', formData)
            .then(async (res) => {
                //console.log('update Bank Details res', res.data.data, formData)
                if (res.data.Error == 0) {
                    Toast.show({
                        text1: res.data.message,
                        type: 'success',
                        position: 'top',
                        color: '#50C878',
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
                // setLoader(false); 
                console.log('update Bank Details error', err)
            })
        } else {
            Toast.show({
                text1: 'Account Number not match!',
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

    // const saveImage = (response) => {
    //     const formData = new FormData();
    //     formData.append('userid', user.id);
    //     formData.append('file', {
    //         name: response.fileName,
    //         type: response.type,
    //         uri: response.uri
    //     })
    //     axiosClient().post('users/updateprofilepic', formData)
    //         .then(async (res) => {
    //             if (res.data.Error == 0) {
    //                 await AsyncStorage.setItem('user', JSON.stringify(res.data.data))
    //                 Alert.alert(res.data.message)
    //                 // getData();
    //             }
    //         }).catch((err) => {
    //             console.log(err)
    //         })
    // }

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
                <Text style={styles.textHead}>Verify Bank Account</Text>
            </View>
        </View>

        <ScrollView keyboardShouldPersistTaps="always">

        <View style={{ padding: 12,backgroundColor: '#fff' }}>


            {reviewType == 'inreview'?
            <View style={{width:'100%',backgroundColor:'#DAEBFC',padding:12,borderRadius:4}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <EntypoIcon name="back-in-time" size={23} color="#11356F" />
                    <Text style={{color:'#1C3F71',fontWeight:'bold',fontSize:14,paddingLeft:10,fontFamily:'GilroyMedium'}}>Verification in review...</Text>
                </View>
                <Text style={{color:'#1C3F71',fontSize:12,marginTop:5,fontFamily:'SofiaProRegular'}}>Bank details are under review</Text>
            </View>:null}

                <View style={{width:'100%',alignSelf:'center',marginTop:20}}>
                    <DefaultInput
                        label={'Account Number'}
                        value={AccountNumber}
                        onChangeText={text => setAccountNumber(text)}
                        keyboardType={'default'}
                        bgColor={'#F8F8F8'}
                        editable={(data && data.verified == 1) || Editable || reviewType == ('inreview' || 'done') ? false : true }
                    />
                    <Text style={{ fontSize: 12, color: '#000',textAlign:'left',fontFamily:'SofiaProRegular'}}>Enter your Bank Account Number</Text>

                    <View style={{marginTop:15}} />
                    <DefaultInput
                        label={'Retype Account Number'}
                        value={ConfirmAccountNumber}
                        onChangeText={text => setConfirmAccountNumber(text)}
                        keyboardType={'default'}
                        bgColor={'#F8F8F8'}
                        editable={(data && data.verified == 1) || Editable || reviewType == ('inreview' || 'done') ? false : true }
                    />
                    <Text style={{ fontSize: 12, color: '#000',textAlign:'left',fontFamily:'SofiaProRegular'}}>Confirm your Bank Account Number</Text>

                    <View style={{marginTop:15}} />
                        <DefaultInput
                            label={'IFSC Code'}
                            value={IFSCCode}
                            onChangeText={text => setIFSCCode(text)}
                            keyboardType={'number-pad'}
                            bgColor={'#F8F8F8'}
                            editable={(data && data.verified == 1) || Editable || reviewType == ('inreview' || 'done') ? false : true }
                        />
                    <Text style={{ fontSize: 11, color: '#000',textAlign:'left',fontFamily:'SofiaProRegular'}}>
                        Enter 11-digit Bank IFSC Code
                    </Text>

                    <View style={{marginTop:15}} />
                    <DefaultInput
                        label={'Bank Name'}
                        value={BankName}
                        onChangeText={text => setBankName(text)}
                        keyboardType={'default'}
                        bgColor={'#F8F8F8'}
                        editable={(data && data.verified == 1) || Editable || reviewType == ('inreview' || 'done') ? false : true }
                    />
                    <Text style={{ fontSize: 12, color: '#000',textAlign:'left',fontFamily:'SofiaProRegular'}}>Your Bank Name</Text>

                    <View style={{marginTop:15}} />
                    <DefaultInput
                        label={'Branch Name'}
                        value={BranchName}
                        onChangeText={text => setBranchName(text)}
                        keyboardType={'default'}
                        bgColor={'#F8F8F8'}
                        editable={(data && data.verified == 1) || Editable || reviewType == ('inreview' || 'done') ? false : true }
                    />
                    <Text style={{ fontSize: 12, color: '#000',textAlign:'left',fontFamily:'SofiaProRegular'}}>Your Branch Name</Text>

                    <View style={{marginTop:15}} />
                    <DefaultInput
                        label={'State'}
                        value={State}
                        onChangeText={text => setState(text)}
                        keyboardType={'default'}
                        bgColor={'#F8F8F8'}
                        editable={(data && data.verified == 1) || Editable || reviewType == ('inreview' || 'done') ? false : true }
                    />
                    {/* <RNPickerSelect
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
                    /> */}

                    {reviewType == ('inreview' || 'done')|| Editable?
                    <TouchableOpacity activeOpacity={1} style={{width:'100%',flexDirection:'row',marginTop:20,height:45,alignItems:'center',justifyContent:'center',borderRadius:4,borderWidth:0.7,borderColor:'lightgrey'}}>
                        <AntDesignIcon name="idcard" size={20} color="#000" />
                        <Text style={{textTransform:'uppercase',fontSize:14,color:'#000',fontWeight:'bold',marginLeft:10,fontFamily:'GilroyMedium'}}>bank PROOF</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => chooseFile('photo')} activeOpacity={0.5} style={{width:'100%',flexDirection:'row',marginTop:20,height:45,alignItems:'center',justifyContent:'center',borderRadius:4,borderWidth:0.7,borderColor:'lightgrey'}}>
                        <AntDesignIcon name="idcard" size={20} color="#000" />
                        <Text style={{textTransform:'uppercase',fontSize:14,color:'#000',fontWeight:'bold',marginLeft:10,fontFamily:'GilroyMedium'}}>UPLOAD bank PROOF</Text>
                    </TouchableOpacity>}

                    
                    {filePath.uri != ''?<Image
                        source={{ uri: filePath.uri }}
                        style={{ height: 100, width: 100,marginTop:5,alignSelf:'center' }}
                        resizeMode='contain' />:null}
                </View>    


                <View style={{width:'90%',alignSelf:'center',marginTop:30}}>
                <Text style={{ fontSize: 14, color: '#000',textAlign:'left',fontWeight:'bold',fontFamily:'GilroyMedium'}}>IMPORTANT</Text>

                <View style={{flexDirection:'row',marginTop:10}}>
                    <EntypoIcon name="dot-single" size={20} color="#000" />
                    <Text style={{ fontSize: 11, color: '#000',textAlign:'left',fontFamily:'SofiaProRegular'}}>
                        Review your details before  submitting your document permanently 
                    </Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <EntypoIcon name="dot-single" size={20} color="#000" />
                    <Text style={{ fontSize: 11, color: '#000',textAlign:'left',fontFamily:'SofiaProRegular'}}>
                        Password protected files will be rejected 
                    </Text>
                </View>
            </View>

            </View>

            


            </ScrollView>

            <View style={{backgroundColor:'#fff',width:'100%',paddingBottom:10}}>
                {Editable || (reviewType == ('inreview' || 'done')) ?
                null:
                <TouchableOpacity 
                    activeOpacity={ AccountNumber && ConfirmAccountNumber && IFSCCode && BankName && BranchName && State ? 0 : 1 } onPress={() => 
                        AccountNumber &&
                        ConfirmAccountNumber &&
                        IFSCCode &&
                        BankName &&
                        BranchName &&
                        State ? saveBankDetails():null}
                    style={{width:'90%',alignSelf:'center',marginTop:20,backgroundColor:AccountNumber && ConfirmAccountNumber && IFSCCode && BankName && BranchName && State?'#009D38':'#DADADA',height:45,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                    <Text style={{textTransform:'uppercase',fontSize:15,color:AccountNumber && ConfirmAccountNumber && IFSCCode && BankName && BranchName && State?'#fff':'#000',fontFamily:'GilroyMedium'}}>submit details</Text>
                </TouchableOpacity>}
            </View>

            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
    </View>
    )
}
export default VerifyBank;

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