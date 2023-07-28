import {
  Button,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignInMode, setIsSignInMode] = useState(true); // State to determine the mode: sign in or sign up

  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error) {
      console.log(error);
      alert("Falló al iniciar sesión: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      // Validar el formato del correo electrónico
      if (!email.includes("@")) {
        throw new Error("El correo electrónico no es válido");
      }

      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
      alert("¡Revisa tu correo!");
    } catch (error) {
      console.log(error);
      alert("Falló al crear una cuenta: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignInMode((prevMode) => !prevMode);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.content}>
        <Text style={styles.title}>
          Tablas de Multiplicar
        </Text>
        <Image
          source={require("../../assets/images/despegue.jpg")}
          style={styles.image}
        />
        <Text style={styles.title}>
          {isSignInMode ? "Iniciar Sesión" : "Crear una cuenta"}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          autoCapitalize="none"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={isSignInMode ? signIn : signUp}
            >
              <Text style={styles.buttonText}>
                {isSignInMode ? "Iniciar sesión" : "Crear una cuenta"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
              <Text style={styles.toggleButtonText}>
                {isSignInMode
                  ? "¿No tienes una cuenta? Crea una cuenta"
                  : "¿Ya tienes una cuenta? Inicia Sesión"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
  content: {
    alignItems: "center",
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
    color: "#2196F3",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleButton: {
    padding: 10,
    marginBottom: 10,
  },
  toggleButtonText: {
    color: "#2196F3",
    fontSize: 14,
  },
});

export default Login;
