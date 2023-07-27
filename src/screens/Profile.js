import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Avatar } from "react-native-paper";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

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

  const { displayName, email, photoURL } = userData;

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("Permiso denegado para acceder a la galería de imágenes");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      uploadImage(result.assets[0]);
    }
  };

  const uploadImage = async (imageData) => {
    try {
      const data = new FormData();
      data.append("file", {
        uri: imageData.uri,
        type: imageData.type,
        name: "image.jpg",
      });

      const cloudinaryURL = "https://api.cloudinary.com/v1_1/dr4zkzpho/upload";
      const cloudinaryParams = {
        folder: "profile",
        overwrite: true,
        upload_preset: "_PerfilPhoto",
      };

      const response = await axios.post(cloudinaryURL, data, {
        params: cloudinaryParams,
      });
      console.log("Imagen subida exitosamente a Cloudinary:", response.data);
    } catch (error) {
      console.log("Error al subir la imagen a Cloudinary:", error);
    }
  };

  return (
    <View style={styles.container}>
      {userData && (
        <View style={styles.userInfo}>
          <Avatar.Image
            source={
              profileImage
                ? { uri: profileImage }
                : photoURL
                ? { uri: photoURL }
                : require("../../assets/images/user1.jpg")
            }
            style={styles.avatar}
          />
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
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
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
