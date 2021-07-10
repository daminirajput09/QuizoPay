import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import axiosClient from '../api/axios-client';
import Header from '../components/Header'
import { MyContext } from '../components/UseContext';
import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Feather';
// import { ScrollView } from 'react-native';
import HTML from 'react-native-render-html'
import moment from 'moment'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import GestureRecognizer from 'react-native-swipe-gestures';




const Blog = ({ navigation }) => {

    const [loader, setLoader] = useState(true)
    const [categories, setCategories] = useState([]);
    const [categoryIndex, setCategoryIndex] = useState(0)
    const [blogPosts, setBlogPosts] = useState([]);
    let flatListRef = React.createRef();
    const regex = /(<([^>]+)>)/ig;
    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };




    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = () => {
        axiosClient().get('https://exambook.co/blog/wp-json/wp/v2/categories')
            .then((res) => {
                setCategories(res.data);
                const { id } = res.data[0]
                getBlogByCategory(id)
                setLoader(false)
                //console.log(res);
            }).catch((err) => {
                //console.log(err)
            })
    }

    const getBlogByCategory = (id) => {
        setLoader(true)
        axiosClient().get(`https://exambook.co/blog/wp-json/wp/v2/posts?categories=${id}`)
            .then((res) => {
                //console.log('get blog by category', id,res);
                setBlogPosts(res.data)
                setLoader(false)
                //console.log(res)
            }).catch((err) => {
                //console.log(err)
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <Header headerText={'Blogs'} onPress={() => navigation.goBack()} />
                <>
                        {/* <GestureRecognizer 
                            onSwipe={(gestureState) => { //console.log('swipe only') }}
                            onSwipeLeft={() => {
                            if (categoryIndex + 1 === categories.length) { //console.log('Cannot swipe!') }
                            else {
                                setCategoryIndex(categoryIndex + 1)
                                getBlogByCategory(categories[categoryIndex + 1].id)
                            }
                        }}
                            onSwipeRight={() => {
                                if (categoryIndex == 0) { //console.log('Cannot swipe!') }
                                else {
                                    setCategoryIndex(categoryIndex - 1)
                                    getBlogByCategory(categories[categoryIndex - 1].id)
                                }
                            }}
                            config={config}> */}
                            {categories && categories.length > 0 ? (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        width: '100%',
                                        backgroundColor: '#fff',
                                        alignSelf: 'center',
                                    }}>
                                    <FlatList
                                        ref={(ref) => {
                                            flatListRef = ref;
                                        }}
                                        horizontal={true}
                                        contentContainerStyle={{ marginLeft: 14 }}
                                        data={categories}
                                        showsHorizontalScrollIndicator={false}
                                        initialNumToRender={1}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity
                                                    key={() => setCategoryIndex(index)}
                                                    style={{
                                                        padding: 10,
                                                        marginRight:10,
                                                        flexDirection: 'row',
                                                        alignSelf: 'center',
                                                    }}
                                                    onPress={
                                                        () => {
                                                            setCategoryIndex(index);
                                                            getBlogByCategory(item.id)
                                                            // { setSubjectIndexResult(index); setQuestionIndex(0); setFilterIndex(0); setQuesAnsData(examSections[index].questions); }
                                                        }}>
                                                    <Text
                                                        style={{
                                                            height: 25,
                                                            fontWeight: 'bold',
                                                            textAlign: 'center',
                                                            color: categoryIndex == index ? '#0B84FE' : 'grey',
                                                            fontSize: 15,
                                                            borderBottomWidth: 2,
                                                            borderBottomColor: categoryIndex === index ? '#0B84FE' : '#fff'
                                                        }}>
                                                        {item.name}
                                                    </Text>
                                                    {/* {index + 1 < questions.length && (<View style={{ height: '60%', width: 1, backgroundColor: 'grey', marginLeft: 15, alignSelf: 'center' }} />)} */}
                                                </TouchableOpacity>
                                            );
                                        }}
                                    />
                                </View>) : null}
                                <View style={{flex:1}}>
                                {loader ? <Loader isLoading={loader} /> :

                            <FlatList
                                data={blogPosts}
                                contentContainerStyle={{ paddingBottom: 10 }}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={{
                                            marginTop: 15,
                                            backgroundColor: '#fff',
                                            width: '100%',
                                            height: 180,
                                            paddingHorizontal: 20,
                                            paddingTop: 10,
                                            justifyContent: 'space-around',
                                            borderBottomWidth: 0.2,
                                            elevation: 2
                                        }}
                                        activeOpacity={0.8}
                                        onPress={() => navigation.navigate('BlogPost', { id: item.id, item })}>
                                        <View style={{ height: 50 }}>
                                            <Text style={{ fontSize: 16, lineHeight: 30 }}>{item.title.rendered}</Text>
                                        </View>
                                        {/* <HTML source={{ html: item.excerpt.rendered, }} /> */}
                                        <View style={{ height: 90 }}>
                                            <Text numberOfLines={3} ellipsizeMode='tail' style={{ color: 'grey', marginTop: 20 }}>{item.excerpt.rendered.replace(regex, '')}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, borderTopColor: '#D2D2D2', borderTopWidth: 0.3 }}>
                                            <Text style={{ color: 'grey' }}>{moment(item.date).format('DD MMM, YYYY')}</Text>
                                            <Icon name='sharealt' size={15} color='grey' style={{ marginLeft: wp('28') }} />
                                            <Text style={{ color: 'grey', marginLeft: 5 }}>Share</Text>
                                            <Icon1 name='bookmark' size={15} color='grey' style={{ marginLeft: 15 }} />
                                            <Text style={{ color: 'grey', marginLeft: 5 }}>Save</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />            }
                            </View>
                        {/* </GestureRecognizer> */}

                </>
        </View>
    )
}
export default Blog;

const styles = StyleSheet.create({
    sliderText: {
        marginHorizontal: 10,
        width: 220,
        fontSize: 14,
        fontWeight: 'bold',
    },
})