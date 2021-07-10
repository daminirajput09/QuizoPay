import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Switch } from 'react-native';
import Header from '../components/Header'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useContext } from 'react';
import { MyContext } from '../components/UseContext';
import { useState } from 'react';


const Account = ({ navigation }) => {
    const { user } = useContext(MyContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [secureText, setSecureText] = useState(true)
    const [mobile, setMobile] = useState('')
    const [isEnabled1, setIsEnabled1] = useState(false);
    const [isEnabled2, setIsEnabled2] = useState(false);
    const [isEnabled3, setIsEnabled3] = useState(false);


    const toggleSwitch1 = () => setIsEnabled1(previousState => !previousState);
    const toggleSwitch2 = () => setIsEnabled2(previousState => !previousState);
    const toggleSwitch3 = () => setIsEnabled3(previousState => !previousState);


    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <Header headerText={'Account'} onPress={() => navigation.goBack()} />
            <View style={{ marginTop: hp('2%'), marginHorizontal: 20 }}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    backgroundColor: '#EDEDED',
                    height: 35,
                    padding: 5
                }}>General</Text>
                <View style={{ marginTop: 15, height: 50 }}>
                    <Text style={{ fontSize: 16 }}>Email Id</Text>
                    <TextInput
                        style={{
                            flex: 1,
                            borderBottomWidth: 1,
                            borderBottomColor: '#92c7c4',
                            // height: 35,
                            fontSize: 16,
                            padding: 0
                        }}
                        textContentType='emailAddress'
                        value={email || user.email}
                        onChangeText={(text) => setEmail(text)} />
                </View>
                <View style={{ marginTop: hp('2') }}></View>
                <Text style={{ fontSize: 16 }}>Password</Text>
                <View style={{ width: '100%', flexDirection: 'row', height: 30 }}>
                    <TextInput
                        style={{
                            flex: 1,
                            borderBottomWidth: 1,
                            borderBottomColor: '#92c7c4',
                            fontSize: 16,
                            padding: 0
                        }}
                        secureTextEntry={secureText}
                        value={password || user.password}
                        onChangeText={(text) => setPassword(text)} />
                    <TouchableOpacity style={{
                        position: 'absolute',
                        marginLeft: wp('80'),
                        top: -5
                    }}
                        onPress={() => setSecureText(!secureText)}>
                        <Image
                            source={require('../../assets/passwordEdit.png')}
                            style={{ height: 20, width: 20 }} />
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: hp('2') }}></View>
                <Text style={{ fontSize: 16 }}>Phone Number</Text>
                <View style={{ width: '100%', flexDirection: 'row', height: 30 }}>
                    <TextInput style={{
                        flex: 1,
                        borderBottomWidth: 1,
                        // height: 35,
                        borderBottomColor: '#92c7c4',
                        fontSize: 16,
                        padding: 0
                    }}
                        value={mobile || user.mobile}
                        onChangeText={(text) => setMobile(text)} />
                </View>
            </View>
            <View style={{ marginTop: hp('3'), marginHorizontal: 20 }}>
                <Text style={{
                    fontSize: 16, fontWeight: 'bold',
                    backgroundColor: '#EDEDED',
                    height: 35,
                    padding: 5
                }}>Notifications</Text>
                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Sound</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled1 ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch1}
                        value={isEnabled1}
                    />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Vibration</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled2 ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch2}
                        value={isEnabled2}
                    />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Allow Push Notification</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled3 ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch3}
                        value={isEnabled3}
                    />
                </View>
            </View>

        </View>
    )
}
export default Account;