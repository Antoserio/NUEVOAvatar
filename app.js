import { AVATARS_CONFIG, BACKEND_URL } from './config.js';

// ===== STATE MANAGEMENT =====
let currentRoom = null;
let currentSession = null;
let localAudioTrack = null;
let localVideoTrack = null;
let isMicEnabled = true;
let isVideoEnabled = true;

// ===== DOM ELEMENTS =====
const gridView = document.getElementById('grid-view');
const chatView = document.getElementById('chat-view');
const avatarsGrid = document.getElementById('avatars-grid');
const videoWrapper = document.getElementById('video-wrapper');
const currentAvatarName = document.getElementById('current-avatar-name');
const connectionStatus = document.getElementById('connection-status');
const avatarState = document.getElementById('avatar-state');
const toggleMicBtn = document.getElementById('toggle-mic');
const toggleVideoBtn = document.getElementById('toggle-video');
const disconnectBtn = document.getElementById('disconnect-btn');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    renderAvatarsGrid();
    setupEventListeners();
});

// ===== RENDER AVATARS GRID =====
function renderAvatarsGrid() {
    avatarsGrid.innerHTML = '';

    AVATARS_CONFIG.forEach(avatar => {
        const card = createAvatarCard(avatar);
        avatarsGrid.appendChild(card);
    });
}

function createAvatarCard(avatar) {
    const card = document.createElement('div');
    card.className = 'avatar-card';

    // Mostrar knowledge base solo si existe
    const knowledgeBaseInfo = avatar.knowledge_base_id
        ? `<div class="avatar-meta-item">
               <span class="icon">📚</span>
               <span>KB: ${avatar.knowledge_base_id.substring(0, 12)}...</span>
           </div>`
        : `<div class="avatar-meta-item">
               <span class="icon">📚</span>
               <span>KB: Por defecto</span>
           </div>`;

    card.innerHTML = `
        <img src="${avatar.thumbnail}" alt="${avatar.name}" class="avatar-thumbnail">
        <div class="avatar-card-content">
            <h3 class="avatar-card-title">${avatar.name}</h3>
            <div class="avatar-card-meta">
                <div class="avatar-meta-item">
                    <span class="icon">🎭</span>
                    <span>${avatar.avatar_id}</span>
                </div>
                ${knowledgeBaseInfo}
            </div>
            <button class="connect-btn" data-avatar-id="${avatar.id}">
                Conectar
            </button>
        </div>
    `;

    const connectBtn = card.querySelector('.connect-btn');
    connectBtn.addEventListener('click', () => connectToAvatar(avatar));

    return card;
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    toggleMicBtn.addEventListener('click', toggleMicrophone);
    toggleVideoBtn.addEventListener('click', toggleVideo);
    disconnectBtn.addEventListener('click', disconnect);
}

// ===== CONNECT TO AVATAR =====
async function connectToAvatar(avatar) {
    try {
        console.log('🚀 Conectando con avatar:', avatar.name);

        // Mostrar vista de chat
        gridView.classList.add('hidden');
        chatView.classList.remove('hidden');
        currentAvatarName.textContent = avatar.name;
        updateConnectionStatus('connecting');
        updateAvatarState('Solicitando token...');

        // 1. Obtener token del backend
        const tokenData = await fetchSessionToken(avatar);
        console.log('✅ Token obtenido:', tokenData);

        updateAvatarState('Iniciando sesión...');

        // 2. Iniciar sesión de LiveAvatar
        const sessionData = await startSession(tokenData.session_token);
        console.log('✅ Sesión iniciada:', sessionData);

        updateAvatarState('Conectando a LiveKit...');

        // 3. Conectar a LiveKit room
        await connectToLiveKit(sessionData);
        console.log('✅ Conectado a LiveKit');

        updateConnectionStatus('connected');
        updateAvatarState('Conversación activa');

    } catch (error) {
        console.error('❌ Error al conectar:', error);
        alert('Error al conectar con el avatar: ' + error.message);
        disconnect();
    }
}

