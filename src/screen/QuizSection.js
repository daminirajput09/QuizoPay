import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  FlatList,
  BackHandler
} from 'react-native';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Feather';
import axiosClient from '../api/axios-client';
import { MyContext } from '../components/UseContext';
import Loader from '../components/Loader';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const QuizSection = ({ navigation, route }) => {

  const { user } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const [quizList, setQuizList] = useState([]);

  useEffect(() => {
    getQuizList();
    const handle = BackHandler.addEventListener('hardwareBackPress', navigateBack)

    return () => handle.remove()
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getQuizList();
    });
    return unsubscribe;
  }, [navigation]);

  const navigateBack = () => {
    navigation.navigate('Home')
    return true
  }

  const getQuizList = () => {
    if (user && user.id) {
      const formdata = new FormData();
      formdata.append('userid', user.id);
      formdata.append('start', 0);
      formdata.append('limit', 20);
      formdata.append('courseid', 'All');
      formdata.append('subjectid', 'All');
      axiosClient()
        .post('quizzes/get', formdata)
        .then((res) => {
          setLoading(false);
          //console.log('quiz response', res);
          if (res.data.Error === 0) {
            setQuizList(res.data.data);
          } else {
            setQuizList([]);
          }
        })
        .catch((err) => {
          setLoading(false);
          //console.log('quiz error', err);
        });
    }
  };

  const redirection = (item) => {
    if (item.quizresultid == null) {
      navigation.navigate('QuizStart', {
        userid: user.id,
        quizKey: item.key,
      })
    }
    else {
      navigation.navigate('QuizResult', { quizKey: item.key })
    }
  }

  return (
    <View style={styles.mainContainer}>
      <Header headerText={'Quizzes'} onPress={() => navigation.navigate('Home')} />
      {loading ? (
        <Loader isLoading={loading} />
      ) : (
        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            contentContainerStyle={{ bottom: 10 }}>
            <LinearGradient
              start={{ x: 0.2, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['#F9CC0D', '#F69419', '#F3801B']}
              style={{
                height: hp('7'),
                width: wp('80'),
                alignSelf: 'flex-end',
                backgroundColor: '#fff',
                borderBottomLeftRadius: 20,
                borderTopLeftRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('AttemptedQuiz')}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
                  All Your Attempted Quizzes
                </Text>
              </TouchableOpacity>
            </LinearGradient>

            <View style={[styles.headerText, { paddingTop: 20 }]}>
              <Text> SUGGESTED QUIZZES </Text>
            </View>
            <FlatList
              data={quizList}
              style={{ borderRadius: 10 }}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingBottom: 35 }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <View key={index}>
                    <TouchableOpacity
                      style={styles.listMainView}
                      onPress={() => redirection(item)}>
                      <Text style={styles.ListHeadText}>{item.name}</Text>
                      <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '60%', justifyContent: 'center' }}>
                          <Text style={styles.ListText}>{item.quizdate}</Text>
                          <Text style={styles.ListText}>{item.totalquestions + 'Qs.' + item.duration + 'mins'}</Text>
                        </View>
                        <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <Text
                            style={{
                              color: 'green',
                              fontSize: 13,
                            }}>{item.quizresume === '1' && item.quizresultid == null ? 'Resume Now' :
                              item.quizresultid == null ? 'Start Now' :
                                'View Result'}</Text>
                          <Icon name={'arrow-right'} size={17} color={'green'} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default QuizSection;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F9F5F2'
  },
  listStyle: {
    height: 228,
  },
  listMainView: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 10,
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    elevation: 10,
    borderColor: '#D5D5D5',
  },
  ListHeadText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#000',
  },
  ListText: {
    fontSize: 12,
    marginTop: 5,
    color: '#000',
    width: '60%'
  },
  headerText: {
    width: '100%',
    marginTop: 10,
    fontSize: 15,
    paddingLeft: 20,
    flexDirection: 'row',
  },
});
