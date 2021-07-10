import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  TextInput,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../components/Header';
import {useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import axiosClient from '../api/axios-client';
import Loader from '../components/Loader';
import {MyContext} from '../components/UseContext';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const ViewDoubt = ({navigation}) => {
  const isFocused = useIsFocused();
  const [subjects, setSubject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doubtText, setDoubtText] = useState(null);
  const [doubts, setDoubts] = useState([1, 2, 3]);
  const {userId} = useContext(MyContext);

  return (
    <>
      {loading ? (
        <Loader isLoading={loading} />
      ) : (
        <View style={{flex: 1}}>
        <View style={{ backgroundColor: '#ecb22d', height: Platform.OS == 'ios' ? hp('10') : hp('5'), flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
                <Image source={require('../../assets/leftArrow.png')} resizeMode='center' />
            </TouchableOpacity>
        </View>

          {isFocused ? (
            <StatusBar backgroundColor={'#ecb22d'} barStyle={'dark-content'} />
          ) : null}
          <View style={{backgroundColor:'#fff'}}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                paddingVertical: 15,
              }}>
              <View
                style={{
                  width: '18%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/TC.jpeg')}
                  style={{width: 55, height: 55, borderRadius: 120}}
                  resizeMode="cover"
                />
              </View>
              <View
                style={{
                  width: '82%',
                  justifyContent: 'center',
                  paddingLeft: 8
                }}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{color: '#000', fontSize: 20}}>
                        Rajendra Yadav{' '}
                    </Text>
                    <View style={{width:5,height:5,backgroundColor:'#000',borderRadius:100}} />
                    <Text style={{color: '#000', fontSize: 16}}>
                        {'  '}10m
                    </Text>
                </View>
                  <Text
                    style={{
                      color: '#A9ABAE',
                      fontSize: 13,
                      marginTop:5
                    }}>
                    NEET (Physics)
                  </Text>
              </View>
              {/* <View
                style={{
                  width: '15%',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcon
                  name="dots-vertical"
                  size={25}
                  color="lightgrey"
                />
              </View> */}
            </View>

            <View
              style={{
                justifyContent: 'center',
                padding: 7,
                backgroundColor: '#fff',
              }}>
              <Text style={{color: '#000',fontSize:16}}>This is Demo textView.</Text>
              <Image
                  source={require('../../assets/study.jpg')}
                  style={{width: 150, height: 200,alignSelf:'center'}}
                  resizeMode="contain"
              />
            </View>

            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                backgroundColor: '#fff',
                flexDirection: 'row',
                height: 50,
              }}>
              <View
                style={{
                  width: '30%',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <AntIcon name="like2" size={20} color="#A9ABAE" />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginLeft: 5,
                    color: '#A9ABAE',
                  }}>
                  Like
                </Text>
              </View>
              <View
                style={{
                  width: '40%',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <MaterialCommunityIcon
                  name="comment-text-outline"
                  size={20}
                  color="#A9ABAE"
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginLeft: 5,
                    color: '#A9ABAE',
                  }}>
                  Comments
                </Text>
              </View>
              <View
                style={{
                  width: '30%',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <EvilIcon name="share-google" size={25} color="#A9ABAE" />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginLeft: 5,
                    color: '#A9ABAE',
                  }}>
                  Share
                </Text>
              </View>
            </View>

            <View style={{width:'90%',alignSelf:'center',marginBottom:10,flexDirection:'row',backgroundColor:'#dcdcdc',height:50,borderRadius:70,}}>
                <TextInput placeholder='Answer Doubt' value={doubtText} onChange={(text)=> setDoubtText(text)} style={{width:'85%',justifyContent:'center',paddingLeft:10}} />
                <TouchableOpacity>
                    <MaterialCommunityIcon
                    name="camera"
                    size={25}
                    color="#000"
                    style={{top:10,position:'absolute'}}
                    />
                </TouchableOpacity>
            </View>
            <View
              style={{backgroundColor: '#E6E7E8', width: '100%', height: 2}}
            />

            <View style={{backgroundColor:'#E6E7E8',width:'100%',paddingVertical:10,paddingLeft:15,marginTop:15}}>
                <Text style={{color:'#323232',fontSize:18}}>ANSWERS</Text>
            </View>
          </View>
          
          <View
              style={{
                width: '100%',
                flexDirection: 'row',
                paddingTop: 15
              }}>
              <View
                style={{
                  width: '18%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/TC.jpeg')}
                  style={{width: 55, height: 55, borderRadius: 120}}
                  resizeMode="cover"
                />
              </View>
              <View
                style={{
                  width: '80%',
                  justifyContent: 'center',
                  paddingLeft: 10,padding:10,backgroundColor:'#E6E7E8',borderRadius:20
                }}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{color: '#000', fontSize: 18}}>
                        Aditya{' '}
                    </Text>
                    <View style={{width:5,height:5,backgroundColor:'#000',borderRadius:100}} />
                    <Text style={{color: '#000', fontSize: 16}}>
                        {'  '}10m
                    </Text>
                </View>
                  <Text
                    style={{
                      color: '#A9ABAE',
                      fontSize: 13,
                      marginTop:5
                    }}>
                    Testing Kit
                  </Text>
              </View>
              
            </View>

            <View style={{flexDirection:'row',width:'80%',alignSelf:'flex-end'}}>
                <Text style={{marginLeft:15,color:'grey'}}>Like</Text>
                <Text style={{marginLeft:15,color:'grey'}}>Comment</Text>
                <Text style={{marginLeft:15,color:'grey'}}>Reply</Text>
               </View>
        </View>
      )}
    </>
  );
};
export default ViewDoubt;