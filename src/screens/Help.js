// En HelpScreen.js

import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Help = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ayuda y Soporte</Text>
      <Text style={styles.content}>
        Bienvenido a la página de ayuda de nuestra aplicación. Aquí puedes
        encontrar información sobre cómo utilizar la app y resolver problemas
        comunes. Si necesitas asistencia adicional, por favor contáctanos a
        support@appexample.com
      </Text>
      {/* Agrega aquí cualquier otra información relevante para la ayuda */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
  },
});

export default Help;
