import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Profile',
            title: 'overview',
          }}
        />
        <Drawer.Screen
         options={{
            drawerLabel: 'Adiction item',
            title: 'overview',
          }}
          name="AddProduct" // This is the name of the page and must match the url from root
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
