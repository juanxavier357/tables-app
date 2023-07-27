import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
