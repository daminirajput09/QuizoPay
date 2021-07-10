import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Image,
    Platform
} from 'react-native';

const FormInput = (props) => {
    return (
        <View style={styles.container}>
            <Image
                source={props.source}
                style={props.imageStyle}
                {...props}
            />
            <TextInput
                style={[styles.inputStyle, { borderBottomColor: props.borderBottomColor }]}
                autoFocus={props.autoFocus}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                placeholder={props.placeholder}
                value={props.value}
                onChangeText={props.onChangeText}
                maxLength={props.maxLength}
                textContentType={props.otp}
                {...props}
            />
        </View>
    )
};

export default FormInput;

const styles = StyleSheet.create({
    container: { flexDirection: 'row', width: '95%', marginTop: 20 },
    inputStyle: {
        flex: 1,
        borderBottomWidth: 1,
        // borderBottomColor: focus1,
        height: Platform.OS === 'ios' ? 50 : -50,
        fontSize: 16,
        paddingLeft: 30
    },
    imageStyle: {
        width: 20,
        height: 20,
        alignSelf: 'flex-end',
        marginBottom: 10,
        left: 20
    }
});
