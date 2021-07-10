import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Text, ScrollView,TouchableOpacity,ActivityIndicator } from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FormInput from '../components/FormInput';
import axiosClient from '../api/axios-client'
import Modal from 'react-native-modal';

const ForgotPassword = ({ navigation }) => {

    const [email, setEmail] = useState('')
    const [focus1, setFocus1] = useState('#f58020')
    const [loader, setLoader] = useState(false);

    const forgotBtnPress = () => {
      setLoader(true);

      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(email) === false) {
        //console.log("Email is Not Correct");
        alert('Email is not correct!');
        setLoader(false);
        return false;
      }
      else {
    
        const formData = new FormData();
        formData.append('email', email.toLocaleLowerCase())
        axiosClient().post('auth/forgotPassword', formData)
            .then(async (res) => {
                //console.log('Forget Password res', res);
                if (res.data.message == "Check your email for further instructions resetting your password") {
                    setLoader(false);
                    alert('Reset password link send to your email id, Check your email!');
                    navigation.navigate('Login');
                } else if(res.data.message == "Error setting new password"){
                  setLoader(false);
                  alert('Email could not found!');
              } else {
                    setLoader(false);
                }
            }).catch((err) => {
                //console.log('Forget Password err',err)
            })

        }
    }

    return(
      <>
            <View style={{flex: 1, backgroundColor: '#f4fbfe' }}>
                <StatusBar backgroundColor={'#f4fbfe'} barStyle={'dark-content'} />
                <IoniconsIcon name='arrow-back' style={styles.backIcon} onPress={() => navigation.goBack()} />
                
                <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center' }}
                    keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>

                <View style={styles.forgotView}>
                    <View style={styles.headerView}>
                        <Text style={{ color: '#f58020', fontSize: 23, fontWeight: 'bold' }}>
                            Forgot Password
                        </Text>
                        <Text style={{ fontSize: 12, color: '#313131', marginTop: 10 }}>
                            Provide email for reset password.
                        </Text>
                    </View>


                    <View style={{ width: '100%' }}>
                        <FormInput source={require('../../assets/user.png')}
                            placeholder={'Email ID'}
                            value={email}
                            autoFocus={true}
                            borderBottomColor={focus1}
                            imageStyle={styles.imageStyle}
                            onFocus={() => setFocus1('#f58020')}
                            onBlur={() => setFocus1('#9da7b4')}
                            onChangeText={(text) => { setEmail(text) }} />
                    </View>

                    <TouchableOpacity style={[styles.btnContainer, {
                      backgroundColor: !email ? '#9da7b4' : '#475e88',
                      borderRadius: 10,
                      flexDirection: 'row',marginTop: 50
                      }]} onPress={()=>!email?null:forgotBtnPress()}
                      activeOpacity={!email?1:0}>
                      <Text style={{ ...styles.btnText }}>Submit</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>

            </View>
            <Modal isVisible={loader}>
              <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>    
                <ActivityIndicator color={"#A9A9A9"} size={'large'} />
              </View>
            </Modal>
        </>    
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    forgotView: {
        marginTop: 150,
        // padding: 30,
        width: '90%',
        alignSelf:'center'
    },
    backIcon: {
        color: '#000',
        fontSize: 30,
        marginTop: 44,
        marginLeft: 10
    },
    forgotText: {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold'
    },
    emailText: {
        color: '#000',
        fontSize: 16,
        color: '#000',
        marginTop: 10
    },
    textInputValue: {
        color: '#000',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#000',
        padding: 3,
        flex: 1
    },
    textInputView: {
        height: 40,
        marginTop: 10
    },
    imageStyle: {
        width: 20,
        height: 20,
        alignSelf: 'flex-end',
        marginBottom: 10,
        left: 20
    },
    btnContainer: {
      backgroundColor: '#475e88',
      height: 60,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    }
})

export default ForgotPassword;
