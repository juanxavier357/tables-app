import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList} from "react-native";
import { Button } from "react-native-paper";
import {
  FIREBASE_AUTH,
  FIREBASE_STORAGE,
  FIREBASE_DB,
} from "../../FirebaseConfig";
import * as ImagePicker from "expo-image-picker";

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  
  useEffect(() => {
    // Obtenemos los datos del usuario actual desde Firebase Authentication
    const currentUser = FIREBASE_AUTH.currentUser;
    if (currentUser) {
      const { displayName, email, photoURL } = currentUser;
      setUserData({ displayName, email, photoURL });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(FIREBASE_DB, "files"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("Nueva imagen ", change.doc.data());
          setFiles((prevFiles) => [...prevFiles, change.doc.data()]);
        }
      });
    });
    return () => unsubscribe();
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

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
      //Subir la imagen
      await uploadImage(result.assets[0].uri, "image");
    }
  };

  const uploadImage = async (uri, fileType) => {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error("Error al cargar la imagen");
      }
      const blob = await response.blob();

      const storageRef = ref(
        FIREBASE_STORAGE,
        "profile/" + new Date().getTime()
      );
      const uploadTask = uploadBytesResumable(storageRef, blob);

      // Escuchando los eventos
      uploadTask.on("state_changed", (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("La carga está en un " + progress + "% completado");
        setProgress(progress.toFixed());
      });

      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then(async (downloadURL) => {
            console.log("Archivo disponible en ", downloadURL)
            // Guardar registro
            await saveRecord(fileType, downloadURL, new Date().toISOString())
            setProfileImage("")
        })
      }
    } catch (error) {
      console.log("Error al subir la imagen a Firebase:", error);
  };

  const saveRecord = async (fileType, url, createdAt) => {
    try {
      const docRef = await addDoc(collection(FIREBASE_DB, "files"), {
        fileType,
        utl,
        createdAt,
      })
      console.log("Imagen guardada correctamente ", docRef.id)
    } catch (error) {
      console.error(error)
    }
  }

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
          <Text style={styles.email}>{email}</Text>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
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
