import React, { useState, useEffect } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";

export default function Options({ route }) {
  const { table } = route.params;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const totalQuestions = 12;
  const [questions, setQuestions] = useState([]);
  const [sound, setSound] = React.useState();

  function generateQuestions(table) {
    const questions = [];
    const allOptions = [];
    for (let i = 1; i <= 12; i++) {
      allOptions.push(table * i);
    }

    for (let i = 0; i < totalQuestions; i++) {
      const question = {
        operand1: table,
        operand2: i + 1,
        answer: table * (i + 1),
        options: getUniqueOptions(allOptions, table * (i + 1)),
      };
      questions.push(question);
    }
    // Barajamos las preguntas aleatoriamente
    return questions.sort(() => Math.random() - 0.5);
  }

  function getUniqueOptions(allOptions, correctAnswer) {
    const uniqueOptions = [correctAnswer];
    while (uniqueOptions.length < 4) {
      const randomOption =
        allOptions[Math.floor(Math.random() * allOptions.length)];
      if (!uniqueOptions.includes(randomOption)) {
        uniqueOptions.push(randomOption);
      }
    }
    return uniqueOptions.sort(() => Math.random() - 0.5);
  }

  async function handleAnswer(answer) {
    if (answer === questions[currentQuestion].answer) {
      // Respuesta correcta
      setScore((prevScore) => prevScore + 1);

      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/correct.mp3")
      );
      setSound(sound);
      await sound.playAsync();
    } else {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/incorrect.mp3")
      );
      setSound(sound);
      await sound.playAsync();
    }

    if (currentQuestion === totalQuestions - 1) {
      // Fin del juego
      setGameOver(true);
    } else {
      // Siguiente pregunta
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    }
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    setCurrentQuestion(0);
    setScore(0);
    setGameOver(false);
    setQuestions(generateQuestions(table));
  }, [table]);

  if (!questions[currentQuestion]) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {!gameOver ? (
        <View>
          <Text style={styles.title}>¡Recuerda la tabla del {table}!</Text>
          <Text style={styles.title}>
            Pregunta {currentQuestion + 1} de {totalQuestions}
          </Text>
          <Image
            source={require("../../assets/images/despegue.jpg")}
            style={[styles.image, { alignSelf: "center" }]}
          />
          <Text style={styles.question}>
            {questions[currentQuestion].operand1} x{" "}
            {questions[currentQuestion].operand2}
          </Text>
          <View style={styles.answersContainer}>
            {questions[currentQuestion].options.map((option, index) => (
              <View key={index} style={styles.answerButtonContainer}>
                <Button
                  title={option.toString()}
                  onPress={() => handleAnswer(option)}
                />
              </View>
            ))}
          </View>
          <Text style={styles.score}>Puntuación: {score}</Text>
        </View>
      ) : (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>¡Juego terminado!</Text>
          <Text style={styles.finalScore}>Puntuación final: {score}</Text>
          <Button
            title="Volver a jugar"
            color="#9C27B0"
            onPress={() => {
              setGameOver(false);
              setCurrentQuestion(0);
              setScore(0);
              setQuestions(generateQuestions(table));
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#E91E63",
  },
  question: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#2196F3",
  },
  answersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  answerButtonContainer: {
    margin: 10,
    minWidth: 120,
  },
  score: {
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
  },
  gameOverContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#E91E63",
  },
  finalScore: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
});
