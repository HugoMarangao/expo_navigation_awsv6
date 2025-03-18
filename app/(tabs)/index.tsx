import React, { useEffect, useState } from 'react';
import {
  View, Image, StyleSheet, TextInput, FlatList,
  ActivityIndicator, Text, Dimensions, RefreshControl,
  Platform, StatusBar,
  TouchableOpacity
} from 'react-native';
import { generateClient } from '@aws-amplify/api';
import { listProducts } from '../../src/graphql/queries';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUrl } from '@aws-amplify/storage';
import { router } from 'expo-router';

const client = generateClient();
const windowWidth = Dimensions.get('window').width;

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string; // chave da imagem no Storage
  category?: string;
  imageUrl?: string; // URL gerada para exibição na home
};

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, products]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const result = await client.graphql({ query: listProducts }) as any;
      const items: Product[] = result.data.listProducts.items;

      // Para exibição na Home, gera a URL com token válido
      const productsWithUrls = await Promise.all(
        items.map(async (product) => {
          if (product.image) {
            const { url } = await getUrl({
              key: product.image,
              options: { accessLevel: 'guest' },
            });
            // Armazena a URL gerada e mantém a chave original
            return { ...product, imageUrl: url.toString() };
          }
          return product;
        }),
      );

      setProducts(productsWithUrls);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
    setLoading(false);
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts().finally(() => setRefreshing(false));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.headerContainer}>
          <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.logo} />
          <TextInput
            style={styles.input}
            placeholder="Buscar produtos..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filteredProducts}
            numColumns={2}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productItem}
                onPress={() =>
                  // Passa os dados do produto e a chave da imagem para a tela de detalhes
                  router.push({ pathname: `/[id]`, params: { ...item, imageKey: item.image } })
                }
              >
                {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.productImage} />}
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#fff',
  },
  productItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    margin: 6,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
    textAlign: 'center',
  },
});
