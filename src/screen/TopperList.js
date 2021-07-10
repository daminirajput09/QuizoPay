import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList,
    Image,
    StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';



const TopperList = ({ navigation, route }) => {

    const TopperListData = route.params.TopperList;
    //console.log(TopperListData, "topper")

    const [isLoading, setIsLoading] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <StatusBar backgroundColor='#F9F5F2' barStyle={'dark-content'} />
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', margin: 10, alignItems: 'center' }}>
                <Icon name="arrowleft" size={20} fill color="#000" onPress={() => navigation.goBack()} />
                <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 15 }}>Leaders Board</Text>
            </View>

            <ScrollView>
                <>
                    <View style={{
                        height: hp('22'),
                        width: '90%',
                        alignSelf: 'center',
                        backgroundColor: '#fff',
                        borderRadius: 30,
                        flexDirection: 'row',
                        marginTop: hp('14'),
                        elevation: 1
                    }}>
                        <View style={{ width: '29%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#52B884' }}>2</Text>
                            <View style={{
                                borderColor: '#52B884',
                                borderWidth: 2,
                                height: 50,
                                width: 50,
                                borderRadius: 25,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Image source={{ uri: TopperListData[1].profile_img }} style={{ height: 46, width: 46, borderRadius: 23 }} />

                            </View>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 13,
                                paddingTop: 10,
                                color: '#000'
                            }}>
                                {TopperListData[1].firstname}
                            </Text>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 11,
                                color: '#52B884',
                                paddingTop: 5
                            }}>
                                {TopperListData[1].obtain_marks} Marks
                            </Text>
                            {/* <Text style={{
                                fontSize: 11,
                                paddingTop: 5
                            }}>
                                @username
                            </Text> */}
                        </View>
                        <LinearGradient
                            start={{ x: 0.3, y: 0.8 }}
                            end={{ x: 0.3, y: 0 }}
                            colors={['#FDEDE0', '#FEF6F1', '#FEF9F5']}
                            style={{
                                width: '40%',
                                // justifyContent: 'center',
                                alignItems: 'center',
                                height: hp('30'),
                                bottom: 60,
                                borderTopLeftRadius: 120,
                                borderTopRightRadius: 120,
                                zIndex: -1
                            }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', alignSelf: 'center', marginTop: -53, zIndex: 1 }}>
                                <Image source={require('../../assets/crown.png')} style={{ height: 90, width: 90 }} resizeMode='center' />
                            </View>
                            <View style={{
                                borderColor: '#F07739',
                                borderWidth: 2,
                                height: 90,
                                width: 90,
                                borderRadius: 45,
                                marginTop: 15,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Image source={{ uri: TopperListData[0].profile_img }} style={{ height: 85.5, width: 85.5, borderRadius: 42 }} />
                            </View>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 15 }}>
                                {TopperListData[0].firstname}
                            </Text>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 13,
                                // bottom: 15,
                                color: '#F07739',
                                paddingTop: 10
                            }}>
                                {TopperListData[0].obtain_marks} Marks
                            </Text>
                            {/* <Text style={{
                                fontSize: 13,
                                bottom: 15,
                                paddingTop: 5
                            }}>
                                @username
                            </Text> */}
                        </LinearGradient>
                        <View style={{ width: '29%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#EF6A6A' }}>3</Text>
                            <View style={{
                                borderColor: '#EF6A6A',
                                borderWidth: 2,
                                height: 50,
                                width: 50,
                                borderRadius: 25,
                            }}>
                                <Image source={{ uri: TopperListData[2].profile_img }} style={{ height: 46, width: 46, borderRadius: 23 }} />
                            </View>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 13,
                                paddingTop: 10,
                                color: '#000'
                            }}>
                                {TopperListData[2].firstname}
                            </Text>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 11,
                                color: '#EF6A6A',
                                paddingTop: 5
                            }}>
                                {TopperListData[2].obtain_marks} Marks
                            </Text>
                            {/* <Text style={{
                                fontSize: 11,
                                paddingTop: 5
                            }}>
                                @username
                            </Text> */}
                        </View>

                    </View>
                    <View style={{
                        width: '90%',
                        backgroundColor: '#FFF',
                        marginTop: 25,
                        padding: 10,
                        alignSelf: 'center',
                        borderRadius: 25
                    }}>
                        {TopperListData.map((item, i) => (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignSelf: 'center',
                                justifyContent: 'space-around',
                                width: '100%',
                                marginVertical: 10
                            }}>
                                <Image
                                    style={{ height: 50, width: 50, borderRadius: 25 }}
                                    source={{ uri: item.profile_img }}
                                />
                                <View style={{ width: '50%' }}>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>{item.firstname + ' ' + item.lastname}</Text>
                                </View>

                                <Text style={{ paddingLeft: 3, fontSize: 14, color: '#6D6969', textAlign: 'center' }}>{item.obtain_marks + '/' + item.max_marks}</Text>
                            </View>
                        ))}
                    </View>
                </>
            </ScrollView>
        </View>

    )
}

export default TopperList;
