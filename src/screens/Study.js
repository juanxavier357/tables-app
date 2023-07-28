import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { shuffle } from "lodash";
import * as Speech from "expo-speech";

const Study = ({ route }) => {
  const { table } = route.params;
  const [tablaMultiplicaciones, setTablaMultiplicaciones] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const speechRef = useRef();
  const navigation = useNavigation();

  useEffect(() => {
      const handleBackPress = () => {
        navigation.goBack();
        return true; // Para evitar que el botón de retroceso propague el evento.
      };
      // Este listener se activará cuando el usuario presione el botón de retroceso del dispositivo.
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      // Limpia el listener cuando el componente se desmonta.
      return () => backHandler.remove();
    }, [navigation]);

  useEffect(() => {
    generarTablaMultiplicaciones();
    return () => {
      Speech.stop();
    };
  }, []);

  const speak = (text, index) => {
    if (speechRef.current && speechRef.current.isSpeakingAsync()) {
      Speech.stop();
    }
    setHighlightedIndex(index);
    speechRef.current = Speech.speak(text, {
      onStart: () => {
        setHighlightedIndex(index);
      },
      onDone: () => {
        setHighlightedIndex(-1);
      },
    });
  };

  const stopSpeaking = () => {
    if (speechRef.current && speechRef.current.isSpeakingAsync()) {
      Speech.stop();
      setHighlightedIndex(-1);
    }
  };

  const generarTablaMultiplicaciones = () => {
    const tablaMultiplicar = [];
    for (let i = 1; i <= 12; i++) {
      tablaMultiplicar.push({
        multiplicacion: `${table} × ${i} = ${table * i}`,
      });
    }
    setTablaMultiplicaciones(tablaMultiplicar);
  };

  const handleOrdenarDerecho = () => {
    generarTablaMultiplicaciones();
  };

  const handleOrdenarReversa = () => {
    setTablaMultiplicaciones([...tablaMultiplicaciones].reverse());
  };

  const handleMezclarAzar = () => {
    const tablaMezclada = shuffle([...tablaMultiplicaciones]);
    setTablaMultiplicaciones(tablaMezclada);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            speak(
              tablaMultiplicaciones
                .map((item) => item.multiplicacion)
                .join(", "),
              0
            )
          }
        >
          <Text style={styles.buttonText}>Escuchar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={stopSpeaking}>
          <Text style={styles.buttonText}>Detener</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tablaContainer}>
        {tablaMultiplicaciones.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tablaItem,
              highlightedIndex === index && styles.highlightedItem,
            ]}
            onPress={() => speak(item.multiplicacion, index)}
          >
            <Text style={styles.tablaItemText}>{item.multiplicacion}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleOrdenarDerecho}>
          <Text style={styles.buttonText}>Derecho</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleOrdenarReversa}>
          <Text style={styles.buttonText}>Reversa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleMezclarAzar}>
          <Text style={styles.buttonText}>Mezclar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF5722", // Naranja vibrante
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#FFF", // Texto blanco para mayor contraste
    fontSize: 16,
    fontWeight: "bold",
  },
  tablaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  tablaItem: {
    width: 150,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2196F3", // Azul vibrante
    margin: 5,
    borderRadius: 10,
  },
  highlightedItem: {
    backgroundColor: "#4CAF50", // Verde vibrante
  },
  tablaItemText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF", // Texto blanco para mayor contraste
  },
});

export default Study;
