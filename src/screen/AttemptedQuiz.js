import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../components/Header'
import axiosClient from '../api/axios-client'
import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../components/UseContext';
import Icon from 'react-native-vector-icons/Feather';
import Loader from '../components/Loader'

const AttemptedQuiz = ({ navigation }) => {

    const { userId } = useContext(MyContext)
    const [quizes, setQuizes] = useState([])
    const [loader, setLoader] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        getAttemptedQuiz();
    }, [])

    const getAttemptedQuiz = () => {
        const fd = new FormData();
        fd.append('userid', userId);
        axiosClient().post('attempted/getQuiz', fd)
            .then((res) => {
                if (res.data.Error === 0) {
                    setQuizes(res.data.data)
                }
                else {
                    setErrorMessage(res.data.message)
                }
                setLoader(false)
                //console.log(res)
            }).catch((err) => {
                //console.log(err)
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <Header headerText={'Attempted Quiz'} onPress={() => navigation.goBack()} />
            {loader ? <Loader isLoading={loader} /> :
                <FlatList
                    data={quizes}
                    style={{ borderRadius: 10 }}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <View key={index}>
                                <TouchableOpacity
                                    style={styles.listMainView}
                                    onPress={() => navigation.navigate('QuizResult', { quizKey: item.key })}>
                                    <Text style={styles.ListHeadText}>{item.name}</Text>
                                    <View style={{ width: '100%', flexDirection: 'row' }}>
                                        <View style={{ width: '60%', justifyContent: 'center' }}>
                                            <Text style={styles.ListText}>{item.obtain_marks + '/' + item.max_marks}</Text>
                                            <Text style={styles.ListText}>{item.coursename}</Text>
                                        </View>
                                        <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <Text
                                                style={{
                                                    color: 'green',
                                                    fontSize: 13,
                                                }}>{'View Result'}</Text>
                                            <Icon name={'arrow-right'} size={17} color={'green'} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
            }
            {errorMessage !== "" &&
                <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>{errorMessage}</Text>
                </View>}
        </View>
    )
}
export default AttemptedQuiz;
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F9F5F2'
    },
    listStyle: {
        height: 228,
    },
    listMainView: {
        backgroundColor: '#fff',
        marginTop: 15,
        padding: 10,
        width: '95%',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        elevation: 10,
        borderColor: '#D5D5D5',
    },
    ListHeadText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#000',
    },
    ListText: {
        fontSize: 12,
        marginTop: 5,
        color: '#000',
        width: '60%'
    },
    headerText: {
        width: '100%',
        marginTop: 10,
        fontSize: 15,
        paddingLeft: 20,
        flexDirection: 'row',
    },
});