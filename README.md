# Analizador Multimodal con Gemini AI

Aplicación web para analizar imágenes y audio usando Google Gemini API, construida con TypeScript, Express y vanilla JavaScript.

## Características

- 🤖 Análisis multimodal con Google Gemini 1.5 Flash
- 📸 **Imágenes**: JPEG, PNG, WebP y GIF (máx 5MB)
- 🎵 **Audio**: MP3, WAV, OGG, WebM (máx 10MB)
- 💬 Prompts personalizables para cada tipo
- 🎨 Interfaz con tabs responsive y moderna
- ✅ Validación doble de archivos (cliente + servidor)
- 🔒 Manejo robusto de errores
- 🚀 TypeScript para mayor seguridad de tipos
- 📡 API REST con rutas separadas

## Stack Tecnológico

### Backend
- **TypeScript** - Tipado estático
- **Express** - Servidor web
- **Multer** - Manejo de uploads
- **Google Generative AI** - Integración con Gemini

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos y animaciones
- **Vanilla JavaScript** - Lógica del cliente

## Requisitos Previos

- Node.js >= 18.0.0
- Cuenta de Google AI Studio
- API Key de Gemini

## Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd SoleaBackend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` y agregar tu API key:
```env
GEMINI_API_KEY=tu_api_key_aquí
GEMINI_MODEL=gemini-1.5-flash
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=5242880
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp,image/gif
CORS_ORIGIN=*
```

Obtener API key en: https://makersuite.google.com/app/apikey

**Modelos disponibles:**
- `gemini-1.5-flash` (recomendado) - Rápido, estable, mejor para free tier
- `gemini-1.5-pro` - Más potente pero con límites más estrictos
- `gemini-2.0-flash-exp` - Experimental, puede tener límites restrictivos

## Uso

### Modo Desarrollo
```bash
npm run dev
```
Servidor con hot-reload en `http://localhost:3000`

### Modo Producción
```bash
npm run build
npm start
```

### Verificar Tipos
```bash
npm run type-check
```

## Despliegue en Vercel

### 1. Instalación de Vercel CLI (opcional)
```bash
npm i -g vercel
```

### 2. Despliegue

**Opción A: Desde la línea de comandos**
```bash
vercel
```

