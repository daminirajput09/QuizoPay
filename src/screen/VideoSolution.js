import React from 'react'
import { View, TouchableOpacity, StatusBar, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Entypo';

const VideoSolution = ({ navigation, route }) => {
    const item = route.params

    return (
        <View style={{ flex: 1, backgroundColor: '#f4fbfe' }}>
            <StatusBar backgroundColor={'#f4fbfe'} barStyle={'dark-content'} />
            <View style={{ height: hp(28), marginTop: Platform.OS === 'ios' ? 35 : 1 }}>
                <WebView scalesPageToFit={false} allowsFullscreenVideo source={{ html: `<iframe width="100%" height="100%" src=${item} frameborder="0" allow="autoplay; encrypted-media" allowfullscreen="allowfullscreen"></iframe>` }} />
            </View>
            <TouchableOpacity style={{
                marginLeft: 10,
                marginTop: Platform.OS === 'ios' ? 35 : 1,
                position: 'absolute',
            }}
                onPress={() => navigation.goBack()}>
                <Icon name="chevron-left" size={35} color="#fff" style={{ marginVertical: 7 }} />
            </TouchableOpacity>
        </View>
    )
}
export default VideoSolution