import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  PanResponder,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";

const Learning = () => {
  const [selectedMultiplicando, setSelectedMultiplicando] = useState(null);
  const [selectedMultiplicador, setSelectedMultiplicador] = useState(null);
  const ScrollViewRef = useRef(null);
  const isFocused = useIsFocused();
  const [isHorizontal, setIsHorizontal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  const handleSelection = (multiplicando, multiplicador) => {
    setSelectedMultiplicando(multiplicando);
    setSelectedMultiplicador(multiplicador);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const TablaMultiplicar = ({ maxTabla }) => {
    const tabla = [];

    for (let i = 1; i <= maxTabla; i++) {
      const fila = [];
      for (let j = 1; j <= maxTabla; j++) {
        const resultado = i * j;
        const isSelected =
          i === selectedMultiplicando && j === selectedMultiplicador;

        fila.push(
          <TouchableOpacity
            key={j}
            onPress={() => handleSelection(i, j)}
            style={[
              styles.celda,
              isSelected && styles.celdaSeleccionada,
              { backgroundColor: i % 2 === 0 ? "#FFC107" : "#FF5722" },
            ]}
          >
            <Animated.View style={{ opacity: fadeAnim }}>
              <Text
                style={[styles.textoCelda, isSelected && { color: "#000" }]}
              >
                {isSelected ? String(resultado) : `${i} x ${j}`}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      }
      tabla.push(
        <View key={i} style={styles.filaTabla}>
          {fila}
        </View>
      );
    }

    return tabla;
  };

  const setScreenOrientation = async () => {
    if (isHorizontal) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
      );
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    }
  };

  useLayoutEffect(() => {
    setScreenOrientation();
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  useLayoutEffect(() => {
    setScreenOrientation();
  }, [isHorizontal]);

  useLayoutEffect(() => {
    if (isFocused) {
      setIsHorizontal(true);
      ScrollViewRef.current?.setNativeProps({
        scrollEnabled: true,
      });
    } else {
      setIsHorizontal(false);
      ScrollViewRef.current?.setNativeProps({
        scrollEnabled: false,
      });
    }
  }, [isFocused]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: () => {
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  return (
    <ScrollView
      ref={ScrollViewRef}
      contentContainerStyle={styles.scrollContainer}
      horizontal={true}
      scrollEnabled={!isFocused}
      {...panResponder.panHandlers}
    >
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.tablaContainer,
            { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
          ]}
        >
          <Text style={styles.titulo}>Tablas de multiplicar</Text>
          <TablaMultiplicar maxTabla={12} />
        </Animated.View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  tablaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#3F51B5",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  filaTabla: {
    flexDirection: "row",
    marginBottom: 10,
  },
  celda: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  celdaSeleccionada: {
    backgroundColor: "#4CAF50",
  },
  textoCelda: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default Learning;
