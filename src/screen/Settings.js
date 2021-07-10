import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Header from '../components/Header'
const { width, height } = Dimensions.get('window');


const Support = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <Header headerText={'Support'} onPress={() => navigation.goBack()} />
            {/* <Text style={{ fontSize: 16, color: '#000', marginTop: 10, marginLeft: 25, marginRight: 25, justifyContent: 'center', opacity: 0.6 }}>{'Location'}</Text>
            <Text style={{ fontSize: 16, color: '#000', marginTop: 0, marginLeft: 25, marginRight: 25, justifyContent: 'center' }}>{'plot no 120 Kailash Nagar, \nKumawat Colony ,'}</Text>
            <Text style={{ fontSize: 16, color: '#000', marginTop: 0, marginLeft: 25, marginRight: 25, justifyContent: 'center' }}>{'Jhotwara Jaipur 302012'}</Text> */}

            {/* <View style={{ backgroundColor: 'grey', width, height: 1, marginTop: 20 }} /> */}

            <Text style={{ fontSize: 16, color: '#000', marginTop: 20, marginLeft: 25, marginRight: 25, justifyContent: 'center', opacity: 0.6 }}>{'Contact Detail :'}</Text>
            <Text style={{ fontSize: 16, color: '#000', marginTop: 0, marginLeft: 25, marginRight: 25, justifyContent: 'center' }}>{'Mobile : 8955174627'}</Text>
            {/* <Text style={{ fontSize: 16, color: '#000', marginTop: 0, marginLeft: 25, marginRight: 25, justifyContent: 'center' }}>{'Whatsapp : 8955174627'}</Text> */}

            <View style={{ backgroundColor: 'grey', width, height: 1, marginTop: 20 }} />

            {/* <Text style={{ fontSize: 16, color: '#000', marginTop: 20, marginLeft: 25, marginRight: 25, justifyContent: 'center', opacity: 0.6 }}>{'Online Enquiry :'}</Text>
            <Text style={{ fontSize: 16, color: '#000', marginTop: 0, marginLeft: 25, marginRight: 25, justifyContent: 'center' }}>{'Telephone : '}</Text>
            <Text style={{ fontSize: 16, color: '#000', marginTop: 0, marginLeft: 25, marginRight: 25, justifyContent: 'center' }}>{'Whatsapp : '}</Text>

            <View style={{ backgroundColor: 'grey', width, height: 1, marginTop: 20 }} />

            <Text style={{ fontSize: 16, color: '#000', marginTop: 20, marginLeft: 25, marginRight: 25, justifyContent: 'center', opacity: 0.6 }}>{'Offline Enquiry :'}</Text>
            <Text style={{ fontSize: 16, color: '#000', marginTop: 0, marginLeft: 25, marginRight: 25, justifyContent: 'center' }}>{'Telephone : '}</Text>
            <Text style={{ fontSize: 16, color: '#000', marginTop: 0, marginLeft: 25, marginRight: 25, justifyContent: 'center' }}>{'Whatsapp : '}</Text>

            <View style={{ backgroundColor: 'grey', width, height: 1, marginTop: 20 }} /> */}

            <Text style={{ fontSize: 16, color: '#000', marginTop: 20, marginLeft: 25, marginRight: 25, justifyContent: 'center', opacity: 0.4 }}>{'Website:'}</Text>
            <Text style={{ fontSize: 16, color: '#000', marginTop: 0, marginLeft: 25, marginRight: 25, justifyContent: 'center' }}>{'www.exambook.co'}</Text>
            <Text style={{ fontSize: 16, color: '#000', marginTop: 20, marginLeft: 25, marginRight: 25, justifyContent: 'center', opacity: 0.4 }}>{'Email:'}</Text>
            <Text style={{ fontSize: 16, color: '#000', marginTop: 0, marginLeft: 25, marginRight: 25, justifyContent: 'center' }}>{'exambookhelpdesk@gmail.com'}</Text>

            <View style={{ backgroundColor: 'grey', width, height: 1, marginTop: 20 }} />
        </View>
    )
}
export default Support;