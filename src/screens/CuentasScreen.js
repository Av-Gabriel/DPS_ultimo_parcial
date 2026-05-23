// src/screens/CuentasScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/config';

export default function CuentasScreen() {
    const [cuentas, setCuentas] = useState([]);
    const [nuevaCuenta, setNuevaCuenta] = useState('');

    const cargarCuentas = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/cuentas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setCuentas(data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const agregarCuenta = async () => {
        if (!nuevaCuenta.trim()) return;
        const token = await AsyncStorage.getItem('token');

        try {
            await fetch(`${API_URL}/cuentas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
    usuario_id: 1,
    nombre: nuevaCuenta
})
            });
            setNuevaCuenta('');
            cargarCuentas();
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear la cuenta');
        }
    };

    const eliminarCuenta = async (id) => {
        const token = await AsyncStorage.getItem('token');
        Alert.alert('Confirmar', '¿Eliminar esta cuenta?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    await fetch(`${API_URL}/cuentas/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    cargarCuentas();
                }
            }
        ]);
    };

    useFocusEffect(useCallback(() => { cargarCuentas(); }, []));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>💳 Mis Cuentas</Text>
            </View>

            <View style={styles.addContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nueva cuenta (Ej: Efectivo)"
                    value={nuevaCuenta}
                    onChangeText={setNuevaCuenta}
                />
                <TouchableOpacity style={styles.addBtn} onPress={agregarCuenta}>
                    <Text style={styles.addBtnText}>+</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={cuentas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemNombre}>💰 {item.nombre}</Text>
                        <TouchableOpacity onPress={() => eliminarCuenta(item.id)}>
                            <Text style={styles.deleteText}>🗑️</Text>
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay cuentas</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { backgroundColor: '#4CAF50', paddingTop: 50, paddingBottom: 20, alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
    addContainer: { flexDirection: 'row', margin: 16, gap: 10 },
    input: { flex: 1, backgroundColor: '#FFF', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E0E0E0' },
    addBtn: { backgroundColor: '#4CAF50', width: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    addBtnText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    list: { padding: 16 },
    itemContainer: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
    itemNombre: { fontSize: 16, fontWeight: '500' },
    deleteText: { fontSize: 20, color: '#F44336' },
    emptyText: { textAlign: 'center', color: '#757575', padding: 40 }
});