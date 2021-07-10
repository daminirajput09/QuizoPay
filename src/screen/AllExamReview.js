import React, { useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'

const AllExamReview = ({ navigation }) => {
    
    const ActivityIndicatorLoadingView = () => {
        return (
     
          <ActivityIndicator
            color='#A9A9A9'
            size='large'
            style={{flex:1,width:'100%',height:'100%',alignItems: 'center',justifyContent: 'flex-start'}}
          />
        );
      }

    return (
        <View style={{ flex: 1 }}>
            <WebView source={{ uri: 'https://www.allexamreview.com/' }}
                style={{flex:1}}
                renderLoading={ActivityIndicatorLoadingView} 
                startInLoadingState={true}  
                javaScriptEnabled={true}
                domStorageEnabled={true}         
            />
        </View>
    )
}

export default AllExamReview