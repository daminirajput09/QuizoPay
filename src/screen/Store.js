import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Image, Platform, BackHandler,SafeAreaView,FlatList,StyleSheet, ScrollView,Animated } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../components/Loader';
import Modal from 'react-native-modalbox';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AppHeader from '../components/AppHeader';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const Store = ({ navigation }) => {

    const [loading, setLoading] = useState(false)
    const [ActiveContest, setActiveContest] = useState('6lakh')
    const [winners, setWinners] = useState([1,2,3,4,5]);
    const [Packs, setPacks] = useState([1,2,3,4,5]);
    const [storeItems, setStoreItems] = useState(['Electronics','Accessories','Grooming','Food']);
    const [ActiveItem, setActiveItem] = useState(0)
    const [PopUp, setPopUp] = useState(false)
    const [quantity, setQuantity] = useState(1);


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

    const MyLoader = () => {
        return(
          <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={"100%"} height={50} />

              <SkeletonPlaceholder.Item paddingHorizontal={10} width={'100%'} flexDirection={'row'}>
                <SkeletonPlaceholder.Item width={120} height={55} borderRadius={100} marginTop={15} marginRight={5} />
                <SkeletonPlaceholder.Item width={120} height={55} borderRadius={100} marginTop={10} marginRight={5} />
                <SkeletonPlaceholder.Item width={120} height={55} borderRadius={100} marginTop={10} marginRight={5} />
              </SkeletonPlaceholder.Item>

              <SkeletonPlaceholder.Item paddingHorizontal={10}>
                  <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={20} />
                  <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={5} />
                  <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={5} />
                  <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={5} />
                  <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={5} />
                  <SkeletonPlaceholder.Item width={"100%"} height={100} borderRadius={4} marginTop={5} />
              </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
    )}

    return (
        <>
            { loading ? 
            // <Loader isLoading={loading} />
            <MyLoader />
             : <View style={{ flex: 1 }}>

                <AppHeader Header={'Store'} onPress={() => handleBackPress()} />

                <ScrollView style={{flex:1}}>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{marginVertical:5,marginLeft:10}}
                    nestedScrollEnabled={true}>
                    {storeItems.map((item, i) => (
                        <View style={styles.view7}>
                            <TouchableOpacity onPress={()=> setActiveItem(i)} 
                                style={[{borderRadius:50,padding:10,marginRight:10,borderColor:'#000',backgroundColor:ActiveItem == i?'#000':'#fff',borderWidth: ActiveContest == i?0:2}]}>
                                <Text style={[styles.text3,{color: ActiveItem == i?'#fff':'#000'}]}>{item}</Text>
                            </TouchableOpacity>
                        </View>
                ))}
                </ScrollView>

                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        style={{marginVertical:5}}
                        nestedScrollEnabled={true}>
                        {winners.map((item, i) => (
                            <TouchableOpacity key={item}
                                style={styles.view8} onPress={()=> setPopUp(!PopUp)}>
                                    <View style={{width:'50%'}}>
                                        <View style={{width:'80%',alignSelf:'flex-start',justifyContent:'flex-end',alignItems:'center',backgroundColor:'#fff',paddingVertical:5,paddingRight:10,flexDirection:'row'}}>
                                            <FontAwesomeIcon name='amazon' size={15} color='#000' style={{marginRight:5}} />
                                            <Text style={{fontSize:16,fontWeight:'bold',fontFamily:'SofiaProRegular'}}>CORSECA</Text>
                                        </View>
                                        <View style={{width:'100%',alignItems:'flex-start',paddingTop:5,paddingLeft:10}}>
                                            <Text style={{fontSize:12,fontFamily:'SofiaProRegular'}}>CORSECA</Text>
                                        </View>
                                        <View style={{width:'100%',alignSelf:'flex-start',paddingTop:5,paddingLeft:10}}>
                                            <Text style={{fontSize:12,fontWeight:'bold',fontFamily:'SofiaProRegular'}}>
                                                Flat 30% off on the entire range Corseca Headphones and BT Headphones
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{width:'50%',alignItems:'center'}}>
                                        <Image source={require('../../assets/headphonesell.jpg')} style={{width:'90%',height:100}} />
                                    </View>
                            </TouchableOpacity>
                        ))}
                        </ScrollView>

                </ScrollView>

                <Modal
                    style={{width: '100%',top:5,height: 600,borderTopLeftRadius:10,borderTopRightRadius:10,backgroundColor:'#fff'}}
                    swipeToClose={true}
                    swipeArea={10}
                    swipeThreshold={50}
                    isOpen={PopUp}
                    backdropOpacity={0.5}
                    entry={'bottom'}
                    backdropPressToClose={true}
                    position={'bottom'}
                    backdropColor={'#000'}
                    coverScreen={true}
                    backButtonClose={true}>
                    <View style={{flex:1}}>
                        
                        <View style={{flexDirection:'row',paddingHorizontal:10,paddingTop:5}}>
                            <View style={{width:'30%'}}>
                               <Image source={require('../../assets/gaanaLogo.png')} style={{width:'95%',height:120}} />
                            </View>
                            <View style={{width:'70%'}}>
                                <View style={{width:'100%',alignItems:'flex-start',paddingLeft:10}}>
                                    <Text style={{fontSize:16,fontFamily:'SofiaProRegular'}}>Gaana Subscription</Text>
                                </View>
                                <View style={{width:'100%',alignItems:'flex-start',paddingLeft:10,flexDirection:'row',paddingTop:5}}>
                                    <FontAwesomeIcon name='star' size={15} color='#008277' style={{marginRight:2}} />
                                    <FontAwesomeIcon name='star' size={15} color='#008277' style={{marginRight:2}} />
                                    <FontAwesomeIcon name='star' size={15} color='#008277' style={{marginRight:2}} />
                                    <FontAwesomeIcon name='star' size={15} color='#008277' style={{marginRight:2}} />
                                    <FontAwesomeIcon name='star-half-empty' size={15} color='#008277' style={{marginRight:2}} />
                                </View>
                                <View style={{width:'100%',alignItems:'flex-start',paddingLeft:10,flexDirection:'row',alignItems:'center',paddingTop:5}}>
                                    <MaterialCommunityIcon name='brightness-percent' size={25} color='#4294E7' style={{marginRight:2}} />
                                    <View>
                                        <Text style={{fontSize:10,fontFamily:'SofiaProRegular'}}>Quizo Discount</Text>
                                        <Text style={{fontSize:10,fontFamily:'SofiaProRegular',fontWeight:'bold'}}>Up to 30%</Text>
                                    </View>
                                </View>
                                <View style={{width:'100%',alignItems:'flex-start',paddingLeft:10,flexDirection:'row',alignItems:'center',paddingTop:5}}>
                                    <TouchableOpacity style={{borderWidth:1,borderColor:'lightgrey',borderRadius:4,width:'90%',height:25,justifyContent:'center',alignItems:'center'}}>
                                      <Text style={{fontSize:12,fontFamily:'SofiaProRegular',fontWeight:'bold',color:'grey'}}>OPEN APP</Text>
                                    </TouchableOpacity>
                                </View>                                
                            </View>
                        </View>

                        <View style={{width:'100%',height:5,backgroundColor:'lightgrey'}} />

                        <Text style={{fontSize:16,fontFamily:'GilroyMedium',textAlign:'center',paddingVertical:5}}>Avaiable packs</Text>

                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            style={{marginVertical:10,backgroundColor:'#fff'}}>
                            {Packs.map((item, i) => (
                            <View key={item} style={styles.optionView}>
                                <TouchableOpacity activeOpacity={1} style={{width:'97%',margin:'1.5%',borderWidth:1.5,borderStyle:'dashed',borderRadius:10,borderColor:'#fff',flexDirection:'row'}}>
                                    
                                <View style={{width:'30%',alignItems:'center',justifyContent:'center'}}>
                                    <View style={{borderWidth:1.5,borderRadius:100,borderColor:'#fff'}}>
                                        <Image source={require('../../assets/gaanaLogoRound.png')} style={{width:70,height:70,borderRadius:100}} />
                                    </View>
                                    <Text style={{fontSize:14,fontFamily:'SofiaProRegular',color:'#fff',marginTop:5}}>PACKS LEFT</Text>
                                    <Text style={{fontSize:18,fontFamily:'SofiaProRegular',color:'#fff',marginTop:5,fontWeight:'bold'}}>4</Text>
                                </View>

                                <LinearGradient style={{width:0.5,height:150,marginVertical:10}} colors={['#E27D7B', '#fff', '#E27D7B']} start={{x: 0, y: 0}} end={{x: 0, y: 1}} />

                                <View style={{width:'70%',justifyContent:'center'}}>
                                    <View style={{width:'100%',alignItems:'flex-start',paddingLeft:10}}>
                                        <Text style={{fontSize:16,fontFamily:'GilroyMedium',color:'#fff'}}>Gaana 1 Year Subscription</Text>
                                    </View>
                                    
                                    <View style={{width:'90%',paddingLeft:10,flexDirection:'row',alignItems:'center',paddingTop:5}}>
                                        <View style={{width:'60%',alignItems:'flex-start'}}>
                                            <Text style={{fontSize:14,fontFamily:'SofiaProRegular',color:'#DE978F'}}>MRP</Text>
                                            <Text style={{fontSize:14,fontFamily:'SofiaProRegular',color:'#fff',fontWeight:'bold',textDecorationLine: 'line-through'}}>
                                                <FontAwesomeIcon name='rupee' size={10} color='#fff' style={{marginTop:3,marginRight:2}} />
                                            399</Text>
                                        </View>
                                        <View style={{width:'40%',alignItems:'flex-start'}}>
                                            <Text style={{fontSize:14,fontFamily:'SofiaProRegular',color:'#DE978F'}}>Quizo Prize</Text>
                                            <Text style={{fontSize:14,fontFamily:'SofiaProRegular',color:'#fff',fontWeight:'bold'}}>
                                                <FontAwesomeIcon name='rupee' size={10} color='#fff' style={{marginTop:3,marginRight:2}} />
                                            379</Text>
                                        </View>
                                    </View>

                                    <View style={{width:'90%',paddingLeft:10,flexDirection:'row',alignItems:'center',paddingTop:5}}>
                                        <View style={{width:'60%',alignItems:'flex-start'}}>
                                            <Text style={{fontSize:14,fontFamily:'SofiaProRegular',color:'#DE978F'}}>You saved</Text>
                                            <Text style={{fontSize:14,fontFamily:'SofiaProRegular',color:'#DE978F',fontWeight:'bold'}}>
                                                <FontAwesomeIcon name='rupee' size={11} color='#DE978F' style={{marginTop:3,marginRight:2}} />
                                            20</Text>
                                        </View>
                                        <View style={{width:'40%',justifyContent:'flex-start',flexDirection:'row'}}>
                                          <View style={{width:'100%',borderWidth:1,borderColor:'#DE978F',borderRadius:4,flexDirection:'row'}}>
                                             
                                              <TouchableOpacity onPress={()=> {quantity==0?null:setQuantity(quantity-1)}} style={{width:'30%',height:30,justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:'#DE978F'}}>
                                                <Text style={{fontSize:20,fontFamily:'SofiaProRegular',color:'#DE978F',marginBottom:10}}>-</Text>
                                              </TouchableOpacity>

                                              <View style={{width:'40%',height:30,justifyContent:'center',alignItems:'center'}}>
                                                <Text style={{fontSize:18,fontFamily:'SofiaProRegular',color:'#fff',fontWeight:'bold'}}>{quantity}</Text>
                                              </View>
                                              
                                              <TouchableOpacity onPress={()=> {quantity==10?null:setQuantity(quantity+1)}} style={{width:'30%',height:30,justifyContent:'center',alignItems:'center',borderLeftWidth:1,borderLeftColor:'#DE978F'}}>
                                                <Text style={{fontSize:20,fontFamily:'SofiaProRegular',color:'#DE978F',marginBottom:10}}>+</Text>
                                              </TouchableOpacity>

                                          </View>
                                        </View>
                                    </View>

                                    <View style={{width:'100%',alignItems:'flex-start',paddingLeft:10,flexDirection:'row',alignItems:'center',paddingTop:5}}>
                                        <TouchableOpacity style={{borderWidth:1,borderColor:'#fff',borderRadius:4,width:'90%',height:25,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
                                        <Text style={{fontSize:12,fontFamily:'SofiaProRegular',fontWeight:'bold',color:'#000'}}>BUY NOW</Text>
                                        </TouchableOpacity>
                                    </View>                                
                                </View>

                                </TouchableOpacity>
                            </View>

                        ))}
                        </ScrollView>                      

                    </View>
                </Modal>
            </View>}
        </>
    )
}
export default Store;

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
    view7: { marginTop: 10,alignSelf: 'center',flexDirection:'row'},
    touch: {width:150,borderRadius:50,padding:10,marginRight:10,borderColor:'lightgrey'},
    text3: { fontSize: 14, fontWeight:'bold',marginLeft:5,fontFamily:'SofiaProRegular'},
    text4: {marginTop:3,marginRight:2,fontFamily:'GilroyMedium'},
    touch1: { width:143,borderRadius:50,padding:10,borderColor:'lightgrey' },
    view8: {
        width:'95%',
        height:120,
        backgroundColor: '#EBF4F3',
        borderColor: '#D5D5D5',
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 5,
        alignSelf: 'center',
        marginBottom:7,
        flexDirection:'row'
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
    optionView: {
        width:'95%',
        alignSelf:'center',
        flexDirection:'row',
        // height:55,
        justifyContent:'space-between',
        // paddingHorizontal:15,
        alignItems:'center',
        backgroundColor:'#CB4546',
        marginBottom:5,
        borderRadius:10
    },
    SofiaFont: {
        fontFamily:'SofiaProRegular'
    } 

});