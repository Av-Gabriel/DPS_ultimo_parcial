import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/config';
import FormularioTransaccion from '../components/FormularioTransaccion';

export default function TransaccionesScreen() {
    const [transacciones, setTransacciones] = useState([]);
    const [cuentas, setCuentas] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [transaccionEdit, setTransaccionEdit] = useState(null);

    const cargarCuentas = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch(`${API_URL}/cuentas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setCuentas(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarTransacciones = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/transacciones`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setTransacciones(data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveTransaccion = async (data) => {
        const token = await AsyncStorage.getItem('token');
        const url = transaccionEdit 
            ? `${API_URL}/transacciones/${transaccionEdit.id}`
            : `${API_URL}/transacciones`;
        const method = transaccionEdit ? 'PUT' : 'POST';

        await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        
        setModalVisible(false);
        setTransaccionEdit(null);
        cargarTransacciones();
    };

    const eliminarTransaccion = async (id) => {
        const token = await AsyncStorage.getItem('token');
        Alert.alert('Confirmar', '¿Eliminar esta transacción?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    await fetch(`${API_URL}/transacciones/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    cargarTransacciones();
                }
            }
        ]);
    };

    useFocusEffect(useCallback(() => { 
        cargarTransacciones();
        cargarCuentas();
    }, []));

    const onRefresh = async () => {
        setRefreshing(true);
        await cargarTransacciones();
        setRefreshing(false);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.itemContainer} 
            onPress={() => {
                setTransaccionEdit(item);
                setModalVisible(true);
            }}
            activeOpacity={0.7}
        >
            <View>
                <Text style={styles.itemCategoria}>{item.categoria}</Text>
                <Text style={styles.itemFecha}>{new Date(item.fecha).toLocaleDateString()}</Text>
                {item.descripcion ? <Text style={styles.itemDesc}>{item.descripcion}</Text> : null}
            </View>
            <View style={styles.itemRight}>
                <Text style={[styles.itemMonto, item.tipo === 'ingreso' ? styles.ingreso : styles.gasto]}>
                    {item.tipo === 'ingreso' ? '+' : '-'}${parseFloat(item.monto || 0).toFixed(2)}
                </Text>
                <TouchableOpacity onPress={() => eliminarTransaccion(item.id)}>
                    <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}> Transacciones</Text>
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => {
                        setTransaccionEdit(null);
                        setModalVisible(true);
                    }}
                >
                    <Text style={styles.addButtonText}>+ Agregar</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={transacciones}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay transacciones</Text>}
            />

            <FormularioTransaccion
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setTransaccionEdit(null);
                }}
                onSave={handleSaveTransaccion}
                transaccionEdit={transaccionEdit}
                cuentas={cuentas}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { backgroundColor: '#4CAF50', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
    addButton: { backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
    addButtonText: { color: '#4CAF50', fontWeight: 'bold' },
    list: { padding: 16 },
    itemContainer: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
    itemCategoria: { fontSize: 16, fontWeight: 'bold' },
    itemFecha: { fontSize: 12, color: '#757575', marginTop: 2 },
    itemDesc: { fontSize: 12, color: '#757575', marginTop: 2, fontStyle: 'italic' },
    itemRight: { alignItems: 'flex-end' },
    itemMonto: { fontSize: 16, fontWeight: 'bold' },
    ingreso: { color: '#4CAF50' },
    gasto: { color: '#F44336' },
    deleteText: { fontSize: 18, marginTop: 5 },
    emptyText: { textAlign: 'center', color: '#757575', padding: 40 }
});