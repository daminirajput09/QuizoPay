import React from 'react';
import {TouchableOpacity, Image, StyleSheet,Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;

export default (ChildItem = ({
  item,
  style,
  onPress,
  index,
  imageKey,
  local,
  height
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(index)}>
      <Image
        style={[styles.image, style, {height: height}]}
        source={local ? item[imageKey] : {uri: item[imageKey]}}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems:'center',
    // backgroundColor:'red'
  },
  image: {
    width: '100%',
    resizeMode: 'stretch',
    // marginVertical:15,
    // paddingHorizontal: 3,
    alignSelf:'center',
  },
});