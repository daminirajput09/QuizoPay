import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axiosClient from '../api/axios-client';
import Header from '../components/Header';
import Loader from '../components/Loader';

const BuyVideo = ({ navigation }) => {
    const [latestCourses, setLatestCourses] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        latestVideoCourses();
    }, [])

    const latestVideoCourses = () => {
        setIsLoading(true);
        const formData = new FormData()
        formData.append('limit', '')
        axiosClient().post('passes/get', formData)
            .then((res) => {
                setIsLoading(false);
                if (res.data.Error === 0) {
                    setLatestCourses(res.data.data)
                }
            }).catch((err) => {
                setIsLoading(false);
                //console.log('error in buy video', err)
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f4fbfe' }}>
            <Header headerText={'Buy Video Lectures'} onPress={() => navigation.goBack()} />
            {isLoading ? <Loader isLoading={isLoading} /> :
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={latestCourses}
                    style={{ marginTop: 15 }}
                    renderItem={({ item }) => {
                        return (
                            <>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('PayYourFee', { hash: item.hash, key: '' })}
                                    style={{ marginHorizontal: 20 }}>
                                    <Image source={{ uri: item.image }} resizeMode='stretch' style={{ height: hp('25'), borderRadius: Platform.OS === 'ios' ? 15 : 5 }} />
                                    <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', marginHorizontal: 15 }}>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.name}</Text>
                                        <Text style={{ fontSize: 16 }}>₹{item.amount.split(".")[0]}/-</Text>
                                    </View>
                                    <Text style={{ marginLeft: 20, color: '#727376', marginTop: 2 }}>{item.coursescategory}</Text>
                                </TouchableOpacity>
                                <View style={{ marginVertical: 10 }}></View>
                            </>
                        )
                    }}
                    keyExtractor={(item, index) => index.toString()}
                ></FlatList>}
        </View>
    )
}
export default BuyVideo