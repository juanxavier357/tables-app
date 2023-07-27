import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { FIREBASE_AUTH, FIREBASE_STORAGE } from "../../FirebaseConfig";
import * as ImagePicker from "expo-image-picker";

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    // Obtenemos los datos del usuario actual desde Firebase Authentication
    const currentUser = FIREBASE_AUTH.currentUser;
    if (currentUser) {
      const { displayName, email, photoURL } = currentUser;
      setUserData({ displayName, email, photoURL });
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

  const { displayName, email, photoURL } = userData;

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("Permiso denegado para acceder a la galería de imágenes");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error("Error al cargar la imagen");
      }

      const blob = await response.blob();

      const currentUser = FIREBASE_AUTH.currentUser;
      const storageRef = FIREBASE_STORAGE.storage().ref();
      const imageRef = storageRef.child(`profile/${currentUser.uid}/image.jpg`);

      await imageRef.put(blob);

      const downloadURL = await imageRef.getDownloadURL();
      console.log("Imagen subida exitosamente a Firebase:", downloadURL);

      return downloadURL;
    } catch (error) {
      console.log("Error al subir la imagen a Firebase:", error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      {userData && (
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : photoURL
                  ? { uri: photoURL }
                  : require("../../assets/images/user1.jpg")
              }
              style={styles.avatar}
            />
          </View>
          <Text style={styles.displayName}>Usuario: {displayName}</Text>
          <Text style={styles.email}>Correo: {email}</Text>
          <Button
            mode="contained"
            onPress={handleChoosePhoto}
            style={styles.button}
          >
            Cambiar foto
          </Button>
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
  },
  email: {
    fontSize: 16,
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    marginVertical: 10,
    width: "45%",
  },
});

export default Profile;
