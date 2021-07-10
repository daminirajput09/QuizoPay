import React, { useContext } from 'react';
import { View, ImageBackground, TouchableOpacity, Text } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { MyContext } from './UseContext';

const Pass = ({ navigation }) => {

    const { passes } = useContext(MyContext)

    return (
        <ImageBackground source={require('../../assets/exambook-banner.png')}
            style={{
                height: hp('23'),
                marginHorizontal: 15,
                marginTop: 30,
                bottom: 10
            }} imageStyle={{ borderRadius: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate('Passes')}>
                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                    <Text style={{
                        fontWeight: 'bold',
                        color: '#fff',
                        fontSize: 18,
                        marginLeft: 15,
                        width: wp('50')
                    }}>
                        {passes[0] ? passes[0].name : ''} {'\n'}
                        <Text style={{ color: '#fff', textDecorationLine: 'line-through', fontSize: 12 }}>₹ {parseInt((passes[0].amount))}</Text>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}> ₹{passes[0].amount - (passes[0].amount * (passes[0].offer / 100)).toFixed('2')}<Text style={{ fontWeight: 'normal' }}></Text></Text>
                    </Text>
                    <Text style={{ color: '#fff', width: wp('36'), top: 5 }}>Unlock 100+ Exams and Quizzes.</Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 15, marginTop: 30 }}>
                    <View style={{ width: wp('50') }}>
                        <Text style={{ color: '#fff' }}>Starts for only</Text>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>
                            ₹ {passes[0] ? ((passes[0].amount - (passes[0].amount * (passes[0].offer / 100))) / passes[0].months).toFixed('0') : ''}/month
                        </Text>
                    </View>
                    <View style={{
                        top: 8,
                        backgroundColor: '#fff',
                        height: hp('4'),
                        width: wp('30'),
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: '#2D79C2', fontWeight: 'bold', fontSize: 15 }}>Buy Pass</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </ImageBackground>
    )
}
export default Pass;