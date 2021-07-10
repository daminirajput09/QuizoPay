import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    Image,
    StatusBar,
    Platform,
    View
} from 'react-native';

const EmptyScreen = (props) => {
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>

                <Image source={require('../../assets/splash/EmptyScreen.png')} style={{width:'80%',resizeMode:'contain'}} />

                <View style={{width:'85%',alignItems: 'center'}}>
                    <Text style={[styles.textHead,{fontWeight:'bold',fontSize:18,color:'#000'}]}>{"There's nothing here"}</Text>
                    <Text style={styles.textHead}>{"Content you are looking for isn't available at this moment"}</Text>
                </View>

        </View>
    )
};

export default EmptyScreen;

const styles = StyleSheet.create({
    textHead: { fontSize: 14, textAlign: 'center',color:'grey',fontFamily:'GilroyMedium',marginTop:10 },
});
