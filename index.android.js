/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ART,
  Animated,
  TouchableOpacity,
} from 'react-native';

const { Shape, Group, Surface } = ART;

const AnimatedShape = Animated.createAnimatedComponent(Shape);
const AnimatedGroup = Animated.createAnimatedComponent(Group);

/** Width of the square container to render `heart` within **/
const CONTAINER_WIDTH = 50;

/**
 * Scale factor (how much `heart` should be smaller.)
 * The value in the animation should be smaller or equal than this
 * value to prevent overflow
 */
const HEART_SCALE_FACTOR = 1.5;

/**
 * Slightly smaller then the scale factor to prevent overflow
 */
const ACTIVE_ANIMATION_HEART_SCALE_FACTOR = 1.45;
const INACTIVE_ANIMATION_HEART_SCALE_FACTOR = 0.85;

/**
 * Stroke width of the heart
 */
const HEART_STROKE_WIDTH = 10;

/**
 * Real width of the heart to be rendered in the initial phase
 */
const HEART_WIDTH = CONTAINER_WIDTH / HEART_SCALE_FACTOR;

/**
 * Original width of the heard as defined by the `HEART_SVG`. This value often
 * varies as the SVG drawing has been borrowed from the Internet. It is used by the
 * `Group` container to downscale it to match HEART_WIDTH.
 */
const REAL_HEART_WIDTH = 200;

/**
 * SVG path that describes the heart itself
 */
const HEART_SVG = 'M130.4-0.8c25.4 0 46 20.6 46 46.1 0 13.1-5.5 24.9-14.2 33.3L88 '
  + '153.6 12.5 77.3c-7.9-8.3-12.8-19.6-12.8-31.9 0-25.5 20.6-46.1 46-46.2 19.1 0 '
  + '35.5 11.7 42.4 28.4C94.9 11 111.3-0.8 130.4-0.8';

/**
 * Animation speed
 */
const ANIMATION_SPEED = 400;

/**
 * The animation itself is defined as 60 frames. That means, first 30 frames
 * can be interpolated to describe transition from inactive to active state
 * whereas the subsequent 30 frames can be used for the active to inactive
 * transition
 */
const ACTIVE_ANIMATION_START = 0;
const ACTIVE_ANIMATION_END = 30;
const INACTIVE_ANIMATION_END = 60;

export default class animatecrash extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animation: new Animated.Value(ACTIVE_ANIMATION_START),
      active: false,
    };
  }

  onPress: Function = () => {
    const active = !this.state.active;

    this.setState({
      active: active,
      animation: new Animated.Value(active
        ? ACTIVE_ANIMATION_START
        : ACTIVE_ANIMATION_END
      ),
    }, () => {
      if (active) {
        this.animateToActive();
      } else {
        this.animateToInactive();
      }
    });
  };

  animateToActive: Function = () => {
    Animated
      .timing(this.state.animation, {
        duration: ANIMATION_SPEED,
        fromValue: ACTIVE_ANIMATION_START,
        toValue: ACTIVE_ANIMATION_END,
      })
      .start();
  };

  animateToInactive: Function = () => {
    Animated
      .timing(this.state.animation, {
        duration: ANIMATION_SPEED,
        fromValue: ACTIVE_ANIMATION_END,
        toValue: INACTIVE_ANIMATION_END,
      })
      .start();
  };

  getPaddingForScaleFactor = (scale: number) =>
    (CONTAINER_WIDTH - HEART_WIDTH) / HEART_SCALE_FACTOR / scale;

  getAnimationStyle: Function = () => ({
    scale: this.state.animation.interpolate({
      inputRange: [ACTIVE_ANIMATION_START, 10, ACTIVE_ANIMATION_END, 45, INACTIVE_ANIMATION_END],
      outputRange: [1, ACTIVE_ANIMATION_HEART_SCALE_FACTOR, 1,
        INACTIVE_ANIMATION_HEART_SCALE_FACTOR, 1],
    }),
    xy: this.state.animation.interpolate({
      inputRange: [ACTIVE_ANIMATION_START, 10, ACTIVE_ANIMATION_END, 45, INACTIVE_ANIMATION_END],
      outputRange: [
        this.getPaddingForScaleFactor(1),
        this.getPaddingForScaleFactor(ACTIVE_ANIMATION_HEART_SCALE_FACTOR),
        this.getPaddingForScaleFactor(1),
        this.getPaddingForScaleFactor(INACTIVE_ANIMATION_HEART_SCALE_FACTOR),
        this.getPaddingForScaleFactor(1),
      ],
    }),
    fill: this.state.animation.interpolate({
      inputRange: [ACTIVE_ANIMATION_START, 14, ACTIVE_ANIMATION_END, 45],
      outputRange: [
        'rgba(255, 255, 255, 0)',
        'rgba(228, 104, 124, 1)',
        'rgba(228, 104, 124, 1)',
        'rgba(255, 255, 255, 0)',
      ],
      extrapolate: 'clamp',
    }),
    stroke: this.state.animation.interpolate({
      inputRange: [ACTIVE_ANIMATION_START, 14, ACTIVE_ANIMATION_END, 45],
      outputRange: [
        'rgba(212, 212, 212, 1)',
        'rgba(228, 104, 124, 1)',
        'rgba(228, 104, 124, 1)',
        'rgba(212, 212, 212, 1)',
      ],
      extrapolate: 'clamp',
    }),
    opacity: this.state.animation.interpolate({
      inputRange: [ACTIVE_ANIMATION_START, 14, ACTIVE_ANIMATION_END, 45],
      outputRange: [0, 0, 1, 0],
      extrapolate: 'clamp',
    }),
  });

  render() {
    const animation = this.getAnimationStyle();

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Tap the heart over and over to crash!
        </Text>
        <TouchableOpacity onPress={this.onPress}>
          <Surface
            style={{ backgroundColor: 'transparent' }}
            height={CONTAINER_WIDTH}
            width={CONTAINER_WIDTH}
          >
            <AnimatedGroup
              x={animation.xy}
              y={animation.xy}
              scale={HEART_WIDTH / REAL_HEART_WIDTH}
            >
              <AnimatedShape
                stroke={animation.stroke}
                strokeWidth={HEART_STROKE_WIDTH}
                fill={animation.fill}
                d={HEART_SVG}
                scale={animation.scale}
              />
            </AnimatedGroup>
          </Surface>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('animatecrash', () => animatecrash);
