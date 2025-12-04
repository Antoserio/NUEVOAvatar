# 🚨 PROBLEMAS IDENTIFICADOS CON LA IMPLEMENTACIÓN ACTUAL

## Según la documentación oficial de HeyGen:

### ❌ Lo que estamos haciendo MAL:

1. **Usamos WebRTC directamente** en lugar de LiveKit
2. **No usamos `version: "v2"`** en la creación de sesión
3. **No nos conectamos a la sala de LiveKit** que HeyGen proporciona

### ✅ Lo que DEBERÍAMOS hacer (según docs oficiales):

**Flujo correcto:**
```javascript
// 1. Crear sesión con version v2
const response = await fetch('https://api.heygen.com/v1/streaming.new', {
    method: 'POST',
    headers: {
        'x-api-key': HEYGEN_API_KEY,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        version: "v2",  // ✅ IMPORTANTE: Usar v2
        avatar_id: avatar.avatar_id,
        knowledge_base_id: avatar.knowledge_base_id  // Si existe
    })
});

const sessionInfo = await response.json();
// sessionInfo contiene:
// - session_id
// - url (URL de la sala LiveKit)
// - access_token (token para conectarse a LiveKit)

// 2. Iniciar sesión
await fetch('https://api.heygen.com/v1/streaming.start', {
    method: 'POST',
    headers: {
        'x-api-key': HEYGEN_API_KEY,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        session_id: sessionInfo.session_id
    })
});

// 3. Conectarse a LiveKit ✅ ESTO ES LO QUE FALTA
const room = new LivekitClient.Room();
await room.connect(sessionInfo.url, sessionInfo.access_token);

// 4. Manejar streams de video/audio de LiveKit
room.on(LivekitClient.RoomEvent.TrackSubscribed, (track) => {
    if (track.kind === "video" || track.kind === "audio") {
        mediaStream.addTrack(track.mediaStreamTrack);
        mediaElement.srcObject = mediaStream;
    }
});
```

---

## 🔍 Explicación de los problemas

### 1. **Permisos de micrófono trabados**
**Causa**: Estamos usando WebRTC manualmente (RTCPeerConnection) en lugar de LiveKit.

**Solución**: LiveKit maneja automáticamente:
- Los permisos de micrófono
- La conexión WebRTC
- El audio bidireccional
- La sincronización

### 2. **Habla en inglés**
**Causa**: NO hay parámetro `language` en la API de HeyGen Streaming.

**Solución**: El idioma se configura en:
1. El **Knowledge Base** (en labs.heygen.com)
2. El **Voice ID** asociado al Knowledge Base

**NO** podemos forzar español desde el código. Debe configurarse en HeyGen.

---

## 📝 Qué necesitamos hacer:

### Opción 1: **Migrar a LiveKit** (Recomendado por HeyGen)
- Incluir el SDK de LiveKit en `index-prueba-rapida.html`
- Reescribir `app-prueba-rapida.js` para usar LiveKit
- Esto resolverá el problema de permisos automáticamente

### Opción 2: **Seguir con WebRTC** (No recomendado)
- Continuar como estamos
- Aceptar que los permisos pueden ser problemáticos
- El idioma seguirá dependiendo del Knowledge Base

---

## 🎯 Mi recomendación:

**MIGRAR A LIVEKIT** siguiendo la documentación oficial. Esto resolverá:
1. ✅ Permisos de micrófono (LiveKit los maneja)
2. ✅ Audio bidireccional más estable
3. ✅ Menos código (LiveKit abstrae WebRTC)
4. ✅ Mejor mantenibilidad (seguimos el estándar oficial)

---

## ¿Qué prefieres?

1. **Opción A**: Reescribo `app-prueba-rapida.js` usando LiveKit (solución definitiva)
2. **Opción B**: Intento arreglar los permisos en la versión WebRTC actual (parche temporal)

**Para el idioma español**: De todas formas, debes configurar los Knowledge Bases en español desde labs.heygen.com. No hay forma de forzarlo desde código.
