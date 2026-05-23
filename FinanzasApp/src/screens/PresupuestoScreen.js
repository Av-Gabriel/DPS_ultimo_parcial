import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/config';
import { Picker } from '@react-native-picker/picker';

export default function PresupuestoScreen() {
    const [presupuestos, setPresupuestos] = useState([]);
    const [categoria, setCategoria] = useState('');
    const [limite, setLimite] = useState('');

    const categorias = ['Comida', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud', 'Educación', 'Ahorro', 'Otros'];

    const cargarPresupuestos = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/presupuestos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setPresupuestos(data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const agregarPresupuesto = async () => {
        if (!categoria || !limite) return;
        const token = await AsyncStorage.getItem('token');
        const fecha = new Date();
        const mes = fecha.getMonth() + 1;
        const anio = fecha.getFullYear();

        try {
            await fetch(`${API_URL}/presupuestos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ categoria, limite: parseFloat(limite), mes, anio })
            });
            setCategoria('');
            setLimite('');
            cargarPresupuestos();
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear el presupuesto');
        }
    };

    const eliminarPresupuesto = async (id) => {
        const token = await AsyncStorage.getItem('token');
        Alert.alert('Confirmar', '¿Eliminar este presupuesto?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    await fetch(`${API_URL}/presupuestos/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    cargarPresupuestos();
                }
            }
        ]);
    };

    useFocusEffect(useCallback(() => { cargarPresupuestos(); }, []));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}> Presupuestos</Text>
            </View>

            <View style={styles.addContainer}>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={categoria} onValueChange={setCategoria} style={styles.picker}>
                        <Picker.Item label="-- Categoría --" value="" />
                        {categorias.map(cat => <Picker.Item key={cat} label={cat} value={cat} />)}
                    </Picker>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Límite $"
                    keyboardType="numeric"
                    value={limite}
                    onChangeText={setLimite}
                />
                <TouchableOpacity style={styles.addBtn} onPress={agregarPresupuesto}>
                    <Text style={styles.addBtnText}>+</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={presupuestos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemCategoria}>{item.categoria}</Text>
                        <View style={styles.itemRight}>
                            <Text style={styles.itemLimite}>${item.limite.toFixed(2)}</Text>
                            <TouchableOpacity onPress={() => eliminarPresupuesto(item.id)}>
                                <Text style={styles.deleteText}>🗑️</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay presupuestos</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { backgroundColor: '#4CAF50', paddingTop: 50, paddingBottom: 20, alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
    addContainer: { margin: 16, gap: 10 },
    pickerContainer: { backgroundColor: '#FFF', borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0', overflow: 'hidden' },
    picker: { height: 50 },
    input: { backgroundColor: '#FFF', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E0E0E0' },
    addBtn: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 10, alignItems: 'center' },
    addBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    list: { padding: 16 },
    itemContainer: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
    itemCategoria: { fontSize: 16, fontWeight: 'bold' },
    itemRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    itemLimite: { fontSize: 16, color: '#4CAF50', fontWeight: 'bold' },
    deleteText: { fontSize: 18, color: '#F44336' },
    emptyText: { textAlign: 'center', color: '#757575', padding: 40 }
});