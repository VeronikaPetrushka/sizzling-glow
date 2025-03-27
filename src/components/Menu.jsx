import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ImageBackground } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import SettingsModal from "./SettingsModal";
import Icons from "./Icons";

const { height } = Dimensions.get("window");

const Menu = () => {
    const navigation = useNavigation();
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [balance, setBalance] = useState(0);
    const [countdown, setCountdown] = useState(0);
    const [isBonusAvailable, setIsBonusAvailable] = useState(true);

    useFocusEffect(
        useCallback(() => {
            getBalance();
            checkBonusTimer();
        }, [getBalance, checkBonusTimer])
    );

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

    const checkBonusTimer = async () => {
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

    const formatTime = (time) => {
        const hours = Math.floor(time / (1000 * 60 * 60)).toString().padStart(2, '0');
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const seconds = Math.floor((time % (1000 * 60)) / 1000).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <ImageBackground source={require('../assets/back/back.png')} style={{flex: 1}}>
            <View style={styles.container}>

                <View style={styles.row}>
                    <View style={styles.balanceBtn}>
                        <Image source={require('../assets/decor/balance.png')} style={styles.btnImg} />
                        <View style={styles.balanceContainer}>
                            <Text style={styles.balanceBtnText}>Balance: {balance}</Text>
                            <View style={{width: 24, height: 24, marginLeft: 2}}>
                                <Icons type={'coin'} />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => setSettingsVisible(true)}>
                        <Image source={require('../assets/decor/settings.png')} style={{width: 63, height: 63, resizeMode: 'contain'}} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('SlotsScreen')}>
                    <Image source={require('../assets/decor/button.png')} style={styles.btnImg} />
                    <Text style={styles.btnText}>Play</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('AboutScreen')}>
                    <Image source={require('../assets/decor/button.png')} style={styles.btnImg} />
                    <Text style={styles.btnText}>About</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.btn, !isBonusAvailable && {opacity: 0.5}]} 
                    onPress={() => navigation.navigate('BonusScreen')} 
                    disabled={!isBonusAvailable}
                >
                    <Image source={require('../assets/decor/button.png')} style={styles.btnImg} />
                    <Text style={styles.btnText}>Bonus</Text>
                </TouchableOpacity>

                <Text style={styles.timer}>{isBonusAvailable ? 'Bonus is active' : `${formatTime(countdown)}`}</Text>

                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ShopScreen')}>
                    <Image source={require('../assets/decor/button.png')} style={styles.btnImg} />
                    <Text style={styles.btnText}>Shop</Text>
                </TouchableOpacity>

                <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />

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

    row: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: height * 0.15
    },

    balanceBtn: {
        width: 160,
        height: 70
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

    btn: {
        width: 240,
        height: 80,
        marginBottom: 20
    },

    btnText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        position: 'absolute',
        alignSelf: 'center',
        top: 24
    },

    timer: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 20,
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 16,
        backgroundColor: '#8b0b00'
    }
    
});

export default Menu;
