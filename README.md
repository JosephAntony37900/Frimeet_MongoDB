

# API_MongoDB_Frimeet

## En proceso de desarrollo para la app-web "FRIMEET" web de recomendaciones de salidas, eventos, actividades,etc.

## Descripción

Esta API proporciona una manera eficiente y organizada de gestionar información sobre usuarios (De prueba ya que usuarios proviene de la BD postgres), lugares y eventos, utilizando MongoDB como base de datos y Mongoose como ORM para manejar la interacción con los datos. La API incluye funcionalidades completas de CRUD (Crear, Leer, Actualizar, Borrar) para cada entidad (usuarios, lugares y eventos), asegurando integridad y consistencia en los datos a través de relaciones referenciales.

## Características

- **Gestión de Usuarios**: Registro, actualización, eliminación y autenticación de usuarios.
- **Gestión de Lugares**: Creación, lectura, actualización y eliminación de lugares, incluyendo la carga de imágenes a Cloudinary.
- **Gestión de Eventos**: Creación, lectura, actualización y eliminación de eventos, vinculando estos eventos a lugares específicos y gestionando imágenes a través de Cloudinary.
- **Autenticación JWT**: Utilización de tokens JWT para la autenticación y autorización de usuarios.
- **Conexión a MongoDB**: Uso de Mongoose para una gestión eficiente y estructurada de la base de datos.

## Tecnologías Utilizadas

- **Node.js**: Plataforma de desarrollo en JavaScript para el backend.
- **Express.js**: Framework web para Node.js.
- **MongoDB**: Base de datos NoSQL utilizada para el almacenamiento de datos.
- **Mongoose**: ORM de MongoDB para Node.js, facilitando la modelización de datos.
- **Cloudinary**: Servicio de almacenamiento y manipulación de imágenes en la nube.
- **bcrypt**: Biblioteca para el hashing de contraseñas.
- **jsonwebtoken**: Biblioteca para la creación y verificación de tokens JWT.

## Requisitos Previos

- Node.js y npm instalados.
- MongoDB instalado y en funcionamiento.
- Cuenta en Cloudinary para la gestión de imágenes.

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/API_MongoDB.git
   cd API_MongoDB
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno creando un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   MONGODB_URI=tu_uri_de_mongodb
   JWT_SECRET=tu_secreto_jwt
   CLOUDINARY_CLOUD_NAME=tu_nombre_de_cloudinary
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

4. Inicia el servidor:
   ```bash
   npm start
   ```

## Endpoints Disponibles

### Usuarios

- **GET /api/users**: Obtiene todos los usuarios.
- **POST /api/users**: Crea un nuevo usuario.
- **GET /api/users/:id**: Obtiene un usuario por ID.
- **DELETE /api/users/:id**: Elimina un usuario por ID.

### Lugares

- **GET /api/places**: Obtiene todos los lugares.
- **POST /api/places**: Crea un nuevo lugar.
- **GET /api/places/:id**: Obtiene un lugar por ID.
- **PUT /api/places/:id**: Actualiza un lugar por ID.
- **DELETE /api/places/:id**: Elimina un lugar por ID.

### Eventos

- **GET /api/events**: Obtiene todos los eventos.
- **POST /api/events**: Crea un nuevo evento.
- **GET /api/events/:id**: Obtiene un evento por ID.
- **PUT /api/events/:id**: Actualiza un evento por ID.
- **DELETE /api/events/:id**: Elimina un evento por ID.

## Ejemplos de Solicitudes

### Crear un Nuevo Usuario
```bash
POST /api/users
Content-Type: application/json

{
  "name": "José",
  "email": "jose@gmail.com",
  "password": "123456"
}
```

### Crear un Nuevo Lugar
```bash
POST /api/places
Content-Type: application/json

{
  "name": "Parque Central",
  "description": "Un hermoso parque con áreas verdes y espacios recreativos.",
  "address": "Avenida Principal 123, Ciudad",
  "tag": "Parque",
  "images": [
    "C:\\Users\\josep\\Downloads\\vixel.png"
  ]
}
```

### Crear un Nuevo Evento
```bash
POST /api/events
Content-Type: application/json

{
  "name": "Concierto de Rock",
  "maxPeoples": 500,
  "idPlace": "672dc093253592ae1ac90c72", // ID del lugar relacionado
  "date": "2024-12-25T20:00:00Z",
  "description": "Un increíble concierto de rock con bandas en vivo.",
  "price": 50,
  "images": [
    "C:\\Users\\josep\\Downloads\\vixel.png"
  ]
}
```

