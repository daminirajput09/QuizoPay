import React, { useState, useContext, useEffect } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../components/Loader'

const Button = (props) => {
    const [click, setClick] = useState(false)

    useEffect(() => {
        setClick(false)
    }, []);

    return (
        <TouchableOpacity style={[styles.btnContainer, {
            backgroundColor: props.disabled ? '#9da7b4' : props.backgroundColor,
            borderRadius: props.borderRadius,
            flexDirection: 'row'
        }]}
            disabled={click || props.disabled}
            onPress={async () => {
                setClick(true);
                props.onPress();
                setTimeout(() => {
                    setClick(false)
                }, 3000)
            }}>
            <Loader isLoading={click} />
            <Text style={{ ...styles.btnText }}>
                {click ? '' : props.Label}
            </Text>
        </TouchableOpacity>
    )
};

export default Button;

const styles = StyleSheet.create({
    btnContainer: {
        backgroundColor: '#475e88',
        height: 60,//hp('8'),
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    }
});
