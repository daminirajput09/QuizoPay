import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    Image,
    StatusBar,
    Platform
} from 'react-native';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const Header = (props) => {
    return (
        <TouchableOpacity style={styles.container} onPress={props.onPress}>
            <StatusBar backgroundColor={'#F9F5F2'} barStyle={'dark-content'} />
            {/* <MaterialIcon name="arrow-back" size={20} color="#4E5A62" style={styles.imageStyle} style1 /> */}
            <Image
                source={require('../../assets/backIcon.png')}
                style={styles.imageStyle}
                resizeMode='center'
                {...props}
            />
            {props.headerText ? <Text
                style={[styles.textStyle]}
                {...props}
            >{props.headerText}</Text> : null}
        </TouchableOpacity>
    )
};

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: Platform.OS == 'ios' ? 40 : 5,
        height: 30
    },
    textStyle: {
        // width: '90%',
        marginLeft: 30
    },
    imageStyle: {
        width: 20,
        height: 20,
        left: 20,
    },
    style1: {
        fontWeight: 'bold'
    }
});
