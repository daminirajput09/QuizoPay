import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, StyleSheet,FlatList } from 'react-native';
import axiosClient from '../api/axios-client';
import Header from '../components/Header'
import { MyContext } from '../components/UseContext';
import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/AntDesign';

const ExamCategory = ({ navigation, route }) => {

    const { coursename, examid } = route.params;
    const { userId } = useContext(MyContext)
    const [category, setCategory] = useState([])
    const [loader, setLoader] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')


    useEffect(() => {
        getCategory();
    }, []);

    const getCategory = () => {
        const fd = new FormData();
        fd.append('userid', userId);
        fd.append('examid', examid);
        axiosClient().post('exams/getExamsCategory', fd)
            .then((res) => {
                if (res.data.Error == 0) {
                    setCategory(res.data.data)
                }
                else {
                    setErrorMessage(res.data.message);
                    setCategory([])
                }
                setLoader(false)
                //console.log(res)
            }).catch((err) => {
                //console.log(err)
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <Header headerText={coursename} onPress={() => navigation.goBack()} />
            {loader ? <Loader isLoading={loader} /> :
                category.length > 0 ?
                    <ScrollView contentContainerStyle={{ height: '100%',flex:1 }}>
                            <FlatList
                            style={{ marginBottom: 10 }}
                            data={category}
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
                                    }} onPress={() => navigation.navigate('ViewCategory', { coursescategory: item.coursescategory, examid: item.id })}>
                                    <Image
                                        source={{ uri: item.image }}
                                        style={{
                                            borderColor: '#000',
                                            height: 30,
                                            width: 30,
                                            marginHorizontal: 10
                                        }}
                                    />
                                    <Text style={styles.sliderText}>{item.coursescategory}</Text>
                                    <Icon name='right' size={20} />
                                </TouchableOpacity>
                            )}}
                            />
                    </ScrollView>
                    :
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{errorMessage}</Text>
                    </View>
            }
        </View>
    )
}

export default ExamCategory;
const styles = StyleSheet.create({
    sliderText: {
        marginHorizontal: 10,
        width: 220,
        fontSize: 14,
        fontWeight: 'bold',
    },
})