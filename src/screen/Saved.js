import React, { useEffect, useState, useContext } from 'react'
import { View, Text, FlatList, TouchableOpacity, Dimensions, ToastAndroid, ActivityIndicator } from 'react-native'
import axiosClient from '../api/axios-client';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { MyContext } from '../components/UseContext'
import FontIcon from 'react-native-vector-icons/FontAwesome';
import HTML from "react-native-render-html";
import { IGNORED_TAGS, alterNode, makeTableRenderer } from 'react-native-render-html-table-bridge';
import WebView from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview';

const windowWidth = Dimensions.get('window').width;


const Saved = ({ navigation }) => {

    const { userId } = useContext(MyContext)
    const [questions, setQuestions] = useState([])
    const [loader, setLoader] = useState(false)
    const [langChange, setLangChange] = useState(true)
    const [bookMark, setBookMark] = useState(true)

    const configHTML = {
        WebViewComponent: WebView,
        tableStyleSpecs: {
            cellSpacingEm: 0.1,
            fitContainerWidth: true,
            fontSizePx: 10,
            width: 100
          }
      };
    
    const renderers = {
        table: makeTableRenderer(configHTML)
    };
    
    const htmlConfig = {
        alterNode,
        renderers,
        ignoredTags: IGNORED_TAGS
    };
    
    useEffect(() => {
        getSavedQues();
    }, [userId]);

    useEffect(() => {
        //console.log('navigation called');
        const unsubscribe = navigation.addListener('focus', () => {
            //console.log('focus called');
            getSavedQues();
        });
        return unsubscribe;
    }, [navigation]);

    const getSavedQues = () => {
        setLoader(true)
        const fd = new FormData();
        fd.append('userid', userId);
        axiosClient().post('questions/getSavedQuestions', fd)
            .then((res) => {
                if (res.data.Error === 0) {
                    setQuestions(res.data.data)
                    setLoader(false)
                }
                //console.log(res, "res")
            }).catch((err) => {
                //console.log(err)
            })
    }

    const onBookMarkQues = (questionid, i) => {
        // setIsLoading(true);
        if (userId !== null && questionid !== null) {
            const formData = new FormData();
            formData.append('userid', userId);
            formData.append('questionid', questionid);
            //console.log('question bookmark response', userId, questionid);
            axiosClient()
                .post('questions/bookmark', formData)
                .then((res) => {
                    // setIsLoading(false);
                    if (res.data.Error == 0) {
                        let question = [...questions]
                        question.splice(i, 1)
                        setQuestions(question)
                        ToastAndroid.show(res.data.message, ToastAndroid.SHORT)
                    }
                })
                .catch((err) => {
                    ToastAndroid.show(err, ToastAndroid.SHORT)
                    //console.log('question bookmark error', err);
                });
        }
    };

    const ActivityIndicatorLoadingView = () => {
        return (
     
          <ActivityIndicator
            color='#A9A9A9'
            size='large'
            style={{flex:1,width:'100%',height:'100%',alignItems: 'center',justifyContent: 'flex-start'}}
          />
        );
      }

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <Header headerText={'Saved'} onPress={() => { navigation.goBack(); return true; }} />
            {loader ? <Loader isLoading={loader} /> : <FlatList
                data={questions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity key={index}
                            onPress={() => navigation.navigate('ViewSavedQuestion', { id: item.id, i: index })}
                            style={{ width: '100%', backgroundColor: '#fff', alignSelf: 'center', marginBottom: 20, paddingVertical: 10 }}>
                            <View style={{ flexDirection: 'row', width: '95%', alignSelf: 'center' }}>
                                <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{
                                        height: 30,
                                        width: 30,
                                        backgroundColor: 'grey',
                                        borderRadius: 50,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{ color: '#fff', fontSize: 16 }}>{index + 1}</Text>
                                    </View>

                                    <Text style={{ color: 'green', fontWeight: 'bold', paddingHorizontal: 5, marginLeft: 10 }}>
                                        +{item.marks}
                                    </Text>
                                    <Text style={{ color: 'red', fontWeight: 'bold', paddingHorizontal: 5, marginLeft: 5 }}>
                                        -{item.negativemarks}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => onBookMarkQues(item.id, index)}>
                                    {<FontIcon name="bookmark" size={22} fill color="grey" />}
                                </TouchableOpacity>
                            </View>
                            <AutoHeightWebView
                                renderLoading={ActivityIndicatorLoadingView}
                                startInLoadingState={true}
                                style={{ width: windowWidth - 60, alignSelf:'center',opacity: 0.99,minHeight: 1 }}
                                files={[{
                                    href: 'cssfileaddress',
                                    type: 'text/css',
                                    rel: 'stylesheet'
                                }]}
                                customStyle={`
                                * {
                                    font-family: 'Times New Roman';
                                }
                                table {
                                    max-width: ${windowWidth - 60};
                                    font-size: 10px;
                                }
                                img {
                                    max-width: ${windowWidth - 60};
                                }`}
                                source={{  html: langChange == true ?
                                    item.question_eng ?
                                        item.question_eng
                                        : item.question_hin
                                    :
                                    item.question_hin
                                        ? item.question_hin
                                        : item.question_eng }}
                            />
                            {/* <HTML source={{
                                html: langChange == true ?
                                item.question_eng ?
                                    item.question_eng
                                    : item.question_hin
                                :
                                item.question_hin
                                    ? item.question_hin
                                    : item.question_eng
                            }} contentWidth={windowWidth - 50} 
                            containerStyle={{marginTop: 10, marginHorizontal:10}} {...htmlConfig} /> */}
                        </TouchableOpacity>
                    )
                }}
            />}

        </View>
    )
}
export default Saved