interface DeviceLocation {
  id: string;
  lng: number;
  lat: number;
  mlng: string;
  mlat: string;
  ps: string;
  gt: string;
  sp: number;
  ol: number;
}

interface GPSResponse {
  result: number;
  status: DeviceLocation[];
}

const GPS_API_BASE = 'http://190.183.254.253:8088';
const JSESSION = 'cf6b70a3-c82b-4392-8ab6-bbddce336222';

export class GPSService {
  private static instance: GPSService;
  private deviceIds = ['20001', '20002', '20003', '20004', '20005'];

  static getInstance(): GPSService {
    if (!GPSService.instance) {
      GPSService.instance = new GPSService();
    }
    return GPSService.instance;
  }

  async getDeviceLocation(devIdno: string): Promise<DeviceLocation | null> {
    try {
      const url = `${GPS_API_BASE}/StandardApiAction_getDeviceStatus.action?jsession=${JSESSION}&devIdno=${devIdno}&toMap=1&language=zh`;
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GPSResponse = await response.json();
      
      if (data.result === 0 && data.status && data.status.length > 0) {
        const device = data.status[0];
        return {
          id: device.id,
          lng: device.lng / 1000000, // Convertir a coordenadas decimales
          lat: device.lat / 1000000, // Convertir a coordenadas decimales
          mlng: device.mlng,
          mlat: device.mlat,
          ps: device.ps,
          gt: device.gt,
          sp: device.sp || 0,
          ol: device.ol
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching location for device ${devIdno}:`, error);
      return null;
    }
  }

  async getAllDeviceLocations(): Promise<DeviceLocation[]> {
    try {
      const promises = this.deviceIds.map(id => this.getDeviceLocation(id));
      const results = await Promise.all(promises);
      return results.filter((location): location is DeviceLocation => location !== null);
    } catch (error) {
      console.error('Error fetching all device locations:', error);
      return [];
    }
  }

  // Método para obtener ubicaciones con polling continuo
  startLocationPolling(callback: (locations: DeviceLocation[]) => void, intervalMs: number = 30000) {
    const poll = async () => {
      const locations = await this.getAllDeviceLocations();
      callback(locations);
    };

    // Ejecutar inmediatamente
    poll();
    
    // Configurar intervalo
    return setInterval(poll, intervalMs);
  }

  stopLocationPolling(intervalId: NodeJS.Timeout) {
    clearInterval(intervalId);
  }

  // Determinar qué ruta está siguiendo el dispositivo basado en su ubicación
  getDeviceRoute(location: DeviceLocation): 'santafe_montevera' | 'montevera_santafe' | 'unknown' {
    // Lógica simple basada en coordenadas
    // Si está más cerca del terminal de Santa Fe, probablemente va hacia Monte Vera
    const terminalSF = { lat: -31.6442377, lng: -60.70065952 };
    const terminalMV = { lat: -31.50918773, lng: -60.67810577 };
    
    const distToSF = this.calculateDistance(location.lat, location.lng, terminalSF.lat, terminalSF.lng);
    const distToMV = this.calculateDistance(location.lat, location.lng, terminalMV.lat, terminalMV.lng);
    
    // Si está más cerca de Santa Fe, asumimos que va hacia Monte Vera
    if (distToSF < distToMV) {
      return 'santafe_montevera';
    } else {
      return 'montevera_santafe';
    }
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export const gpsService = GPSService.getInstance();