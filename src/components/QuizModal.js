import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  View,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import CountDown from 'react-native-countdown-component';
import { Tooltip } from 'react-native-elements';
import moment from 'moment';

const QuizModal = (props) => {
  // console.log('props.diff', props.diff);
  return (
    <View style={[styles.homeSectionView,{width:props.width}]}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={props.onPress}
        style={{width: '100%', alignItems: 'center', alignSelf: 'center'}}>
        <View style={styles.firstRow}>
          <Text style={styles.firstRowText}>{props.item.name}</Text>
          {props.diff == 0 && (
            <View
              style={[
                styles.thirdRowFirst,
                {justifyContent: 'flex-start', alignItems: 'flex-start'},
              ]}>
              <OcticonsIcon
                name="primitive-dot"
                size={20}
                color="#6DBD5B"
                style={{marginRight: 2, marginBottom: 5}}
              />
              <Text style={[styles.thirdRowText, {marginTop: 2.5}]}>
                {'Live'}
              </Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <EntypoIcon
              name="stopwatch"
              size={17}
              color="#000"
              style={{marginTop: 1, marginRight: 2}}
            />
            {props.expDate.diff(props.nowDate, 'days')>0 || props.notShow?
                props.notShow?
                <Text style={[styles.thirdRowText,{marginTop:2.5}]}>{moment(props.item.startdate).format('DD MMMM YYYY, h:mm:ss a')}</Text>
                :
                <Text style={[styles.thirdRowText,{marginTop:2.5}]}>{moment(props.item.startdate).format('DD MMMM YYYY')}</Text>
            :
            <CountDown
              until={props.diff == 0 ? props.item.buffertime * 60 : props.diff} //(item.duration)*60}
              onFinish={props.onFinish}
              // onPress={(time) => console.log('hello',time)}
              // onChange={props.onChange}
              size={12}
              timeToShow={['D', 'H', 'M', 'S']}
              timeLabels={{d: null, h: null, m: null, s: null}}
              digitStyle={{backgroundColor: '#FFF', width: 15}}
              digitTxtStyle={{color: '#000'}}
              showSeparator
            />}
          </View>
        </View>
        <View style={styles.secondRow}>
          <Text style={styles.secondRowText}>
            {props.item.totalspots + ' Total spots'}
          </Text>
          <View style={styles.secondRowColumn}>
            <Text style={[styles.secondRowColumnText, {marginRight: 5}]}>
              <Ionicon
                name="trophy-outline"
                size={15}
                color="#FFD93F"
                style={{marginTop: 7}}
              />
              {' Play & Win : '}
            </Text>
            <Text style={styles.secondRowColumnText}>
              {/* <FontAwesome5Icon name='coins' size={15} color='#FFD93F' style={{marginTop:7}} /> */}
              <FontAwesomeIcon
                name="rupee"
                size={10}
                color="#000"
                style={{marginTop: 7}}
              />
              {props.item.prizepool}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.thirdRow}>
        <View style={styles.thirdRowFirst}>
          <OcticonsIcon
            name="primitive-dot"
            size={20}
            color="#6DBD5B"
            style={{marginRight: 2}}
          />
          <Text style={styles.thirdRowText}>
            {props.item.userplaying + ' user playing'}
          </Text>
        </View>
        <View style={styles.thirdRowSecond}>
          <Text style={styles.thirdRowText1}>
            {'Entry: '}
            {/* <FontAwesome5Icon name='coins' size={14} color='#FFD93F' style={{marginTop:7}} /> */}
            <FontAwesomeIcon
              name="rupee"
              size={10}
              color="#000"
              style={{marginTop: 7}}
            />
            {props.item.entryfee}
          </Text>
        </View>
        <View style={styles.thirdRowThird}>
          <Tooltip
            width={165}
            height={30}
            containerStyle={{borderRadius: 4, paddingVertical: 2}}
            backgroundColor={'#000'}
            popover={
              <Text style={[styles.playBtn, {color: '#fff', fontSize: 13}]}>
                First Prize ={' '}
                <FontAwesomeIcon
                  name="rupee"
                  size={12}
                  color="#fff"
                  style={{marginTop: 10}}
                />
                {props.item.firstprize}
              </Text>
            }
            overlayColor="transparent"
            skipAndroidStatusBar={true}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../../assets/firstWinner.png')}
                style={{height: 17, width: 17}}
              />
              <Text style={[styles.playBtn, {color: '#000', fontSize: 13}]}>
                {' '}
                <FontAwesomeIcon
                  name="rupee"
                  size={12}
                  color="#000"
                  style={{marginTop: 10}}
                />
                {props.item.firstprize}
              </Text>
            </View>
          </Tooltip>
          <Tooltip
            width={220}
            height={30}
            containerStyle={{borderRadius: 4, paddingVertical: 2}}
            backgroundColor={'#000'}
            popover={
              <Text style={[styles.playBtn, {color: '#fff', fontSize: 13}]}>
                {(props.item.totalspots * props.item.totalwinner_percentage) / 100 +
                  ' contestant win this contest'}
              </Text>
            }
            overlayColor="transparent"
            skipAndroidStatusBar={true}>
            <View style={{flexDirection: 'row'}}>
              <Ionicon
                name="trophy-outline"
                size={12}
                color="#000"
                style={{marginTop: 2, marginRight: 3, marginLeft: 5}}
              />
              <Text style={[styles.playBtn, {color: '#000', fontSize: 13}]}>
                {props.item.totalwinner_percentage + '%'}
              </Text>
            </View>
          </Tooltip>
        </View>
      </View>
    </View>
  );
};

export default QuizModal;

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
