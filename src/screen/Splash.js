import React, { useEffect } from 'react'
import { View, Image, ImageBackground, StatusBar, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

const Splash = ({ navigation }) => {

    useEffect(() => {
        // setTimeout(
            navigate()
            // , 3000);
        //console.log('splash screen rendering');
    }, []);

  const navigate = async () => {
    await AsyncStorage.getItem('userInfo', async(err, result) => {
      if (!err && result !== null) {
        navigation.navigate('Home')
      } else {
        navigation.navigate('SignIn')
      }
    })
  };


    return (
        <ImageBackground source={require('../../assets/splash/AppSplash.jpg')} style={{flex: 1,justifyContent: "center",resizeMode: "cover",alignItems: 'center'}}>
        {/* <View style={styles.container}> */}
            <StatusBar backgroundColor={'#72013B'} barStyle={'light-content'} />

            {/* <Image source={require('../../assets/splash/AppSplash.jpg')} /> */}
            {/* <Image style={{width:50,height:50}} source={require('../../assets/splash/QuizApplogo.png')} /> */}
            
        {/* </View> */}
        </ImageBackground>
    )
}
export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F4',
        justifyContent: 'center',
        alignItems: 'center'
    }

})