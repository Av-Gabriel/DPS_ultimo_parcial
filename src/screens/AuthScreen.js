// src/screens/AuthScreen.js
import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/config';

export default function AuthScreen({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        const url = isLogin ? `${API_URL}/auth/login` : `${API_URL}/auth/register`;
        const body = { email, password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await response.json();

            if (data.success) {
                if (isLogin) {
                    await AsyncStorage.setItem('token', data.data.token);
                    onLogin();
                } else {
                    Alert.alert('Éxito', 'Usuario registrado. Ahora inicia sesión');
                    setIsLogin(true);
                }
            } else {
                Alert.alert('Error', data.error?.message || 'Ocurrió un error');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo conectar al servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.emoji}>💰</Text>
                    <Text style={styles.title}>Mis Finanzas</Text>
                    <Text style={styles.subtitle}>{isLogin ? 'Bienvenido' : 'Crea tu cuenta'}</Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        placeholderTextColor="#999"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    {!isLogin && (
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar contraseña"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    )}
                    <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                        <Text style={styles.buttonText}>
                            {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                        <Text style={styles.switchText}>
                            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#4CAF50' },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
    header: { alignItems: 'center', marginBottom: 40 },
    emoji: { fontSize: 64, marginBottom: 10 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
    form: { backgroundColor: '#FFF', borderRadius: 20, padding: 20 },
    input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 15, color: '#333' },
    button: { backgroundColor: '#4CAF50', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    switchText: { textAlign: 'center', marginTop: 20, color: '#4CAF50', fontWeight: '500' }
});