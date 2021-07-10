import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Button,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import WheelOfFortune from '../../node_modules/react-native-wheel-of-fortune';//'react-native-wheel-of-fortune';
import AppHeader from '../components/AppHeader';
import Modal from 'react-native-modalbox';
import LottieView from 'lottie-react-native';

const windowHeight = Dimensions.get('window').height;

const participants = [
    '0',
    '10',
    '20',
    '30',
    '40',
    '50',
    '60',
    '70',
    '80',
    'FREE',
];

class SpinWin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winnerValue: null,
      winnerIndex: null,
      started: false,
      filterShow: false
    };
    this.child = null;
  }

  buttonPress = () => {
    this.setState({
      started: true,
    });
    this.child._onPress();
  };

  render() {
    const wheelOptions = {
      rewards: participants,
      knobSize: 40,
      borderWidth: 5,
      borderColor: '#d3d3d3',
      innerRadius: 30,
      duration: 6000,
      backgroundColor: '#fff',//'transparent',
      textAngle: 'horizontal',
      knobSource: 'burn', // require('../../assets/arrow.jpg'),
      onRef: ref => (this.child = ref),
    };
    return (
      <View style={styles.container}>

        <StatusBar barStyle={'light-content'} />
        <AppHeader Header={'Spin & Wheel'} onPress={() => this.props.navigation.goBack()} />

        <WheelOfFortune
          options={wheelOptions}
          getWinner={(value, index) => {
            this.setState({winnerValue: value, winnerIndex: index, filterShow: true});
          }}
        />
        {!this.state.started && (
          <View style={styles.startButtonView}>
            <TouchableOpacity
              onPress={() => this.buttonPress()}
              style={styles.startButton}>
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        )}
        {this.state.winnerIndex != null && (
          <View style={styles.winnerView}>
            <Text style={styles.winnerText}>
              You win {participants[this.state.winnerIndex]}
            </Text>
            {/* <TouchableOpacity
              onPress={() => {
                this.setState({winnerIndex: null});
                this.child._tryAgain();
              }}
              style={styles.tryAgainButton}>
              <Text style={styles.tryAgainText}>TRY AGAIN</Text>
            </TouchableOpacity> */}
          </View>
        )}

        <Modal
            style={{width: '80%', height: 120,borderRadius:10,backgroundColor:'transparent',justifyContent:'center',alignItems:'center'}}
            swipeToClose={true}
            swipeArea={10}
            swipeThreshold={50}
            isOpen={this.state.filterShow}
            backdropOpacity={0.5}
            entry={'top'}
            backdropPressToClose={true}
            position={'center'}
            backdropColor={'#000'}
            coverScreen={true}>
            <View>
                
                <LottieView
                  source={require('../../assets/splash/celebration.json')}
                  autoPlay
                  loop={true}
                  style={{ height: '100%', width: '100%', alignSelf: 'center',zIndex:1 }}
                />  
                {/* <LottieView
                  source={require('../../assets/splash/fireworks.json')}
                  autoPlay
                  loop={true}
                  style={{ height: '100%', width: '100%', alignSelf: 'center',zIndex:1 }}
                /> */}
                
                <View style={{backgroundColor:'#fff',bottom:300}}>
                  <LottieView
                    source={require('../../assets/splash/victory.json')}
                    autoPlay={true}
                    loop={true}
                    style={{ height: '100%', width: '100%', alignSelf: 'center' }}
                  />
                   <Text style={{fontSize:25, color:'#000',textAlign:'center',zIndex:10,top:-90,fontFamily:'GilroyMedium'}}>Congratulations</Text>
                   <Text style={{fontSize:20, color:'#000',textAlign:'center',zIndex:10,top:-90,fontFamily:'SofiaProRegular'}}>
                     You Win {participants[this.state.winnerIndex]} 
                   </Text>
                </View>            

            </View>
        </Modal>

      </View>
    );
  }
}
export default SpinWin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  startButtonView: {
    position: 'absolute',
  },
  startButton: {
    backgroundColor: 'rgba(0,0,0,.5)',
    marginTop: 120,
    padding: 5,
    backgroundColor: '#fff',
    width: 100,
    height: 100,
    borderRadius:100,
    justifyContent:'center',
    alignItems:'center'
  },
  startButtonText: {
    fontSize: 25,
    color: '#000',
    fontWeight: 'bold',
  },
  winnerView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 50
  },
  tryAgainButton: {
    padding: 10,
  },
  winnerText: {
    fontSize: 30,
  },
  tryAgainButton: {
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  tryAgainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});