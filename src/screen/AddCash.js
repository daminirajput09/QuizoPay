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
import Ionicon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import axiosClient from '../api/axios-client';
import Toast,{BaseToast} from 'react-native-toast-message';

const AddCash = ({navigation, route}) => {

  const { userId ,Balance } = route.params;
  const isFocused = useIsFocused();
  const [loader, setLoader] = useState(false);
  const [List, setList] = useState([]);
  const [TotalAmount, setTotalAmount] = useState(Balance);
  const [amount, setAmount] = useState('150');

  const successIcon = require('../../assets/close.png');

  const toastConfig = {
      success: ({ text1, hide, ...rest }) => (
        <BaseToast
          {...rest}
          style={{ borderRadius:0, backgroundColor:'#2E8B57' }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          text1Style={{
            fontSize: 15,
          }}
          text1={text1}
          text2={null}
          trailingIcon={successIcon}
          onTrailingIconPress={hide}
        />
      ),
      error: ({ text1, hide, ...rest }) => (
          <BaseToast
            {...rest}
            style={{ borderRadius:0, backgroundColor:'#D42F2F' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
              fontSize: 15,
            }}
            text1={text1}
            text2={null}
            trailingIcon={successIcon}
            onTrailingIconPress={hide}
          />
        )
  };

   useEffect(() => {
     BackHandler.addEventListener('hardwareBackPress', handleBackPress);
     return () => {
         BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
         setList([]); 
     }
   },[]);

    const onAddCash = () => {
      setLoader(true);

    if(userId && amount){  
      const formData = new FormData();
      formData.append('userid', userId);
      formData.append('amount', amount);

      axiosClient().post('wallet/addCash', formData)
          .then(async (res) => {
              console.log('add cash res', res.data, formData)
              if (res.data.Error == 0) {
                  let cash = parseInt(TotalAmount)+parseInt(amount); 
                  setTotalAmount(cash);
                  setLoader(false);
                  Toast.show({
                    text1: res.data.message,
                    type: 'success',
                    position: 'top',
                    visibilityTime: 4000,
                    autoHide: true,
                    topOffset: 0,
                    bottomOffset: 40,
                    leadingIcon: null
                });
                } else if(res.data.Error == 1) {
                  setLoader(false);
                  Toast.show({
                      text1: res.data.message,
                      type: 'error',
                      position: 'top',
                      visibilityTime: 4000,
                      autoHide: true,
                      topOffset: 0,
                      bottomOffset: 40,
                      leadingIcon: null
                  });
              } else { setLoader(false); }
          }).catch((err) => {
              setLoader(false); 
              console.log('add cash', err)
          })
     } else { setLoader(false); }  
  }

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
                <Text style={{fontSize:17,fontFamily:'SofiaProRegular'}}><FontAwesomeIcon name='rupee' size={15} color='#000' />{TotalAmount}</Text>
            </View>
        </View>

        <View style={{width:'100%',flexDirection:'row',padding:15,backgroundColor:'#fff',marginTop:20}}>
          <View style={{width:'50%',padding:7,backgroundColor:'#ECFFDC',borderRadius:5,height:70,borderBottomWidth:1.5,borderBottomColor:'#78B685'}}>
            <Text style={{color:'#78B685',fontSize:15,fontFamily:'SofiaProRegular'}}>Amount to add</Text>
            <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
              <TextInput value={amount} onChangeText={(text)=>setAmount(text)}
                style={{fontSize:20,height:45,width:'80%'}} keyboardType={'numeric'} />
              <AntIcon name='closecircleo' size={25} color='#000' style={{marginTop:5}} onPress={()=>setAmount('')} />  
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
    <TouchableOpacity onPress={()=> onAddCash() }
      style={{width:'90%',alignSelf:'center',height:40,backgroundColor:'#32CD32',marginBottom:20,justifyContent:'center',alignItems:'center',borderRadius:4}}>
        <Text style={{fontSize:14,color:'#fff',fontWeight:'bold',fontFamily:'GilroyMedium'}}>ADD <FontAwesomeIcon name='rupee' size={13} color='#fff' style={{marginTop:7}} />{amount}</Text>
     </TouchableOpacity>

     <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />

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