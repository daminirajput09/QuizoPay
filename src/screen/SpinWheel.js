import React from 'react';
import {
  StyleSheet,
  View,
  Text as RNText,
  Dimensions,
  Animated
} from 'react-native';
import {PanGestureHandler, State, TapGestureHandler, LongPressGestureHandler, PinchGestureHandler, TouchableOpacity} from 'react-native-gesture-handler';
import {Svg, Path, G, Text, TSpan, SvgUri, Image,ClipPath, Defs} from 'react-native-svg';

import * as d3Shape from 'd3-shape';
import color from 'randomcolor';
import { snap } from '@popmotion/popcorn';
import AppHeader from '../components/AppHeader';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// const { PanGestureHandler, State } = PanGestureHandler;
// const { Path, G, Text, TSpan } = Svg;
const { width } = Dimensions.get('screen');
const { height } = Dimensions.get('screen').height;

let randNumber = Math.floor(Math.random() * 1000) + 500;

const numberOfSegments = 10; // for pie sections
const wheelSize = width * 0.95;
const fontSize = 26;
const oneTurn = 360;
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment / 2;
const knobFill = color({ hue: 'purple' });

const valueArr = ['0','10','20','25','30','35','40','45','50','500'];
const bgColorArr = ['#eb4034', '#eb9526', '#44eb26', '#16999c', '#0c135e', '#742a91', '#cf42a4', '#b3152a', '#F66A6A', '#d3d3d3'];

const makeWheel = () => {
  const data = Array.from({ length: numberOfSegments }).fill(1);
  const arcs = d3Shape.pie()(data);

  // console.log('arcs len', data);

  const colors = color({
    luminosity: 'dark',
    count: numberOfSegments
  });

  return arcs.map((arc, index) => {
    const instance = d3Shape
      .arc()
      .padAngle(0.01)
      .outerRadius(width / 2)
      .innerRadius(20);

      
      // console.log('data of spin', index); //Math.round(Math.random() * 100 + 1) * 200);

    return {
      path: instance(arc),
      color: bgColorArr[index],//colors[index],
      value: valueArr[index],//Math.round(Math.random(100) * 1000),//Math.round(Math.random() * 10 + 1) * 200, //[200, 2200]
      centroid: instance.centroid(arc)
    };
  });
};

export default class SpinWheel extends React.Component {

  doubleTapRef = React.createRef();
  _wheelPaths = makeWheel();
  _angle = new Animated.Value(0);
  angle = 0;

  state = {
    enabled: true,
    finished: false,
    winner: null,
    YAngle: null
  };

  componentDidMount() {
    this._angle.addListener(event => {
      // if(this.state.YAngle == event.value){
        if (this.state.enabled) {
          this.setState({
            enabled: false,
            finished: false
          });
        }

        this.angle = event.value;
      // }
      // console.log('YAngle is',this.state.YAngle);
      if(randNumber == event.value){
        // {(i * oneTurn) / numberOfSegments + angleOffset}
        this.angle = randNumber;
      }
      // console.log('this.angle',this.angle, randNumber);
    });
  }

  _getWinnerIndex = () => {
    const deg = Math.abs(Math.round(this.angle % oneTurn));

    // console.log('winner index',deg, angleBySegment, deg/angleBySegment);
    // console.log('angle', this.angle);
    
    //console.log('deg is ', deg);
    //console.log('winner index is ', (1 * oneTurn) / numberOfSegments + angleOffset);

    return Math.floor(deg / angleBySegment);
  };

