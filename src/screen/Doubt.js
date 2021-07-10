import React, { useContext, useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Image, Platform, StatusBar,ImageBackground,Animated,StyleSheet, ScrollView, Button } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../components/Header';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import axiosClient from '../api/axios-client'
import Loader from '../components/Loader';
import { MyContext } from '../components/UseContext'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import AppHeader from '../components/AppHeader';
import {Polygon, Svg,ClipPath,Defs,Filter,Path,FeMerge,FeMergeNode,FeOffset,FeGaussianBlur} from 'react-native-svg';
import * as shape from 'd3-shape';
const d3 = {shape};
import Pie from './Pie';

const Doubt = ({ navigation }) => {
    const isFocused = useIsFocused();

    const [animation, setAnimation] = useState(new Animated.Value(0));

    const [loading, setLoading] = useState(false)
    const [doubtText, setDoubtText] = useState(null);
    const [doubts, setDoubts] = useState([1,2,3]);
    const { userId } = useContext(MyContext)

    // let arcGenerator = d3.shape.arc()
    // .outerRadius(100)
    // .padAngle(0)
    // .innerRadius(0);
    

    useEffect(() => {
        
    }, []);

    // const createPieArc = (index, endAngle, data) => {

    //     const arcs = d3.shape.pie()
    //         .value((item)=>item.number)
    //         .startAngle(0)
    //         .endAngle(endAngle)
    //         (data);

    //     let arcData = arcs[index];

    //     return this.arcGenerator(arcData);
    // };

    const click = ()=> {
        animation.setValue(0);

        Animated.loop(
            Animated.sequence([
              Animated.timing(animation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
              })
            ]),
            {
              iterations: 5
            }
          ).start()
          
    }

    return (
        <>
            { loading ? <Loader isLoading={loading} /> : <View style={{ flex: 1 }}>

                <AppHeader Header={'Chat'} onPress={() => navigation.goBack()} />

                {/* <ImageBackground source={require('../../assets/splash/AppBg.jpg')} style={{flex: 1,justifyContent: "center",resizeMode: "cover"}}>             */}
                    <ScrollView style={{flex:1}} contentContainerStyle={{justifyContent:'center',alignItems:'center'}}>

                    <Animated.Image source={require('../../assets/krug-1.png')}
                    style={{
                        width:200,height:200,
                        transform: [{
                            rotate: animation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '360deg'],
                                        extrapolate: 'clamp'
                                    })
                                },
                                { perspective: 1000 }]
                }} />

                    <Button title="start" onPress={click} />
                    {/* <Pie /> */}
                        {/* <Path
                            onPress={()=>alert('value is: '+val)}
                            d={createPieArc(index, endAngle, data)}
                            fill={color}
                        />       

                        <View style={{
                            backgroundColor:'pink',width:300,height:300,borderRadius:150,alignSelf:'center'
                        }}>
                            
                            <Polygon
                                    strokeWidth={1}
                                    stroke={'red'}
                                    fill={'yellow'}
                                    fillOpacity={1}
                                    points={[[100, 50],[0, 99]]}
                            /> */}
                            {/* <Defs>
                                <ClipPath id="clip">
                                    <Polygon points="100 50, 0 0, 0 99" style={{backgroundColor:'red',top:120,left:0,zIndex:10}}>
                                    </Polygon>
                                </ClipPath>
                            </Defs> */}
{/* 
                            <View></View>
                            <View></View>
                            <View></View> */}
                        {/* </View> */}

                    </ScrollView>
                {/* </ImageBackground> */}

            </View>}
        </>
    )
}
export default Doubt;

const styles = StyleSheet.create({

    headerView: {
        flexDirection: 'row',
        marginTop: Platform.OS === 'ios' ? hp('4') : 0,
        alignItems: 'center',
        paddingHorizontal: 5,
        // borderWidth:1,
        height: 50,
        backgroundColor:'#C61D24'
    },
    textHead: { fontSize: 18, textAlign: 'center',color:'#fff', textTransform:'uppercase',fontFamily:'GilroyMedium' },    
});