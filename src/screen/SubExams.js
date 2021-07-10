import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, ToastAndroid, FlatList, ScrollView, BackHandler} from 'react-native';
import axiosClient from '../api/axios-client';
import Header from '../components/Header'
import { MyContext } from '../components/UseContext';
import Icon from 'react-native-vector-icons/FontAwesome5';


const SubExams = ({ navigation, route }) => {
    const { courseid } = route.params;
    const { user } = useContext(MyContext)
    const [courses, setCourses] = useState([])
    //console.log(courseid, "id");

    useEffect(()=>{
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    
        return () => 
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    },[]);

    useEffect(() => {
        getSubCourses();
    }, [courseid])

    const handleBackButtonClick = () => {
        return true;
    };

    const getSubCourses = () => {
        const fd = new FormData();
        fd.append('userid', user.id);
        fd.append('courseid', courseid);
        axiosClient().post('courses/getSubCourses', fd)
            .then((res) => {
                if (res.data.Error === 0) {
                    setCourses(res.data.data);
                }
                //console.log(res)
            }).catch((err) => {
                console.log(err)
            })
    }

    const updateCourse = (id) => {
        const fd = new FormData();
        fd.append('userid', user.id);
        fd.append('courseid', id);
        axiosClient().post('courses/update', fd)
            .then((res) => {
                //console.log('id of sub exam', id);
                if (res.data.Error === 0) {
                    getSubCourses();
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT)
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <Header headerText={'Sub Exams'} onPress={() => navigation.goBack()} />
            <ScrollView>
            {courses.map((item, i) => {
                return (
                    <TouchableOpacity
                        key={i}
                        style={{
                            height: 90,
                            backgroundColor: '#fff',
                            marginTop: 15,
                            flexDirection: 'row',
                            width: '92%',
                            alignSelf: 'center',
                            elevation: 20,
                            alignItems: 'center',
                            marginBottom:10
                            // justifyContent: 'space-around'
                        }} onPress={() => updateCourse(item.id)}>
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
                        <View style={{ marginHorizontal: 10, width: 180 }}>
                            <Text style={{
                                ...styles.sliderText, fontSize: 15
                            }}>{item.coursescategory}</Text>
                        </View>
                        <View style={{
                            marginLeft: 10,
                            borderWidth: 1,
                            borderColor: item.selected === 'Yes' ? '#55AA89' : '#B0B0B0',
                            backgroundColor: item.selected !== 'Yes' ? '#f4fbfe' : '#55AA89',
                            height: 25,
                            width: 25,
                            borderRadius: 15,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {item.selected === 'Yes' && <Icon name="check" size={15} color="#fff" />}
                        </View>
                    </TouchableOpacity>
                )
            })}
            </ScrollView>
        </View>
    )
}
export default SubExams;

const styles = StyleSheet.create({
    sliderText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
})