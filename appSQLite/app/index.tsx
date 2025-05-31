import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { deleteUsuario, selectUsuarios } from '../banco/crud';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Index() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [emailUsuario, setEmailUsuario] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const params = useLocalSearchParams();

  const exibirUsuarios = useCallback(async () => {
    setIsLoading(true);
    const dados = await selectUsuarios();
    setUsuarios(dados);
    setIsLoading(false);
  }, []);

  async function delUsuarios(id: number) {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: async () => {
          await deleteUsuario(id);
          await exibirUsuarios();
        }}
      ]
    );
  }

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const carregarDados = async () => {
        setIsLoading(true);
        const usuario = await AsyncStorage.getItem('usuarioLogado');

        if (usuario) {
          const userObj = JSON.parse(usuario);
          if (isActive) setEmailUsuario(userObj.email);
        }

        const dados = await selectUsuarios();
        if (isActive) {
          setUsuarios(dados);
          setIsLoading(false);
        }
      };

      carregarDados();

      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    if (params.atualizado === 'true') {
      exibirUsuarios();
    }
  }, [params.atualizado]);

  async function sair() {
    await AsyncStorage.removeItem('usuarioLogado');
    router.replace('/login');
  }

  function editUsuario(item: any) {
    router.push({
      pathname: '/editar',
      params: {
        id: item.id,
        item: JSON.stringify(item)
      }
    });
  }

  // Adicione no início do componente Index:
useEffect(() => {
  const verificarLogin = async () => {
    const usuario = await AsyncStorage.getItem('usuarioLogado');
    if (!usuario) {
      router.replace('/login');
    }
  };

  verificarLogin();
}, []);

  return (
    <View style={styles.container}>
      {/* Header com espaçamento seguro */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.titulo}>Usuários Cadastrados</Text>
          <Text style={styles.subtitulo}>Gerencie os usuários do sistema</Text>
        </View>
        
        <TouchableOpacity onPress={sair} style={styles.btnSair}>
          <Icon name="exit-to-app" size={24} color="#8a6fa8" />
        </TouchableOpacity>
      </View>

      {usuarios.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="group" size={80} color="#d3c1e5" />
          <Text style={styles.emptyText}>Nenhum usuário cadastrado</Text>
          <Text style={styles.emptySubtext}>Cadastre novos usuários para começar</Text>
          
          <TouchableOpacity 
            onPress={() => router.push('/cadastro')} 
            style={styles.addButton}
          >
            <Icon name="person-add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Adicionar Usuário</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.usuarioContainer}>
              <View style={styles.avatarContainer}>
                <Icon name="person" size={28} color="#8a6fa8" />
              </View>
              
              <View style={styles.usuarioInfo}>
                <Text style={styles.usuarioNome}>{item.nome}</Text>
                <Text style={styles.usuarioEmail}>{item.email}</Text>
              </View>

              <View style={styles.usuarioActions}>
                <TouchableOpacity 
                  onPress={() => editUsuario(item)} 
                  style={styles.btnEdit}
                >
                  <Icon name="edit" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => delUsuarios(item.id)} 
                  style={styles.btnDelete}
                >
                  <Icon name="delete" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {usuarios.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.userInfo}>Logado como: {emailUsuario}</Text>
          <TouchableOpacity 
            onPress={() => router.push('/cadastro')} 
            style={styles.addButton}
          >
            <Icon name="person-add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Adicionar Usuário</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf5ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf5ff',
    paddingTop: 60, // Espaço para a barra de status
  },
  loadingImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  loadingText: {
    color: '#8a6fa8',
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    paddingTop: 60, // Espaço extra para a barra de status
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e6d7ff',
    shadowColor: '#d3c1e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flex: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6a3d9e',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: '#b8a9c9',
  },
  btnSair: {
    backgroundColor: '#f0e6ff',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d3a8e8',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  usuarioContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#d3c1e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  usuarioInfo: {
    flex: 1,
  },
  usuarioNome: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  usuarioEmail: {
    fontSize: 14,
    color: '#8a6fa8',
  },
  usuarioActions: {
    flexDirection: 'row',
    gap: 10,
  },
  btnEdit: {
    backgroundColor: '#d3a8e8',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDelete: {
    backgroundColor: '#ef476f',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#6a3d9e',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#8a6fa8',
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 30,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e6d7ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  userInfo: {
    textAlign: 'center',
    color: '#8a6fa8',
    marginBottom: 15,
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#d3a8e8',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#d3a8e8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
});