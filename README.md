# GeoAPP - Plataforma de Captura de Ubicaciones

Una plataforma completa para capturar, almacenar y visualizar ubicaciones geográficas, desarrollada con arquitectura de microservicios.

##  Descripción del Proyecto

GeoAPP es una solución integral que permite a los usuarios capturar ubicaciones desde dispositivos móviles y visualizarlas a través de una interfaz web moderna. El sistema está diseñado con una arquitectura escalable que incluye una aplicación móvil, API backend, y frontend web.

##  Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Backend API   │    │  Web Frontend   │
│  (React Native) │◄──►│    (Rails 8)    │◄──►│    (Vue.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │    Database     │
                       └─────────────────┘
```

##  Tecnologías Utilizadas

### Backend API
- **Ruby on Rails 8** - Framework web principal
- **PostgreSQL** - Base de datos principal
- **Railway** - Plataforma de despliegue

### Aplicación Móvil
- **React Native** - Framework móvil multiplataforma
- **Expo SDK 53** - Herramientas de desarrollo
- **React Navigation** - Navegación entre pantallas
- **Expo Location** - Servicios de geolocalización
- **EAS Build** - Servicio de compilación en la nube

### Frontend Web
- **Vue.js 3** - Framework web progresivo
- **Element Plus** - Librería de componentes UI
- **Axios** - Cliente HTTP
- **Docker + Nginx** - Contenedorización y servidor web
- **Railway** - Plataforma de despliegue

##  Funcionalidades

### Aplicación Móvil
-  Captura de ubicación actual con GPS
-  Geocodificación inversa (coordenadas → dirección)
-  Navegación entre pantallas (Home, Mapa, Registros)
-  Visualización de registros históricos
-  Interfaz nativa para Android e iOS

### Backend API
-  API RESTful para gestión de ubicaciones
-  Filtrado por fechas con soporte de zona horaria
-  Almacenamiento en PostgreSQL
-  Configuración CORS para múltiples orígenes
-  Desplegado en Railway con dominio personalizado

### Frontend Web
-  Visualización de ubicaciones en tabla
-  Filtros por fecha (formato Bogotá UTC-5)
-  Interfaz responsive con Element Plus
-  Paginación y ordenamiento
-  Desplegado en Railway

## 🗄️ Estructura de la Base de Datos

Ver [diagrama detallado](./database/database_diagram.md) y [script de creación](./database/create_database.sql).

**Tabla principal: `captures`**
- `id` - Identificador único
- `latitude` - Latitud (DECIMAL 10,8)
- `longitude` - Longitud (DECIMAL 11,8)
- `address` - Dirección geocodificada
- `device_info` - Información del dispositivo (JSONB)
- `created_at` / `updated_at` - Timestamps automáticos

##  Cómo Probar la Plataforma

### 1. Backend API (Desplegado)
**URL:** https://geoapp-production.up.railway.app

**Endpoints disponibles:**
```bash
# Listar todas las ubicaciones
GET https://geoapp-production.up.railway.app/captures

# Crear nueva ubicación
POST https://geoapp-production.up.railway.app/captures
Content-Type: application/json
{
  "capture": {
    "latitude": 19.4326,
    "longitude": -99.1332,
    "captured_at": "2025-07-26T18:00:00Z",
    "device_brand": "Samsung",
    "device_model": "Galaxy S20"
  }
}


# Filtrar por fecha
GET https://geoapp-production.up.railway.app/captures?date=2025-07-28
```

### 2. Frontend Web (Desplegado)
**URL:** https://micro-frontend-captures-production.up.railway.app

**Funcionalidades disponibles:**
- Visualización de todas las ubicaciones capturadas
- Filtros por fecha con selector de calendario
- Formato de fechas en zona horaria de Bogotá
- Interfaz responsive para móvil y desktop

### 3. Aplicación Móvil

1. Descargar APK desde las releases de GitHub
2. Instalar en dispositivo Android
3. Permitir instalación de fuentes desconocidas
4. Abrir la app y permitir permisos de ubicación

##  Ejecución Local del Proyecto Completo

### Prerrequisitos
- **Node.js** 18+ y npm
- **Ruby** 3.2+ y Bundler
- **PostgreSQL** 14+
- **Git**

### 1. Configuración de la Base de Datos
```bash
# Instalar PostgreSQL (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib

# Crear usuario y base de datos
sudo -u postgres createuser -s geoapp
sudo -u postgres createdb geoapp_development
sudo -u postgres createdb geoapp_test

# Crear la estructura (usar el script en database/)
psql -U geoapp -d geoapp_development -f database/create_database.sql
```

### 2. Backend API (Rails)
```bash
# Clonar repositorio
git clone https://github.com/usuario/geoapp
cd geoapp/backend-api

# Instalar dependencias Ruby
bundle install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración local

# Ejecutar migraciones
rails db:create
rails db:migrate

# Iniciar servidor (puerto 3000)
rails server
```

### 3. Frontend Web (Vue.js)
```bash
# En otra terminal, ir al frontend
cd ../micro-frontend-captures

# Instalar dependencias
npm install

# Configurar variables de entorno
echo "VUE_APP_API_URL=http://localhost:3000" > .env.local

# Iniciar servidor de desarrollo (puerto 8080)
npm run serve
```

### 4. Aplicación Móvil (React Native)
```bash
# En otra terminal, ir a la app móvil
cd ../mobile-app

# Instalar dependencias
npm install

# Configurar API URL local en app.json
# Cambiar la URL a "http://tu-ip-local:3000"

# Iniciar Expo (puerto 19000)
npx expo start

# Escanear QR con Expo Go o usar emulador
```

### 5. URLs Locales
- **Backend API**: http://localhost:3000
- **Frontend Web**: http://localhost:8080  
- **Mobile App**: Expo DevTools

### Build Personalizado con EAS (Opcional)
```bash
# Instalar EAS CLI
npm install -g @expo/cli eas-cli

# Configurar proyecto
eas build:configure

# Compilar APK
eas build --profile preview --platform android
```

##  Estructura del Proyecto

```
GeoAPP/
├── backend-api/                 # API Rails 8
│   ├── app/
│   │   ├── controllers/         # Controladores de la API
│   │   │   ├── application_controller.rb
│   │   │   └── captures_controller.rb
│   │   ├── models/             # Modelos ActiveRecord
│   │   │   ├── application_record.rb
│   │   │   └── capture.rb
│   │   └── views/              # Vistas (JSON responses)
│   ├── config/                 # Configuración Rails
│   │   ├── database.yml        # Configuración BD
│   │   ├── routes.rb          # Rutas de la API
│   │   └── environments/       # Configuraciones por entorno
│   ├── db/                     # Base de datos
│   │   ├── migrate/           # Migraciones
│   │   └── schema.rb          # Esquema actual
│   ├── Dockerfile             # Configuración Docker
│   ├── Gemfile               # Dependencias Ruby
│   └── Procfile              # Configuración Railway
│
├── mobile-app/                 # App React Native + Expo
│   ├── screens/               # Pantallas de la app
│   │   ├── HomeScreen.js      # Pantalla principal
│   │   ├── MapScreen.js       # Vista de mapa
│   │   └── RecordsScreen.js   # Lista de registros
│   ├── assets/               # Recursos (imágenes, iconos)
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   └── splash-icon.png
│   ├── .github/workflows/    # CI/CD GitHub Actions
│   │   └── build.yml         # Configuración EAS Build
│   ├── App.js               # Componente principal y navegación
│   ├── app.json             # Configuración Expo
│   ├── eas.json             # Configuración EAS Build
│   └── package.json         # Dependencias Node.js
│
├── micro-frontend-captures/   # Frontend Vue.js
│   ├── src/
│   │   ├── App.vue           # Componente principal
│   │   ├── main.js           # Punto de entrada
│   │   ├── components/       # Componentes reutilizables
│   │   └── assets/          # Recursos del frontend
│   ├── public/              # Archivos públicos
│   │   └── index.html       # Template HTML
│   ├── Dockerfile           # Configuración Docker + Nginx
│   ├── nginx.conf           # Configuración servidor web
│   ├── package.json         # Dependencias Node.js
│   └── vue.config.js        # Configuración Vue CLI
│
├── database/                  # Scripts y documentación BD
│   ├── create_database.sql   # Script de creación completo
│   └── database_diagram.md   # Diagrama y documentación
│
├── README.md                 # Documentación principal
└── .gitignore               # Archivos ignorados por Git
```




---

**Desarrollado usando React Native, Ruby on Rails, Vue.js y PostgreSQL**
