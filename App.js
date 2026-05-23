// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TransaccionesScreen from './src/screens/TransaccionesScreen';
import CuentasScreen from './src/screens/CuentasScreen';
import PresupuestoScreen from './src/screens/PresupuestoScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator({ onLogout }) {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#4CAF50',
                tabBarInactiveTintColor: '#757575'
            }}
        >
            <Tab.Screen
    name="Dashboard"
    options={{
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text>
    }}
>
    {(props) => (
        <DashboardScreen
            {...props}
            onLogout={onLogout}
        />
    )}
</Tab.Screen>
            <Tab.Screen name="Transacciones" component={TransaccionesScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📝</Text> }} />
            <Tab.Screen name="Cuentas" component={CuentasScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💳</Text> }} />
            <Tab.Screen name="Presupuestos" component={PresupuestoScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🎯</Text> }} />
        </Tab.Navigator>
    );
}

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');
            setUser(!!token);
            setLoading(false);
        };
        checkToken();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Screen name="Main">
  {(props) => (
    <TabNavigator
      {...props}
      onLogout={() => setUser(false)}
    />
  )}
</Stack.Screen>
                ) : (
                    <Stack.Screen name="Auth">
                        {(props) => <AuthScreen {...props} onLogin={() => setUser(true)} />}
                    </Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}