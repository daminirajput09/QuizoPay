import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions,ScrollView } from 'react-native';
import axiosClient from '../api/axios-client';
import Header from '../components/Header'
import { MyContext } from '../components/UseContext';
import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Feather';
import HTML from 'react-native-render-html'
import moment from 'moment'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import GestureRecognizer from 'react-native-swipe-gestures';
import { WebView } from 'react-native-webview'
import AutoHeightWebView from 'react-native-autoheight-webview'

const BlogPost = ({ navigation, route }) => {

    const { item } = route.params;
    const [loader, setLoader] = useState(false)
    const [categories, setCategories] = useState([]);
    const [categoryIndex, setCategoryIndex] = useState(0)
    const [blogPosts, setBlogPosts] = useState([]);
    let flatListRef = React.createRef();
    const regex = /(<([^>]+)>)/ig;
    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };
    const windowWidth = Dimensions.get('window').width;

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <Header headerText={'Post'} onPress={() => navigation.goBack()} />
            {loader ? <Loader isLoading={loader} /> :
                <>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.title.rendered}</Text>
                            <Text style={{ fontWeight: 'bold', marginTop: 10 }}>{moment(item.date).format('DD/MM/YYYY')}</Text>
                            {/* <HTML source={{ html: item.content.rendered, }} contentWidth={windowWidth} /> */}
                        </View>
                        <View style={{  marginTop: 10,marginBottom:20, width: '100%' }}>
                            {/* <WebView
                                source={{ html: item.content.rendered }}
                                startInLoadingState
                                javaScriptEnabled={true}
                                automaticallyAdjustContentInsets={true} /> */}
                        <AutoHeightWebView
                                style={{ width: windowWidth - 10,opacity: 0.99,minHeight: 1,alignSelf:'center' }}
                                files={[{
                                    href: 'cssfileaddress',
                                    type: 'text/css',
                                    rel: 'stylesheet'
                                }]}
                                files={[{
                                    href: 'cssfileaddress',
                                    type: 'text/css',
                                    rel: 'stylesheet'
                                }]}
                            source={{ html: item.content.rendered }}
                            />
                        </View>
                    </ScrollView>

                </>
            }
        </View>
    )
}
export default BlogPost;

const styles = StyleSheet.create({
    sliderText: {
        marginHorizontal: 10,
        width: 220,
        fontSize: 14,
        fontWeight: 'bold',
    },
})