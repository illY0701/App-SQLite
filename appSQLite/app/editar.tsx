import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { updateUsuario } from '../banco/crud';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Editar() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ nome: false, email: false, senha: false });
  
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.item) {
      try {
        const usuario = JSON.parse(params.item as string);
        setNome(usuario.nome);
        setEmail(usuario.email);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário');
      }
    }
  }, [params.item]);

  async function handleSalvar() {
    if (!nome || !email) {
      Alert.alert('Erro', 'Nome e e-mail são obrigatórios!');
      return;
    }

    setLoading(true);
    
    try {
      const sucesso = await updateUsuario(
        Number(params.id),
        nome,
        email,
        senha ? senha : 'no-change'
      );
      
      if (sucesso) {
        router.push({ 
          pathname: '/', 
          params: { atualizado: 'true' } 
        });
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar o usuário');
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar atualizar o usuário');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Editar Usuário</Text>
        <Text style={styles.subtitulo}>Atualize os dados abaixo</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={[styles.input, isFocused.nome && styles.inputFocus]}
            placeholder="Digite o nome completo"
            placeholderTextColor="#b8a9c9"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            onFocus={() => setIsFocused({...isFocused, nome: true})}
            onBlur={() => setIsFocused({...isFocused, nome: false})}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[styles.input, isFocused.email && styles.inputFocus]}
            placeholder="exemplo@email.com"
            placeholderTextColor="#b8a9c9"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setIsFocused({...isFocused, email: true})}
            onBlur={() => setIsFocused({...isFocused, email: false})}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nova Senha</Text>
          <TextInput
            style={[styles.input, isFocused.senha && styles.inputFocus]}
            placeholder="Deixe em branco para manter a atual"
            placeholderTextColor="#b8a9c9"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            onFocus={() => setIsFocused({...isFocused, senha: true})}
            onBlur={() => setIsFocused({...isFocused, senha: false})}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.btnSalvar, loading && styles.buttonDisabled]} 
            onPress={handleSalvar}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.btnCancelar, loading && styles.buttonDisabled]} 
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.btnTextCancelar}>Cancelar</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 30,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#6a3d9e', // Lilás escuro
    textAlign: 'center',
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
  buttonContainer: {
    marginTop: 20,
  },
  btnSalvar: {
    backgroundColor: '#d3a8e8', // Rosa lilás
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#d3a8e8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnCancelar: {
    backgroundColor: '#f0e6ff', // Lilás muito claro
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d3a8e8', // Rosa lilás
  },
  btnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  btnTextCancelar: {
    color: '#8a6fa8', // Lilás médio
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});