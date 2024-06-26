import React, { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, KeyboardAvoidingView, PanResponder, Text } from 'react-native';
import useErrorManager from '../context/errorManager';
import { palette, styles } from '../helper';

const DismissableError = () => {
    const translateX = useRef(new Animated.Value(-500)).current;
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const errorManager = useErrorManager();

    const slideIn = () => {
        Animated.timing(translateX, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start();
    };

    const slideOut = (direction = 1) => {
        Animated.timing(translateX, {
            toValue: direction * 500,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            errorManager.setError(null);
        });
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: translateX }], { useNativeDriver: false }),
            onPanResponderRelease: (e, gestureState) => {
                if (Math.abs(gestureState.dx) > 50) {
                    slideOut(gestureState.dx > 0 ? 1 : -1);
                } else {
                    Animated.spring(translateX, {
                        toValue: 0,
                        friction: 5,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const animatedStyle = {
        ...styles.positionAbsolute,
        ...styles.br16,
        ...styles.p16,
        position: 'absolute',
        bottom: keyboardHeight ? keyboardHeight + 20 : 55, // Adjust based on keyboard height
        marginHorizontal: '5%',
        width: '90%',
        height: 96,
        backgroundColor: palette.red,
        transform: [{ translateX: translateX }],
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (errorManager.error) {
            slideIn(); // Slide in if there's an error
        }
    }, [errorManager.error]); // React to changes in error

    useEffect(() => {
        const _id = setTimeout(() => {
            if (errorManager.error) {
                slideOut(); // Slide out after 5 seconds if there's an error
            }
        }, 5000);

        return () => clearTimeout(_id);
    }, [errorManager.error]); // React to changes in error

    return (
        <>
            {errorManager.error && (
                <Animated.View {...panResponder.panHandlers} style={animatedStyle}>
                    <Text style={[styles.boldText, styles.font14, styles.white]}>Error</Text>
                    <Text style={[styles.text, styles.font14, styles.white]}>{errorManager.error}</Text>
                </Animated.View>
            )}
        </>
    );
};

export default DismissableError;
