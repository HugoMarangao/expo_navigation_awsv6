import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUrl } from '@aws-amplify/storage';

const windowWidth = Dimensions.get('window').width;

export default function ProductDetail() {
  const { id, name, description, price, category, imageKey } = useLocalSearchParams();
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    async function fetchImageUrl() {
      if (imageKey) {
        try {
          const { url } = await getUrl({
            key: imageKey,
            options: { accessLevel: 'guest' },
          });
          setImageUrl(url.toString());
        } catch (error) {
          console.error('Erro ao buscar URL da imagem:', error);
        }
      }
    }
    fetchImageUrl();
  }, [imageKey]);

  function handlePurchase() {
    Alert.alert('Compra efetuada', `Você adquiriu: ${name}`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
        )}
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.price}>R$ {parseFloat(price as string).toFixed(2)}</Text>
        <View style={styles.button}>
          <Button title="Adquirir" onPress={handlePurchase} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width - 32,
    height: Dimensions.get('window').width - 32,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  category: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    width: '100%',
  },
});
