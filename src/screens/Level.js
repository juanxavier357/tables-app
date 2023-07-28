import React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

export default function Level({ route, navigation }) {
  const { level, color } = route.params;
  const tablesStart = (level - 1) * 4 + 1;
  const tablesEnd = level * 4;

  const handleSelectTable = (table) => {
    navigation.navigate("Entrenar", { table });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color }]}>
        Tablas de multiplicar del {tablesStart} al {tablesEnd}
      </Text>
      <Image
        source={require("../../assets/images/despegue.jpg")}
        style={styles.image}
      />
      <Text style={styles.subTitle}>Elige la tabla que quieres aprender</Text>
      <View style={styles.buttonsContainer}>
        {[...Array(4)].map((_, index) => (
          <View key={index} style={styles.buttonContainer}>
            <Button
              title={`Tabla ${tablesStart + index}`}
              color={color}
              onPress={() => handleSelectTable(tablesStart + index)}
            />
          </View>
        ))}
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
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#E91E63",
  },
  buttonsContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  buttonContainer: {
    margin: 10,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    minWidth: 200,
  },
});
