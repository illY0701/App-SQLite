import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';
import * as Crypto from 'expo-crypto';

// Definir interface para o usuário
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

// Função para criptografar senhas
async function hashSenha(senha: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    senha
  );
}

// Inicialização do banco de dados
export async function Crud() {
  try {
    const db = await SQLite.openDatabaseAsync('sistema.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL
      );
    `);
    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar o banco:', error);
    throw error;
  }
}

// Inserir novo usuário
export async function insertUsuario(nome: string, email: string, senha: string): Promise<boolean> {
  try {
    const senhaHash = await hashSenha(senha);
    const db = await SQLite.openDatabaseAsync('sistema.db');
    
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return false;
    }

    // Verificar se email já existe
    const existingUser = await db.getFirstAsync<Usuario>(
      'SELECT * FROM usuario WHERE email = ?', 
      [email]
    );
    
    if (existingUser) {
      Alert.alert('Erro', 'Este e-mail já está cadastrado!');
      return false;
    }

    await db.runAsync(
      'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)', 
      [nome, email, senhaHash]
    );
    
    return true;
  } catch (error: any) {
    console.error('Erro ao salvar o usuário:', error);
    
    if (error.message.includes('UNIQUE constraint failed')) {
      Alert.alert('Erro', 'Este e-mail já está cadastrado!');
    } else {
      Alert.alert('Erro', 'Falha ao salvar o usuário.');
    }
    return false;
  }
}

// Selecionar todos os usuários
export async function selectUsuarios(): Promise<Usuario[]> {
  try {
    const db = await SQLite.openDatabaseAsync('sistema.db');
    return await db.getAllAsync<Usuario>('SELECT * FROM usuario');
  } catch (error) {
    console.error('Erro ao buscar usuários', error);
    return [];
  }
}

// Deletar usuário
export async function deleteUsuario(id: number): Promise<boolean> {
  try {
    const db = await SQLite.openDatabaseAsync('sistema.db');
    await db.runAsync('DELETE FROM usuario WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Erro ao excluir usuário', error);
    return false;
  }
}

// Atualizar usuário
export async function updateUsuario(
  id: number,
  nome: string,
  email: string,
  senha: string = 'no-change' 
): Promise<boolean> {
  try {
    const db = await SQLite.openDatabaseAsync('sistema.db');
    
    if (!nome || !email) {
      Alert.alert('Erro', 'Nome e e-mail são obrigatórios!');
      return false;
    }

    // Verificar conflito de e-mail
    const existingUser = await db.getFirstAsync<Usuario>(
      'SELECT * FROM usuario WHERE email = ? AND id != ?', 
      [email, id]
    );
    
    if (existingUser) {
      Alert.alert('Erro', 'Este e-mail já está sendo usado por outro usuário!');
      return false;
    }

    let updateQuery = 'UPDATE usuario SET nome = ?, email = ?';
    const params: any[] = [nome, email];

    // Atualizar senha apenas se for fornecida
    if (senha !== 'no-change') {
      const senhaHash = await hashSenha(senha);
      updateQuery += ', senha = ?';
      params.push(senhaHash);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await db.runAsync(updateQuery, params);
    return true;
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error);
    
    if (error.message.includes('UNIQUE constraint failed')) {
      Alert.alert('Erro', 'Este e-mail já está cadastrado!');
    } else {
      Alert.alert('Erro', 'Falha ao atualizar o usuário.');
    }
    return false;
  }
}

// Função para login
export async function loginUsuario(email: string, senha: string): Promise<Usuario | null> {
  try {
    const db = await SQLite.openDatabaseAsync('sistema.db');
    const senhaHash = await hashSenha(senha);
    
    const usuario = await db.getFirstAsync<Usuario>(
      'SELECT * FROM usuario WHERE email = ? AND senha = ?', 
      [email, senhaHash]
    );
    
    return usuario;
  } catch (error) {
    console.error('Erro ao verificar login:', error);
    return null;
  }
}