// app/(login)/SignUp.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Auth from '@aws-amplify/auth';

export default function SignUp() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setLoading(true);
    setError(null);
    try {
      // Para contornar o erro de TS, fazemos um cast para "any"
      const signUpResult = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          'custom:address': nome,
          'custom:telefone': telefone, // ex.: "+5511999999999"
          'custom:endereco': endereco,
        },
      } as any);
      console.log('signUpResult:', JSON.stringify(signUpResult, null, 2));
      console.log('Usuário cadastrado:', signUpResult);
      // Dependendo do seu fluxo, pode ser necessário confirmar a conta antes de prosseguir
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Erro ao criar conta:', err);
      setError(err.message || 'Erro ao criar conta.');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={endereco}
        onChangeText={setEndereco}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone (ex: +5511999999999)"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      
      <Button
        title={loading ? 'Cadastrando...' : 'Cadastrar'}
        onPress={handleSignUp}
        disabled={loading}
      />
      <Button
        title="Já tem conta? Faça login"
        onPress={() => router.push('/(login)')}
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
