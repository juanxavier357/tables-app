import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { DraxProvider, DraxView } from "react-native-drax";

const DragDrop = ({ route }) => {
  const { table } = route.params;
  const multiplicadores = Array.from({ length: 12 }, (_, index) => index + 1);
  const productos = multiplicadores.map((num) => num * table);
  const [operaciones, setOperaciones] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [correctos, setCorrectos] = useState(Array(12).fill(false));
  const [draggingItem, setDraggingItem] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const nuevasOperaciones = multiplicadores.map((num) => ({
      operation: `${num} x ${table}`,
      id: num,
    }));
    setOperaciones(nuevasOperaciones);

    const nuevasRespuestas = productos.map((num) => ({
      value: num.toString(),
      id: num,
      isCorrect: false,
    }));
    // Desordenar las respuestas
    nuevasRespuestas.sort(() => Math.random() - 0.5);
    setRespuestas(nuevasRespuestas);
  }, [table]);

  const handleDragEnd = () => {
    if (draggingItem !== null) {
      const respuesta = respuestas[draggingItem];
      const index = multiplicadores.findIndex((num) => num === respuesta.id);
      if (index !== -1 && respuesta.isCorrect) {
        const correctosTemp = [...correctos];
        correctosTemp[index] = true;
        setCorrectos(correctosTemp);
        const nuevasRespuestas = respuestas.map((r, i) => {
          if (i === draggingItem) {
            return { ...r, isCorrect: true };
          }
          return r;
        });
        setRespuestas(nuevasRespuestas);
        setCompletedCount((prev) => prev + 1);
      }
      setDraggingItem(null);
    }
  };

  const handleDrop = (payload, receiverId) => {
    const respuesta = respuestas[payload];
    const index = multiplicadores.findIndex((num) => num === receiverId);
    if (index !== -1) {
      if (respuesta.id === multiplicadores[index] * table) {
        const correctosTemp = [...correctos];
        correctosTemp[index] = true;
        setCorrectos(correctosTemp);
        const nuevasRespuestas = respuestas.map((r, i) => {
          if (i === payload) {
            return { ...r, isCorrect: true };
          }
          return r;
        });
        setRespuestas(nuevasRespuestas);
        setCompletedCount((prev) => prev + 1);
      }
    }
  };

  const handleEnter = (index) => {
    setDraggingItem(index);
  };

  const handleLeave = () => {
    setDraggingItem(null);
  };

  const handleRestart = () => {
    setCorrectos(Array(12).fill(false));
    setCompletedCount(0);

    const nuevasRespuestas = productos.map((num) => ({
      value: num.toString(),
      id: num,
      isCorrect: false,
    }));
    // Desordenar las respuestas
    nuevasRespuestas.sort(() => Math.random() - 0.5);
    setRespuestas(nuevasRespuestas);
  };

  const { width } = Dimensions.get("window");
  const itemWidth = (width - 40) / 3;

  const renderAnswerItem = ({ item, index }) => {
    if (!item.isCorrect) {
      return (
        <DraxView
          key={item.id}
          style={[styles.draggable, { width: itemWidth }]}
          draggingStyle={styles.dragging}
          payload={index} // Usamos el índice como payload
          onDragEnd={handleDragEnd}
          onEnter={() => handleEnter(index)}
          onLeave={handleLeave}
        >
          <Text style={styles.text}>{item.value}</Text>
        </DraxView>
      );
    }
    return null;
  };

  const renderOperationItem = ({ item }) => {
    return (
      <DraxView
        style={[
          styles.receiver,
          correctos[item.id - 1] && styles.correct,
          { width: itemWidth },
        ]}
        receivingStyle={styles.receiving}
        payload={item.id}
        onReceiveDragDrop={({ dragged: { payload } }) =>
          handleDrop(payload, item.id)
        }
      >
        <Text style={styles.text}>{item.operation}</Text>
      </DraxView>
    );
  };

  return (
    <DraxProvider>
      <View style={styles.container}>
        <FlatList
          data={respuestas}
          renderItem={renderAnswerItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.column}
        />
        <SafeAreaView style={styles.column}>
          <FlatList
            data={operaciones}
            renderItem={renderOperationItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
          />
        </SafeAreaView>
      </View>
      {completedCount === multiplicadores.length && (
        <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
          <Text style={styles.restartButtonText}>Reiniciar</Text>
        </TouchableOpacity>
      )}
    </DraxProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  column: {
    flexGrow: 1,
  },
  draggable: {
    margin: 5,
    backgroundColor: "lightgreen",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  receiver: {
    margin: 5,
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  receiving: {
    opacity: 0.5,
  },
  correct: {
    backgroundColor: "green",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dragging: {
    opacity: 0.5,
  },
  restartButton: {
    backgroundColor: "lightblue",
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  restartButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default DragDrop;
