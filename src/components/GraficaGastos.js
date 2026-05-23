// src/components/GraficaGastos.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, G, Circle, Text as SvgText } from 'react-native-svg';

export default function GraficaGastos({ datos }) {
    const total = datos.reduce((sum, d) => sum + d.monto, 0);
    if (total === 0) return <Text style={styles.empty}>Sin datos de gastos</Text>;

    let anguloAcumulado = 0;
    const colores = ['#FF5722', '#2196F3', '#9C27B0', '#FF9800', '#4CAF50', '#00BCD4', '#3F51B5', '#607D8B'];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gastos por categoría</Text>
            <Svg height={200} width={200} viewBox="0 0 200 200">
                <G origin="100,100">
                    {datos.map((item, i) => {
                        const porcentaje = (item.monto / total) * 100;
                        const angulo = (porcentaje / 100) * 360;
                        const anguloMedio = anguloAcumulado + angulo / 2;
                        const rad = (anguloMedio * Math.PI) / 180;
                        const x = 100 + 70 * Math.cos(rad);
                        const y = 100 + 70 * Math.sin(rad);
                        const elemento = (
                            <React.Fragment key={i}>
                                <Circle cx="100" cy="100" r="70" fill="transparent" stroke={colores[i % colores.length]} strokeWidth={35} strokeDasharray={`${angulo} ${360 - angulo}`} strokeDashoffset={-anguloAcumulado} rotation={-90} origin="100,100" />
                                <SvgText x={x} y={y} fill="#FFF" fontSize="12" textAnchor="middle" stroke="#000" strokeWidth="0.5">{Math.round(porcentaje)}%</SvgText>
                            </React.Fragment>
                        );
                        anguloAcumulado += angulo;
                        return elemento;
                    })}
                </G>
            </Svg>
            <View style={styles.legendas}>
                {datos.map((item, i) => (
                    <View key={i} style={styles.legendaItem}>
                        <View style={[styles.legendaColor, { backgroundColor: colores[i % colores.length] }]} />
                        <Text style={styles.legendaText}>{item.categoria}: ${parseFloat(item.monto || 0).toFixed(2)}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderRadius: 20, margin: 16 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    empty: { textAlign: 'center', color: '#757575', padding: 20 },
    legendas: { marginTop: 20, width: '100%' },
    legendaItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
    legendaColor: { width: 16, height: 16, borderRadius: 8, marginRight: 8 },
    legendaText: { fontSize: 12, color: '#555' }
});