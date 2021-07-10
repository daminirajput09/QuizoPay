import React, { useEffect, useState, useContext } from 'react'
import { Switch, BackHandler, Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar, Dimensions,ToastAndroid } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const windowHeight = Dimensions.get('window').height;

const PrivavySettings = ({ navigation, route }) => {

    const [DOB, setDOB] = useState('')

    const [isEnabled1, setIsEnabled1] = useState(false);
    const toggleSwitch1 = () => setIsEnabled1(previousState => !previousState);
    const [isEnabled2, setIsEnabled2] = useState(false);
    const toggleSwitch2 = () => setIsEnabled2(previousState => !previousState);
    const [isEnabled3, setIsEnabled3] = useState(false);
    const toggleSwitch3 = () => setIsEnabled3(previousState => !previousState);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backPress)

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backPress)
        }
    }, []);

    const backPress = () => {
        navigation.goBack();
        return true;
    }

    return (
    <View style={{flex: 1,backgroundColor:'#F5F5F5'}}>
        <StatusBar backgroundColor={'#000000'} barStyle={'light-content'} />

        <View style={styles.headerView}>
            <TouchableOpacity
                style={{width:'15%',alignItems:'center',justifyContent:'center'}}
                onPress={() => backPress()}>
                <Ionicon name='arrow-back-outline' size={20} color='#fff' />
            </TouchableOpacity>

            <View style={{width:'85%',alignItems: 'flex-start'}}>
                <Text style={styles.textHead}>{'Privavy Settings'}</Text>
            </View>
        </View>

        <ScrollView keyboardShouldPersistTaps="always">

        <View style={{
            // paddingVertical:20,
            backgroundColor: '#fff',
        }}>

                <View style={[{paddingLeft:25,backgroundColor: '#F5F5F5',width:'100%',flexDirection:'row',height:55,justifyContent:'flex-start',alignItems:'center'}]}>
                        <Text style={{fontSize:15,fontWeight:'bold',fontFamily:'GilroyMedium'}}>Personal Information</Text>
                </View>

                <View style={[{paddingLeft:25,width:'100%',flexDirection:'row',paddingVertical:15,justifyContent:'center',alignItems:'center',borderRadius:10}]}>
                    <View style={{width:'80%'}}>
                        <Text style={{fontSize:14,fontFamily:'SofiaProRegular'}}>Display my full name on profile</Text>
                        <Text style={{fontSize:12,fontFamily:'SofiaProRegular'}}>Your full name will be visible to everyone who views your profile</Text>
                    </View>
                    <View style={{width:'20%',alignItems:'flex-end',paddingRight:15}}>
                        <Switch
                            trackColor={{ false: "#CCCCCC", true: "#C9EECD" }}
                            thumbColor={isEnabled1 ? "#28B438" : "#F5F5F5"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch1}
                            value={isEnabled1}
                        />
                    </View>
                </View>

                <View style={[{paddingLeft:25,backgroundColor: '#F5F5F5',width:'100%',flexDirection:'row',height:55,justifyContent:'flex-start',alignItems:'center'}]}>
                        <Text style={{fontSize:15,fontWeight:'bold',fontFamily:'GilroyMedium'}}>Gameplay</Text>
                </View>

                <View style={[{paddingLeft:25,width:'100%',flexDirection:'row',paddingVertical:15,justifyContent:'center',alignItems:'center',borderRadius:10}]}>
                    <View style={{width:'80%'}}>
                        <Text style={{fontSize:14,fontFamily:'SofiaProRegular'}}>Show my previous teams</Text>
                        <Text style={{fontSize:12,fontFamily:'SofiaProRegular'}}>People who view your profile will be able to see teams that you have created for completed matches</Text>
                    </View>
                    <View style={{width:'20%',alignItems:'flex-end',paddingRight:15}}>
                        <Switch
                            trackColor={{ false: "#CCCCCC", true: "#C9EECD" }}
                            thumbColor={isEnabled2 ? "#28B438" : "#F5F5F5"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch2}
                            value={isEnabled2}
                        />
                    </View>
                </View>

                <View style={{width:'100%',height:2,backgroundColor:'#F5F5F5'}} />
                <View style={[{paddingLeft:25,width:'100%',flexDirection:'row',paddingVertical:15,justifyContent:'center',alignItems:'center',borderRadius:10}]}>
                    <View style={{width:'80%'}}>
                        <Text style={{fontSize:14,fontFamily:'SofiaProRegular'}}>Show which contents I join</Text>
                        <Text style={{fontSize:12,fontFamily:'SofiaProRegular'}}>People who view your profile will be able to see teams that you have created for completed matches</Text>
                    </View>
                    <View style={{width:'20%',alignItems:'flex-end',paddingRight:15}}>
                        <Switch
                            trackColor={{ false: "#CCCCCC", true: "#C9EECD" }}
                            thumbColor={isEnabled3 ? "#28B438" : "#F5F5F5"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch3}
                            value={isEnabled3}
                        />
                    </View>
                </View>

            </View>

            </ScrollView>
            
    </View>
    )
}
export default PrivavySettings;

const styles = StyleSheet.create({

    headerView: {
        flexDirection: 'row',
        marginTop: 0,
        alignItems: 'center',
        paddingHorizontal: 5,
        // borderWidth:1,
        height: 50,
        backgroundColor:'#1A1A1A'
    },
    textHead: { fontSize: 18, textAlign: 'center',color:'#fff',fontFamily:'GilroyMedium' },
    imageStyle: {
        width: 25,
        height: 25,
        alignSelf: 'flex-end',
        marginBottom: 10,
        left: 20
    },
    HeaderView: {
        width: '93%',
        alignSelf: 'center',
        height: Platform.OS === 'ios' ? windowHeight / 3.5 : windowHeight / 3.5,
        justifyContent: 'flex-end',
        paddingBottom: 20,
        // borderWidth:1,
    },
    middleView: {
        width: '100%',
        height: windowHeight / 3,
        // borderWidth:1,
    },
    footerView: {
        width: '93%',
        height: windowHeight / 5,
        // borderWidth:1,
        alignSelf: 'center',
        justifyContent: 'center',
        position:'relative',
        top: 35
    },

});    