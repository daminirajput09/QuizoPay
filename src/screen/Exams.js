import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import axiosClient from '../api/axios-client';
import Header from '../components/Header'
import { MyContext } from '../components/UseContext';
import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/AntDesign';


const Exams = ({ navigation }) => {

    const { userId } = useContext(MyContext);
    const [exams, setExams] = useState([]);
    const [loader, setLoader] = useState(true)


    useEffect(() => {
        getExams();
    }, []);

    const getExams = () => {
        const fd = new FormData();
        fd.append('userid', userId);
        axiosClient().post('exams/getExams', fd)
            .then((res) => {
                if (res.data.Error == 0) {
                    setExams(res.data.data)
                    setLoader(false)
                }
                //console.log(res)
            }).catch((err) => {
                //console.log(err)
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <Header headerText={'Explore Exams'} onPress={() => navigation.goBack()} />
            {loader ? <Loader isLoading={loader} /> :
                <>
                    <FlatList
                        data={exams}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={{
                                        height: 70,
                                        backgroundColor: '#fff',
                                        marginTop: 15,
                                        flexDirection: 'row',
                                        width: '90%',
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        borderRadius: 4
                                        // justifyContent: 'space-around'
                                    }} onPress={() => navigation.navigate('ExamCategory', { coursename: item.coursename, examid: item.id })}>
                                    <Image
                                        source={{ uri: item.image }}
                                        style={{
                                            borderColor: '#000',
                                            height: 30,
                                            width: 30,
                                            marginHorizontal: 10
                                        }}
                                    />
                                    <Text style={styles.sliderText}>{item.coursename}</Text>
                                    <Icon name='right' size={20} />
                                </TouchableOpacity>
                            )
                        }}
                    />
                </>
            }
        </View>
    )
}
export default Exams;

const styles = StyleSheet.create({
    sliderText: {
        marginHorizontal: 10,
        width: 220,
        fontSize: 14,
        fontWeight: 'bold',
    },
})