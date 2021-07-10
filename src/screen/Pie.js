import React, {Component} from 'react';
import SVG, {G, Svg, Path,Image, Defs, ClipPath} from 'react-native-svg';
import { Text, View, Button, Animated, StyleSheet,Easing } from 'react-native'
import Slice from "./pieShape";

let num = Math.floor(Math.random() * 10) + 1;
//console.log('random number',num);

const AnimatedSlice = Animated.createAnimatedComponent(Slice);
const demoData = [
    {
        number: 10,
        color: '#eb4034',
        value: 'first'
    },
    {
        number: 10,
        color: '#eb9526',
        value: 'second'
    },
    {
        number: 10,
        color: '#44eb26',
        value: 'first'
    },
    {
        number: 10,
        color: '#16999c',
        value: 'first'
    },
    {
        number: 10,
        color: '#0c135e',
        value: 'first'
    },
    {
        number: 10,
        color: '#742a91',
        value: 'first'
    },{
        number: 10,
        color: '#cf42a4',
        value: 'first'
    },
    {
        number: 10,
        color: '#b3152a',
        value: 'first'
    },
    {
        number: 10,
        color: '#F66A6A',
        value: 'first'
    },
    {
        number: 10,
        color: '#d3d3d3',
        value: 'first'
    }
];
export default class Pie extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animValue: new Animated.Value(2),
            animation: new Animated.Value(0),
        };

    }

    click = ()=> {
        this.state.animation.setValue(0);

        Animated.loop(
            Animated.sequence([
            //   Animated.delay(1000),
              Animated.timing(this.state.animation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
              })
            ]),
            {
              iterations: 5 // Number of repetitions
            }
          ).start()
          

        // const timer = setTimeout(() => {
            // clearTimeout(timer);
            
            // Animated.loop(
            //     Animated.timing(
            //         this.state.animation,
            //         { toValue: 1, duration: 500, useNativeDriver: true}
            //     )
            // ).start()

        // }, 10);
    }

    stop = () => {
        Animated.decay(this.state.animation, {
            // coast to a stop
            // velocity: { x: gestureState.vx, y: gestureState.vy }, // velocity from gesture release
            deceleration: 0.997
        }).stop()
        // this.setState({ animation: new Animated.Value(0) })

    }

    render() {
        
        let endAngle = Animated.multiply(this.state.animValue, Math.PI);

        return (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>

                <Svg
                    width={100}
                    height={100}
                    viewBox={`-120 -100 180 200`}
                >
                    <Path
                        d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
                        fill={'pink'}
                    />
                    {/* <Image
                        x="5%"
                        y="5%"
                        width="50%"
                        height="90%"
                        preserveAspectRatio="xMidYMid slice"
                        opacity="0.5"
                        href={require('../../assets/splash/AppBg.jpg')}
                        clipPath="url(#clip)"
                    /> */}
                </Svg>

                <Animated.View
                    style={{
                        transform: [{
                            rotate: this.state.animation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '360deg'],
                                        extrapolate: 'clamp'
                                    })
                                },
                                { perspective: 1000 }]
                }}>
                <Svg
                    width={300}
                    height={300}
                    viewBox={`-100 -100 200 200`}
                >                     
                    <G>
                        {
                            demoData.map( (item, index) => {
                                return (
                                    <>
                                      <AnimatedSlice
                                        index={index}
                                        endAngle={endAngle}
                                        color={item.color}
                                        data={demoData}
                                        value={item.value}
                                        key={'pie_shape_' + index}
                                      />
                                      <Svg>
                                        <Defs>
                                            <ClipPath id="hexagon" clipRule="evenodd">
                                            <AnimatedSlice
                                                index={index}
                                                endAngle={endAngle}
                                                color={item.color}
                                                data={demoData}
                                                value={item.value}
                                                key={'pie_shape_' + index}
                                            />
                                            </ClipPath>
                                        </Defs>
                                        <Image
                                            // x="0"
                                            // y="0"
                                            // width="200"
                                            // height="200"
                                            href={require('../../assets/splash/AppBg.jpg')}
                                            clipPath="#hexagon"
                                        />
                                    </Svg>
                                      {/* <Text     
                                        // transform={{ translate: d3.shape.pie(value) }}
                                      >
                                        {item.value}
                                    </Text> */}
                                    </>
                                )
                            })
                        }
                    </G>


                </Svg>
                </Animated.View>

                <View style={{marginTop: 20}}>
                    <Button title="Start" onPress={this.click}/>
                    <Button title="End" onPress={()=> this.setState({ animation: new Animated.Value(0) })}/>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({

});