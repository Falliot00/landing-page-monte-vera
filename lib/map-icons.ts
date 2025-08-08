import type { Icon } from 'leaflet'

let L: typeof import('leaflet') | null = null;
let busStopIcon: Icon | null = null;
let busMovingIcon: Icon | null = null;
let busStoppedIcon: Icon | null = null;
let busOfflineIcon: Icon | null = null;
let selectedStopIcon: Icon | null = null;
let userLocationIcon: Icon | null = null;

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  L = require('leaflet');
  
  if (L) {
    // Configurar iconos por defecto de Leaflet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    // Icono para paradas de colectivo (no usado actualmente, pero disponible)
    busStopIcon = new L.Icon({
      iconUrl: '/icons/map/bus-stopped.svg',
      iconSize: [25, 25],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });

    // Icono para colectivo en movimiento
    busMovingIcon = new L.Icon({
      iconUrl: '/icons/map/bus-moving2.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    // Icono para colectivo parado
    busStoppedIcon = new L.Icon({
      iconUrl: '/icons/map/bus-stopped.svg',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });

    // Icono para colectivo desconectado
    busOfflineIcon = new L.Icon({
      iconUrl: '/icons/map/bus-offline.svg',
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -13],
    });

    // Icono para parada seleccionada
    selectedStopIcon = new L.Icon({
      iconUrl: '/icons/map/selected-stop.svg',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });

    // Icono para ubicación del usuario
    userLocationIcon = new L.Icon({
      iconUrl: '/icons/map/user-location.svg',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  }
}

export { L, busStopIcon, busMovingIcon, busStoppedIcon, busOfflineIcon, selectedStopIcon, userLocationIcon };