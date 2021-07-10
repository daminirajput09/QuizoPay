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
import Ionicon from 'react-native-vector-icons/Ionicons';

const AppHeader = (props) => {
    return (
        <View>
            <StatusBar backgroundColor={'#598EF6'} barStyle={'light-content'} />
            <View style={styles.headerView}>
                <TouchableOpacity
                    style={{width:'15%',alignItems:'center',justifyContent:'center'}}
                    onPress={props.onPress}>
                    <Ionicon name='arrow-back-outline' size={20} color='#fff' />
                </TouchableOpacity>

                <View style={{width:'85%',alignItems: 'flex-start'}}>
                    <Text style={styles.textHead}>{props.Header}</Text>
                </View>
            </View>
        </View>
    )
};

export default AppHeader;

const styles = StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        marginTop: Platform.OS === 'ios' ? hp('4') : 0,
        alignItems: 'center',
        paddingHorizontal: 5,
        // borderWidth:1,
        height: 50,
        backgroundColor:'#4782F5'
    },
    headerImg: { width:'15%',height: 25,justifyContent:'center',paddingLeft:10 },
    headerText: { width: '85%' },
    textHead: { fontSize: 18, textAlign: 'left',color:'#fff',fontFamily:'GilroyMedium' },
});
