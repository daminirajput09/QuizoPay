import React, { useContext, useState } from 'react'
import {
    Text,
    View,
    TextInput,
    Alert
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../components/Header';
import Button from '../components/Button'
import axiosClient from '../api/axios-client';
import { MyContext } from '../components/UseContext'

const Feedback = ({ navigation }) => {

    const { userId, user } = useContext(MyContext)
    const [email, setEmail] = useState(user.email);
    const [mobile, setMobile] = useState(user.mobile)
    const [message, setMessage] = useState('')
    //console.log(user, "user")

    const GoBack = () => {
        setMessage('')
        navigation.goBack()
    }

    const send = () => {
        if (userId) {
            const formData = new FormData();
            formData.append('user_id', userId);
            formData.append('emailid', email);
            formData.append('mobileno', mobile);
            formData.append('feedback', message);
            axiosClient().post('Feedback/submit', formData)
                .then((res) => {
                    Alert.alert(res.data.message)
                    setMessage('')
                }).catch((err) => {
                    //console.log(err)
                })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <Header headerText={'Feedback'} onPress={GoBack} />
            <View style={{ marginHorizontal: 20, marginTop: hp('2') }}>
                <Text style={{ fontSize: 18 }}>We would love to hear from you. {'\n'} If you have any feedback, please share!!</Text>
            </View>
            <View style={{ marginTop: hp('2'), marginHorizontal: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Email Id</Text>
                <TextInput
                    style={{
                        marginTop: hp('1'),
                        borderWidth: 1,
                        borderColor: '#D2D2D2',
                        height: hp('5'),
                        paddingLeft: 20
                    }}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    keyboardType={'email-address'}
                    placeholder='example@mail.com' />
                <Text style={{ marginTop: hp('2'), fontWeight: 'bold', fontSize: 15 }}>Contact Number</Text>
                <TextInput
                    style={{
                        marginTop: hp('1'),
                        borderWidth: 1,
                        borderColor: '#D2D2D2',
                        height: hp('5'),
                        paddingLeft: 20
                    }}
                    keyboardType={'numeric'}
                    maxLength={10}
                    onChangeText={(text) => setMobile(text)}
                    value={mobile}
                    placeholder='1234567890' />
                <Text style={{ marginTop: hp('2'), fontWeight: 'bold', fontSize: 15 }}>Feedback</Text>
                <TextInput
                    style={{
                        marginTop: hp('1'),
                        borderWidth: 1,
                        borderColor: '#D2D2D2',
                        height: hp('15'),
                        paddingLeft: 20
                    }}
                    multiline={true}
                    autoFocus={true}
                    onChangeText={(text) => setMessage(text)}
                    value={message}
                    placeholder='Type your message here' />

                <View style={{ marginTop: hp('5') }}>
                    <Button
                        backgroundColor={'#6EBFB2'}
                        Label={'Send Feedback'}
                        borderRadius={10}
                        onPress={() => send()}
                        disabled={!email || !mobile || !message}
                    />
                </View>
            </View>
        </View>
    )
}
export default Feedback;