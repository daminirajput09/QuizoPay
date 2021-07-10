import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  BackHandler
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import Loader from '../components/Loader';
import {MyContext} from '../components/UseContext';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const AddCash = ({navigation, route}) => {

  const { Balance } = route.params;
  const isFocused = useIsFocused();
  const [loader, setLoader] = useState(false);
  const [List, setList] = useState([]);
  const [amount, setAmount] = useState('150');

    useEffect(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
          setList([]); 
      }
    },[])

  const handleBackPress = () => {
      navigation.goBack();
      return true;
  };

  return (
    <View style={{flex: 1,backgroundColor:'#CDCED2'}}>
        <StatusBar backgroundColor={'#0D0E10'} barStyle={'light-content'} />

        <View style={styles.headerView}>
            <TouchableOpacity
                style={{width:'15%',alignItems:'center',justifyContent:'center'}}
                onPress={() => navigation.goBack()}>
                <Ionicon name='arrow-back-outline' size={20} color='#fff' />
            </TouchableOpacity>

            <View style={{width:'85%',alignItems: 'flex-start'}}>
                <Text style={styles.textHead}>Add Cash</Text>
            </View>
        </View>

      {loader ? (
          <Loader isLoading={loader} />
      ) : (
    <ScrollView>
        <View style={{width:'100%',flexDirection:'row',padding:15,backgroundColor:'#fff'}}>
            <View style={{width:'15%'}}>
                <Icon name='wallet' size={25} color='#D27A0F' />
            </View>
            <View style={{width:'65%',justifyContent:'center'}}>
                <Text style={{fontSize:17,fontFamily:'GilroyMedium'}}>Current Balance</Text>
            </View>
            <View style={{width:'20%',alignItems:'flex-end'}}>
                <Text style={{fontSize:17,fontFamily:'SofiaProRegular'}}><FontAwesomeIcon name='rupee' size={15} color='#000' />{Balance}</Text>
            </View>
        </View>

        <View style={{width:'100%',flexDirection:'row',padding:15,backgroundColor:'#fff',marginTop:20}}>
          <View style={{width:'50%',padding:7,backgroundColor:'#ECFFDC',borderRadius:5,height:70,borderBottomWidth:1.5,borderBottomColor:'#78B685'}}>
            <Text style={{color:'#78B685',fontSize:15,fontFamily:'SofiaProRegular'}}>Amount to add</Text>
            <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
              <TextInput value={amount} onChangeText={(text)=>setAmount(text)}
                style={{fontSize:20,height:45,width:'80%'}} keyboardType={'numeric'} />
              <AntIcon name='closecircleo' size={25} color='#000' style={{marginTop:5}} onPress={()=>setAmount('SofiaProRegular')} />  
            </View>
          </View>

          <View style={{width:'50%',paddingHorizontal:7,alignItems:'flex-end',height:70,flexDirection:'row'}}>
            <TouchableOpacity onPress={()=> setAmount('500')}
              style={{width:'50%',height:45,justifyContent:'center',alignItems:'center',borderWidth:0.7,borderColor:'grey',borderRadius:5,marginRight:5}}>
              <Text style={{fontSize:15,fontFamily:'SofiaProRegular'}}><FontAwesomeIcon name='rupee' size={14} color='#000' />500</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> setAmount('1000')}
              style={{width:'50%',height:45,justifyContent:'center',alignItems:'center',borderWidth:0.7,borderColor:'grey',borderRadius:5}}>
              <Text style={{fontSize:15,fontFamily:'SofiaProRegular'}}><FontAwesomeIcon name='rupee' size={14} color='#000' />1000</Text>
            </TouchableOpacity>
          </View>

        </View>

    </ScrollView>
    )}
    <TouchableOpacity onPress={()=> navigation.goBack()}
      style={{width:'90%',alignSelf:'center',height:40,backgroundColor:'#32CD32',marginBottom:20,justifyContent:'center',alignItems:'center',borderRadius:4}}>
        <Text style={{fontSize:14,color:'#fff',fontWeight:'bold',fontFamily:'GilroyMedium'}}>ADD <FontAwesomeIcon name='rupee' size={13} color='#fff' style={{marginTop:7}} />{amount}</Text>
     </TouchableOpacity>

    </View>
  );
};

export default AddCash;

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'ios' ? hp('4') : 0,
    alignItems: 'center',
    paddingHorizontal: 5,
    height: 50,
    backgroundColor:'#0D0E10'
  },
  textHead: { 
      fontSize: 18,
      textAlign: 'center',
      color:'#fff',
      fontFamily:'GilroyMedium'
  },
});    