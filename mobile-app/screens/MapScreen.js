import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import axios from 'axios';

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);   
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación actual');
    } finally {
      setLoading(false);
    }
  };

  //Función para enviar la ubicación al backend
  const sendLocationToServer = async () => {
    if (!location) {
      Alert.alert('Error', 'Primero debes obtener tu ubicación');
      return;
    }

    setLoading(true);
    try {
      // Obtener información completa del dispositivo
      const deviceBrand = Device.brand || 'Unknown Brand';
      const deviceModel = Device.modelName || Device.modelId || 'Unknown Model';
      
      // Usar la fecha/hora actual del dispositivo
      const now = new Date();
      
      await axios.post('https://geoapp-production.up.railway.app/captures', {
        capture:{
          latitude: location.latitude,
          longitude: location.longitude,
          captured_at: now.toISOString(),
          device_brand: deviceBrand,
          device_model: deviceModel,
        },
      });
      
      Alert.alert('¡Éxito!', 'Ubicación registrada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la ubicación');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header con botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Ubicación</Text>
      </View>

      {/* Mapa */}
      {region ? (
        <MapView style={styles.map} region={region} showsUserLocation={true}>
          <Marker coordinate={location} title="Tu ubicación" />
        </MapView>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
        </View>
      ) : (
        <View style={styles.noLocationContainer}>
          <Button title="Obtener ubicación" onPress={getCurrentLocation} />
        </View>
      )}

      {/* Botones */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.refreshButton]}
          onPress={getCurrentLocation} 
          disabled={loading}
        >
          <Text style={styles.buttonText}>🔄 Actualizar Ubicación</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.saveButton]}
          onPress={sendLocationToServer} 
          disabled={loading || !location}
        >
          <Text style={styles.buttonText}>💾 Registrar Ubicación</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 25,
    backgroundColor: '#3498db',
  },
  backButton: {
    marginRight: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  noLocationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    padding: 25,
    paddingBottom: 35,
    backgroundColor: '#fff',
  },
  actionButton: {
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  refreshButton: {
    backgroundColor: '#f39c12',
  },
  saveButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 20,
  },
});
