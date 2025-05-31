import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { insertUsuario } from '../banco/crud';
import { useRouter } from 'expo-router';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isFocused, setIsFocused] = useState({ nome: false, email: false, senha: false });
  const router = useRouter();

  async function handleCadastro() {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      const success = await insertUsuario(nome, email, senha);
      if (success) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        router.replace('/login');
      } else {
        Alert.alert('Erro', 'Falha ao cadastrar usuário');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro durante o cadastro');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <Text style={styles.titulo}>Crie sua conta</Text>
        <Text style={styles.subtitulo}>Preencha os dados abaixo</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={[styles.input, isFocused.nome && styles.inputFocus]}
            value={nome}
            onChangeText={setNome}
            placeholder='Seu nome completo'
            placeholderTextColor="#b8a9c9"
            autoCapitalize="words"
            onFocus={() => setIsFocused({...isFocused, nome: true})}
            onBlur={() => setIsFocused({...isFocused, nome: false})}
          />
        </View>
        
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
        
        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Criar Conta</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Já tem uma conta?</Text>
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text style={styles.signUpLink}>Faça login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#faf5ff', // Fundo lilás muito claro
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 20,
    tintColor: '#9c89b8', // Lilás médio
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
    marginBottom: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#8a6fa8', // Lilás médio
  },
  input: {
    height: 58,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6d7ff', // Lilás muito claro
    borderRadius: 16,
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
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 15,
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
    marginBottom: 20,
  },
  footerText: {
    color: '#8a6fa8', // Lilás médio
    marginRight: 5,
    fontSize: 15,
  },
  signUpLink: {
    color: '#d3a8e8', // Rosa lilás
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontSize: 15,
  },
});