import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import Login from "./src/screens/Login";
import Profile from "./src/screens/Profile";
import Home from "./src/screens/Home";
import Level from "./src/screens/Level";
import Study from "./src/screens/Study";
import Learning from "./src/screens/Learning";
import Train from "./src/screens/Train";
import Complete from "./src/screens/Complete";
import DragDrop from "./src/screens/DragDrop";
import Memory from "./src/screens/Memory";
import Order from "./src/screens/Order";
import Options from "./src/screens/Options";
import DrawerContent from "./src/components/DrawerContent";
import Help from "./src/screens/Help";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="Perfil" component={Profile} />
      <InsideStack.Screen name="Inicio" component={Home} />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user);
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {user ? (
        <Drawer.Navigator
          drawerContent={(props) => <DrawerContent {...props} />}
        >
          <Drawer.Screen
            name="Tablas de Multiplicar"
            component={InsideLayout}
          />
          <Drawer.Screen name="Desafío" component={Learning} />
          <Drawer.Screen name="Ayuda" component={Help} />
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Iniciar sesión"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Inicio" component={Home} />
          <Stack.Screen name="Nivel" component={Level} />
          <Stack.Screen name="Estudiar" component={Study} />
          <Stack.Screen name="Aprendizaje" component={Learning} />
          <Stack.Screen name="Entrenar" component={Train} />
          <Stack.Screen name="Completa la tabla" component={Complete} />
          <Stack.Screen name="Arrastra y suelta" component={DragDrop} />
          <Stack.Screen name="Memoriza el orden" component={Memory} />
          <Stack.Screen name="Ordena la tabla" component={Order} />
          <Stack.Screen name="Elige una opción" component={Options} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
