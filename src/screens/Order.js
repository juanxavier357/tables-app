import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function Order({ route }) {
  const { table } = route.params;
  const [numbers, setNumbers] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [ascendingOrder, setAscendingOrder] = useState(true);

  useEffect(() => {
    generateNumbers();
  }, []);

  function generateNumbers() {
    const allOptions = [];
    for (let i = 1; i <= 12; i++) {
      allOptions.push(table * i);
    }

    // Shuffle the numbers
    const shuffledNumbers = allOptions.sort(() => Math.random() - 0.5);
    setNumbers(shuffledNumbers);
  }

  function handleNumberPress(number) {
    if (selectedNumber === null) {
      setSelectedNumber(number);
    } else {
      // Swap the numbers
      const updatedNumbers = [...numbers];
      const selectedIndex = updatedNumbers.indexOf(selectedNumber);
      const numberIndex = updatedNumbers.indexOf(number);
      updatedNumbers[selectedIndex] = number;
      updatedNumbers[numberIndex] = selectedNumber;

      setNumbers(updatedNumbers);
      setSelectedNumber(null);
    }
  }

  function checkOrder() {
    const sortedNumbers = ascendingOrder
      ? numbers.slice().sort((a, b) => a - b)
      : numbers.slice().sort((a, b) => b - a);

    if (JSON.stringify(numbers) === JSON.stringify(sortedNumbers)) {
      showAlert("¡Orden correcto! ¡Felicidades!");
    } else {
      showAlert("El orden no es correcto. ¡Inténtalo de nuevo!");
    }
  }

  function resetGame() {
    setSelectedNumber(null);
    generateNumbers();
  }

  function showAlert(message) {
    Alert.alert(
      "Resultado",
      message,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elegir Respuesta</Text>
      <View style={styles.orderButtonContainer}>
        <TouchableOpacity
          style={[
            styles.orderButton,
            ascendingOrder && styles.selectedOrderButton,
          ]}
          onPress={() => setAscendingOrder(true)}
        >
          <Text
            style={[
              styles.orderButtonText,
              ascendingOrder && styles.selectedOrderButtonText,
            ]}
          >
            Ascendente
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.orderButton,
            !ascendingOrder && styles.selectedOrderButton,
          ]}
          onPress={() => setAscendingOrder(false)}
        >
          <Text
            style={[
              styles.orderButtonText,
              !ascendingOrder && styles.selectedOrderButtonText,
            ]}
          >
            Descendente
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        {numbers.map((number, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.numberButton,
              selectedNumber === number && styles.selectedButton,
            ]}
            onPress={() => handleNumberPress(number)}
          >
            <Text
              style={[
                styles.numberButtonText,
                selectedNumber === number && styles.selectedButtonText,
              ]}
            >
              {number}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.verifyButton]} onPress={checkOrder}>
          <Text style={styles.verifyButtonText}>Verificar Orden</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetButtonText}>Reiniciar Juego</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9EBB2",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#D32F2F",
  },
  orderButtonContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  orderButton: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: "#FFC107",
  },
  selectedOrderButton: {
    backgroundColor: "#FFA000",
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  selectedOrderButtonText: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  numberButton: {
    margin: 8,
    minWidth: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFA000",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#FFA000",
    borderWidth: 2,
    borderColor: "#FFC107",
  },
  numberButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  selectedButtonText: {
    color: "#fff",
  },
  buttons: {
    flexDirection: "row",
    marginTop: 20,
  },
  verifyButton: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  verifyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resetButton: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#E91E63",
    borderRadius: 4,
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
