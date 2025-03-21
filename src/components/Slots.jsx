import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ImageBackground, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import symbols from "../constants/symbols";
import Icons from "./Icons";

const { height } = Dimensions.get("window");

const Slots = () => {
    const navigation = useNavigation();
    const [columns, setColumns] = useState([]);
    const [balance, setBalance] = useState(0);
    const [spinning, setSpinning] = useState(false);

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
        setSpinning(true);

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
        let winAmount = 0;
    
        thirdRow.forEach(symbol => {
            counts[symbol.price] = (counts[symbol.price] || 0) + 1;
        });
    
        console.log('Symbol Counts:', counts);
    
        Object.keys(counts).forEach(price => {
            let matchingSymbol = symbols.find(s => s.price === parseInt(price));
            console.log('Matching Symbol:', matchingSymbol);
    
            if (counts[price] >= 3) {
                winAmount += matchingSymbol.price * counts[price];
            }
        });
    
        console.log('Win Amount:', winAmount);
    
        if (winAmount > 0) {
            let newBalance = balance + winAmount;
            setBalance(newBalance);
            await AsyncStorage.setItem("balance", newBalance.toString());
            Alert.alert("You Won!", `You won ${winAmount} coins!`);
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

                <View style={styles.slotContainer}>
                    {columns.length > 0 && columns.map((col, colIndex) => (
                        <View key={colIndex} style={styles.column}>
                            {col.slice(0, 4).map((symbol, rowIndex) => (
                                <Image 
                                    key={rowIndex} 
                                    source={symbol.image} 
                                    style={[styles.symbol, rowIndex === 2 && styles.highlightedSymbol]}
                                />
                            ))}
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.btn} onPress={spinSlots} disabled={spinning}>
                    <Image source={require('../assets/decor/button.png')} style={styles.btnImg} />
                    <Text style={styles.btnText}>{spinning ? "Spinning..." : "Spin"}</Text>
                </TouchableOpacity>

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
        marginBottom: 70
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
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 10,
        borderRadius: 10
    },

    column: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5
    },

    symbol: {
        width: 60,
        height: 60,
        margin: 5
    },

    highlightedSymbol: {
        backgroundColor: 'rgba(255, 255, 0, 0.5)',
        borderRadius: 10,
        padding: 5,
    },

    btn: {
        width: 240,
        height: 80,
        marginTop: 28,
        position: 'absolute',
        bottom: 21,
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
});

// import react from 'react';
// import { Text, View } from 'react-native';
// import SlotMachine from 'react-native-slot-machine';

// const Slots = () => {
//     const [slotSettings, setSlotSettings] = react.useState({duration: 4000, slot1: 1234, slot2: 'hello', slot3: '2351'});
//     const slotRef = react.useRef(null);
//     react.useEffect(() => {
//       setTimeout(() => setSlotSettings({duration: 1000, slot1: '4321', slot2: 'world', slot3: '1234'}), 5000);
//       setTimeout(() => setSlotSettings({duration: 4000, slot1: '1234', slot2: 'hello', slot3: '2351'}), 7000);
//       setTimeout(() => slotRef.current.spinTo('prize'), 12000);
//     }, []);

//     const symbols = ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌'];
//     return (
//         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//             <View style={{height: 200, justifyContent: 'space-between', alignItems: 'center'}}>
//                 <SlotMachine text={slotSettings.slot1} duration={slotSettings.duration} />
//                 <SlotMachine
//                     text={slotSettings.slot2}
//                     range="abcdefghijklmnopqrstuvwxyz"
//                     width={45} duration={slotSettings.duration}
//                     ref={slotRef}
//                 />
//                 <SlotMachine text={slotSettings.slot3} range="012345" renderContent={c => <Text style={{fontSize: 25}}>{symbols[c]}</Text>} duration={slotSettings.duration} />
//             </View>
//         </View>
//     );
// };

export default Slots;