// ===== FETCH SESSION TOKEN =====
async function fetchSessionToken(avatar) {
    const response = await fetch(`${BACKEND_URL}/generate-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            avatar_id: avatar.avatar_id,
            knowledge_base_id: avatar.knowledge_base_id
        })
    });

    if (!response.ok) {
        throw new Error('Error al obtener token del backend');
    }

    return await response.json();
}

// ===== START SESSION =====
async function startSession(sessionToken) {
    const response = await fetch('https://api.liveavatar.com/v1/sessions/start', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${sessionToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al iniciar sesión de LiveAvatar');
    }

    return await response.json();
}

// ===== CONNECT TO LIVEKIT =====
async function connectToLiveKit(sessionData) {
    const { livekit_url, livekit_client_token } = sessionData;

    // Crear room de LiveKit
    currentRoom = new LivekitClient.Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
            resolution: LivekitClient.VideoPresets.h720.resolution
        }
    });

    // Event listeners
    currentRoom.on(LivekitClient.RoomEvent.TrackSubscribed, handleTrackSubscribed);
    currentRoom.on(LivekitClient.RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
    currentRoom.on(LivekitClient.RoomEvent.Disconnected, handleDisconnected);
    currentRoom.on(LivekitClient.RoomEvent.ParticipantConnected, handleParticipantConnected);

    // Conectar al room
    await currentRoom.connect(livekit_url, livekit_client_token);

    // Publicar audio local (micrófono)
    try {
        localAudioTrack = await LivekitClient.createLocalAudioTrack();
        await currentRoom.localParticipant.publishTrack(localAudioTrack);
        console.log('🎤 Micrófono publicado');
    } catch (error) {
        console.error('Error al publicar audio:', error);
    }
}

// ===== LIVEKIT EVENT HANDLERS =====
function handleTrackSubscribed(track, publication, participant) {
    console.log('📹 Track recibido:', track.kind, 'de', participant.identity);

    if (track.kind === 'video') {
        const videoElement = track.attach();
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.objectFit = 'cover';

        // Limpiar loading state
        const loadingState = videoWrapper.querySelector('.loading-state');
        if (loadingState) {
            loadingState.remove();
        }

        videoWrapper.appendChild(videoElement);
    } else if (track.kind === 'audio') {
        const audioElement = track.attach();
        document.body.appendChild(audioElement);
    }
}

function handleTrackUnsubscribed(track, publication, participant) {
    console.log('Track desuscrito:', track.kind);
    track.detach().forEach(element => element.remove());
}

function handleDisconnected() {
    console.log('Desconectado del room');
    updateConnectionStatus('disconnected');
    updateAvatarState('Desconectado');
}

function handleParticipantConnected(participant) {
    console.log('👤 Participante conectado:', participant.identity);
}

// ===== CONTROLS =====
function toggleMicrophone() {
    if (localAudioTrack) {
        isMicEnabled = !isMicEnabled;
        localAudioTrack.mute(!isMicEnabled);
        toggleMicBtn.classList.toggle('active', isMicEnabled);
        toggleMicBtn.querySelector('.icon').textContent = isMicEnabled ? '🎤' : '🔇';
    }
}

function toggleVideo() {
    // Implementar si se necesita video local
    isVideoEnabled = !isVideoEnabled;
    toggleVideoBtn.classList.toggle('active', isVideoEnabled);
}

async function disconnect() {
    console.log('🔌 Desconectando...');

    // Limpiar tracks locales
    if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack = null;
    }

    if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack = null;
    }

    // Desconectar room
    if (currentRoom) {
        await currentRoom.disconnect();
        currentRoom = null;
    }

    // Limpiar video wrapper
    videoWrapper.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Conectando con el avatar...</p>
        </div>
    `;

    // Volver a la vista de grid
    chatView.classList.add('hidden');
    gridView.classList.remove('hidden');

    // Reset state
    isMicEnabled = true;
    isVideoEnabled = true;
    toggleMicBtn.classList.remove('active');
    toggleVideoBtn.classList.remove('active');
}

// ===== UI HELPERS =====
function updateConnectionStatus(status) {
    const statusMap = {
        'connecting': { text: 'Conectando...', class: 'connecting' },
        'connected': { text: 'Conectado', class: '' },
        'disconnected': { text: 'Desconectado', class: 'disconnected' }
    };

    const { text, class: className } = statusMap[status];
    connectionStatus.textContent = text;
    connectionStatus.className = 'status-badge ' + className;
}

function updateAvatarState(state) {
    avatarState.textContent = state;
}
