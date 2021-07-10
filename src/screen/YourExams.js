import React, { useEffect, useState } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import Header from '../components/Header'
import Icon from 'react-native-vector-icons/AntDesign'
import axiosClient from '../api/axios-client'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const YourExams = ({ navigation }) => {

    const [exams, setExams] = useState([])

    useEffect(() => {
        getCourses();
    }, []);

    const getCourses = () => {
        const fd = new FormData();
        axiosClient().post('courses/getCourses')
            .then((res) => {
                //console.log(res, "res1")
                if (res.data.Error == 0) {
                    setExams(res.data.data)
                }
            }).catch((err) => {
                //console.log(err)
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            {/* <ImageBackground
                source={require('../../assets/exam_bg.jpg')} style={{ height: '100%', width: '100%' }}> */}
                <TouchableOpacity style={styles.container} onPress={() => navigation.goBack()}>
                    <Icon name='arrowleft' size={20} color='#000' style={{ marginLeft: 20 }} />
                </TouchableOpacity>
                <Text style={[styles.textStyle]}>
                    Exams
                </Text>
                <View>
                    <Text style={{ textAlign: 'center', color: '#000', fontWeight: 'bold', fontSize: 17 }}>Exams are you preparing for?</Text>
                    <Text style={{ textAlign: 'center', color: '#000' }}>You can select multiple options.</Text>
                </View>
                <ScrollView style={{ marginTop: hp('2') }}>
                    {exams.map((item, i) => {
                        return (
                            <TouchableOpacity
                                key={i}
                                style={{
                                    height: 90,
                                    backgroundColor: '#fff',
                                    marginTop: 10,
                                    marginBottom: 5,
                                    flexDirection: 'row',
                                    width: '92%',
                                    alignSelf: 'center',
                                    elevation: 20,
                                    alignItems: 'center',
                                    // justifyContent: 'space-around'
                                }} onPress={() => navigation.navigate('SubExams', { courseid: item.id })}>
                                <Image
                                    source={{ uri: item.thumbnail }}
                                    style={{
                                        borderColor: '#000',
                                        height: '100%',
                                        width: '20%',
                                        alignSelf: 'flex-start',
                                        marginHorizontal: 10
                                    }}
                                    resizeMode='contain'
                                />
                                <View style={{ marginHorizontal: 10, width: 190 }}>
                                    <Text style={{
                                        ...styles.sliderText, fontSize: 15
                                    }}>{item.coursename}</Text>
                                    <Text style={{
                                        marginTop: 5,
                                        color: '#919295', fontSize: 12
                                    }}>RRB NTPC, RRC GROUP D</Text>
                                </View>
                                <View>
                                    <Icon name='right' size={20} />
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            {/* </ImageBackground> */}

        </View>
    )
}
export default YourExams;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', width: '100%',
        marginTop: Platform.OS == 'ios' ? 40 : 5,
        // alignItems: 'center'
    },
    textStyle: {
        width: '90%',
        marginLeft: 50,
        color: '#000',
        bottom: 20
    },
    imageStyle: {
        width: 20,
        height: 20,
        left: 20,
    },
    style1: {
        fontWeight: 'bold'
    },
    sliderText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});