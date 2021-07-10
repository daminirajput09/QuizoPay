import React, {Component} from 'react';
import {Path, G, TSpan, Svg, Defs,ClipPath,Circle, Ellipse, Rect, Polygon, Image, SVGText} from 'react-native-svg';
import * as shape from 'd3-shape';
const d3 = {shape};
import { Text, View, Button, Animated, StyleSheet,Easing } from 'react-native'

export default class pieShape extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.arcGenerator = d3.shape.arc()
            .outerRadius(100)
            .padAngle(0)
            .innerRadius(0);
    }

    createPieArc = (index, endAngle, data) => {

        const arcs = d3.shape.pie()
            .value((item)=>item.number)
            .startAngle(0)
            .endAngle(endAngle)
            (data);

        let arcData = arcs[index];

        return this.arcGenerator(arcData);
    };


    render() {

        const {
            endAngle,
            color,
            index,
            data,
            value
        } = this.props;
        let val = data[index].number;

        return (
            <>
                {/* <Path
                    d={this.createPieArc(index, endAngle, data)}
                    fill={color}
                />
                <Text style={{left:30,padding:20}} transform={{ translate: d3.shape.pie(value) }}>
                    {value}
                </Text> */}

                {/* <Svg width="100%" height="100%">
                    <Path d={this.createPieArc(index, endAngle, data)} fill={color} /> */}
                    {/* <Text transform={{ translate:  d3.shape.pie(value) }}>{value}</Text> */}
                    {/* <Text
                        x="50"
                        y="16"
                        fill="red"
                        fontSize="16"
                        fontWeight="bold"
                        textAnchor="middle">
                        100
                    </Text>
                </Svg> */}

                <Svg>
                    <Defs>
                        <ClipPath id="hexagon" clipRule="evenodd">
                            <Path d={this.createPieArc(index, endAngle, data)} />
                            {/* <Text
                                x="50"
                                y="16"
                                fill="red"
                                fontSize="16"
                                fontWeight="bold"
                                textAnchor="middle">
                                100
                            </Text> */}
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
                
                {/* <Svg width="100%" height="100%" viewBox="0 0 100 20">
                <Path d={this.createPieArc(index, endAngle, data)} fill={color} />
                <Text
                    x="50"
                    y="16"
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle">
                    100
                </Text>
                </Svg> */}

            </>
        )

    }
}
