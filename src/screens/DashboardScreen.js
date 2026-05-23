// src/screens/DashboardScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/config';
import GraficaGastos from '../components/GraficaGastos';

export default function DashboardScreen({ onLogout }) {
    const [refreshing, setRefreshing] = useState(false);
    const [ingresos, setIngresos] = useState(0);
    const [gastos, setGastos] = useState(0);
    const [gastosPorCategoria, setGastosPorCategoria] = useState([]);
    const [transacciones, setTransacciones] = useState([]);

    const cargarDatos = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/transacciones`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                let totalIngresos = 0, totalGastos = 0;
                const gastosCat = {};

               data.data.forEach(t => {
    const monto = parseFloat(t.monto || 0);

    if (t.tipo === 'ingreso') {
        totalIngresos += monto;
    } else {
        totalGastos += monto;
        gastosCat[t.categoria] = (gastosCat[t.categoria] || 0) + monto;
    }
});

                setIngresos(totalIngresos);
                setGastos(totalGastos);
                setGastosPorCategoria(Object.entries(gastosCat).map(([categoria, monto]) => ({ categoria, monto })));
                setTransacciones(data.data.slice(0, 5));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        onLogout();
    };

    useFocusEffect(useCallback(() => { cargarDatos(); }, []));

    const onRefresh = async () => {
        setRefreshing(true);
        await cargarDatos();
        setRefreshing(false);
    };

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={styles.header}>
                <Text style={styles.title}>💰 Mis Finanzas</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Salir</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Balance del mes</Text>
                <Text style={[styles.balanceValue, (ingresos - gastos) >= 0 ? styles.positivo : styles.negativo]}>
                    ${(parseFloat(ingresos || 0) - parseFloat(gastos || 0)).toFixed(2)}
                </Text>
                <View style={styles.balanceRow}>
                    <View style={styles.balanceItem}>
                        <Text style={styles.ingresoLabel}>Ingresos</Text>
                        <Text style={styles.ingresoValue}>+${parseFloat(ingresos || 0).toFixed(2)}</Text>
                    </View>
                    <View style={styles.balanceItem}>
                        <Text style={styles.gastoLabel}>Gastos</Text>
                        <Text style={styles.gastoValue}>-${parseFloat(gastos || 0).toFixed(2)}</Text>
                    </View>
                </View>
            </View>

            <GraficaGastos datos={gastosPorCategoria} />

            <View style={styles.ultimosCard}>
                <Text style={styles.ultimosTitle}>📝 Últimas transacciones</Text>
                {transacciones.length === 0 ? (
                    <Text style={styles.emptyText}>No hay transacciones</Text>
                ) : (
                    transacciones.map((t, i) => (
                        <View key={i} style={styles.transaccionItem}>
                            <View>
                                <Text style={styles.transaccionCategoria}>{t.categoria}</Text>
                                <Text style={styles.transaccionFecha}>{new Date(t.fecha).toLocaleDateString()}</Text>
                            </View>
                            <Text style={[styles.transaccionMonto, t.tipo === 'ingreso' ? styles.positivo : styles.negativo]}>
                                {t.tipo === 'ingreso' ? '+' : '-'}${parseFloat(t.monto || 0).toFixed(2)}
                            </Text>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { backgroundColor: '#4CAF50', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
    logoutText: { color: '#FFF', fontWeight: 'bold' },
    balanceCard: { backgroundColor: '#FFF', margin: 16, padding: 20, borderRadius: 20, elevation: 3, alignItems: 'center' },
    balanceLabel: { fontSize: 14, color: '#757575' },
    balanceValue: { fontSize: 36, fontWeight: 'bold', marginVertical: 10 },
    balanceRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 15 },
    balanceItem: { alignItems: 'center' },
    ingresoLabel: { color: '#4CAF50', fontWeight: 'bold' },
    ingresoValue: { color: '#4CAF50', fontSize: 18, fontWeight: 'bold' },
    gastoLabel: { color: '#F44336', fontWeight: 'bold' },
    gastoValue: { color: '#F44336', fontSize: 18, fontWeight: 'bold' },
    positivo: { color: '#4CAF50' },
    negativo: { color: '#F44336' },
    ultimosCard: { backgroundColor: '#FFF', margin: 16, padding: 20, borderRadius: 20, elevation: 3 },
    ultimosTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    transaccionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
    transaccionCategoria: { fontSize: 16, fontWeight: '500' },
    transaccionFecha: { fontSize: 12, color: '#757575', marginTop: 2 },
    transaccionMonto: { fontSize: 16, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', color: '#757575', padding: 20 }
});