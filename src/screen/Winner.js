import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Image, Platform, StatusBar,ImageBackground,BackHandler,StyleSheet, ScrollView } from 'react-native'
import Loader from '../components/Loader';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AppHeader from '../components/AppHeader';

const Winner = ({ navigation }) => {

    const [loading, setLoading] = useState(false)
    const [winners, setWinners] = useState([1,2,3,4]);
    const [AllWinners, setAllWinners] = useState([1,2,3,4,5,6,7,8,9,10]);

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

            <AppHeader Header={'Winners'} onPress={() => navigation.goBack()} />

                {/* <ImageBackground source={require('../../assets/splash/AppBg.jpg')} style={styles.bgImageConatiner}>             */}
                <ScrollView style={{flex:1}}>

                    <Text style={styles.winnerHead}>
                        Mega Contest Winners
                    </Text>

                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        style={{marginVertical:5}}
                        nestedScrollEnabled={true}>
                        {winners.map((item, i) => (
                            <View key={item}
                                style={styles.mainView}>
                                <View style={styles.RowView}>
                                    <Text style={styles.RowText}>{'FanCode ESC T20 - Kiel'}</Text>
                                    <Text style={[styles.RowText,{ fontWeight:'bold' }]}>{'16 Jun, 2021'}</Text>
                                </View>
                                <View style={{width:'93%', alignSelf:'center', height:0.2,backgroundColor:'#A8A8A8'}} />
                                <View style={styles.RowView}>
                                    <Text style={[styles.RowText,{ fontWeight:'bold' }]}>{'Royal Strikers'}</Text>
                                    <Text style={[styles.RowText,{ fontWeight:'bold' }]}>{'Marsa'}</Text>
                                </View>
                                <View style={styles.secondRow}>
                                    <View style={styles.secondText}>
                                        <Image source={require('../../assets/01.png')} style={{ height: 15, width: 25,marginRight:10 }} />
                                        <Text style={styles.secondText1}>{'rst'}</Text>
                                    </View>
                                    <View style={styles.thirdView}>
                                        <Text style={styles.thirdText}>{'vs'}</Text>
                                    </View>
                                    <View style={styles.fourthVIew}>
                                        <Text style={styles.fourthText}>{'mar'}</Text>
                                        <Image source={require('../../assets/01.png')} style={{ height: 15, width: 25 }} />
                                    </View>
                                </View>
                                <View style={styles.fifthRow} />
                                <View style={styles.sixthRow}>
                                    <View style={styles.sevenRow}>
                                        <Ionicon name='trophy-outline' size={15} color='#000' />
                                        <Text style={styles.sevenRowText}>{'1 Crore'}</Text>
                                    </View>    
                                </View>

                                <ScrollView
                                    horizontal={true}
                                    scrollEnabled={true}
                                    showsHorizontalScrollIndicator={false}>
                                    {AllWinners.map((item, i) => (
                                        i < 4 ?
                                        <TouchableOpacity key={item}
                                            activeOpacity={1}
                                            onPress={()=>navigation.navigate('TopWinner')}
                                            style={styles.winnerSection}>
                                            <Text style={styles.rankView}>Rank #4</Text>
                                            <Text style={styles.winnerName}>ThankGod77</Text>

                                            <FontAwesomeIcon name='user-circle' size={60} color='#999999' style={styles.winnerImage} />

                                            <Text style={{width:'100%',fontWeight:'bold',fontSize:12,padding:4,backgroundColor:'#DCEBFF',borderBottomLeftRadius:10,borderBottomRightRadius:10,textAlign:'center',fontFamily:'SofiaProRegular'}}>Won <FontAwesomeIcon name='rupee' size={13} color='#000' style={{marginTop:3,marginRight:2}} />20,000</Text>
                                        </TouchableOpacity>
                                        : i == 4 ?
                                        <TouchableOpacity key={item}
                                        activeOpacity={0.5}
                                        onPress={()=>navigation.navigate('AllWinners')}
                                        style={styles.AllView}>
                                            <Ionicon name='trophy-outline' size={30} color='#000' />
                                            <Text style={styles.AllViewText}>View All Winners</Text>
                                        </TouchableOpacity>
                                        : null
                                        ))}
                                    </ScrollView>

                            </View>
                            ))}
                        </ScrollView>

                </ScrollView>
                {/* </ImageBackground> */}

            </View>}
        </>
    )
}
export default Winner;

const styles = StyleSheet.create({

    headerView: {
        flexDirection: 'row',
        marginTop: 0,
        alignItems: 'center',
        paddingHorizontal: 5,
        // borderWidth:1,
        height: 50,
        backgroundColor:'#C61D24'
    },
    textHead: { fontSize: 18, textAlign: 'center',color:'#fff',fontFamily:'GilroyMedium' },    

    bgImageConatiner: {flex: 1,justifyContent: "center",resizeMode: "cover"},
    winnerHead: { fontSize: 17, width: '90%',textAlign:'left', fontWeight: 'bold', marginLeft: 20,marginTop:10,fontFamily:'GilroyMedium',color:'#000' },
    mainView: {
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
        marginBottom:10
    },
    RowView: { width: '100%', paddingVertical: 5,paddingHorizontal:10, justifyContent:'space-between', flexDirection:'row' },
    RowText: {fontSize: 13, color: '#000',fontFamily:'SofiaProRegular'},
    secondRow: { width: '100%', paddingHorizontal: 10,paddingBottom:5, justifyContent:'space-between', flexDirection:'row' },
    secondText: { width: '40%', flexDirection:'row',alignItems:'center' },
    secondText1: { fontSize: 15, color: '#000', textTransform:'uppercase',fontWeight:'bold',fontFamily:'SofiaProRegular' },
    thirdView: { width: '20%',alignItems:'center' },
    thirdText: { fontSize: 15, color: '#000',fontWeight:'bold',fontFamily:'SofiaProRegular' },
    fourthVIew: { width: '40%', flexDirection:'row',justifyContent:'flex-end',alignItems:'center' },
    fourthText: { fontSize: 15, color: '#000', textTransform:'uppercase',marginRight:10,fontWeight:'bold',fontFamily:'SofiaProRegular' },
    fifthRow: {width:'93%', alignSelf:'center', height:0.5,backgroundColor:'#A8A8A8'},
    sixthRow: { width: '100%', paddingHorizontal: 10,paddingVertical:5, flexDirection:'row' },
    sevenRow: { width: '50%', flexDirection:'row',alignItems:'center',justifyContent:'flex-start' },
    sevenRowText:{ fontSize: 15, color: '#000',fontWeight:'bold',marginLeft:5,fontFamily:'SofiaProRegular'},

    winnerSection:{
        width: 105,
        margin:4,
        borderColor: '#E6E6E6',
        borderWidth: 1.5,
        borderRadius: 10,
        height:135,paddingVertical:3,
    },
    rankView: {paddingHorizontal:7,fontWeight:'bold',fontSize:13},
    winnerName: {paddingHorizontal:7,fontSize:12,fontFamily:'SofiaProRegular'},
    winnerImage: {paddingHorizontal:7,alignSelf:'center',marginVertical:5,fontFamily:'SofiaProRegular'},
    AllView: {
        width: 105,
        margin:5,
        borderColor: '#E6E6E6',
        borderWidth: 1.5,
        borderRadius: 10,
        height:135,paddingVertical:7,
        justifyContent:'center',
        alignItems:'center'
    },
    AllViewText: {marginTop:20,textAlign:'center',fontWeight:'bold',fontSize:16,fontFamily:'GilroyMedium'}
}); 