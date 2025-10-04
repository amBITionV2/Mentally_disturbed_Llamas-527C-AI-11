import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import Svg, { Path } from 'react-native-svg';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
  if (!email || !password) {
    Alert.alert('Error', 'Please enter email and password');
    return;
  }
  console.log('Login/SignUp with:', { email, password });
  Alert.alert('Success', 'Logged in! Navigating to Home...');
  navigation.navigate('Tabs');  // Navigate to Tabs
};

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Integrate with Google Sign-In');
  };

  const handleAppleLogin = () => {
    Alert.alert('Apple Login', 'Integrate with Apple Sign-In');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.main}>
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Rancho</Text>
            <Text style={styles.subtitle}>Your emotional wellness companion</Text>
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity onPress={handleSubmit}>
              <LinearGradient
                colors={['#2a60ea', 'rgba(42,96,234,0.7)']}  // from-primary to-primary/70
                style={styles.submitButton}
              >
                <Text style={styles.buttonText}>Login / Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.divider} />
          </View>
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#2a60ea" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15.5 16.5c-1.3 1.3-3.1 2-5 2s-3.7-.7-5-2c-1.3-1.3-2-3.1-2-5s.7-3.7 2-5c1.3-1.3 3.1-2 5-2s3.7.7 5 2" />
                <Path d="M12 12v.01" />
                <Path d="M22 12c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2" />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#2a60ea" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17.5 3c-1.8 0-3.5 1-4.5 2.83-1-1.83-2.7-2.83-4.5-2.83A4.91 4.91 0 0 0 4 9.78c0 4.22 3 12.22 6 12.22 1.25 0 2.5-1.06 4-1.06z" />
                <Path d="M12 21.82a1.82 1.82 0 0 0-1 3.18" />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111521',  // dark:bg-background-dark
  },
  main: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  formContainer: {
    width: '100%',
    maxWidth: 384,  // max-w-sm
    backgroundColor: 'rgba(17,21,33,0.5)',  // bg-background-dark/50
    borderRadius: 8,  // rounded-lg
    padding: 32,  // p-8
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    // Backdrop blur approximated with opacity; add BlurView for real blur
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,  // mb-10
  },
  title: {
    fontSize: 30,  // text-3xl
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',  // text-white/60
  },
  form: {
    gap: 24,  // space-y-6
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',  // dark:bg-black/20
    borderRadius: 8,  // rounded
    padding: 16,  // p-4
    color: '#ffffff',
    fontSize: 16,
  },
  submitButton: {
    width: '100%',
    borderRadius: 9999,  // rounded-full
    paddingVertical: 12,  // py-3
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2a60ea',  // glow
    shadowOpacity: 1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,  // my-6
  },
  divider: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    marginHorizontal: 16,  // mx-4
    fontSize: 14,  // text-sm
    color: 'rgba(255,255,255,0.4)',  // text-white/40
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,  // space-x-4
  },
  socialButton: {
    width: 48,  // w-12
    height: 48,  // h-12
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: '#2a60ea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2a60ea',  // glow
    shadowOpacity: 1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
});

export default LoginScreen;