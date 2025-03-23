import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ImageBackground, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import backgrounds from "../constants/backgrounds";
import Icons from "./Icons";

const { height } = Dimensions.get("window");

const Menu = () => {
    const navigation = useNavigation();
    const [balance, setBalance] = useState(0);
    const [unlockedBacks, setUnlockedBacks] = useState([]);
    const [currentBack, setCurrentBack] = useState(backgrounds[0])

    useEffect(() => {
        loadUnlockedBacks();
        loadCurrentBack();
    }, []);
    
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
        
        getBalance();
    }, []);

    const loadUnlockedBacks = async () => {
        const storedBacks = await AsyncStorage.getItem("unlockedBacks");
        if (storedBacks !== null) {
            const parsedBacks = JSON.parse(storedBacks);
            if (!parsedBacks.find(skin => skin.name === backgrounds[0].name)) {
                parsedBacks.push({ ...backgrounds[0], unlocked: true });
                await AsyncStorage.setItem("unlockedBacks", JSON.stringify(parsedBacks));
            }
            setUnlockedBacks(parsedBacks);
        } else {
            const initialBacks = [{ ...backgrounds[0], unlocked: true }];
            setUnlockedBacks(initialBacks);
            await AsyncStorage.setItem("unlockedBacks", JSON.stringify(initialBacks));
        }
    };

    const loadCurrentBack = async () => {
        const storedBack = await AsyncStorage.getItem("currentBack");
        if (storedBack !== null) {
            setCurrentBack(JSON.parse(storedBack));
        } else {
            setCurrentBack(backgrounds[0]);
            await AsyncStorage.setItem("currentBack", JSON.stringify(backgrounds[0]));
        }
    };

    const unlockBack = async (back) => {
        if (balance >= 1000 && !unlockedBacks.some(s => s.name === back.name)) {
            const newBalance = balance - 1000;
            const updatedBacks = [...unlockedBacks, { ...back, unlocked: true }];

            setBalance(newBalance);
            setUnlockedBacks(updatedBacks);
            await AsyncStorage.setItem("balance", newBalance.toString());
            await AsyncStorage.setItem("unlockedBacks", JSON.stringify(updatedBacks));
        }
    };

    const selectBack = async (back) => {
        if (unlockedBacks.some(s => s.name === back.name && s.unlocked)) {
            setCurrentBack(back);
            await AsyncStorage.setItem("currentBack", JSON.stringify(back));
        }
    };

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

                <ScrollView style={{width: '100%'}}>
                    {
                        backgrounds.map((back, index) => {
                            const isUnlocked = unlockedBacks.some(s => s.name === back.name && s.unlocked);
                            const selected = currentBack?.name === back.name;

                            return (
                            <View key={index} style={{width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 30, justifyContent: 'space-between'}}>
                                <Image source={back.image} style={{width: 157, height: 157, borderRadius: 24, borderWidth: 1, borderColor: '#fff'}} />
                                <View style={{width: '55%', alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={[styles.balanceBtnText, {fontSize: 20, marginBottom: 10}]}>{back.name}</Text>
                                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                                        <Text style={[styles.balanceBtnText, {fontSize: 16}]}>Price: {back.price}</Text>
                                        <View style={{width: 24, height: 24, marginLeft: 2}}>
                                            <Icons type={'coin'} />
                                        </View>
                                    </View>
                                    <TouchableOpacity 
                                        style={[styles.btn, {width: 125, height: 70}]} 
                                        onPress={isUnlocked ? () => selectBack(back) : () => unlockBack(back)}
                                        disabled={balance < back.price && !isUnlocked}
                                        >
                                        <Image source={require('../assets/decor/balance.png')} style={styles.btnImg} />
                                        <Text style={[styles.btnText, {fontSize: 14, top: 26}]}>{(isUnlocked && selected) ? 'Selected' : (isUnlocked && !selected) ? 'Select' : 'Get'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>

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
        marginBottom: height * 0.05
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
    }
    
});

export default Menu;
