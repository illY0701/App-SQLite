import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import { loginUsuario } from '../banco/crud';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [isFocused, setIsFocused] = useState({ email: false, senha: false });
    const router =  useRouter();

    async function verificarLogin() {
        if(!email || !senha){
            Alert.alert('Erro', 'Preencha e-mail e senha');
            return;
        }

        try {
            const user = await loginUsuario(email, senha);
            
            if (user) {
                await AsyncStorage.setItem('usuarioLogado', JSON.stringify({
                    id: user.id,
                    nome: user.nome,
                    email: user.email
                }));
                router.replace('/');
            } else {
                Alert.alert('Erro', 'E-mail ou senha incorretos!');
            }
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login');
        }
    }
    
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titulo}>Bem-vindo de volta!</Text>
                <Text style={styles.subtitulo}>Faça login para continuar</Text>
            </View>
            
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={[styles.input, isFocused.email && styles.inputFocus]}
                        value={email}
                        onChangeText={setEmail}
                        placeholder='seu.email@exemplo.com'
                        placeholderTextColor="#b8a9c9"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onFocus={() => setIsFocused({...isFocused, email: true})}
                        onBlur={() => setIsFocused({...isFocused, email: false})}
                    />
                </View>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={[styles.input, isFocused.senha && styles.inputFocus]}
                        value={senha}
                        onChangeText={setSenha}
                        placeholder='••••••••'
                        placeholderTextColor="#b8a9c9"
                        secureTextEntry
                        onFocus={() => setIsFocused({...isFocused, senha: true})}
                        onBlur={() => setIsFocused({...isFocused, senha: false})}
                    />
                </View>
                
                <TouchableOpacity style={styles.button} onPress={verificarLogin}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
            
            </View>
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>Não tem uma conta?</Text>
                <Link href="/cadastro" asChild>
                    <TouchableOpacity>
                        <Text style={styles.signUpLink}>Cadastre-se agora</Text>
                    </TouchableOpacity>
                </Link>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 25,
      justifyContent: 'center',
      backgroundColor: '#faf5ff', // Fundo lilás muito claro
  },
  header: {
      alignItems: 'center',
      marginBottom: 40,
  },
  titulo: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 8,
      color: '#6a3d9e', // Lilás escuro
      textAlign: 'center',
      fontFamily: 'sans-serif-light',
  },
  subtitulo: {
      fontSize: 16,
      color: '#b8a9c9', // Lilás claro
      textAlign: 'center',
  },
  formContainer: {
      marginBottom: 30,
  },
  inputContainer: {
      marginBottom: 20,
  },
  label: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 8,
      color: '#8a6fa8', // Lilás médio
  },
  input: {
      height: 56,
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#e6d7ff', // Lilás muito claro
      borderRadius: 14,
      padding: 16,
      fontSize: 16,
      color: '#6a3d9e', // Lilás escuro
      shadowColor: '#d3c1e5',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
  },
  inputFocus: {
      borderColor: '#d3a8e8', // Rosa lilás
      shadowColor: '#d3a8e8',
      shadowOpacity: 0.2,
  },
  button: {
      backgroundColor: '#d3a8e8', // Rosa lilás
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: 'center',
      marginTop: 10,
      shadowColor: '#d3a8e8',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
  },
  buttonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
      letterSpacing: 0.5,
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 30,
  },
  footerText: {
      color: '#8a6fa8', // Lilás médio
      marginRight: 5,
  },
  signUpLink: {
      color: '#d3a8e8', // Rosa lilás
      fontWeight: '600',
      textDecorationLine: 'underline',
  },
});