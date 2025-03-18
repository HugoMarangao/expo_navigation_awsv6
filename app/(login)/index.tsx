// app/(login)/SignIn.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Auth from '@aws-amplify/auth';

export default function SignIn() {
  const router = useRouter();
  // Campo único que aceita username ou e-mail
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError(null);
  
    try {
      // Verifica se já existe usuário logado
      const currentUser = await Auth.getCurrentUser();
  
      if (currentUser) {
        console.log('Usuário já logado:', currentUser);
        router.replace('/(tabs)');
        setLoading(false);
        return;
      }
    } catch {
      console.log('Nenhum usuário logado, tentando login...');
    }
  
    // Se não tiver usuário logado, tenta fazer login normalmente
    try {
      const user = await Auth.signIn({ username: login, password });
      console.log('Usuário logado:', user);
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Erro de login:', err);
      setError(err.message || 'Erro ao fazer login.');
    }
  
    setLoading(false);
  }
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Username ou E-mail"
        value={login}
        onChangeText={setLogin}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Entrando...' : 'Entrar'}
        onPress={handleLogin}
        disabled={loading}
      />
      <Button
        title="Não tem conta? Cadastre-se"
        onPress={() => router.push('/(login)/SingUp')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
