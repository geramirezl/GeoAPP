import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  TextInput,
  Modal 
} from 'react-native';
import axios from 'axios';

export default function RecordsScreen({ navigation }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Cargar todos los registros
  const loadRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://geoapp-production.up.railway.app/captures');
      setRecords(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los registros');
    } finally {
      setLoading(false);
    }
  };

  // Cargar registros con filtro de fecha
  const loadFilteredRecords = async () => {
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Debes ingresar ambas fechas');
      return;
    }

    setLoading(true);
    try {
      // Obtener todos los registros y filtrar del lado cliente
      const response = await axios.get('https://geoapp-production.up.railway.app/captures');
      
      // Filtrar del lado cliente considerando la zona horaria de Bogotá
      const filteredRecords = response.data.filter(record => {
        const recordDate = new Date(record.captured_at);
        
        // Convertir la fecha del registro a fecha de Bogotá
        const bogotaDate = new Date(recordDate.getTime() - (5 * 60 * 60 * 1000));
        const recordDateString = bogotaDate.toISOString().split('T')[0];
        
        return recordDateString >= startDate && recordDateString <= endDate;
      });
      
      setRecords(filteredRecords);
      setShowFilters(false);
      
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los registros filtrados');
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha para mostrar en zona horaria de Bogotá
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Crear opciones para formato en zona horaria de Bogotá
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Bogota',
      hour12: false // Formato 24 horas
    };
    
    return date.toLocaleString('es-CO', options);
  };

  // Renderizar cada registro
  const renderRecord = ({ item }) => (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordDate}>{formatDate(item.captured_at)}</Text>
        <Text style={styles.recordDevice}>{item.device_brand} {item.device_model}</Text>
      </View>
      <View style={styles.recordLocation}>
        <Text style={styles.coordinates}>
          📍 Lat: {parseFloat(item.latitude).toFixed(6)}
        </Text>
        <Text style={styles.coordinates}>
          📍 Lng: {parseFloat(item.longitude).toFixed(6)}
        </Text>
      </View>
    </View>
  );

  useEffect(() => {
    loadRecords();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registros de Ubicación</Text>
      </View>

      {/* Botones de acción */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.actionButtonText}>🔍 Filtrar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#e74c3c' }]}
          onPress={() => loadRecords()}
        >
          <Text style={styles.actionButtonText}>📋 Ver Todo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de registros */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Cargando registros...</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={renderRecord}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay registros disponibles</Text>
            </View>
          }
        />
      )}

      {/* Modal de filtros */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilters}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filtrar por Fechas</Text>
          
          {/* Botón de ayuda para fecha de hoy */}
          <TouchableOpacity 
            style={styles.todayButton}
            onPress={() => {
              const today = new Date();
              const bogotaDate = new Date(today.getTime() - (5 * 60 * 60 * 1000));
              const dateString = bogotaDate.toISOString().split('T')[0];
              setStartDate(dateString);
              setEndDate(dateString);
            }}
          >
            <Text style={styles.todayButtonText}>📅 Usar fecha de hoy</Text>
          </TouchableOpacity>
          
          <Text style={styles.inputLabel}>Fecha de inicio (YYYY-MM-DD):</Text>
          <TextInput
            style={styles.dateInput}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="2025-07-28"
          />
          
          <Text style={styles.inputLabel}>Fecha de fin (YYYY-MM-DD):</Text>
          <TextInput
            style={styles.dateInput}
            value={endDate}
            onChangeText={setEndDate}
            placeholder="2025-07-28"
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.confirmButton]}
              onPress={loadFilteredRecords}
            >
              <Text style={styles.modalButtonText}>Filtrar</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 25,
    backgroundColor: '#2c3e50',
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
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingVertical: 25,
    backgroundColor: '#fff',
    elevation: 2,
  },
  actionButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    padding: 20,
    paddingBottom: 30,
  },
  recordCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  recordHeader: {
    marginBottom: 10,
  },
  recordDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  recordDevice: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  recordLocation: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10,
  },
  coordinates: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 2,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  todayButton: {
    backgroundColor: '#f39c12',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  todayButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#2c3e50',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  confirmButton: {
    backgroundColor: '#27ae60',
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