**Opción B: Desde GitHub**
1. Sube tu código a GitHub
2. Importa el proyecto en [Vercel Dashboard](https://vercel.com/new)
3. Vercel detectará automáticamente la configuración

### 3. Configurar Variables de Entorno en Vercel

En el dashboard de Vercel (Settings → Environment Variables), agrega:

```
GEMINI_API_KEY=tu_api_key_aquí
GEMINI_MODEL=gemini-1.5-flash
MAX_FILE_SIZE=5242880
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp,image/gif
CORS_ORIGIN=*
```

### 4. Redesplegar (si es necesario)
```bash
vercel --prod
```

**Notas importantes:**
- Vercel maneja automáticamente la compilación de TypeScript
- Los archivos estáticos en `/public` se sirven automáticamente
- El archivo `vercel.json` ya está configurado
- No olvides configurar las variables de entorno antes del primer despliegue

## Estructura del Proyecto

```
SoleaBackend/
├── src/
│   ├── config/
│   │   └── index.ts              # Configuración de la app
│   ├── middleware/
│   │   ├── upload.middleware.ts  # Configuración de Multer
│   │   └── error.middleware.ts   # Manejo de errores
│   ├── routes/
│   │   └── analyze.routes.ts     # Rutas del API
│   ├── services/
│   │   └── gemini.service.ts     # Integración con Gemini
│   ├── types/
│   │   └── index.ts              # Tipos de TypeScript
│   └── index.ts                  # Servidor principal
├── public/
│   ├── css/
│   │   └── styles.css            # Estilos
│   ├── js/
│   │   └── app.js                # Lógica del frontend
│   └── index.html                # Página principal
├── .env.example                  # Variables de entorno ejemplo
├── .gitignore
├── package.json
├── tsconfig.json
├── API-Docs.md              # Documentación detallada de la API
└── README.md
```

## API Endpoints

> 📖 **Documentación completa**: Ver [API-Docs.md](./API-Docs.md) para ejemplos detallados, códigos de error y casos de uso.

### POST /api/analyze-image
Analiza una imagen con Gemini AI.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `image` (file): Imagen a analizar
  - `prompt` (string, opcional): Prompt personalizado (max 2000 caracteres)

**Response:**
```json
{
  "success": true,
  "result": "Descripción generada por Gemini..."
}
```

**Errores:**
- 400: Archivo no válido o faltante
- 413: Archivo muy grande (>5MB)
- 500: Error del servidor o API

### POST /api/analyze-audio
Analiza un archivo de audio con Gemini AI.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `audio` (file): Archivo de audio a analizar
  - `prompt` (string, opcional): Prompt personalizado (max 2000 caracteres)

**Response:**
```json
{
  "success": true,
  "result": "Transcripción y análisis generado por Gemini..."
}
```

**Errores:**
- 400: Archivo no válido o faltante
- 413: Archivo muy grande (>10MB)
- 500: Error del servidor o API

### GET /api/health
Verifica el estado del servidor y la conexión con Gemini.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "services": {
    "gemini": "connected"
  }
}
```

## Validaciones

### Archivos de Imagen
- **Tipos permitidos**: JPEG, PNG, WebP, GIF
- **Tamaño máximo**: 5MB
- **Validación en**: Cliente y servidor

### Archivos de Audio
- **Tipos permitidos**: MP3, WAV, OGG, WebM
- **Tamaño máximo**: 10MB
- **Validación en**: Cliente y servidor

### Prompts
- **Longitud máxima**: 2000 caracteres
- **Prompt por defecto (imagen)**: "Describe esta imagen en detalle, identificando objetos, escenas, colores, y cualquier texto visible."
- **Prompt por defecto (audio)**: "Transcribe este audio y proporciona un resumen de su contenido."

## Seguridad

- Validación de tipos MIME
- Límite de tamaño de archivo
- Sanitización de inputs
- CORS configurable
- Sin almacenamiento permanente de archivos (memory storage)
- Error handling robusto

## Mejoras Implementadas

Comparado con la especificación original:

1. ✅ **TypeScript estricto** con validaciones completas
2. ✅ **Multer** en lugar de Formidable (más estándar para Express)
3. ✅ **Validaciones dobles** (cliente + servidor)
4. ✅ **Health check endpoint** para monitoreo
5. ✅ **Manejo de errores** centralizado
6. ✅ **UI/UX mejorada** con loading states y feedback
7. ✅ **Configuración flexible** vía variables de entorno
8. ✅ **Character counter** en textarea
9. ✅ **Preview de imagen y audio** antes de enviar
10. ✅ **Soporte Vercel** serverless con configuración lista para deploy
11. ✅ **Selección de modelo** configurable (gemini-1.5-flash por defecto)
12. ✅ **Análisis multimodal** con soporte para imágenes y audio
13. ✅ **Interfaz con tabs** para cambiar entre tipos de archivos
14. ✅ **Rutas API separadas** para cada tipo de análisis

## Troubleshooting

### Error: GEMINI_API_KEY is required
- Verificar que `.env` existe y contiene `GEMINI_API_KEY`
- Reiniciar el servidor después de editar `.env`

### Error: File size exceeds maximum
- El límite es 5MB por defecto
- Cambiar `MAX_FILE_SIZE` en `.env` si es necesario

### Error: Invalid file type
- Solo se permiten: JPEG, PNG, WebP, GIF
- Verificar el tipo MIME real del archivo

### Error: 429 Too Many Requests / Quota exceeded
- **Causa común**: Uso de modelos experimentales (gemini-2.0-flash-exp) en free tier
- **Solución**: Cambiar a `GEMINI_MODEL=gemini-1.5-flash` en `.env`
- Los modelos experimentales tienen límites muy restrictivos
- `gemini-1.5-flash` es más estable y tiene mejor soporte para free tier

### Gemini API disconnected
- Verificar que la API key es válida
- Revisar conexión a internet
- Consultar cuota en Google AI Studio
- Verificar el modelo configurado en `GEMINI_MODEL`

## Licencia

ISC

## Créditos

Powered by [Google Gemini API](https://ai.google.dev/)
