import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { FIREBASE_AUTH, FIREBASE_STORE } from "../../FirebaseConfig";

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const currentUser = FIREBASE_AUTH.currentUser;
    const { displayName, email, photoURL, uid } = currentUser;
    if (currentUser) {
      setUserData({ displayName, email, photoURL, uid });
    }
  }, []);

  useEffect(() => {
    // Si el usuario sube una nueva imagen, actualizamos la fotoURL en los datos del usuario
    if (profileImage) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        photoURL: profileImage,
      }));
    }
  }, [profileImage]);

  const selectPhoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("Permiso denegado para acceder a la galería de imágenes");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Establecer la nueva imagen local
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error al subir la imagen a Firebase:", error);
    }
  };

  async function savePhoto() {
    try {
      const userCredential = await FIREBASE_AUTH.createUserWithEmailAndPassword(
        email,
        password
      );

      const user = userCredential.user;
      // Guardar el nombre de usuario en la base de datos
      await FIREBASE_STORE.collection("users").doc(user.uid).set({
        username: userName,
      });

      console.log(userCredential);
      alert("¡Revisa tu correo!");
    } catch (error) {
      console.log(error);
      alert("Falló al crear una cuenta: " + error.message);
    } finally {
      setLoading(false);
    }

    console.log("Foto de perfil actualizada correctamente");
  }

  return (
    <View style={styles.container}>
      {userData && (
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                userData.photoURL
                  ? { uri: userData.photoURL }
                  : require("../../assets/images/user1.jpg")
              }
              style={styles.avatar}
            />
          </View>
          <Text style={styles.displayName}>
            Usuario: {userData.displayName}
          </Text>
          <Text style={styles.email}>{userData.email}</Text>
          <Button
            title="Seleccionar imagen"
            onPress={selectPhoto}
            style={styles.button}
          />
          <Button
            title="Guardar cambios"
            onPress={savePhoto}
            style={styles.button}
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Inicio")}
          style={styles.button}
        >
          Inicio
        </Button>
        <Button
          mode="contained"
          onPress={() => FIREBASE_AUTH.signOut()}
          style={styles.button}
        >
          Cerrar sesión
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#2196F3", // Borde azul alrededor del avatar
  },
  avatar: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  displayName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2196F3", // Texto en color azul
  },
  email: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    marginVertical: 10,
    width: "45%",
    backgroundColor: "#2196F3",
    borderRadius: 8, // Bordes redondeados del botón
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default Profile;
