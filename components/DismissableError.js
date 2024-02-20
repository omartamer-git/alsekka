import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import { palette, styles } from '../helper';
import useErrorManager from '../context/errorManager';
import { SlideInLeft, SlideOutLeft } from 'react-native-reanimated';

const DismissableError = () => {
    // Initial state for the horizontal translation
    const translateX = useRef(new Animated.Value(-500)).current;
    const errorManager = useErrorManager();

    // Slide In Animation
    const slideIn = () => {
        Animated.timing(translateX, {
            toValue: 0, // Slide to original position
            duration: 400,
            useNativeDriver: true,
        }).start();
    };

    // Slide Out Animation
    const slideOut = (direction = 1) => {
        Animated.timing(translateX, {
            toValue: direction * 500, // Slide out of screen
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            errorManager.setError(null); // After sliding out, dismiss the error
        });
    };


    // Setup PanResponder
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: translateX }], { useNativeDriver: false }),
            onPanResponderRelease: (e, gestureState) => {
                // Determine if the view should be dismissed
                if (Math.abs(gestureState.dx) > 50) { // Threshold to decide if the gesture is a dismiss
                    Animated.timing(translateX, {
                        toValue: gestureState.dx > 0 ? 500 : -500, // Move out of screen based on direction
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        slideOut();
                        // Optional: reset state or call a callback after dismissal
                    });
                } else {
                    // Return the view back to its original position if not dismissed
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    // Style that includes the animated translation
    const animatedStyle = {
        ...styles.positionAbsolute,
        ...styles.br16,
        ...styles.p16,
        position: 'absolute',
        bottom: 0,
        marginBottom: 55,
        marginHorizontal: '5%',
        width: '90%',
        height: 96,
        backgroundColor: palette.red,
        transform: [{ translateX: translateX }],
    };

    useEffect(() => {
        slideIn(); // Slide in when component mounts

        const _id = setTimeout(() => {
            slideOut(); // Slide out after 5 seconds
        }, 5000);

        return () => {
            clearTimeout(_id);
            // Consider adding a cleanup animation if needed
        };
    }, []);

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={animatedStyle}>
            <Text style={[styles.text, styles.bold, styles.font14, styles.white]}>Error</Text>
            <Text style={[styles.text, styles.bold, styles.font14, styles.white]}>{errorManager.error}</Text>
        </Animated.View>
    );
};

export default DismissableError;