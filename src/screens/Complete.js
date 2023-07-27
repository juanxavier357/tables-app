import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

export default function Complete({ route }) {
  const { table } = route.params;

  const [completed, setCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [resultsVisible, setResultsVisible] = useState(false);

  useEffect(() => {
    setQuestions(generateQuestions(table));
  }, [table]);

  function generateQuestions(table) {
    const questions = [];
    const answers = [];
    for (let i = 1; i <= 10; i++) {
      const question = {
        operand1: table,
        operand2: i,
        answer: table * i,
      };
      questions.push(question);
      answers.push("");
    }
    setUserAnswers(answers);
    return questions;
  }

  function handleInputChange(text, index) {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = text;
    setUserAnswers(updatedAnswers);
  }

  function checkAnswers() {
    const allAnswered = userAnswers.every((answer) => answer !== "");
    if (allAnswered) {
      const validAnswers = userAnswers.every((answer) => !isNaN(answer));
      if (validAnswers) {
        const correctAnswers = userAnswers.every(
          (answer, index) => parseInt(answer, 10) === questions[index].answer
        );
        setCompleted(correctAnswers);
        setResultsVisible(true);
      }
    }
  }

  function resetGame() {
    setQuestions(generateQuestions(table));
    setCompleted(false);
    setUserAnswers(Array.from({ length: 10 }, () => ""));
    setResultsVisible(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {!completed ? (
          <>
            {questions.map((question, index) => (
              <View key={index} style={styles.questionContainer}>
                <Text style={styles.questionText}>
                  {question.operand1} x {question.operand2} =
                </Text>
                <View
                  style={[
                    styles.inputField,
                    userAnswers[index] === "" && styles.emptyInputField,
                    userAnswers[index] !== "" &&
                      (parseInt(userAnswers[index], 10) === question.answer
                        ? styles.correctInputField
                        : styles.incorrectInputField),
                  ]}
                >
                  <TextInput
                    style={[
                      styles.inputText,
                      userAnswers[index] !== "" &&
                        (parseInt(userAnswers[index], 10) === question.answer
                          ? styles.correctInputText
                          : styles.incorrectInputText),
                    ]}
                    keyboardType="numeric"
                    onChangeText={(text) => handleInputChange(text, index)}
                    value={userAnswers[index]}
                  />
                </View>
              </View>
            ))}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                <Text style={styles.resetButtonText}>Reiniciar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={checkAnswers}
              >
                <Text style={styles.verifyButtonText}>Verificar</Text>
              </TouchableOpacity>
            </View>
            {resultsVisible && (
              <>
                <Text style={styles.resultsTitle}>Resultados:</Text>
                <View style={styles.resultsContainer}>
                  {questions.map(
                    (question, index) =>
                      (userAnswers[index] === "" ||
                        parseInt(userAnswers[index], 10) !==
                          question.answer) && (
                        <View key={index} style={styles.resultItem}>
                          <Text style={styles.resultQuestion}>
                            {question.operand1} x {question.operand2} =
                          </Text>
                          <Text
                            style={[
                              styles.resultAnswer,
                              styles.incorrectAnswer,
                            ]}
                          >
                            {question.answer}
                          </Text>
                        </View>
                      )
                  )}
                </View>
              </>
            )}
          </>
        ) : (
          <View style={styles.completedContainer}>
            <Text style={styles.completedTitle}>¡Completado!</Text>
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={resetGame}
            >
              <Text style={styles.playAgainButtonText}>Jugar de nuevo</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  questionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    marginRight: 10,
    color: "#2196F3",
  },
  inputField: {
    width: 60,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#2196F3",
    borderRadius: 4,
  },
  emptyInputField: {
    backgroundColor: "#F1F1F1",
  },
  correctInputField: {
    backgroundColor: "#C8E6C9",
  },
  incorrectInputField: {
    backgroundColor: "#FFCDD2",
  },
  inputText: {
    color: "#2196F3",
    fontSize: 18,
  },
  correctInputText: {
    color: "#4CAF50",
  },
  incorrectInputText: {
    color: "#F44336",
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
  },
  verifyButton: {
    margin: 10,
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
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#E91E63",
    borderRadius: 4,
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  completedContainer: {
    alignItems: "center",
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4CAF50",
  },
  playAgainButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  playAgainButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#2196F3",
  },
  resultsContainer: {
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  resultQuestion: {
    fontSize: 16,
    color: "#2196F3",
  },
  resultAnswer: {
    fontSize: 16,
  },
  incorrectAnswer: {
    color: "#F44336",
  },
});
