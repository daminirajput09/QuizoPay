import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import Header from '../components/Header'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useContext } from 'react';
import { MyContext } from '../components/UseContext';
import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicon from 'react-native-vector-icons/Ionicons';

const Profile = ({ navigation }) => {
    const { user } = useContext(MyContext)
    const [name, setName] = useState(user.firstname + user.lastname)
    const [pincode, setPincode] = useState('302019')
    const [dob, setDob] = useState('04/04/1996')
    const [category, setCategory] = useState('')
    const [education, setEducation] = useState('')
    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
<StatusBar backgroundColor={'#B0191E'} barStyle={'light-content'} />

                <View style={styles.headerView}>
                    <TouchableOpacity
                        style={{width:'15%',alignItems:'center',justifyContent:'center'}}
                        onPress={() => navigation.goBack()}>
                        <Ionicon name='arrow-back-outline' size={20} color='#fff' />
                    </TouchableOpacity>

                    <View style={{width:'85%',alignItems: 'flex-start'}}>
                        <Text style={styles.textHead}>my matches</Text>
                    </View>
                </View>            <View style={{ marginTop: hp('5'), marginHorizontal: 20 }}>
                <Text style={{ fontSize: 16 }}>Name</Text>
                <View style={{ width: '100%', flexDirection: 'row', height: 30 }}>
                    <TextInput
                        style={{
                            flex: 1,
                            borderBottomWidth: 1,
                            borderBottomColor: '#92c7c4',
                            fontSize: 16,
                            padding: 0
                        }}
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                </View>
                <View style={{ marginTop: hp('2') }}></View>
                <Text style={{ fontSize: 16 }}>Pincode</Text>
                <View style={{ width: '100%', flexDirection: 'row', height: 30 }}>
                    <TextInput
                        style={{
                            flex: 1,
                            borderBottomWidth: 1,
                            borderBottomColor: '#92c7c4',
                            fontSize: 16,
                            padding: 0
                        }}
                        value={pincode}
                        onChangeText={(text) => setPincode(text)}
                    />
                </View>
                <View style={{ marginTop: hp('2') }}></View>
                <Text style={{ fontSize: 16 }}>Date Of Birth</Text>
                <View style={{ width: '100%', flexDirection: 'row', height: 30 }}>
                    <TextInput
                        style={{
                            flex: 1,
                            borderBottomWidth: 1,
                            borderBottomColor: '#92c7c4',
                            fontSize: 16,
                            padding: 0
                        }}
                        value={dob}
                        onChangeText={(text) => setDob(text)}
                    />
                </View>
                <View style={{ marginTop: hp('2') }}></View>
                <Text style={{ fontSize: 16 }}>Category</Text>
                <View style={{ width: '100%', flexDirection: 'row', height: 30, }}>
                    <DropDownPicker
                        items={[
                            { label: '', value: '' },
                            { label: '', value: '' },
                            { label: '', value: '' },
                        ]}
                        defaultValue={category}
                        containerStyle={{ height: 40, width: '100%', }}
                        style={{
                            borderWidth: 0,
                            borderBottomWidth: 1,
                            borderBottomColor: '#92c7c4',
                            fontSize: 16,
                            backgroundColor: '#F9F5F2'
                        }}
                        placeholderStyle={{
                            right: 10
                        }}
                        globalTextStyle={{ right: 10, fontSize: 15 }}
                        itemStyle={{
                            justifyContent: 'flex-start',
                            left: 10
                        }}
                        // dropDownStyle={{ backgroundColor: '#fafafa' }}
                        onChangeItem={item => setCategory(item.value)}
                    />
                </View>
                <View style={{ marginTop: hp('2') }}></View>
                <Text style={{ fontSize: 16 }}>Education</Text>
                <View style={{ width: '100%', flexDirection: 'row', height: 30 }}>
                    <DropDownPicker
                        items={[
                            { label: '', value: '' },
                            { label: '', value: '' },
                            { label: '', value: '' },
                        ]}
                        defaultValue={education}
                        containerStyle={{ height: 40, width: '100%' }}
                        style={{
                            borderWidth: 0,
                            borderBottomWidth: 1,
                            borderBottomColor: '#92c7c4',
                            fontSize: 16,
                            backgroundColor: '#F9F5F2',
                        }}
                        globalTextStyle={{ right: 10, fontSize: 15 }}
                        placeholderStyle={{
                            right: 10
                        }}
                        itemStyle={{
                            justifyContent: 'flex-start',
                            left: 10
                        }}
                        // dropDownStyle={{ backgroundColor: '#fafafa' }}
                        onChangeItem={item => setEducation(item.value)}
                    />
                </View>
            </View>
        </View>
    )
}
export default Profile;