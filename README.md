# 🎭 Avatares Interactivos - LiveKit

Aplicación web para conversaciones en tiempo real con avatares interactivos de HeyGen usando LiveKit, **sin latencia**.

## 📋 Características

- ✅ Grid visual de avatares configurables
- ✅ Integración directa con LiveKit (sin SDK pesado)
- ✅ Soporte para Knowledge Base personalizada
- ✅ Conversaciones en tiempo real con audio bidireccional
- ✅ UI moderna con diseño premium (dark mode, glassmorphism)
- ✅ Controles de micrófono y video
- ✅ Backend Node.js para gestión segura de tokens

## 🏗️ Arquitectura

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Frontend  │─────▶│   Backend    │─────▶│  LiveAvatar API │
│  (HTML/JS)  │      │  (Node.js)   │      │   (HeyGen)      │
└─────────────┘      └──────────────┘      └─────────────────┘
       │                                             │
       │                                             │
       └─────────────────────────────────────────────┘
                    LiveKit WebRTC
```

## 📁 Estructura del Proyecto

```
heygen-livekit-app/
├── index.html          # Interfaz principal
├── styles.css          # Estilos premium
├── app.js             # Lógica de la aplicación
├── config.js          # Configuración de avatares
└── README.md          # Este archivo

heygen-token-service/
├── server.js          # Backend Node.js
├── package.json       # Dependencias
├── .env              # Variables de entorno
└── Dockerfile        # Para deployment
```

## 🚀 Configuración

### 1. Configurar Avatares

Edita `config.js` y reemplaza los valores con tus IDs reales:

```javascript
export const AVATARS_CONFIG = [
    {
        id: 'avatar_1',
        name: 'Avatar Profesional',
        avatar_id: 'TU_AVATAR_ID_REAL',
        knowledge_base_id: 'TU_KNOWLEDGE_BASE_ID',
        thumbnail: 'URL_DE_IMAGEN'
    },
    // Añade más avatares aquí
];
```

### 2. Configurar Backend

1. **Instalar Node.js** (si no lo tienes):
   - Descarga desde: https://nodejs.org/
   - Versión recomendada: 18.x o superior

2. **Configurar variables de entorno**:
   
   Edita `heygen-token-service/.env`:
   ```
   HEYGEN_API_KEY=tu_api_key_de_heygen_aqui
   PORT=8080
   ```

3. **Instalar dependencias**:
   ```bash
   cd heygen-token-service
   npm install
   ```

4. **Iniciar el servidor**:
   ```bash
   npm start
   ```
   
   El servidor estará corriendo en `http://localhost:8080`

### 3. Ejecutar Frontend

Simplemente abre `index.html` en tu navegador, o usa un servidor local:

**Opción A - Servidor Python:**
```bash
cd heygen-livekit-app
python -m http.server 3000
```

**Opción B - Servidor Node.js (http-server):**
```bash
npx http-server heygen-livekit-app -p 3000
```

Luego abre: `http://localhost:3000`

## 🎯 Uso

1. **Selecciona un avatar** del grid
2. **Haz clic en "Conectar"**
3. **Espera a que se establezca la conexión** (verás el video del avatar)
4. **Habla con el avatar** usando tu micrófono
5. **Controla la conversación** con los botones de micrófono/video
6. **Desconecta** cuando termines

## 🔧 Solución de Problemas

### El backend no arranca
- Verifica que Node.js esté instalado: `node --version`
- Asegúrate de haber ejecutado `npm install`
- Revisa que el archivo `.env` tenga tu API key correcta

### No se conecta al avatar
- Verifica que el backend esté corriendo en `http://localhost:8080`
- Abre la consola del navegador (F12) para ver errores
- Verifica que los `avatar_id` y `knowledge_base_id` sean correctos
- Asegúrate de tener permisos de micrófono en el navegador

### No se escucha el audio
- Verifica que el navegador tenga permisos de micrófono
- Revisa que el volumen del sistema no esté silenciado
- Comprueba que el micrófono esté habilitado (botón 🎤)

### Error de CORS
- Asegúrate de que el backend esté corriendo
- Verifica que `BACKEND_URL` en `config.js` apunte a `http://localhost:8080`

## 🌐 Deployment

### Backend (Google Cloud Run)

1. **Build Docker image**:
   ```bash
   cd heygen-token-service
   docker build -t heygen-token-service .
   ```

2. **Deploy a Cloud Run**:
   ```bash
   gcloud run deploy heygen-token-service \
     --image heygen-token-service \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars HEYGEN_API_KEY=tu_api_key
   ```

3. **Actualiza `config.js`** con la URL de Cloud Run

### Frontend (Netlify/Vercel)

1. Sube la carpeta `heygen-livekit-app` a tu repositorio Git
2. Conecta con Netlify o Vercel
3. Actualiza `BACKEND_URL` en `config.js` con tu URL de backend

## 📚 Documentación de APIs

- **LiveAvatar API**: https://docs.liveavatar.com
- **LiveKit Client SDK**: https://docs.livekit.io/client-sdk-js/
- **HeyGen Streaming API**: https://docs.heygen.com/docs/streaming-api

## 🔐 Seguridad

⚠️ **IMPORTANTE**: 
- Nunca expongas tu `HEYGEN_API_KEY` en el frontend
- Siempre usa el backend para generar tokens
- En producción, implementa autenticación y rate limiting

## 📝 Notas

- La aplicación usa **LiveAvatar API** (nueva plataforma de HeyGen)
- El idioma por defecto es **español** (configurable en `server.js`)
- El modo es **FULL** para interacción completa con el avatar
- LiveKit maneja automáticamente la conexión WebRTC

## 🤝 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Revisa los logs del backend
3. Consulta la documentación oficial de HeyGen/LiveAvatar

---

**Creado con ❤️ usando HeyGen LiveAvatar + LiveKit**
