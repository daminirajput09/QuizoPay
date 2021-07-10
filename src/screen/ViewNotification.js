import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Header from '../components/Header';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { WebView } from 'react-native-webview'
const windowWidth = Dimensions.get('window').width;

const ViewNotification = ({navigation, route}) => {

  const { item } = route.params;
  const [ data, setData ] = useState();

  useEffect(()=> {
    setData(item);
  },[item]);

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
    <View style={styles.mainContainer}>
    <Header headerText={'Notification'} onPress={() => navigation.goBack()} />

    <ScrollView style={{flex:1,marginTop: 10, paddingBottom: 20,width:'100%',backgroundColor: '#fff'}}>
          <View style={styles.listMainView}>
              <Text style={styles.ListHeadText}>
                {data && data.name}
              </Text>
                <View style={{width: '100%', justifyContent: 'center'}}>
                  <Text style={styles.ListText}>
                    {data && data.dateadded} 
                  </Text>
                  <WebView source={{ html: data && data.message }}
                      style={{ width: windowWidth - 60, height:30, alignSelf:'center',opacity: 0.99,minHeight: 1, marginTop:10 }}
                      renderLoading={ActivityIndicatorLoadingView} 
                      startInLoadingState={true}  
                      javaScriptEnabled={true}
                      domStorageEnabled={true} 
                      originWhitelist={["*"]}
                      allowFileAccessFromFileURLs
                      allowUniversalAccessFromFileURLs
                      startInLoadingState
                      mixedContentMode="compatibility"
                      ignoreSslError        
                  />
                  {/* <AutoHeightWebView
                        renderLoading={ActivityIndicatorLoadingView}
                        startInLoadingState={true}
                        style={{ width: windowWidth - 60, alignSelf:'center',opacity: 0.99,minHeight: 1, marginTop:10 }}
                        files={[{
                            href: 'cssfileaddress',
                            type: 'text/css',
                            rel: 'stylesheet'
                        }]}
                        customStyle={`
                        * {
                            font-family: 'Times New Roman';
                        }
                        table {
                            max-width: ${windowWidth - 60};
                            font-size: 10px;
                        }
                        img {
                            max-width: ${windowWidth - 60};
                        }`}
                        source={{ html: data && data.message }}
                    /> */}
                </View>
          </View>
    </ScrollView>

    </View>
  );
};

export default ViewNotification;

const styles = StyleSheet.create({
    mainContainer: {
        flex:1,
    },
    listMainView: {
        paddingHorizontal: 20,
        paddingTop: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        borderColor: '#D5D5D5',
        marginTop: 5,
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
        color: 'grey',
    },
});    