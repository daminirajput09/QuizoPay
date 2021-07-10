import React, { useState, useEffect, useRef } from 'react'
import { Text, Platform, View, ScrollView, StyleSheet, ImageBackground, Image, TouchableOpacity, Alert, StatusBar, Button } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import AppHeader from '../components/AppHeader';
import WheelOfFortune from 'react-native-wheel-of-fortune'

const MyProfile = ({ navigation }) => {

    const isFocused = useIsFocused();
    const rewards = [1,2,3,4,5,6,7,8,9,10];

    let child = React.useRef();

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#f4fbfe'
        }}>
            {isFocused ? <StatusBar backgroundColor={'#B0191E'} barStyle={'light-content'} /> : null}

            <AppHeader Header={'MY FEED'} onPress={() => navigation.goBack()} />
                <ImageBackground source={require('../../assets/splash/AppBg.jpg')} style={{flex: 1,justifyContent: "center",resizeMode: "cover"}}>            
                <ScrollView style={{flex:1}}>

                    <WheelOfFortune
                        onRef={ref => (child = ref)} 
                        rewards={ rewards }
                        knobSize={20}
                        borderWidth={3}
                        borderColor={"#FFF"}
                        winner={3}
                        innerRadius={50}
                        backgroundColor={"#c0392b"}
                        knobSource={require('../../assets/bell.png')}
                        getWinner={(value, index) => this.setState({ winnerValue: value, winnerIndex: index })}
                    />
                    {/* <Button title="Press me" onPress={ () => { _onPress() } } /> */}


                </ScrollView>
                </ImageBackground>

        </View>
    )
}
const styles = StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        marginTop: Platform.OS === 'ios' ? hp('4') : 0,
        alignItems: 'center',
        paddingHorizontal: 5,
        height: 50,
        backgroundColor:'#C61D24'
    },
    textHead: { fontSize: 18, textAlign: 'center',color:'#fff', textTransform:'uppercase',fontFamily:'GilroyMedium' },    
});

export default MyProfile