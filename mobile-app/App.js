import { StyleSheet, Text, View, Button, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function App() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);   
  const [loading, setLoading] = useState(true);

  //Función para obtener la ubicación actual del dispositivo
  const getCurrentLocation = async () => {
    setLoading(true);
    try {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación del dispositivo');
        setLoading(false);
        return;
      }

      // Obtener la ubicación actual
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Enviar la ubicación al backend
      await sendLocationToServer(currentLocation.coords);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación actual');
    } finally {
      setLoading(false);
    }
  };

  //Función para enviar la ubicación al backend
  const sendLocationToServer = async (coords) => {
    try {
      await axios.post('http://192.168.10.4:3000/captures', {
        capture:{
          latitude: coords.latitude,
          longitude: coords.longitude,
          captured_at: new Date().toISOString(),
          device_brand: 'Expo',
          device_model: 'React Native',
        },
      });
      console.log('Ubicación enviada exitosamente al servidor');
    } catch (error) {
      console.log('Error al enviar la ubicación al servidor:', error.message);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);


  return (
    <View style={styles.container}>
      {region ? (
        <MapView style={styles.map} region={region} showsUserLocation={true}>
          <Marker coordinate={location} title="Tu ubicación" />
        </MapView>
      ) : loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.noLocationContainer}>
          <Button title="Obtener ubicación" onPress={getCurrentLocation} />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Registrar ubicación" onPress={getCurrentLocation} disabled={loading} />
      </View>

      {loading && <ActivityIndicator style={styles.loading} size="small" color="#0000ff" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: '60%',
  },
  loading: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
  noLocationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
