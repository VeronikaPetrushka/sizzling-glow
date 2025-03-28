import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ImageBackground, Animated, Modal } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, Text as SvgText, Image as SvgImage } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import Icons from "./Icons";

const { height, width } = Dimensions.get("window");

const bonuses = [1000, 250, 500, 250, 1000, 250, 500, 250];

const Bonus = () => {
    const navigation = useNavigation();
    const [balance, setBalance] = useState(0);
    const [winAmount, setWinAmount] = useState(null);
    const spinValue = useState(new Animated.Value(0))[0];
    const [modalVisible, setModalVisible] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isBonusAvailable, setIsBonusAvailable] = useState(true);
    
    useEffect(() => {
        const getBalance = async () => {
            try {
                const storedBalance = await AsyncStorage.getItem("balance");
                if (storedBalance !== null) {
                    setBalance(parseInt(storedBalance));
                }
            } catch (error) {
                console.error("Error retrieving balance", error);
            }
        };
        
        const checkTimer = async () => {
            try {
                const storedTimestamp = await AsyncStorage.getItem("bonusTimestamp");
                if (storedTimestamp) {
                    const elapsedTime = Date.now() - parseInt(storedTimestamp);
                    const remainingTime = 24 * 60 * 60 * 1000 - elapsedTime;

                    if (remainingTime > 0) {
                        setCountdown(remainingTime);
                        setIsBonusAvailable(false);
                    } else {
                        await AsyncStorage.removeItem("bonusTimestamp");
                        setIsBonusAvailable(true);
                    }
                } else {
                    setIsBonusAvailable(true);
                }
            } catch (error) {
                console.error("Error checking timer", error);
            }
        };

        getBalance();
        checkTimer();
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            const interval = setInterval(() => {
                setCountdown(prevTime => {
                    if (prevTime <= 1000) {
                        setIsBonusAvailable(true);
                        AsyncStorage.removeItem("bonusTimestamp");
                        clearInterval(interval);
                        return 0;
                    }
                    return prevTime - 1000;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [countdown]);

    const getWinAmount = (finalRotation) => {
        const index = Math.round((bonuses.length * (finalRotation % 360)) / 360) % bonuses.length;
        return bonuses[index];
    };

    const spinWheel = () => {
        if (!isBonusAvailable) return;

        const finalRotation = 360 * 3 + Math.floor(Math.random() * 360);

        Animated.timing(spinValue, {
            toValue: finalRotation,
            duration: 2000,
            useNativeDriver: true,
        }).start(async () => {
            const win = getWinAmount(finalRotation);
            setWinAmount(win);
            setModalVisible(true);

            const newBalance = balance + win;
            setBalance(newBalance);
            await AsyncStorage.setItem("balance", newBalance.toString());

            const newTimestamp = Date.now().toString();
            await AsyncStorage.setItem("bonusTimestamp", newTimestamp);
            setCountdown(24 * 60 * 60 * 1000);
            setIsBonusAvailable(false);
        });
    };

    const renderBonuses = () => {
        const radius = height * 0.11;
        const centerX = width / 2;
        const centerY = height * 0.22;
    
        return bonuses.map((bonus, index) => {
            const angle = (index / bonuses.length) * (2 * Math.PI);
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
    
            return (
                <React.Fragment key={index}>
                    <SvgText
                        x={x - 15}
                        y={y}
                        fill='#fff'
                        fontSize='16'
                        fontWeight='800'
                        textAnchor='middle'
                    >
                        {bonus}
                    </SvgText>
    
                    <SvgImage
                        x={x + 7}
                        y={y - 16}
                        width={20}
                        height={20}
                        href={require('../assets/icons/coin.png')}
                    />
                </React.Fragment>
            );
        });
    };

    const handleModalClose = () => {
        setModalVisible(false);
        navigation.goBack('');
    }

    return (
        <ImageBackground source={require('../assets/back/back.png')} style={{flex: 1}}>
            <View style={styles.container}>

                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <Icons type={'back'} />
                </TouchableOpacity>

                <View style={styles.balanceBtn}>
                    <Image source={require('../assets/decor/balance.png')} style={styles.btnImg} />
                    <View style={styles.balanceContainer}>
                        <Text style={styles.balanceBtnText}>Balance: {balance}</Text>
                        <View style={{width: 24, height: 24, marginLeft: 2}}>
                            <Icons type={'coin'} />
                        </View>
                    </View>
                </View>

                <Text style={styles.title}>Bonus Game</Text>
                <Text style={[styles.subTitle, {marginBottom: height > 700 ? height * 0.08 : 0}]}>{isBonusAvailable ? 'Bonus is active' : 'Bonus is inactive'}</Text>

                <Image source={require('../assets/decor/arrow.png')} style={styles.arrow} />

                <View style={[styles.wheel, {marginBottom: height > 700 ? 20 : 0}]}>
                    <Animated.View style={{ transform: [{ rotate: spinValue.interpolate({
                        inputRange: [0, 360],
                        outputRange: ["0deg", "360deg"],
                    }) }] }}>
                        <Image source={require('../assets/decor/wheel.png')} style={{width: '100%', height: '100%'}} />
                        <Svg style={{height: '100%', width: '100%', position: 'absolute', top: -10, left: height > 700 ? -20 : -42}}>
                            <Circle cx="50%" cy="50%" r={height * 0.15} fill="transparent" />
                            {renderBonuses()}
                        </Svg>
                    </Animated.View>
                </View>

                <TouchableOpacity style={[styles.btn, !isBonusAvailable && {opacity: 0.5}]} onPress={spinWheel} disabled={!isBonusAvailable}>
                    <Image source={require('../assets/decor/button.png')} style={styles.btnImg} />
                    <Text style={styles.btnText}>Get</Text>
                </TouchableOpacity>

                <Modal 
                    animationType="fade" 
                    transparent={true} 
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                    >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.btn} onPress={spinWheel}>
                            <Image source={require('../assets/decor/button.png')} style={styles.btnImg} />
                            <View style={[styles.balanceContainer, {top: 27}]}>
                                <Text style={[styles.balanceBtnText, {fontSize: 20}]}>You won +{winAmount}</Text>
                                <View style={{width: 24, height: 24, marginLeft: 2}}>
                                    <Icons type={'coin'} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={handleModalClose}>
                            <Image source={require('../assets/decor/button.png')} style={styles.btnImg} />
                            <Text style={styles.btnText}>Back to menu</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: height * 0.07,
        padding: 20
    },

    back: {
        width: 48,
        height: 63,
        position: 'absolute',
        top: height * 0.07,
        left: 16
    },

    balanceBtn: {
        width: 160,
        height: 70,
        marginBottom: 20
    },

    btnImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },

    balanceContainer: {
        position: 'absolute',
        alignSelf: 'center',
        top: 24,
        flexDirection: 'row',
        alignItems: 'center'
    },

    balanceBtnText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 22,
    },

    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 12
    },

    subTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 16,
        backgroundColor: '#8b0b00'
    },

    btn: {
        width: 240,
        height: 80,
        marginBottom: 20
    },

    arrow: {
        width: '100%',
        height: 150,
        zIndex: 10
    },
    wheel: {
        width: height * 0.4,
        height: height * 0.4,
        marginTop: height * -0.07,
    },

    btnText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        position: 'absolute',
        alignSelf: 'center',
        top: 24
    },

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
});

export default Bonus;
