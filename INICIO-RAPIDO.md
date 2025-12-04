# 🚀 Inicio Rápido

## ✅ Configuración completada

Tu aplicación está lista con:
- ✅ API Key configurada
- ✅ 6 avatares configurados:
  1. Ann - Therapist (KB por defecto)
  2. Santa Fireplace (KB por defecto)
  3. Elenora - Fitness Coach (KB por defecto)
  4. Dexter - Lawyer (KB por defecto)
  5. Katya - Black Suit (KB: 05129fbc...)
  6. Graham - Professional (KB: 9dea05db...)

## 📋 Pasos para arrancar

### 1. Instalar Node.js (si no lo tienes)
Descarga desde: https://nodejs.org/
Versión recomendada: 18.x o superior

### 2. Arrancar el Backend

```bash
cd heygen-token-service
npm install
npm start
```

Deberías ver: `Server is running on port 8080`

### 3. Arrancar el Frontend

**Opción A - Abrir directamente:**
- Abre `heygen-livekit-app/index.html` en tu navegador

**Opción B - Servidor local (recomendado):**
```bash
cd heygen-livekit-app
python -m http.server 3000
```
O con Node.js:
```bash
npx http-server heygen-livekit-app -p 3000 --cors
```

Luego abre: http://localhost:3000

### 4. ¡Listo para usar!

1. Verás el grid con los 6 avatares
2. Haz clic en "Conectar" en cualquier avatar
3. Acepta los permisos de micrófono
4. ¡Empieza a hablar con el avatar!

## 🔧 Solución de problemas

### El backend no arranca
```bash
# Verifica que Node.js esté instalado
node --version

# Si falla npm install, intenta:
cd heygen-token-service
rm -rf node_modules
npm install
```

### Error de CORS
- Asegúrate de que el backend esté corriendo en puerto 8080
- Si usas servidor local para el frontend, añade `--cors`

### No se conecta al avatar
- Abre la consola del navegador (F12) para ver errores
- Verifica que el backend esté corriendo
- Comprueba que aceptaste permisos de micrófono

## 📝 Notas

- Los avatares con "KB: Por defecto" usan su knowledge base configurada en HeyGen
- Katya y Graham tienen knowledge bases personalizadas
- El idioma está configurado en español
- La conexión es directa vía LiveKit (sin latencia)

## 🎯 Próximos pasos

- Personaliza los thumbnails de los avatares en `config.js`
- Ajusta el idioma en `server.js` (línea con `language: 'es'`)
- Añade más avatares en `config.js`
- Despliega en producción (ver README.md)
