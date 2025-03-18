// app/(drawer)/profile.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as Auth from '@aws-amplify/auth';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      // Obtém as informações básicas do usuário
      const currentUser = await Auth.getCurrentUser();
      console.log('Current user:', currentUser);

      // Obtém os atributos do usuário; pode ser um array ou um objeto
      const attributesResult = await Auth.fetchUserAttributes();
      console.log('User attributes (result):', attributesResult);

      // Se for array, converte para objeto; se não, já está em formato de objeto
      const attributesObject = Array.isArray(attributesResult)
        ? attributesResult.reduce((acc, attribute) => {
            acc[attribute.Name] = attribute.Value;
            return acc;
          }, {})
        : attributesResult;
      
      console.log('User attributes (object):', attributesObject);

      // Atualiza o estado unindo as informações básicas com os atributos
      setUser({
        ...currentUser,
        attributes: attributesObject,
      });
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
    }
  };

  const handleUpdate = () => {
    Alert.alert('Atualizar', 'Função de atualizar ainda não implementada.');
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              // Implemente sua lógica de deleção de conta via API customizada ou função Lambda
              Alert.alert('Conta excluída', 'Sua conta foi excluída com sucesso.');
            } catch (error) {
              console.error('Erro ao excluir conta:', error);
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Carregando informações...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Perfil do Usuário</Text>
      <Text>Username: {user.username}</Text>
      <Text>Email: {user.attributes?.email || 'N/A'}</Text>
      <Text>Nome: {user.attributes?.name || 'N/A'}</Text>
      <Text>Endereço: {user.attributes?.address || 'N/A'}</Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Atualizar Informações" onPress={handleUpdate} />
      </View>
      <View style={{ marginTop: 20 }}>
        <Button title="Deslogar" onPress={handleSignOut} />
      </View>
      <View style={{ marginTop: 20 }}>
        <Button title="Excluir Conta" color="red" onPress={handleDeleteAccount} />
      </View>
    </SafeAreaView>
  );
}
