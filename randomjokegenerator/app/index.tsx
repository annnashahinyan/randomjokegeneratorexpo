import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  useColorScheme,
  Animated,
} from 'react-native';
import { Stack } from 'expo-router';

type JokeResponse = {
  type: 'single' | 'twopart';
  joke?: string;
  setup?: string; 
  delivery?: string;
  id: number;
  safe: boolean;
  lang: string;
}

//expo initialized this code with typescript so I improvised and managed to make this in typescript

export default function HomePage() {
  const isDarkMode = useColorScheme() === 'dark';
  const [joke, setJoke] = useState<JokeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const getJoke = async () => {
    if (loading) {
      return;
    }
    
    setLoading(true);
    fadeOut();

    try {
      let response = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode');
      let data = await response.json();
      setJoke(data);


            fadeIn();
    } catch (err) {
      console.log('Error fetching joke:', err);
    }
    
    setLoading(false);
  };

  function fadeOut() 
  {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  function fadeIn() {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  function showJoke() {
    if (loading) {
      return <ActivityIndicator size="large" color="#4CAF50" />;
    }



    if (!joke) {
      return (
        <Text style={[styles.placeholder, {color: isDarkMode ? '#fff' : '#000'}]}>
          Click the button to get a joke!
        </Text>
      );
    }

    if (joke.type === 'single') {
      return (
        <Text style={[styles.jokeText, {color: isDarkMode ? '#fff' : '#000'}]}>
          {joke.joke}
        </Text>
      );
    }




    return (
      <>
        <Text style={[styles.jokeText, {color: isDarkMode ? '#fff' : '#000'}]}>
          {joke.setup}
        </Text>
        <Text style={[styles.punchline, {color: isDarkMode ? '#fff' : '#000'}]}>
          {joke.delivery}
        </Text>
      </>
    );
  }

  return (

    <View style={[styles.container, {backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'}]}>
      <Stack.Screen 
        options={{
          title: 'Random Joke Generator',
          headerStyle: {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
          },
          headerTintColor: isDarkMode ? '#fff' : '#000',
          headerShadowVisible: false,
        }} 
      />
      
      <Animated.View style={[styles.jokeContainer, {opacity: fadeAnim}]}>
        {showJoke()}
      </Animated.View>



      <TouchableOpacity
        style={styles.button}
        onPress={getJoke}
        activeOpacity={0.7}>
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : 'Get New Joke!'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}






const styles = StyleSheet.create({//css styling

  container: {
    flex: 1,
    padding: 20,

  },
  jokeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 20,
  },
  jokeText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 16,

    lineHeight: 28,
  },
  punchline: {
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 16,
  },
  placeholder: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,


  },
  buttonText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: '600',
  },
});