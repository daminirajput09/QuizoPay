import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Image, Platform, BackHandler,SafeAreaView,FlatList,StyleSheet, ScrollView,Animated } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../components/Loader';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AppHeader from '../components/AppHeader';

const AllWinners = ({ navigation }) => {

    const [loading, setLoading] = useState(false)
    const [ActiveContest, setActiveContest] = useState('6lakh')
    const [winners, setWinners] = useState([1,2,3,4,5,6,7]);
    
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }
    },[])

    const handleBackPress = () => {
        navigation.goBack();
        return true;
    };

    return (
        <>
            { loading ? <Loader isLoading={loading} /> : <View style={{ flex: 1 }}>

                <AppHeader Header={'Mega Contest Winners'} onPress={() => handleBackPress()} />

                <ScrollView style={{flex:1}}>

                <View 
                    style={styles.mainContainer}>
                        <View style={styles.firstRow}>
                            <Text style={styles.commonText}>{'English T20 Blast'}</Text>
                            <Text style={styles.text}>{'16 Jun, 2021'}</Text>
                        </View>
                        <View style={styles.view1} />
                        <View style={styles.view2}>
                            <Text style={[styles.commonText,{ fontWeight:'bold' }]}>{'Royal Strikers'}</Text>
                            <Text style={[styles.commonText,{ fontWeight:'bold' }]}>{'Marsa'}</Text>
                        </View>
                        <View style={styles.view3}>
                            <View style={styles.view4}>
                                <Image source={require('../../assets/01.png')} style={styles.image} />
                                <Text style={styles.text1}>{'lie'}</Text>
                            </View>
                            <View style={{ width: '20%',alignItems:'center' }}>
                                <Text style={{ fontSize: 15, color: '#000',fontWeight:'bold' }}>{'vs'}</Text>
                            </View>
                            <View style={{ width: '40%', flexDirection:'row',justifyContent:'flex-end',alignItems:'center' }}>
                                <Text style={[styles.text1,{ marginRight:10 }]}>{'was'}</Text>
                                <Image source={require('../../assets/01.png')} style={styles.image1} />
                            </View>
                        </View>
                        <View style={styles.view5} />
                        <View style={styles.view6}>
                            <FontAwesome5Icon name='crown' size={14} color='#FED533' />
                            <Text style={styles.text2}>{'View Dream Team'}</Text>
                        </View>
                </View>

                <View style={styles.view7}>
                    <TouchableOpacity onPress={()=> setActiveContest('60lakh')} 
                        style={[styles.touch,{backgroundColor:ActiveContest == '6lakh'?'#fff':'#000',borderWidth: ActiveContest == '6lakh'?1:0}]}>
                        <Text style={[styles.text3,{color: ActiveContest == '6lakh'?'#000':'#fff'}]}>
                            <FontAwesomeIcon name='rupee' size={13} color='#fff' style={styles.text4} />60 Lakhs Contest
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> setActiveContest('6lakh')} 
                        style={[styles.touch1,{backgroundColor:ActiveContest == '6lakh'?'#000':'#ffff',borderWidth: ActiveContest == '6lakh'?0:1}]}>
                        <Text style={{ fontSize: 14, color: ActiveContest == '6lakh'?'#fff':'#000',fontWeight:'bold',marginLeft:5}}>
                            <FontAwesomeIcon name='rupee' size={13} color='#fff' style={styles.text4} />6 Lakhs Contest
                        </Text>
                    </TouchableOpacity>
                </View>

                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        style={{marginVertical:5}}
                        nestedScrollEnabled={true}>
                        {winners.map((item, i) => (
                            <View key={item}
                                style={styles.view8}>
                                <View style={styles.view9}>
                                    <View style={styles.view10}>
                                        <Image source={require('../../assets/Logo_of_Dream11.png')} style={styles.image2} />
                                    </View>
                                    <View style={{ width: '75%' }}>
                                        <Text style={styles.text5}>{'srh2606'}</Text>
                                        <Text style={styles.text6}>{'Kondredd Sri Rama Harsha'}</Text>
                                        <Text style={styles.text7}>{'Karnataka | 9##########7'}</Text>
                                        <Text style={styles.text7}>{'Playing since 2016'}</Text>
                                        <View style={styles.view11}>
                                            <Text style={styles.text8}>{'Level 231'}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.view12}>
                                    <View style={{width:'30%'}}>
                                        <Text style={styles.text9}>Rank</Text>
                                        <Text style={styles.text10}>#1</Text>
                                    </View>
                                    <View style={styles.view13}>
                                        <Text style={styles.text11}>Amount Won</Text>
                                        <Text style={styles.text12}>
                                            <FontAwesomeIcon name='rupee' size={20} color='#000' style={{marginTop:3}} />3 Lakhs
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.view14}>
                                    <View style={styles.view15}>
                                        <Ionicon name='trophy-outline' size={15} color='#000' />
                                        <Text style={[styles.commonText,{ fontWeight:'bold',marginLeft:5}]}>{'Won with Team 8'}</Text>
                                    </View>    
                                </View>

                            </View>
                            ))}
                        </ScrollView>

                </ScrollView>
            </View>}
        </>
    )
}
export default AllWinners;

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
    textHead: { fontSize: 18, textAlign: 'center',color:'#fff',fontFamily:'GilroyMedium' },  
    animatedHeaderContainer: {
        position: 'absolute',
        top: (Platform.OS == 'ios') ? 20 : 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
      },
      
      mainContainer: {
        width:'95%',
        backgroundColor: '#FFFFFF',
        borderColor: '#D5D5D5',
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        alignSelf: 'center',
    },
    firstRow: { width: '100%', padding: 10, marginTop: 5, justifyContent:'space-between', flexDirection:'row' },
    commonText: { fontSize: 13, color: '#000',fontFamily:'SofiaProRegular' },
    text: { fontSize: 12, color: '#000',fontWeight:'bold',fontFamily:'SofiaProRegular' },
    view1: {width:'93%', alignSelf:'center', height:0.2,backgroundColor:'#A8A8A8'},
    view2: { width: '100%', padding: 10, justifyContent:'space-between', flexDirection:'row' },
    view3: { width: '100%', paddingHorizontal: 10,paddingBottom:10, justifyContent:'space-between', flexDirection:'row' },
    view4: { width: '40%', flexDirection:'row',alignItems:'center' },
    image: { height: 15, width: 25,marginRight:10 },
    text1: { fontSize: 15, color: '#000', textTransform:'uppercase',fontWeight:'bold',fontFamily:'SofiaProRegular' },
    image1: { height: 15, width: 25 },
    view5: {width:'93%', alignSelf:'center', height:0.5,backgroundColor:'#A8A8A8'},
    view6: { width: '100%', paddingHorizontal: 10,paddingVertical:7, flexDirection:'row',justifyContent:'flex-end',backgroundColor:'#F5F5F5',borderBottomLeftRadius:10,borderBottomRightRadius:10 },
    text2: { fontSize: 14, color: '#000',fontWeight:'bold',marginLeft:5,fontFamily:'SofiaProRegular'},
    view7: { width:'95%',marginTop: 10,alignSelf: 'center',flexDirection:'row'},
    touch: {width:150,borderRadius:50,padding:10,marginRight:10,borderColor:'lightgrey'},
    text3: { fontSize: 14, fontWeight:'bold',marginLeft:5,fontFamily:'SofiaProRegular'},
    text4: {marginTop:3,marginRight:2,fontFamily:'GilroyMedium'},
    touch1: { width:143,borderRadius:50,padding:10,borderColor:'lightgrey' },
    view8: {
        width:'95%',
        backgroundColor: '#FFFFFF',
        borderColor: '#D5D5D5',
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
        alignSelf: 'center',
    },
    view9: { width: '100%', paddingVertical: 5,paddingHorizontal:10, justifyContent:'space-between', flexDirection:'row' },
    view10: { width: '25%', flexDirection:'row',alignItems:'center' },
    image2: { height: 60, width: 60,borderRadius:50 },
    text5: { fontSize: 15, color: '#000',fontWeight:'bold',fontFamily:'SofiaProRegular' },
    text6: { fontSize: 12, color: '#000',fontWeight:'bold',fontFamily:'SofiaProRegular' },
    text7: { fontSize: 12, color: '#000',fontFamily:'SofiaProRegular' },
    text8: { fontSize: 12, color: '#000',fontWeight:'bold',fontFamily:'SofiaProRegular' },
    view11: { alignSelf:'flex-end',bottom:70,width:65,paddingVertical:3, justifyContent:'center',alignItems:'center',borderRadius:4,backgroundColor:'#F5F5F5' },
    view12: { width: '100%', paddingVertical: 5,paddingHorizontal:10, marginTop: -15, flexDirection:'row',backgroundColor:'#DCEBFF' },
    text9: {fontSize:14,color:'grey',fontFamily:'SofiaProRegular'},
    text10: {fontWeight:'bold',fontSize:22,color:'#000',fontFamily:'GilroyMedium'},

    view13: {width:'70%',alignItems:'flex-end'},
    text11: {color:'grey',fontSize:14,fontFamily:'SofiaProRegular'},
    text12:{fontWeight:'bold',fontSize:22,fontFamily:'GilroyMedium'},

    view14: { width: '100%', paddingVertical: 5,paddingHorizontal:10, flexDirection:'row' },
    view15: { width: '50%', flexDirection:'row',alignItems:'center',justifyContent:'flex-start' },


});