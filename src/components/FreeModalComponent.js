import React, { useEffect, useState } from 'react';
import {TouchableOpacity, StyleSheet, Text, Image, View} from 'react-native';
import Modal from 'react-native-modalbox';
import {Picker} from '@react-native-picker/picker';

const FreeModalComponent = props => {

  return (
    <Modal
      style={{
        width: '100%',
        top: 5,
        height: 310,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#F3F3F3',
        justifyContent: 'flex-end',
      }}
      swipeToClose={true}
      swipeArea={10}
      swipeThreshold={50}
      isOpen={props.FreeCountdownModal}
      backdropOpacity={0.5}
      entry={'bottom'}
      backdropPressToClose={true}
      position={'bottom'}
      backdropColor={'#000'}
      coverScreen={true}
      onClosed={props.onClosed}
      backButtonClose={true}>
      <View>
        <View style={[styles.filterView, {flexDirection: 'column'}]}>
          <Text style={{fontSize: 16, fontFamily: 'SofiaProRegular',marginBottom:10}}>
            Today's Quiz on
          </Text>
          <Text style={{fontSize: 20, fontFamily: 'GilroyBold', marginVertical: 7}}>
            {props.QuizItem.name}
          </Text>
          <Text style={{fontSize: 16, fontFamily: 'SofiaProRegular', marginVertical: 7}}>
            {'Time : ' + props.QuizItem.questiontime + ' seconds'}
          </Text>
          <Text style={{fontSize: 16, fontFamily: 'SofiaProRegular', marginVertical: 7}}>
            {'Entry Fee :'} <Text style={{fontSize: 16, fontFamily: 'SofiaProRegular', color:'#009D38'}}>Free</Text>
          </Text>

        </View>

        {props.QuizItem && props.QuizItem.language && props.QuizItem.language.length > 0 ? (
          <View
            style={{width: '95%', alignSelf: 'center', flexDirection: 'row',marginTop:10}}>
            <Text
              style={[
                styles.playBtn,
                {color: '#000', fontSize: 16, width: '30%'},
              ]}>
              Language :{' '}
            </Text>
            <View
              style={{
                width: '70%',
                borderWidth: 0.5,
                borderColor: '#C0C0C0',
                height: 30,
              }}>
              {props.QuizItem &&
                props.QuizItem.language &&
                props.QuizItem.language.length > 0 ? 
                <Picker
                  selectedValue={props.Language}
                  style={{height: 30, bottom: 12}}
                  mode={'dropdown'}
                  onValueChange={props.onValueChange}>
                    {props.QuizItem.language.map((item, i) => (
                      <Picker.Item key={i} label={item} value={item.toString()} />
                    ))}
                </Picker>
              : null}  
              <Text style={{width: '100%', height: 60, position: 'absolute', bottom: 0, left: 0}}>{' '}</Text>
            </View>
          </View>
        ) : (
          <View
            style={{width: '95%', alignSelf: 'center', flexDirection: 'row',marginTop:10}}>
            <Text
              style={[
                styles.playBtn,
                {color: '#000', fontSize: 16, width: '30%'},
              ]}>
              Language :{' '}
            </Text>
            <View
              style={{
                width: '70%',
                borderWidth: 0.5,
                borderColor: '#C0C0C0',
                height: 30,
              }}>
              {props.QuizItem && props.QuizItem.language && props.QuizItem.language[0] ? (
                <Text style={[styles.playBtn, {color: '#000', fontSize: 16}]}>
                  {props.QuizItem && props.QuizItem.language[0]}
                </Text>
              ) : null}
            </View>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.5} //difference <= 0?0.5:1}
          // onPress={props.onPress}
          onPress={props.onPress}
          style={[
            styles.ApplyBtn,
            {
              backgroundColor: '#009D38',
              marginBottom: 30,
              marginTop: 30,
            },
          ]}>
          <Text style={[styles.apply, {color: '#fff'}]}>PLAY QUIZ NOW</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
export default FreeModalComponent;

const styles = StyleSheet.create({
    filterView: {width:'100%',alignSelf:'center',paddingTop:15,paddingHorizontal:10,flexDirection:'row',backgroundColor:'#F3F3F3',borderTopLeftRadius:10,borderTopRightRadius:10,flexDirection:'row',justifyContent:'flex-start'},
    resetBtn: {textTransform:'uppercase',fontSize:14,fontWeight:'bold',fontFamily:'SofiaProRegular',color:'#D1D1D1'},
    ViewBorder: {backgroundColor:'#F5F5F5',width:'100%',height:2},
    ApplyBtn: {width:'90%',marginTop:10,marginBottom:10,alignSelf:'center',height:45,alignItems:'center',justifyContent:'center',borderRadius:4},
    apply: {textTransform:'uppercase',fontSize:14,fontFamily:'GilroyMedium'},

    playBtn: { fontSize: 10, color: '#fff',fontFamily:'SofiaProRegular'},

});
