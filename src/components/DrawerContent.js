// DrawerContent.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import firebase from "firebase/app";

const DrawerContent = ({ navigation }) => {
  const handleLogout = () => {
    firebase.auth().signOut();
    navigation.closeDrawer();
    navigation.navigate("Iniciar sesión");
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView>
        <DrawerItem
          label="Inicio"
          onPress={() => navigation.navigate("Inicio")}
        />
        <DrawerItem
          label="Perfil"
          onPress={() => navigation.navigate("Perfil")}
        />
        <DrawerItem
          label="Desafío"
          onPress={() => navigation.navigate("Desafío")}
        />
        <DrawerItem
          label="Ayuda"
          onPress={() => navigation.navigate("Ayuda")}
        />
      </DrawerContentScrollView>
      <DrawerItem label="Cerrar Sesión" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DrawerContent;
