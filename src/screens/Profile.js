import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { FIREBASE_AUTH, FIREBASE_STORAGE } from "../../FirebaseConfig";
import { updateProfile } from "firebase/auth";

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

  const choosePhoto = async () => {
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

        // Subir la imagen a Firebase Storage
        const storageRef = ref(FIREBASE_STORAGE, `profile/${userData.uid}`);
        const metadata = {
          contentType: "image/jpeg",
        };
        const uploadTask = uploadBytesResumable(
          storageRef,
          result.assets[0].uri,
          metadata
        );

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case "storage/unauthorized":
                // User doesn't have permission to access the object
                break;
              case "storage/canceled":
                // User canceled the upload
                break;

              // ...

              case "storage/unknown":
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              // Actualizar la foto de perfil del usuario en Firebase Authentication
              const currentUser = FIREBASE_AUTH.currentUser;
              updateProfile(currentUser, { photoURL: downloadURL });
              console.log("File available at", downloadURL);
            });
          }
        );

        console.log("Foto de perfil actualizada correctamente");
      }
    } catch (error) {
      console.log("Error al subir la imagen a Firebase:", error);
    }
  };

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
          <Button mode="contained" onPress={choosePhoto} style={styles.button}>
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
