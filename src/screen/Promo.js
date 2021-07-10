import React from 'react';
import { View, StatusBar } from 'react-native';
import Header from '../components/Header'

const Promo = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#F9F5F2' }}>
            <Header headerText={'Promo'} onPress={() => navigation.goBack()} />
        </View>
    )
}
export default Promo;