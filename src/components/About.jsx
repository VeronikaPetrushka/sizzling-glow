import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ImageBackground, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import symbols from "../constants/symbols";
import Icons from "./Icons";

const { height } = Dimensions.get("window");

const About = () => {
    const navigation = useNavigation();
    const [index, setIndex] = useState(0);

    useFocusEffect(
        useCallback(() => {
            setIndex(0);
        }, [])
    );

    return (
        <ImageBackground source={require('../assets/back/back.png')} style={{flex: 1}}>
            <View style={styles.container}>

                <TouchableOpacity style={styles.back}  onPress={() => (index === 0 ? navigation.goBack() : setIndex(0))}>
                    <Icons type={'back'} />
                </TouchableOpacity>

                <Text style={[styles.title, {fontSize: 24, lineHeight: 26, alignSelf: 'center', marginBottom: 60}]}>{index === 0 ? 'About game' : 'Symbols'}</Text>

                {
                    index === 0 ? (
                        <View style={{width: '100%', height: height * 0.75}}>
                            <Image source={require('../assets/back/about.png')} style={{width: '100%', height: '100%', resizeMode: 'contain'}} />
                            <View style={{width: '100%', height: '100%', position: 'absolute', top: 0}}>
                                <ScrollView contentContainerStyle={{width: '100%', paddingVertical: 20, paddingHorizontal: 44, alignItems: 'center'}}>
                                    <Text style={styles.title}>Welcome to our exciting game!</Text>
                                    <Text style={styles.title}>Spin the slots and earn coins!</Text>
                                    <Text style={styles.text}>Every spin brings you a chance to win coins, which are added to your virtual balance.</Text>
                                    <Text style={styles.title}>Spend coins on exclusive designs!</Text>
                                    <Text style={styles.text}>Decorate your game with unique styles and visual effects by buying different designs with your accumulated coins.</Text>
                                    <Text style={styles.title}>Daily bonus - your luck every day!</Text>
                                    <Text style={styles.text}>If you run out of stars, don't worry! Once every 24 hours you can get a bonus from 250 to 1000 coins to continue playing and try your luck again.</Text>
                                    <Text style={styles.title}>Have fun playing!</Text>
                                    <View style={{height: 100}} />
                                </ScrollView>
                            </View>
                            <TouchableOpacity style={styles.btn} onPress={() => setIndex(1)}>
                                <Image source={require('../assets/decor/button.png')} style={styles.btnImg} />
                                <Text style={styles.btnText}>Symbols</Text>
                            </TouchableOpacity>    
                        </View>
                    ) : (
                        <View style={{width: '100%', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                            {
                                symbols.map((symbol, index) => (
                                    <View key={index} style={{marginBottom: 20, flexDirection: 'row', alignItems: 'center'}}>
                                        <Image source={symbol.image} style={{width: 80, height: 80, marginRight: 10}} />
                                        <Text style={[styles.title, {marginBottom: 0, marginRight: 10}]}>{symbol.price}</Text>
                                        <View style={{width: 24, height: 24}}>
                                            <Icons type={'coin'} />
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                    )
                }

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

    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 30,
        zIndex: 10
    },

    text: {
        fontSize: 18,
        fontWeight: '400',
        color: '#fff',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 30,
        zIndex: 10
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

export default About;
