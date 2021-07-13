import React, { useEffect, useState } from 'react';
import {TouchableOpacity, StyleSheet, Text, Image, View} from 'react-native';
import CountDown from 'react-native-countdown-component';
import Modal from 'react-native-modalbox';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker';
import axiosClient from '../api/axios-client';

const ModalComponent = props => {

  //console.log('m o d a l c o m p o e n e n t', props);
  const [buffertime, setBuffertime] = useState(0);
  const [difference, setDifference] = useState(0);

  useEffect(()=>{
    if(props.countdownModal == true){
      getQuizStartTime();
    }
    if(props.countdownModal == false){
      setBuffertime();
      setDifference();
    }
  },[props.countdownModal]);

  const getQuizStartTime = () => {

    const formData = new FormData();
    formData.append('userid', props.userId);
    formData.append('quizkey', props.quizKey);

    axiosClient().post('quizzes/getQuizStarttime',formData)
        .then((res) => {
          //console.log('get -> Quiz -> Start -> time',res.data.data);
          if (res.data.Error === 0) {
                // setBuffertime(res.data.data.buffertime);
                const expDate = moment(res.data.data.startdate); // create moment from string with format 
                const nowDate = moment(new Date());//res.data.data.currentdate); // new moment -> today 
                const buffer = moment(res.data.data.buffertime); // create moment from string with format 

                const diff = expDate.diff(nowDate, 'seconds'); // returns 366 
                const bufferDiff = buffer.diff(nowDate, 'seconds'); // returns 366 

                setDifference(diff);
                console.log('buffer diff in popup', bufferDiff);
                setBuffertime(bufferDiff);
          }
        }).catch((err) => {
            console.log(err)
        })
  }

  return (
    <Modal
      style={{
        width: '100%',
        top: 5,
        height: 510,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#F3F3F3',
        justifyContent: 'flex-end',
      }}
      swipeToClose={true}
      swipeArea={10}
      swipeThreshold={50}
      isOpen={difference ? props.countdownModal : false}
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
            {'Entry Fee : ₹' + props.QuizItem.entryfee}
          </Text>
          <TouchableOpacity onPress={props.distributionPlan}> 
            <Text style={{fontSize: 14, fontFamily: 'SofiaProRegular', marginVertical: 7,fontWeight:'bold',color:'#3366BB'}}>
              {'See Distribution plan'}
            </Text>
          </TouchableOpacity>

        </View>

        {/* {(props.item.buffertime * 60) > 0 ?
          <View> */}

        {difference > 0 ? //&& buffertime > 0 ?
        <View style={{width: '100%', marginVertical: 10,alignItems:'flex-start'}}>

        <Text
            style={{
              fontSize: 14,
              fontFamily: 'SofiaProRegular',
              marginVertical: 10,
              marginLeft:15
            }}>
            This Quiz starts in
          </Text>

          {moment(props.QuizItem.startdate).diff(moment(new Date()), 'days') > 0 ? (
            <CountDown
              until={difference} //difference <= 0 ? buffertime * 60 : difference
              // until={diff == 0 ? item.buffertime*60 : diff}//(item.duration)*60}
              onFinish={props.onFinish}
              // onFinish={() => alert('finished')}
              size={12}
              timeToShow={['D', 'H', 'M', 'S']}
              timeLabels={{d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds'}}
              digitStyle={{
                backgroundColor: '#FFF',
                width: 60,
                height: 60,
                borderColor: '#fff',
                borderWidth: 1,
                elevation: 5,
                marginLeft: 15,
                borderRadius: 0,
              }}
              digitTxtStyle={{color: '#000', fontSize: 25}}
              timeLabelStyle={{color: '#000', fontSize: 10}}
            />
          ) : (
            <CountDown
              until={difference} //difference <= 0 ? buffertime * 60 : 
              // until={diff == 0 ? item.buffertime*60 : diff}//(item.duration)*60}
              onFinish={props.onFinish}
                //console.log('quiz time finish');
              // }}
              // onFinish={() => alert('finished')}
              size={12}
              timeToShow={['H', 'M', 'S']}
              timeLabels={{h: 'Hours', m: 'Minutes', s: 'Seconds'}}
              digitStyle={{
                backgroundColor: '#FFF',
                width: 60,
                height: 60,
                borderColor: '#fff',
                borderWidth: 1,
                elevation: 5,
                marginLeft: 15,
                borderRadius: 0,
              }}
              digitTxtStyle={{color: '#000', fontSize: 25}}
              timeLabelStyle={{color: '#000', fontSize: 10}}
            />
          )}
        </View>
        :
        <View>
          <Text
            style={{
              fontSize: 30,
              fontFamily: 'GilroyBold',
              marginVertical: 25,
              marginLeft:15,
              textAlign:'center'
            }}>
            Quiz time is over
          </Text>
        </View>}

        {props.QuizItem && props.QuizItem.language && props.QuizItem.language.length > 0 ? (
          <View
            style={{width: '90%', alignSelf: 'center', flexDirection: 'row'}}>
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
            style={{width: '90%', alignSelf: 'center', flexDirection: 'row'}}>
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
          activeOpacity={difference >= 0 ? 1 :0.5} //difference <= 0?0.5:1}
          // onPress={props.onPress}
          onPress={difference >= 0 ? null : props.onPress 
            // props.navigation.navigate('MyTests',{userid: props.userId ,quiz_key: props.quizKey}) 
          }
          style={[
            styles.ApplyBtn,
            {
              backgroundColor: difference <= 0 ? '#009D38' : '#D8D9D8',
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
export default ModalComponent;

const styles = StyleSheet.create({
    filterView: {width:'100%',alignSelf:'center',paddingTop:15,paddingHorizontal:10,flexDirection:'row',backgroundColor:'#F3F3F3',borderTopLeftRadius:10,borderTopRightRadius:10,flexDirection:'row',justifyContent:'flex-start'},
    resetBtn: {textTransform:'uppercase',fontSize:14,fontWeight:'bold',fontFamily:'SofiaProRegular',color:'#D1D1D1'},
    ViewBorder: {backgroundColor:'#F5F5F5',width:'100%',height:2},
    ApplyBtn: {width:'90%',marginTop:10,marginBottom:10,alignSelf:'center',height:45,alignItems:'center',justifyContent:'center',borderRadius:4},
    apply: {textTransform:'uppercase',fontSize:14,fontFamily:'GilroyMedium'},

    playBtn: { fontSize: 10, color: '#fff',fontFamily:'SofiaProRegular'},

});
