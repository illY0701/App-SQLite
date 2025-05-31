import { Stack } from 'expo-router/stack';
import { useEffect } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { Crud } from '../banco/crud';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
  useEffect(() => {
    Crud();
  }, []);

  return (
    <SQLiteProvider databaseName="sistema.db">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          listeners={({ navigation }) => ({
            transitionStart: async () => {
              // Redireciona para login se não estiver logado
              const usuario = await AsyncStorage.getItem('usuarioLogado');
              if (!usuario) {
                navigation.replace('login');
              }
            },
          })}
        />
        <Stack.Screen name="login" />
        <Stack.Screen name="cadastro" />
        <Stack.Screen name="editar" />
      </Stack>
    </SQLiteProvider>
  );
}