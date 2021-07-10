import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StatusBar, Image, TouchableOpacity, FlatList, ImageBackground, StyleSheet, BackHandler } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../components/Header'
import Loader from '../components/Loader'
import { MyContext } from '../components/UseContext';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntIcon from 'react-native-vector-icons/AntDesign'
import AsyncStorage from "@react-native-async-storage/async-storage";

const Passes = ({ navigation }) => {

    const { passes } = useContext(MyContext)
    const [numOfDays, setNumOfDays] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedPass, setSelectedPass] = useState(passes[0])
    const [IsShow, setIsShow] = useState(true);
    
    // //console.log(passes, "passes")

    useEffect(()=>{
        getDays();

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    },[]);

    const handleBackPress = () => {
        setIsShow(true); 
    };

    const getDays = async () => {
        await AsyncStorage.getItem('leftDays', (err, result) => {
            if (!err && result !== null) {
                //console.log('get days', result, JSON.parse(result));
                setNumOfDays(JSON.parse(result));
            }
            else {
                //console.log(err)
            }
        });
    };
    
    return (
        <ImageBackground source={require('../../assets/bgg.jpg')} style={{ flex: 1 }}>
            <Header headerText={''} onPress={() => {setIsShow(true); navigation.goBack();}} />
            <StatusBar backgroundColor={'#f4fbfe'} barStyle={'dark-content'} />
            {loading ? <Loader isLoading={loading} /> :
                <>
                    {IsShow && numOfDays != null?<TouchableOpacity style={styles.topSection} onPress={()=> setIsShow(false)}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Image source={require('../../assets/ticket.png')} resizeMode='center' style={{ height: 30, width: 30,marginRight:7 }} />
                            <Text style={{fontSize:12,color:'#6C7482'}}>{numOfDays} days left</Text>
                        </View>
                        <Text style={{color:'#5881CA',fontSize:14,fontWeight:'bold'}}>Add More Days</Text>
                    </TouchableOpacity>:null}
                    <View style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: 5,
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{
                                fontSize: 28,
                                fontWeight: 'bold',
                            }}>App</Text>
                            <Image source={require('../../assets/ticket.png')} resizeMode='center' style={{ height: 40, width: 40 }} />
                        </View>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 15, marginVertical: 20 }}>Get Access to 1,000+ Mock Tests{'\n'}
                       and Quizzes</Text>
                    </View>
                    <FlatList
                        data={passes}
                        // style={{ marginTop: -10 }}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    height: hp('10'),
                                    borderWidth: 1,
                                    borderColor: selectedPass.id === item.id ? '#55AA89' : '#B0B0B0',
                                    marginHorizontal: 30,
                                    borderRadius: 10,
                                    marginTop: 20,
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    flexDirection: 'row',
                                }} onPress={() => setSelectedPass(item)}>
                                <View style={{
                                    marginLeft: 10,
                                    borderWidth: 1,
                                    borderColor: selectedPass.id === item.id ? '#55AA89' : '#B0B0B0',
                                    backgroundColor: selectedPass.id !== item.id ? '#f4fbfe' : '#55AA89',
                                    height: 25,
                                    width: 25,
                                    borderRadius: 15,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {selectedPass.id === item.id && <Icon name="check" size={15} color="#fff" />}
                                </View>
                                <View style={{ marginHorizontal: 15 }}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        width: wp('35')
                                    }}>{item.name}</Text>
                                    <Text style={{}}>
                                        Test Pass
                                    </Text>
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: '#868B85', fontSize: 10, textDecorationLine: 'line-through' }}>₹{(item.amount / item.months).toFixed('0')}</Text>
                                        <Text style={{ color: '#000', fontWeight: 'bold' }}> ₹{((item.amount - (item.amount * (item.offer / 100))) / item.months).toFixed('0')}<Text style={{ fontWeight: 'normal' }}>/month</Text></Text>
                                    </View>
                                    <Text style={{ color: '#000', fontWeight: 'bold' }}>₹{(item.amount - (item.amount * (item.offer / 100))).toFixed('0')} <Text style={{ fontWeight: 'normal' }}>for</Text></Text>
                                    <Text style={{
                                    }}>{item.months} Months</Text>
                                </View>
                            </TouchableOpacity>

                        )}
                    />
                    <View style={{
                        height: 60,
                        backgroundColor: '#FFFFFF',
                        borderWidth: 0.2,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around'
                    }}>
                        <View style={{
                            marginLeft: 10
                        }}>
                            {selectedPass &&
                                <>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        fontSize: 16
                                    }}>₹ {(selectedPass.amount - (selectedPass.amount * (selectedPass.offer / 100))).toFixed('2')}</Text>
                                    <Text>For {selectedPass.months} months</Text>
                                </>}
                        </View>
                        <TouchableOpacity style={{
                            height: 48,
                            width: wp('65'),
                            backgroundColor: '#55AA89',
                            borderRadius: 7,
                            justifyContent: 'center',
                            marginRight: 10
                        }} onPress={() => navigation.navigate('Checkout', { selectedPass })}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }}>CONTINUE TO PAY</Text>
                                <AntIcon size={12} name='caretright' color='#fff' style={{ marginLeft: 10 }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </>
            }
        </ImageBackground>
    )
}

export default Passes;

const styles = StyleSheet.create({
    topSection:
    {
        width:'90%',
        alignSelf:'center',
        backgroundColor:'#DFE8F9',
        borderColor:'#82A1DB',
        borderWidth:1.5,
        height:55,
        borderRadius:5,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:10
    }
})