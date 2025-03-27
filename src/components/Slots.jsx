import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ImageBackground, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'react-native-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import backgrounds from "../constants/backgrounds";
import symbols from "../constants/symbols";
import Icons from "./Icons";

const { height } = Dimensions.get("window");

const Slots = () => {
    const navigation = useNavigation();
    const [columns, setColumns] = useState([]);
    const [balance, setBalance] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [currentBack, setCurrentBack] = useState(backgrounds[0]);
    const [winAmount, setWinAmount] = useState(0);

    useEffect(() => {
        loadCurrentBack();
    }, []);

    const loadCurrentBack = async () => {
        const storedBack = await AsyncStorage.getItem("currentBack");
        if (storedBack !== null) {
            setCurrentBack(JSON.parse(storedBack));
        } else {
            setCurrentBack(backgrounds[0]);
            await AsyncStorage.setItem("currentBack", JSON.stringify(backgrounds[0]));
        }
    };

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
        setColumns(generateColumns());
    }, []);

    useEffect(() => {
        setColumns(generateColumns());
    }, []);

    function generateColumns() {
        return Array.from({ length: 4 }, () => generateColumn());
    }

    function generateColumn() {
        let column = [...symbols];
        while (column.length < 12) {
            column.push(symbols[Math.floor(Math.random() * symbols.length)]);
        }
        return column.sort(() => Math.random() - 0.5);
    }

    const spinSlots = async () => {
        if (balance < 10) return;
    
        setSpinning(true);
        setWinAmount(0);
    
        let newBalance = balance - 10;
        setBalance(newBalance);
        await AsyncStorage.setItem("balance", newBalance.toString());
    
        setTimeout(async () => {
            const newColumns = generateColumns();
            setColumns(newColumns);
            setSpinning(false);
            calculateWin(newColumns);
        }, 2000);
    };

    const calculateWin = async (newColumns) => {
        let thirdRow = newColumns.map(col => col[2]);
        console.log('Third Row:', thirdRow);
    
        let counts = {};
        let win = 0;
    
        thirdRow.forEach(symbol => {
            counts[symbol.price] = (counts[symbol.price] || 0) + 1;
        });
    
        console.log('Symbol Counts:', counts);
    
        Object.keys(counts).forEach(price => {
            let matchingSymbol = symbols.find(s => s.price === parseInt(price));
            console.log('Matching Symbol:', matchingSymbol);
    
            if (counts[price] >= 3) {
                win += matchingSymbol.price * counts[price];
            }
        });
    
        console.log('Win Amount:', win);
    
        if (win > 0) {
            let newBalance = balance + win;
            setBalance(newBalance);
            setWinAmount(win);
            await AsyncStorage.setItem("balance", newBalance.toString());
        } else {
            setWinAmount(0);
        }
    }; 

    const slotsColor = () => {
        if(currentBack.name === 'Main Background') {
            return {backgroundColor: '#f5d900'};
        } else if (currentBack.name === 'Green Background') {
            return{ backgroundColor: '#4f8c17'};
        } else if (currentBack.name === 'Blue Background') {
            return {backgroundColor: '#2e49a7'};
        } else if (currentBack.name === 'Red Background') {
            return {backgroundColor: '#970156'};
        }
    };

    const gradientColor = () => {
        if(currentBack.name === 'Main Background') {
            return ['#8b0b00', '#ddad00'];
        } else if (currentBack.name === 'Green Background') {
            return ['#588b00', '#0093dd'];
        } else if (currentBack.name === 'Blue Background') {
            return ['#00388b', '#9700dd'];
        } else if (currentBack.name === 'Red Background') {
            return ['#51008b', '#dd0021'];
        }
    };

    return (
        <ImageBackground source={currentBack.image} style={{flex: 1}}>
            <View style={styles.container}>

                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <Icons type={'back'} />
                </TouchableOpacity>

                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: height * 0.08}}>
                    {
                        winAmount && (
                            <>
                                <Text style={[styles.balanceBtnText, {fontSize: 36, lineHeight: 40}]}>+ {winAmount}</Text>
                                <View style={{width: 32, height: 32, marginLeft: 2}}>
                                    <Icons type={'coin'} />
                                </View>
                            </>
                        )
                    }
                </View>

                <View style={styles.slotContainer}>
                    {columns.length > 0 && (
                        <>
                            {columns.map((col, colIndex) => (
                                    <View key={colIndex} style={[styles.column, slotsColor()]}>
                                        {col.slice(0, 4).map((symbol, rowIndex) => (
                                            <Image 
                                                key={rowIndex} 
                                                source={symbol.image} 
                                                style={[styles.symbol, rowIndex === 2 && styles.highlightedSymbol]}
                                            />
                                        ))}
                                    </View>
                                ))}    
                        </>
                    )}
                </View>

                <View style={styles.buttonsContainer}>
                    <LinearGradient colors={gradientColor()} style={{width: '100%', height: '100%', borderTopRightRadius: 30, borderTopLeftRadius: 30}}>
                        <View style={{width: '100%', height: '100%', padding: 24, alignItems: 'center'}}>
                            <View style={styles.balanceBtn}>
                                <Image source={require('../assets/decor/balance.png')} style={styles.btnImg} />
                                <View style={styles.balanceContainer}>
                                    <Text style={styles.balanceBtnText}>Balance: {balance}</Text>
                                    <View style={{width: 24, height: 24, marginLeft: 2}}>
                                        <Icons type={'coin'} />
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.balanceBtn, {width: 217, height: 60}]}>
                                <Image source={require('../assets/decor/settings-btn.png')} style={styles.btnImg} />
                                <View style={[styles.balanceContainer, {top: 18}]}>
                                    <Text style={styles.balanceBtnText}>Bet: 10</Text>
                                    <View style={{width: 24, height: 24, marginLeft: 2}}>
                                        <Icons type={'coin'} />
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={[styles.btn, (spinning || balance < 10) && {opacity: 0.5}]} onPress={spinSlots} disabled={spinning || balance < 10}>
                                <Image source={require('../assets/decor/spin.png')} style={styles.btnImg} />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: height * 0.085,
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
        height: 60,
        marginBottom: 12
    },

    balanceContainer: {
        position: 'absolute',
        alignSelf: 'center',
        top: 18,
        flexDirection: 'row',
        alignItems: 'center'
    },

    balanceBtnText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 22,
    },

    balance: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 70
    },

    slotContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20
    },

    column: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        margin: 5,
        borderRadius: 8,
        padding: 5
    },

    symbol: {
        width: 55,
        height: 55,
        margin: 5
    },

    highlightedSymbol: {
        backgroundColor: 'rgba(255, 255, 0, 0.5)',
        borderRadius: 10,
        padding: 5,
    },

    btn: {
        width: height * 0.115,
        height: height * 0.115,
        alignSelf: 'center'
    },

    btnImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },

    btnText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        position: 'absolute',
        alignSelf: 'center',
        top: 24
    },

    buttonsContainer: {
        width: '100%', 
        height: height * 0.38,
        position: 'absolute', 
        bottom: 0, 
        borderTopRightRadius: 30, 
        borderTopLeftRadius: 30
    },

});

export default Slots;
