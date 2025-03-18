import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { generateClient } from '@aws-amplify/api';
import { createProduct } from '../../../src/graphql/mutations';
import { uploadData, getUrl } from '@aws-amplify/storage';
import * as ImagePicker from 'expo-image-picker';

const client = generateClient();

export default function AddProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  
  const cleanName = name.replace(/\s+/g, '_').toLowerCase();
  const filename = `products/${Date.now()}-${cleanName}.jpg`;

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function handleAddProduct() {
    if (!name || !price || !imageUri) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (nome, preço e imagem).');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      const cleanName = name.replace(/\s+/g, '_').toLowerCase(); // Remove espaços
      const filename = `products/${Date.now()}-${cleanName}.jpg`;
  
      await uploadData({
        key: filename,
        data: blob,
        options: { contentType: 'image/jpeg' },
      });
  
      const productInput = {
        name,
        description,
        price: parseFloat(price),
        image: filename, // Key correta, limpa sem espaços
        category,
      };
  
      await client.graphql({
        query: createProduct,
        variables: { input: productInput },
      });
  
      Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      setName('');
      setDescription('');
      setPrice('');
      setImageUri('');
      setCategory('');
    } catch (error: any) {
      console.error('Erro ao cadastrar produto:', error);
      Alert.alert('Erro', error.message || 'Erro ao cadastrar produto.');
    }
  
    setLoading(false);
  }
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Button title="Selecionar Imagem" onPress={pickImage} />
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.imagePreview} /> : null}
      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={category}
        onChangeText={setCategory}
      />
      <Button
        title={loading ? 'Cadastrando...' : 'Cadastrar Produto'}
        onPress={handleAddProduct}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
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
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 10,
    alignSelf: 'center',
  },
});
