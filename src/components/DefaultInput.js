import React, {useState} from 'react';
import {StyleSheet, TextInput, View, Text, Platform} from 'react-native';

const DefaultInput = props => {
  const [isFocused, setFocused] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const {label, value, bgColor} = props;
  const labelStyle = {
    position: 'absolute',
    left: 10,
    top: !isFocused
      ? Platform.OS === 'ios'
        ? 18
        : 14
      : Platform.OS === 'ios'
      ? 5
      : 0,
    fontSize: !isFocused ? 15 : 14,
    fontFamily: 'SofiaProRegular',
    color: !isFocused ? '#a0a0aa' : '#50505a',
  };
  const labelStyle1 = {
    position: 'absolute',
    left: 10,
    top: !value ? 18 : Platform.OS === 'ios' ? 5 : 0,
    fontSize: !value ? 15 : 14,
    fontFamily: 'SofiaProRegular',
    color: !value ? '#a0a0aa' : '#50505a',
  };

  return (
    <View
      style={[styles.input,{backgroundColor:bgColor,borderBottomWidth: isFocused? 1.5 :0.5,borderColor: isFocused? '#000' : '#C8C8C8'}]}>
        <Text style={value ? labelStyle1 : labelStyle}>{label}</Text>

      <TextInput
        {...props}
        underlineColorAndroid="transparent"
        style={styles.textinputStyle}
        textAlignVertical={'center'}
        placeholderTextColor={'#a0a0aa'}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 0 : 15,
    height: 50,
    // borderRadius: 5,
    justifyContent: 'center',
    fontSize: 16,
    // backgroundColor:'#F2F4F2',
  },
  textinputStyle: {
    fontSize: 15,
    lineHeight: 15,
    width: '100%',
    marginTop: Platform.OS === 'ios' ? 15 : 0,
    height: 40,
    fontFamily: 'SofiaProRegular',
    paddingLeft: 8,
    color: '#000',
  },
});

export default DefaultInput;
