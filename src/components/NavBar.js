import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const NavBar = ({
  onHome,
  onProfile,
  onChallenge,
  onHelp,
  onLogout,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onHome}>
        <Text style={styles.buttonText}>Inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onProfile}>
        <Text style={styles.buttonText}>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onChallenge}>
        <Text style={styles.buttonText}>Desafío</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onHelp}>
        <Text style={styles.buttonText}>Ayuda</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#2980b9",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NavBar;
