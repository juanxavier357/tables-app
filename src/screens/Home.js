import React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

export default function Home({ navigation }) {
  const handleSelectLevel = (level, color) => {
    navigation.navigate("Nivel", { level, color });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tablas de Multiplicar</Text>
        <Text style={styles.title}>Bienvenid@s</Text>
        <Image
          source={require("../../assets/images/despegue.jpg")}
          style={styles.image}
        />
        <Text style={styles.subTitle}>Elige el nivel que quieres aprender</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button
            title="Nivel 1"
            color="#FF9800"
            onPress={() => handleSelectLevel(1, "#FF9800")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Nivel 2"
            color="#E91E63"
            onPress={() => handleSelectLevel(2, "#E91E63")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Nivel 3"
            color="#03A9F4"
            onPress={() => handleSelectLevel(3, "#03A9F4")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#2196F3",
  },
  subTitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#E91E63",
  },
  buttonsContainer: {
    alignItems: "center",
  },
  buttonContainer: {
    margin: 10,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    minWidth: 200,
  },
});