  _onPan = ({ nativeEvent }) => {

    // console.log('native event', nativeEvent);
    // if (nativeEvent.state === 5){ //State.END) {
      // const { velocityY } = nativeEvent;

      const velocityY = randNumber; //950.449462890625;
      // console.log('velocityY', velocityY, randNumber);

      Animated.decay(this._angle, {
        velocity: velocityY / 1000,
        deceleration: 0.999,
        useNativeDriver: true
      }).start(() => {
        this._angle.setValue(this.angle % oneTurn);
        const snapTo = snap(oneTurn / numberOfSegments);
        Animated.timing(this._angle, {
          toValue: snapTo(this.angle),
          duration: 300,
          useNativeDriver: true
        }).start(() => {
          const winnerIndex = this._getWinnerIndex();
          this.setState({
            enabled: true,
            finished: true,
            winner: this._wheelPaths[winnerIndex].value
          });

          // console.log('wheel path', this._wheelPaths);
          // {(i * oneTurn) / numberOfSegments + angleOffset}

        //   console.log('winner index value',this._wheelPaths[0]);
        });
        // do something here;
      });
    // }
  };
  render() {
    return (
        <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}>
        <AppHeader Header={'Spin & Wheel'} onPress={() => this.props.navigation.goBack()} />

        <View style={styles.container}>
          {this._renderSvgWheel()}
        </View>

        <PanGestureHandler
            onHandlerStateChange={this._onPan}
            enabled={this.state.enabled}>
            <View style={{backgroundColor:'#fff',width:80,height:80,borderWidth:0,justifyContent:'center',alignItems:'center',borderRadius:50,
              position:'relative', bottom: width/1.7,
              zIndex:10
            }}>
              <RNText style={{fontSize:fontSize,color:'#000'}}>Spin</RNText>
            </View>
          </PanGestureHandler>
          {this.state.finished && this.state.enabled && this._renderWinner()}

      </View>
    );
  }

  _renderKnob = () => {
    const knobSize = 30;
    // [0, numberOfSegments]
    const YOLO = Animated.modulo(
      Animated.divide(
        Animated.modulo(Animated.subtract(this._angle, angleOffset), oneTurn),
        new Animated.Value(angleBySegment)
      ),
      1
    );

    return (
      <Animated.View
        style={{
          width: knobSize,
          height: knobSize * 2,
          justifyContent: 'flex-end',
          zIndex: 1,
          transform: [
            {
              rotate: YOLO.interpolate({
                inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                outputRange: ['0deg', '0deg', '35deg', '-35deg', '0deg', '0deg']
              })
            }
          ]
        }}
      >
        <Svg
          width={knobSize}
          height={(knobSize * 100) / 57}
          viewBox={`0 0 57 100`}
          style={{ transform: [{ translateY: 8 }] }}
        >
          <Path
            d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
            fill={knobFill}
          />
        </Svg>
      </Animated.View>
    );
  };

  _renderWinner = () => {
    return (
      <RNText style={styles.winnerText}>Winner is: {this.state.winner}</RNText>
    );
  };

  handleLayoutChange() {
    this.feedPost.measure( (fx, fy, width, height, px, py) => {
      //console.log('Component width is: ' + width)
      //console.log('Component height is: ' + height)
      //console.log('X offset to page: ' + px)
      //console.log('Y offset to page: ' + py)
      this.setState({ YAngle: py });
    })
  }


  _renderSvgWheel = () => {
    return (
      <View style={styles.container}>
        {this._renderKnob()}
        <Animated.View
          ref={view => { this.feedPost = view; }}
          onLayout={(event) => {this.handleLayoutChange(event) }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transform: [
              {
                rotate: this._angle.interpolate({
                  inputRange: [-oneTurn, 0, oneTurn],
                  outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`]
                })
              }
            ]
          }}
        >

          <Svg
            width={wheelSize}
            height={wheelSize}
            viewBox={`0 0 ${width} ${width}`}
            style={{ transform: [{ rotate: `-${angleOffset}deg` }] }}
          >
            <G y={width / 2} x={width / 2}>
              {this._wheelPaths.map((arc, i) => {
                const [x, y] = arc.centroid;
                const number = arc.value.toString();

                return (
                  <G key={`arc-${i}`}>
                    
                    <Path d={arc.path} fill={arc.color} />
                    
                    <G
                      rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                      origin={`${x}, ${y}`}
                    >
                      <Text
                        x={x}
                        y={y - 70}
                        fill="white"
                        textAnchor="middle"
                        fontSize={fontSize}
                      >
                        {Array.from({ length: number.length }).map((_, j) => {
                          // console.log('i and j', i,j);
                          return (
                            <TSpan
                              x={x}
                              dy={fontSize}
                              key={`arc-${i}-slice-${j}`}
                            >
                              {valueArr[i][j]} 
                            </TSpan> // render inner number values  {number.charAt(j)} 
                          );
                        })}
                      </Text>
                    </G>
                  </G>
                );
              })}
            </G>

          </Svg>
        </Animated.View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  winnerText: {
    fontSize: 32,
    fontFamily: 'Menlo',
    position: 'absolute',
    bottom: 10
  }
});

