import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Switch, Image, Modal, Linking, Alert } from "react-native"
import { LinearGradient } from 'react-native-linear-gradient';
import { useMusic } from "../music";
import Icons from "./Icons";

const PRIVACY_POLICY_URL = "https://www.termsfeed.com/live/14bbfb7f-facf-4974-8626-aefbb80ba25b";
const APP_STORE_URL = "https://apps.apple.com/us/app/glow-of-sizzling-play/id6743840913";

const SettingsModal = ({ visible, onClose }) => {
    const { isPlaying, togglePlay } = useMusic();
    const [sound, setSound] = useState(true);

    const toggleSound = () => {
        if(sound) {
            setSound(false)
        } else {
            setSound(true)
        }
    };

    const privacyLink = () => {
        Linking.openURL(PRIVACY_POLICY_URL).catch((err) =>
            Alert.alert("Error", "Unable to open Privacy Policy")
        );
    };
      
    const rateLink = () => {        
        Linking.openURL(APP_STORE_URL).catch((err) =>
            Alert.alert("Error", "Unable to open store page")
        );
    };

    return (
        <Modal 
            visible={visible} 
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
            >
            <View style={styles.modalContainer}>

                <View style={{width: '85%', borderRadius: 30}}>

                    <LinearGradient colors={[ '#8b0b00', '#ddad00' ]} style={{width: '100%', borderRadius: 30}}>

                        <View style={styles.modalContent}>

                            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32}}>
                                <Text style={styles.title}>Settings</Text>
                                <TouchableOpacity style={{width: 24, height: 24}} onPress={onClose}>
                                    <Icons type={'close'} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.musicContainer}>
                                <View style={styles.inner}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={{width: 32, height: 32, marginRight: 10}}>
                                            <Icons type={sound ? 'sound' : 'sound-off'} />
                                        </View>
                                        <Text style={styles.title}>Sound</Text>
                                    </View>
                                    <Switch value={sound} onValueChange={toggleSound} thumbColor="#fff" trackColor={{ true: "#ddad00", false: "rgba(255, 255, 255, 0.2)" }} />
                                </View>

                                <View style={styles.inner}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={{width: 32, height: 32, marginRight: 10}}>
                                            <Icons type={isPlaying ? 'music' : 'music-off'} />
                                        </View>
                                        <Text style={styles.title}>Music</Text>
                                    </View>
                                    <Switch value={isPlaying} onValueChange={togglePlay} thumbColor="#fff" trackColor={{ true: "#ddad00", false: "rgba(255, 255, 255, 0.2)" }} />
                                </View>
                            </View>  

                            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <TouchableOpacity style={styles.btn} onPress={rateLink}>
                                    <Image source={require('../assets/decor/settings-btn.png')} style={styles.btnImg} />
                                    <Text style={styles.btnText}>Rate us</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btn} onPress={privacyLink}>
                                    <Image source={require('../assets/decor/settings-btn.png')} style={styles.btnImg} />
                                    <Text style={styles.btnText}>Privacy Policy</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </LinearGradient>

                </View>

            </View>
        </Modal>

    )
};

const styles = StyleSheet.create({

    modalContainer: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'rgba(0,0,0,0.5)' 
    },

    modalContent: {
        width: '100%',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center'
    },


    title: {
        fontWeight: '800',
        fontSize: 24,
        color: '#fff',
    },

    musicContainer: {
        width: '100%',
    },

    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30
    },

    btn: {
        width: 130,
        height: 80,
    },

    btnImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },

    btnText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#fff',
        position: 'absolute',
        alignSelf: 'center',
        top: 30
    }

})

export default SettingsModal;