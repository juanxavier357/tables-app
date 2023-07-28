import React, { useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Train({ route }) {
  const { table } = route.params;
  const navigation = useNavigation();

  const [isStudying, setIsStudying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = Array.from({ length: 12 }, (_, index) => ({
    operand1: table,
    operand2: index + 1,
    answer: table * (index + 1),
  }));

  const handleMemory = () => {
    navigation.navigate("Memoriza el orden", { table: table });
  };

  const handleComplete = () => {
    navigation.navigate("Completa la tabla", { table: table });
  };

  const handleOrder = () => {
    navigation.navigate("Ordena la tabla", { table: table });
  };

  const handleChoose = () => {
    navigation.navigate("Elige una opción", { table: table });
  };

  const handleDrag = () => {
    navigation.navigate("Arrastra y suelta", { table: table });
  };

  const handleStudy = () => {
    navigation.navigate("Estudiar", { table: table });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      setIsStudying(false);
    }
  };

  return (
    <View style={styles.container}>
      {isStudying ? (
        <View style={styles.studyContainer}>
          <Text style={styles.studyQuestion}>
            {questions[currentQuestion].operand1} x{" "}
            {questions[currentQuestion].operand2} =
          </Text>
          <Text style={styles.studyAnswer}>
            {questions[currentQuestion].answer}
          </Text>
          <Button
            title="Siguiente"
            onPress={handleNextQuestion}
            color="#FFC107"
          />
        </View>
      ) : (
        <>
          <Text style={styles.title}>Tabla de multiplicar del {table}</Text>
          <Image
            source={require("../../assets/images/despegue.jpg")}
            style={styles.image}
          />
          <Text style={styles.subTitle}>
            Elige la forma que quieres aprender
          </Text>
          <View style={styles.buttonsContainer}>
            <View style={styles.buttonContainer}>
              <Button
                title="Arrastrar"
                onPress={handleDrag}
                color="#2196F3" // Azul
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Completar"
                onPress={handleComplete}
                color="#4CAF50" // Verde
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Estudiar"
                onPress={handleStudy}
                color="#00BCD4" // Verde Azulado
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Elegir"
                onPress={handleChoose}
                color="#9C27B0" // Morado
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Memorizar"
                onPress={handleMemory}
                color="#FF5722" // Naranja
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Ordenar"
                onPress={handleOrder}
                color="#3F51B5" // Azul oscuro
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
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
    color: "#E91E63",
  },
  buttonsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonContainer: {
    margin: 10,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    minWidth: 200,
    width: "80%",
  },
  playButtonContainer: {
    margin: 10,
    borderRadius: 40,
    overflow: "hidden",
    elevation: 3,
    minWidth: 200,
    width: "80%",
  },
  subTitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#E91E63",
  },
  studyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  studyQuestion: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#2196F3",
  },
  studyAnswer: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#4CAF50",
  },
});
