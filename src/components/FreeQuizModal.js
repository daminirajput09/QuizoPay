import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  View,
} from 'react-native';
import OcticonsIcon from 'react-native-vector-icons/Octicons';

const FreeQuizModal = (props) => {

  return (
    <View style={[styles.homeSectionView,{width:props.width}]}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={props.onPress}
        style={{width: '100%', alignItems: 'center', alignSelf: 'center'}}>
        <View style={[styles.firstRow,{height:32}]}>
          <View style={{width:'30%'}}>
            <Text style={[styles.firstRowText]}>{props.item.name}</Text>
          </View>
          <View
            style={{
              width:'40%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            {/* <OcticonsIcon
                name="primitive-dot"
                size={20}
                color="#6DBD5B"
                style={{marginRight: 2, marginBottom: 5}}
            /> */}
            <Text style={[styles.secondRowText,{fontSize:11,color:'#6DBD5B',fontFamily:'GilroyBold',borderWidth:1,borderColor:'#6DBD5B',padding:4,borderRadius:4}]}>
                Free Quiz
            </Text>
          </View>
        </View>
        <View style={[styles.secondRow]}>
          <Text style={styles.secondRowText}>
            {/* {props.item.totalspots + ' Total spots'} */}
          </Text>

          <View style={[styles.secondRowColumn,{backgroundColor:'#fff'}]}>
            <Text style={[styles.secondRowColumnText, {marginRight: 5}]}>
            </Text>
            <Text style={[styles.secondRowColumnText]}>
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={[styles.thirdRow,{justifyContent:'flex-start',alignItems:'center'}]}>
          <OcticonsIcon
            name="primitive-dot"
            size={20}
            color="#6DBD5B"
            style={{marginRight: 2}}
          />
          <Text style={styles.thirdRowText}>
            {'User can play this quiz free'}
          </Text>
      </View>
    </View>
  );
};

export default FreeQuizModal;

const styles = StyleSheet.create({
    homeSectionView: {
        width:'95%',
        backgroundColor: '#FFFFFF',
        borderColor: '#D5D5D5',
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
        alignSelf: 'center',
        marginBottom: 15
    },
    firstRow: { width: '100%', paddingVertical: 5, paddingHorizontal:15, marginTop: 5, justifyContent:'space-between', flexDirection:'row' },
    firstRowText: { fontSize: 15, color: '#000',fontFamily:'SofiaProRegular' },
    secondRow: { width: '100%', paddingHorizontal: 10, justifyContent:'space-between', flexDirection:'row',alignItems:'center' },
    secondRowText: { fontSize: 12, color: '#A01319', fontFamily:'SofiaProRegular' },
    secondRowColumn: {backgroundColor:'#EEF1EF', flexDirection:'row',padding:2,borderRadius:4,marginVertical:2},
    secondRowColumnText: {fontSize: 12, color: '#000',fontFamily:'SofiaProRegular',},
    thirdRow: { width: '100%', paddingHorizontal: 10, paddingVertical:4, marginTop:5, justifyContent:'space-between', flexDirection:'row',backgroundColor:'#F5F5F5',borderBottomLeftRadius:10,borderBottomRightRadius:10 },
    thirdRowFirst: { width: '25%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start' },
    thirdRowSecond: { width: '35%',flexDirection:'row',alignItems:'center',justifyContent:'center' },
    thirdRowThird: { width: '40%',flexDirection:'row',alignItems:'center',justifyContent:'flex-end' },
    thirdRowText: { fontSize: 10, color: '#000',fontFamily:'SofiaProRegular'},
    thirdRowText1: { fontSize: 12, color: '#000',marginLeft:5,fontFamily:'SofiaProRegular'},
    thirdRowText2: {width:65,alignSelf:'center',height:25,justifyContent:'center',alignItems:'center',borderRadius:5,borderWidth:0.5,backgroundColor:'#009D38',borderColor:'#009D38'},

});
