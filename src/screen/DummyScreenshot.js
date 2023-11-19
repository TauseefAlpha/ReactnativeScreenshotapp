import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  PanResponder,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

const Screenshot = () => {
  const ref = useRef();
  const [capturedImage, setCapturedImage] = useState(null);
  const [circleComplete, setCircleComplete] = useState(false);
  const pathRef = useRef([]);

  const isCompleteCircle = path => {
    const MIN_POINTS_FOR_CIRCLE = 20;
    if (path && path.length >= MIN_POINTS_FOR_CIRCLE) {
      const firstPoint = path[0];
      const lastPoint = path[path.length - 1];

      const distance = Math.sqrt(
        Math.pow(lastPoint.moveX - firstPoint.moveX, 2) +
          Math.pow(lastPoint.moveY - firstPoint.moveY, 2),
      );

      console.log('Distance:', distance);

      const threshold = 20;
      const minThreshold = 10;
      const maxThreshold = 30;

      if (distance >= minThreshold && distance <= maxThreshold) {
        console.log('Circle detected!');
        return true;
      }
    }

    console.log('Not a complete circle.');
    return false;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const {moveX, moveY} = gestureState;
        const pathPoint = {moveX, moveY};
        pathRef.current = [...pathRef.current, pathPoint];
      },
      onPanResponderRelease: async (event, gestureState) => {
        // Check if the drawn path forms a complete circle
        const isCircle = isCompleteCircle(pathRef.current);

        if (isCircle) {
          try {
            const uri = await ref.current.capture();
            console.log('Screenshot taken:', uri);
            setCapturedImage(uri);
            setCircleComplete(true); // Set the circle as complete
          } catch (error) {
            console.error('Error capturing image:', error);
          }
        } else {
          Alert.alert(
            'Please draw a complete circle before capturing a screenshot.',
          );
          setCircleComplete(false); // Reset the circle completion state
        }
        pathRef.current = [];
      },
    }),
  ).current;

  const handleShare = () => {
    if (capturedImage) {
      const options = {
        url: capturedImage,
        message: 'Use This screenshot image',
      };

      Share.open(options)
        .then(res => {
          console.log(res);
          setCapturedImage(null);
        })
        .catch(err => {
          err && console.log(err);
        });
    } else {
      Alert.alert('Please draw a circle and capture a screenshot first.');
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ViewShot
          style={{width: 300, height: 300}}
          ref={ref}
          options={{fileName: 'dummy image', format: 'jpg', quality: 0.9}}>
          <View style={styles.circle} {...panResponder.panHandlers}>
            <Text style={{color: 'white', fontSize: 18}}>
              Draw circle on me for Screenshot
            </Text>
          </View>
        </ViewShot>
        {capturedImage && (
          <TouchableOpacity
            style={[styles.btnstyle, {backgroundColor: 'green'}]}
            onPress={handleShare}>
            <Text style={{color: 'white', textAlign: 'center'}}>
              Share Screenshot
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  circle: {
    marginHorizontal: 'auto',
    marginVertical: 'auto',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnstyle: {
    backgroundColor: '#0E1B41',
    color: 'white',
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 14,
  },
});

export default Screenshot;
