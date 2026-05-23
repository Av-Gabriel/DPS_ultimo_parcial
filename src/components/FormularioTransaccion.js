// src/components/FormularioTransaccion.js
import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Modal, Alert, ScrollView
} from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function FormularioTransaccion({
    visible,
    onClose,
    onSave,
    transaccionEdit,
    cuentas
}) {
    const [monto, setMonto] = useState('');
    const [tipo, setTipo] = useState('gasto');
    const [categoria, setCategoria] = useState('Comida');
    const [cuenta, setCuenta] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState(new Date());
    const [fechaTexto, setFechaTexto] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const categorias = ['Comida', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud', 'Educación', 'Ahorro', 'Otros'];

    useEffect(() => {
        if (transaccionEdit) {
            setMonto(transaccionEdit.monto.toString());
            setTipo(transaccionEdit.tipo);
            setCategoria(transaccionEdit.categoria);
            setCuenta(transaccionEdit.cuenta);
            setDescripcion(transaccionEdit.descripcion || '');
            const fechaObj = new Date(transaccionEdit.fecha);
            setFecha(fechaObj);
            setFechaTexto(fechaObj.toLocaleDateString('es-ES'));
        } else {
            resetForm();
        }
    }, [transaccionEdit, visible]);

    const resetForm = () => {
        setMonto('');
        setTipo('gasto');
        setCategoria('Comida');
        setCuenta('');
        setDescripcion('');
        setFecha(new Date());
        setFechaTexto('');
    };

    const handleSave = () => {
        if (!monto || parseFloat(monto) <= 0) {
            Alert.alert('Error', 'Ingrese un monto válido');
            return;
        }
        if (!cuenta) {
            Alert.alert('Error', 'Seleccione una cuenta');
            return;
        }
        if (!fechaTexto) {
            Alert.alert('Error', 'Seleccione una fecha');
            return;
        }

        onSave({
            monto: parseFloat(monto),
            tipo,
            categoria,
            cuenta,
            descripcion,
            fecha: fecha.toISOString().split('T')[0]
        });
        resetForm();
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{transaccionEdit ? '✏️ Editar' : '➕ Nueva'} Transacción</Text>

                    <ScrollView keyboardShouldPersistTaps="handled"
    nestedScrollEnabled={true}>
                        <Text style={styles.label}>Monto ($)</Text>
                        <TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" value={monto} onChangeText={setMonto} />

                        <Text style={styles.label}>Tipo</Text>
                        <View style={styles.tipoContainer}>
                            <TouchableOpacity style={[styles.tipoBtn, tipo === 'gasto' && styles.tipoGastoActivo]} onPress={() => setTipo('gasto')}>
                                <Text style={[styles.tipoBtnText, tipo === 'gasto' && styles.tipoActivoText]}>💸 Gasto</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tipoBtn, tipo === 'ingreso' && styles.tipoIngresoActivo]} onPress={() => setTipo('ingreso')}>
                                <Text style={[styles.tipoBtnText, tipo === 'ingreso' && styles.tipoActivoText]}>💰 Ingreso</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Categoría</Text>
                        <View style={styles.optionsContainer}>
    {categorias.map(cat => (
        <TouchableOpacity
            key={cat}
            style={[
                styles.optionButton,
                categoria === cat && styles.optionSelected
            ]}
            onPress={() => setCategoria(cat)}
        >
            <Text
                style={[
                    styles.optionText,
                    categoria === cat && styles.optionTextSelected
                ]}
            >
                {cat}
            </Text>
        </TouchableOpacity>
    ))}
</View>

                        <Text style={styles.label}>Cuenta</Text>
                        {cuentas.length === 0 ? (
    <Text style={styles.noAccountsText}>
        ⚠️ Primero crea una cuenta
    </Text>
) : (
    <View style={styles.optionsContainer}>
        {cuentas.map(c => (
            <TouchableOpacity
                key={c.id}
                style={[
                    styles.optionButton,
                    cuenta === c.nombre && styles.optionSelected
                ]}
                onPress={() => setCuenta(c.nombre)}
            >
                <Text
                    style={[
                        styles.optionText,
                        cuenta === c.nombre && styles.optionTextSelected
                    ]}
                >
                    {c.nombre}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
)}

                        <Text style={styles.label}>Fecha</Text>
                        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.dateBtnText}>{fechaTexto || 'Seleccionar fecha'}</Text>
                        </TouchableOpacity>

                        <Text style={styles.label}>Descripción (opcional)</Text>
                        <TextInput style={[styles.input, styles.textArea]} placeholder="Ej: Compra en supermercado" multiline value={descripcion} onChangeText={setDescripcion} />

                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveBtnText}>Guardar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelBtnText}>Cancelar</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <DateTimePickerModal
                        isVisible={showDatePicker}
                        mode="date"
                        textColor="#000"
                        themeVariant="light"
                        onConfirm={(date) => {
                            setFecha(date);
                            setFechaTexto(date.toLocaleDateString('es-ES'));
                            setShowDatePicker(false);
                        }}
                        onCancel={() => setShowDatePicker(false)}
                        locale="es_ES"
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { backgroundColor: '#FFF', borderRadius: 20, width: '90%', maxHeight: '85%', padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' },
    label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginTop: 12, marginBottom: 5 },
    input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: 12, fontSize: 16 },
    textArea: { height: 80, textAlignVertical: 'top' },
    tipoContainer: { flexDirection: 'row', gap: 10 },
    tipoBtn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', backgroundColor: '#F0F0F0' },
    tipoGastoActivo: { backgroundColor: '#F44336' },
    tipoIngresoActivo: { backgroundColor: '#4CAF50' },
    tipoBtnText: { fontWeight: 'bold', color: '#555' },
    tipoActivoText: { color: '#FFF' },
    dateBtn: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: 12 },
    dateBtnText: { fontSize: 16, color: '#333' },
    saveBtn: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    cancelBtn: { backgroundColor: '#F0F0F0', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    cancelBtnText: { color: '#555', fontWeight: 'bold' },
    optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10
},

optionButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20
},

optionSelected: {
    backgroundColor: '#4CAF50'
},

optionText: {
    color: '#333',
    fontWeight: 'bold'
},

optionTextSelected: {
    color: '#FFF'
},

noAccountsText: {
    color: '#F44336',
    marginBottom: 10,
    fontStyle: 'italic'
},
});