import React, { useEffect } from 'react';
import { View, Image, Animated, ImageBackground, Dimensions } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { MusicProvider } from './src/music';
import Player from './src/components/Player';

import MenuScreen from './src/screens/MenuScreen';
import AboutScreen from './src/screens/AboutScreen';
import SlotsScreen from './src/screens/SlotsScreen';

const { height } = Dimensions.get('window');

enableScreens();

const Stack = createStackNavigator();

const SplashingScreen = ({ navigation }) => {
  const progress = new Animated.Value(0);

  useEffect(() => {
      Animated.timing(progress, {
          toValue: 100,
          duration: 5000,
          useNativeDriver: false,
      }).start(() => {
          navigation.replace('MenuScreen');
      });
  }, []);

  return (
    <ImageBackground source={require('./src/assets/back/back.png')} style={{flex: 1}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingTop: height * 0.03, paddingBottom: height * 0.1}}>
          <Image source={require('./src/assets/decor/logo.png')} style={{ width: '100%', height: 500, resizeMode: 'cover'}} />

          <View style={{width: '100%', alignItems: 'center'}}>
            <Image source={require('./src/assets/decor/progress-bar.png')} style={{width: 350, height: 30, zIndex: 10}} />
            <View style={{ width: 328, height: 18, backgroundColor: '#8b0b00', borderRadius: 2, overflow: 'hidden', alignSelf: 'center', position: 'absolute', zIndex: 10, top: 6 }}>
                <Animated.View style={{
                    width: progress.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
                    height: '100%',
                    backgroundColor: '#ddad00',
                }} />
            </View>
          </View>

      </View>
    </ImageBackground>
  );
};

const App = () => {

  return (
    <MusicProvider>
        <Player />
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"SplashingScreen" }>    
                <Stack.Screen 
                      name="SplashingScreen" 
                      component={SplashingScreen} 
                      options={{ headerShown: false }} 
                />
                <Stack.Screen 
                      name="MenuScreen" 
                      component={MenuScreen} 
                      options={{ headerShown: false }} 
                />
                <Stack.Screen 
                      name="AboutScreen" 
                      component={AboutScreen} 
                      options={{ headerShown: false }} 
                />
                <Stack.Screen 
                      name="SlotsScreen" 
                      component={SlotsScreen} 
                      options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
      </MusicProvider>
    );
};

export default App;
