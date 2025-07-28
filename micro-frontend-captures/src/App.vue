<template>
  <div class="container" style="padding: 2rem;">
    <h1 class="main-title">📍 GeoAPP - Sistema de Ubicaciones</h1>
    <p class="subtitle">Consulta y filtra las capturas geográficas registradas</p>

    <el-form :inline="true" class="filter-form" @submit.prevent="fetchCaptures">
      <el-form-item label="📅 Fecha inicio">
        <el-date-picker
          v-model="filters.startDate"
          type="date"
          placeholder="Selecciona fecha inicio"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          clearable
          style="width: 200px;"
        />
      </el-form-item>

      <el-form-item label="📅 Fecha fin">
        <el-date-picker
          v-model="filters.endDate"
          type="date"
          placeholder="Selecciona fecha fin"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          clearable
          style="width: 200px;"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchCaptures" size="default">
          🔍 Filtrar Registros
        </el-button>
        <el-button @click="resetFilter" size="default">
          🗑️ Limpiar Filtros
        </el-button>
      </el-form-item>
    </el-form>

    <div class="table-container">
      <el-table
        :data="captures"
        style="width: 100%;"
        v-loading="loading"
        element-loading-text="Cargando capturas..."
        :empty-text="!loading ? 'No hay registros disponibles' : ''"
        stripe
      >
        <el-table-column prop="latitude" label="📍 Latitud"  />
        <el-table-column prop="longitude" label="📍 Longitud"  />
        <el-table-column label="🕐 Fecha y Hora" >
          <template #default="scope">
            {{ formatDate(scope.row.captured_at) }}
          </template>
        </el-table-column>
        <el-table-column prop="device_brand" label="📱 Marca"  />
        <el-table-column prop="device_model" label="📲 Modelo"  />
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const captures = ref([])
    const loading = ref(false)

    const filters = ref({
      startDate: null,
      endDate: null,
    })

    const API_URL = 'https://geoapp-production.up.railway.app/captures' 

    const fetchCaptures = async () => {
      loading.value = true
      try {
        let url = API_URL
        const params = {}

        if (filters.value.startDate) params.start_date = filters.value.startDate
        if (filters.value.endDate) params.end_date = filters.value.endDate

        const response = await axios.get(url, { params })
        captures.value = response.data
      } catch (error) {
        console.error('Error al cargar capturas:', error)
        alert('Error al cargar datos. Revisa la consola.')
      }
      loading.value = false
    }

    const resetFilter = () => {
      filters.value.startDate = null
      filters.value.endDate = null
      fetchCaptures()
    }

    // Formatear fecha para mostrar en zona horaria de Bogotá
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      
      // Crear opciones para formato en zona horaria de Bogotá
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Bogota',
        hour12: false // Formato 24 horas
      }
      
      return date.toLocaleString('es-CO', options)
    }

    onMounted(() => {
      fetchCaptures()
    })

    return { captures, loading, filters, fetchCaptures, resetFilter, formatDate }
  },
}
</script>

<style>
.container {
  max-width: 1200px;
  margin: auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.main-title {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  font-weight: 600;
}

.subtitle {
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  font-style: italic;
}

.filter-form {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  width: 100%;
}

.el-form-item__label {
  font-weight: 600 !important;
  color: #2c3e50 !important;
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.el-table th {
  background-color: #3498db !important;
  color: white !important;
  font-weight: 600 !important;
}
</style>
