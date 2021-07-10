import React, { useContext, useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Image, Platform, StatusBar,TextInput,FlatList,ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../components/Header';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import axiosClient from '../api/axios-client'
import Loader from '../components/Loader';
import { MyContext } from '../components/UseContext'

const MyDoubts = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false)
    const [postType, setPostType] = useState('doubt');
    const [doubtText ,setDoubtText] = useState(null);
    // const [doubtOption ,setDoubtOption] = useState('');
    const [mcqData ,setMcqData] = useState([1,2]);
    const { userId } = useContext(MyContext)

    const deleteRow = (lastItem) => {
        if(mcqData.length>2){
            const temp = [...mcqData];
            temp.splice(lastItem-1, 1);
            setMcqData(temp);
            // //console.log('mcq Arr 2',mcqData);
        }
    }

    const mcqOption = (item,index) => {
        // //console.log('item, index',mcqData, item,index);
        let charCode = String.fromCharCode(96+item.item);
        return(
            <View style={{width:'90%',alignSelf:'center',marginVertical:7,flexDirection:'row'}}>
                <View style={{width:'15%',borderWidth:1.5,height:50,justifyContent:'center',alignItems:'center',borderRadius:10,borderColor:'lightgrey'}}>
                    <Text style={{textTransform:'capitalize'}}>{charCode}</Text>
                </View>
                <View style={{width:'75%',borderWidth:1.5,height:50,justifyContent:'center',borderRadius:10,borderColor:'lightgrey',marginLeft:'5%',paddingHorizontal:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <TextInput placeholder={'Option '+item.item} value={doubtText} onChange={(text)=> setDoubtText(text)} style={{fontSize:16,width:'100%',justifyContent:'center',paddingLeft:10}} />
                    {mcqData.length == item.item && mcqData.length>2?<AntIcon name='close' size={20} color='#000' style={{right:15}} onPress={()=> deleteRow(item.item)} />:null}
                </View>
            </View>
        )
    }

    return (
        <View style={{flex:1,backgroundColor:'#fff'}}>
            { loading ? <Loader isLoading={loading} /> : <View style={{ flex: 1 }}>
                <View style={{ justifyContent:'space-between',width:'100%', height: Platform.OS == 'ios' ? hp('10') : hp('7'), flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row',width:'100%'}}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft:10,marginRight: 20 }}>
                            <AntIcon name='arrowleft' size={20} color='#000' />
                        </TouchableOpacity>
                        <Text style={{ color: '#000', fontSize: 18,fontWeight:'bold' }}>Ask a Doubt</Text>
                    </View>
                </View>
                {isFocused ? <StatusBar backgroundColor={'#ecb22d'} barStyle={'dark-content'} /> : null}
                
                <View style={{width:'90%',height:2,alignSelf:'center',backgroundColor:'lightgrey'}} />

                <View style={{width:'90%',alignItems:'center',flexDirection:'row',justifyContent:'center',marginTop:20,alignSelf:'center'}}>
                    <TouchableOpacity style={{width:'47%',justifyContent:'center',borderWidth:2,alignItems:'center',height:40,borderRadius:10,borderColor:postType == 'doubt'?'green':'#000'}} onPress={()=>setPostType('doubt')}>
                        <Text style={{ color: '#000', fontSize: 15,fontWeight:'bold' }}>ASK DOUBTS</Text>
                    </TouchableOpacity>
                    <View style={{width:'6%'}} />
                    <TouchableOpacity style={{width:'47%',justifyContent:'center',borderWidth:2,alignItems:'center',height:40,borderRadius:10,borderColor:postType == 'doubt'?'#000':'green'}} onPress={()=>setPostType('mcq')}>
                        <Text style={{ color: '#000', fontSize: 15,fontWeight:'bold' }}>POST MCQ</Text>
                    </TouchableOpacity>
                </View>

                {postType == 'doubt'?
                    <View style={{width:'90%',alignSelf:'center',marginTop:20,}}>
                        <TextInput placeholder='Ask your Doubt' value={doubtText} multiline onChange={(text)=> setDoubtText(text)} style={{fontSize:16,width:'100%',justifyContent:'center',paddingLeft:10}} />
                        <FontAwesome5Icon name='user-alt' size={100} color='#000' style={{alignSelf:'center'}} />
                    </View>
                :
                    <ScrollView contentContainerStyle={{paddingVertical:10}}>
                        <View style={{width:'90%',alignSelf:'center',marginTop:20,}}>
                            <TextInput placeholder='Ask your Question' value={doubtText} multiline onChange={(text)=> setDoubtText(text)} style={{fontSize:16,width:'100%',justifyContent:'center',paddingLeft:10}} />
                            <FontAwesome5Icon name='user-alt' size={100} color='#000' style={{alignSelf:'center'}} />
                        </View>
                        <FlatList
                            data={mcqData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(item,index)=>mcqOption(item,index)}
                        />
                        <TouchableOpacity style={{width:'90%',alignSelf:'center',flexDirection:'row',marginTop:10}} onPress={()=>{
                            if(mcqData.length<6){setMcqData(mcqData => [...mcqData, mcqData[mcqData.length-1]+1])}
                            }}>
                            <AntIcon name='plus' size={20} color='grey' style={{alignSelf:'center'}} />
                            <Text style={{color:'grey',fontSize:17,marginLeft:10}}>More Options</Text>
                        </TouchableOpacity>
                        <View style={{width:'90%',alignSelf:'center',marginTop:10}}>
                            <Text style={{color:'grey',fontSize:17,marginLeft:10}}>Correct Answers :</Text>
                            <View style={{flexDirection:'row',width:'100%'}}>
                            {mcqData.map((data) => {
                            return (<View style={{width:30,height:40,borderWidth:1,justifyContent:'center',alignItems:'center',margin:4,borderColor:'lightgrey',elevation:1,shadowColor: "grey",
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                    }}><Text>{data}</Text></View>)
                            })}
                            </View>
                        </View>
                    </ScrollView>    
                }


            </View>}
            <View style={{width:'90%',height:2,alignSelf:'center',backgroundColor:'lightgrey'}} />
                <View style={{width:'100%',justifyContent:'space-around',flexDirection:'row',marginVertical:7,alignItems:'center'}}>
                    <MaterialIcon name='attach-file' size={25} color='#000' />
                    <MaterialCommunityIcon
                        name="camera"
                        size={25}
                        color="#000"
                    />
                    <TouchableOpacity style={{backgroundColor:'#6495ED',width:230,height:50,justifyContent:'center',alignItems:'center',borderRadius:4}}>
                        <Text style={{color:'#fff',fontSize:17}}>NEXT</Text>
                    </TouchableOpacity>
                </View>
        </View>
    )
}
export default MyDoubts;