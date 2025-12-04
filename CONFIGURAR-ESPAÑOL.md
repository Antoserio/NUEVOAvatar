# Configurar Avatares en Español

## ✅ Archivo app-prueba-rapida.js CORREGIDO

He eliminado la configuración de voz personalizada (`voice_id: 'es-ES-ElviraNeural'`) que causaba el error 400.

**El idioma español se configura en los Knowledge Bases de HeyGen, NO en el código.**

---

## 🇪🇸 Cómo hacer que los avatares hablen español

### Para avatares CON Knowledge Base (Katya y Graham):

1. Ve a [https://labs.heygen.com](https://labs.heygen.com) o [https://app.heygen.com](https://app.heygen.com)
2. Navega a **Knowledge Base**
3. Edita los Knowledge Bases:
   - `05129fbc64974171aca54accc4ae876a` (Katya)
   - `9dea05db40234989b09d67adbbc92676` (Graham)
4. En la configuración del Knowledge Base:
   - **Language**: Selecciona "Spanish" o "Español"
   - **Voice**: Selecciona una voz en español disponible (ej: "Spanish (Spain)", "Spanish (Mexico)")
5. Guarda los cambios

### Para avatares SIN Knowledge Base (Ann, Santa, Elenora, Dexter):

Estos avatares están en modo **"Talk"** sin IA, sólo repiten lo que les dices. Para que funcionen con español:

**Opción 1: Crear un Knowledge Base en español para cada uno**
1. Ve a HeyGen → Knowledge Base → Create New
2. Name: "KB Español - [Nombre del avatar]"
3. Language: **Spanish**
4. Voice: Selecciona una voz en español
5. Añade contenido básico en español (ej: "Soy un asistente virtual en español")
6. Guarda y copia el Knowledge Base ID
7. Actualiza `AVATARS_CONFIG` en `app-prueba-rapida.js`:

```javascript
{
    id: 'ann_therapist',
    name: 'Ann - Therapist',
    avatar_id: 'Ann_Therapist_public',
   knowledge_base_id: 'TU_NUEVO_KB_ID_AQUI', // ← Pega el ID aquí
    thumbnail: '...'
}
```

**Opción 2: Usar solo los avatares que ya tienen KB (Katya y Graham)**

---

## 🎤 Cómo funciona ahora:

1. **Tu voz** → Transcrita a texto en español (`lang: 'es-ES'` en SpeechRecognition)
2. **Texto** → Enviado al Knowledge Base de HeyGen
3. **Knowledge Base** → Genera respuesta en español (si está configurado en español)
4. **Avatar** → Habla la respuesta con la voz configurada en el KB

---

##  Permisos de micrófono (solución permanente):

1. Ve a `chrome://settings/content/microphone`
2. En "Permitir", añade: `http://localhost:8000`
3. No volverá a pedir permisos

---

## 🚀 Prueba ahora:

1. Recarga la página (F5)
2. Conecta con **Katya** o **Graham** (tienen KB configurado)
3. Habla en español
4. El avatar debería responderte en español (si su KB está configurado en español)

Si sigue respondiendo en inglés, es porque el Knowledge Base NO está configurado en español en HeyGen. Debes cambiarlo desde su plataforma web.
