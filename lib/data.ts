export const configuracion = {
  rutas: { // Added this object to define route metadata
    santafe_montevera: {
      id: "SFMV",
      nombre: "Santa Fe → Monte Vera",
      paradasCount: 49,
      duracion: 55,
      color: "#1565C0"
    },
    montevera_santafe: {
      id: "MVSF", 
      nombre: "Monte Vera → Santa Fe",
      paradasCount: 49,
      duracion: 55,
      color: "#2E7D32"
    }
  },
  // Tiempo total de recorrido (constante) - kept for consistency if needed elsewhere
  tiempoTotalRecorrido: {
    santafe_montevera: 55, // minutos
    montevera_santafe: 55
  },

  // Horarios oficiales de la empresa
  horariosOficiales: {
    santafe_montevera: {
      laborables: {
        primerColectivo: "05:40",
        ultimoColectivo: "23:10",
        frecuencia: "variable",
        horarios: [
          "05:40", "06:20", "07:00", "07:25", "07:50", "08:05",
          "08:30", "08:55", "09:25", "09:55", "10:30", "10:55",
          "11:30", "12:00", "12:20", "12:45", "13:05", "13:25",
          "13:55", "14:20", "14:55", "15:20", "15:55", "16:20",
          "16:50", "17:15", "17:35", "17:55", "18:20", "18:50",
          "19:10", "19:30", "20:10", "21:20", "22:10", "23:10"
        ]
      },
      sabados: {
        primerColectivo: "06:00",
        ultimoColectivo: "22:30",
        frecuencia: "variable",
        horarios: [
          "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
          "12:00", "13:00", "14:00", "15:55", "17:00", "18:00",
          "18:55", "19:45", "20:45", "22:30"
        ]
      },
      domingos: {
        primerColectivo: "06:00",
        ultimoColectivo: "22:30",
        frecuencia: "variable",
        horarios: [
          "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
          "12:00", "13:00", "14:00", "15:55", "17:00", "18:00",
          "18:55", "19:45", "20:45", "22:30"
        ]
      }
    },
    montevera_santafe: {
      laborables: {
        primerColectivo: "04:55",
        ultimoColectivo: "22:15",
        frecuencia: "variable",
        horarios: [
          "04:55", "05:35", "06:05", "06:30", "06:50", "07:10",
          "07:35", "08:00", "08:30", "09:00", "09:25", "09:50",
          "10:20", "10:50", "11:25", "11:50", "12:10", "12:30",
          "13:00", "13:25", "14:00", "14:25", "15:00", "15:25",
          "15:50", "16:15", "16:35", "16:55", "17:20", "17:50",
          "18:15", "18:35", "19:20", "20:25", "21:15", "22:15"
        ]
      },
      sabados: {
        primerColectivo: "05:10",
        ultimoColectivo: "21:40",
        frecuencia: "variable",
        horarios: [
          "05:10", "06:10", "07:00", "08:00", "09:00", "10:00",
          "11:00", "12:00", "13:00", "15:00", "16:00", "17:00",
          "18:00", "18:50", "19:50", "21:40"
        ]
      },
      domingos: {
        primerColectivo: "05:10",
        ultimoColectivo: "21:40",
        frecuencia: "variable",
        horarios: [
          "05:10", "06:10", "07:00", "08:00", "09:00", "10:00",
          "11:00", "12:00", "13:00", "15:00", "16:00", "17:00",
          "18:00", "18:50", "19:50", "21:40"
        ]
      }
    }
  }
};

// Datos completos de paradas organizados por ruta
export const paradas = {
  santafe_montevera: [
    {
      id: "MV00",
      nombre: "TERMINAL SANTA FE",
      coordenadas: { lat: -31.6442377, lng: -60.70065952 },
      tiempoDesdeInicio: "00:00:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV01",
      nombre: "LA RIOJA Y RIVADAVIA",
      coordenadas: { lat: -31.646189, lng: -60.703943 },
      tiempoDesdeInicio: "00:03:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV02",
      nombre: "RIVADAVIA Y H. YRIGOYEN",
      coordenadas: { lat: -31.642883, lng: -60.703108 },
      tiempoDesdeInicio: "00:04:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV03",
      nombre: "RIVADAVIA Y SUIPACHA",
      coordenadas: { lat: -31.64078, lng: -60.702403 },
      tiempoDesdeInicio: "00:05:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV04",
      nombre: "P. VITTORI Y MAIPÚ",
      coordenadas: { lat: -31.634345, lng: -60.700427 },
      tiempoDesdeInicio: "00:07:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV05",
      nombre: "A. DEL VALLE E ITURRASPE",
      coordenadas: { lat: -31.62953163, lng: -60.70060558 },
      tiempoDesdeInicio: "00:09:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV06",
      nombre: "A. DEL VALLE Y P. ZENTENO",
      coordenadas: { lat: -31.62762259, lng: -60.70019552 },
      tiempoDesdeInicio: "00:09:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV07",
      nombre: "A. DEL VALLE Y L. TORRENT",
      coordenadas: { lat: -31.624698, lng: -60.699522 },
      tiempoDesdeInicio: "00:10:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV08",
      nombre: "A. DEL VALLE Y PADILLA",
      coordenadas: { lat: -31.6220704, lng: -60.69901947 },
      tiempoDesdeInicio: "00:11:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV09",
      nombre: "A. DEL VALLE Y MARTIN ZAPATA",
      coordenadas: { lat: -31.62030467, lng: -60.69857951 },
      tiempoDesdeInicio: "00:12:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV10",
      nombre: "A. DEL VALLE Y J.M. ZUVIRÍA",
      coordenadas: { lat: -31.617471, lng: -60.697774 },
      tiempoDesdeInicio: "00:13:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV11",
      nombre: "A. DEL VALLE Y ESQUIÚ",
      coordenadas: { lat: -31.61506306, lng: -60.69676128 },
      tiempoDesdeInicio: "00:15:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV12",
      nombre: "A. DEL VALLE Y LAVAISE",
      coordenadas: { lat: -31.61314539, lng: -60.69562393 },
      tiempoDesdeInicio: "00:16:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV13",
      nombre: "A. DEL VALLE Y PEDRO DE VEGA",
      coordenadas: { lat: -31.6114326, lng: -60.69465245 },
      tiempoDesdeInicio: "00:18:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV14",
      nombre: "A. DEL VALLE Y A. CASANELLO",
      coordenadas: { lat: -31.60961387, lng: -60.6939883 },
      tiempoDesdeInicio: "00:19:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV15",
      nombre: "A. DEL VALLE Y CASTELLI",
      coordenadas: { lat: -31.60690082, lng: -60.69297968 },
      tiempoDesdeInicio: "00:20:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV16",
      nombre: "A. DEL VALLE Y ESPORA",
      coordenadas: { lat: -31.604187, lng: -60.692195 },
      tiempoDesdeInicio: "00:22:00",
      localidad: "Espora"
    },
    {
      id: "MV17",
      nombre: "A. DEL VALLE Y RISSO",
      coordenadas: { lat: -31.60142634, lng: -60.69174453 },
      tiempoDesdeInicio: "00:22:00",
      localidad: "Espora"
    },
    {
      id: "MV18",
      nombre: "A. DEL VALLE Y J. DE LA ROSA",
      coordenadas: { lat: -31.59948123, lng: -60.69169029 },
      tiempoDesdeInicio: "00:23:00",
      localidad: "Espora"
    },
    {
      id: "MV19",
      nombre: "A. DEL VALLE Y AYACUCHO",
      coordenadas: { lat: -31.59765385, lng: -60.69159591 },
      tiempoDesdeInicio: "00:24:00",
      localidad: "Espora"
    },
    {
      id: "MV20",
      nombre: "A. DEL VALLE Y LARREA",
      coordenadas: { lat: -31.59561128, lng: -60.69180183 },
      tiempoDesdeInicio: "00:24:00",
      localidad: "Espora"
    },
    {
      id: "MV21",
      nombre: "A. DEL VALLE Y FRENCH",
      coordenadas: { lat: -31.592654, lng: -60.691942 },
      tiempoDesdeInicio: "00:25:00",
      localidad: "Espora"
    },
    {
      id: "MV22",
      nombre: "A. DEL VALLE Y ALMONACID",
      coordenadas: { lat: -31.58987532, lng: -60.69178088 },
      tiempoDesdeInicio: "00:26:00",
      localidad: "Espora"
    },
    {
      id: "MV23",
      nombre: "A. DEL VALLE Y C.A. GRAL. BELGRANO",
      coordenadas: { lat: -31.58723161, lng: -60.69107235 },
      tiempoDesdeInicio: "00:27:00",
      localidad: "Espora"
    },
    {
      id: "MV24",
      nombre: "A. DEL VALLE Y A. STORNI",
      coordenadas: { lat: -31.584244, lng: -60.690295 },
      tiempoDesdeInicio: "00:28:00",
      localidad: "Espora"
    },
    {
      id: "MV25",
      nombre: "A. DEL VALLE Y LAMOTHE",
      coordenadas: { lat: -31.58266678, lng: -60.68980807 },
      tiempoDesdeInicio: "00:29:00",
      localidad: "Espora"
    },
    {
      id: "MV26",
      nombre: "A. DEL VALLE Y CALLEJÓN EL SABLE",
      coordenadas: { lat: -31.58031048, lng: -60.68918563 },
      tiempoDesdeInicio: "00:29:00",
      localidad: "Espora"
    },
    {
      id: "MV27",
      nombre: "A. DEL VALLE Y CALLEJÓN ROCA",
      coordenadas: { lat: -31.57728074, lng: -60.68983602 },
      tiempoDesdeInicio: "00:30:00",
      localidad: "Espora"
    },
    {
      id: "MV28",
      nombre: "A. DEL VALLE FRENTE CLUB BANCO PROVINCIA",
      coordenadas: { lat: -31.57452298, lng: -60.69021778 },
      tiempoDesdeInicio: "00:31:00",
      localidad: "Espora"
    },
    {
      id: "MV29",
      nombre: "A. DEL VALLE Y LOS NOGALES",
      coordenadas: { lat: -31.57176052, lng: -60.68989961 },
      tiempoDesdeInicio: "00:31:00",
      localidad: "Espora"
    },
    {
      id: "MV30",
      nombre: "A. DEL VALLE Y F. QUIROGA",
      coordenadas: { lat: -31.56890649, lng: -60.68944186 },
      tiempoDesdeInicio: "00:32:00",
      localidad: "Parada 10"
    },
    {
      id: "MV31",
      nombre: "A. DEL VALLE Y RUTA 2",
      coordenadas: { lat: -31.55498602, lng: -60.68633093 },
      tiempoDesdeInicio: "00:35:00",
      localidad: "A. Gallardo"
    },
    {
      id: "MV32",
      nombre: "ROTONDA ÁNGEL GALLARDO",
      coordenadas: { lat: -31.55534699, lng: -60.67938257 },
      tiempoDesdeInicio: "00:37:00",
      localidad: "A. Gallardo"
    },
    {
      id: "MV33",
      nombre: "RUTA 2 Y CEMENTERIO LAR DE PAZ",
      coordenadas: { lat: -31.54796032, lng: -60.69119829 },
      tiempoDesdeInicio: "00:42:00",
      localidad: "A. Mirta"
    },
    {
      id: "MV34",
      nombre: "RUTA 2 Y RUTA 5",
      coordenadas: { lat: -31.53992705, lng: -60.6884873 },
      tiempoDesdeInicio: "00:43:00",
      localidad: "A. Mirta"
    },
    {
      id: "MV35",
      nombre: "ESTACIÓN DE SERVICIO PUMA",
      coordenadas: { lat: -31.52788229, lng: -60.68457796 },
      tiempoDesdeInicio: "00:45:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV36",
      nombre: "AV. SAN MARTÍN Y LA RIOJA",
      coordenadas: { lat: -31.52363084, lng: -60.68315798 },
      tiempoDesdeInicio: "00:46:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV37",
      nombre: "AV. SAN MARTÍN Y SANTA CRUZ",
      coordenadas: { lat: -31.5225049, lng: -60.68279833 },
      tiempoDesdeInicio: "00:46:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV38",
      nombre: "AV. SAN MARTÍN Y NEUQUÉN",
      coordenadas: { lat: -31.51973596, lng: -60.68187972 },
      tiempoDesdeInicio: "00:47:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV39",
      nombre: "AV. SAN MARTÍN Y ENTRE RIOS",
      coordenadas: { lat: -31.51656266, lng: -60.68084077 },
      tiempoDesdeInicio: "00:48:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV40",
      nombre: "BV. E. LOPEZ Y SANTA FE",
      coordenadas: { lat: -31.51542814, lng: -60.67916941 },
      tiempoDesdeInicio: "00:49:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV41",
      nombre: "BV. E. LOPEZ Y BUENOS AIRES",
      coordenadas: { lat: -31.51746878, lng: -60.67924818 },
      tiempoDesdeInicio: "00:50:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV42",
      nombre: "BUENOS AIRES Y DR. PUCCIO",
      coordenadas: { lat: -31.51832609, lng: -60.6779001 },
      tiempoDesdeInicio: "00:51:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV43",
      nombre: "BALDACINI Y BUENOS AIRES",
      coordenadas: { lat: -31.51799404, lng: -60.67664048 },
      tiempoDesdeInicio: "00:51:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV44",
      nombre: "BALDACINI Y SANTA FE",
      coordenadas: { lat: -31.51599047, lng: -60.67612504 },
      tiempoDesdeInicio: "00:52:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV45",
      nombre: "BALDACINI Y SGO. DEL ESTERO",
      coordenadas: { lat: -31.51380801, lng: -60.67587012 },
      tiempoDesdeInicio: "00:53:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV46",
      nombre: "BV. E. LOPEZ Y SGO. DEL ESTERO",
      coordenadas: { lat: -31.51290909, lng: -60.67833377 },
      tiempoDesdeInicio: "00:54:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV47",
      nombre: "BV. E. LOPEZ Y FORMOSA",
      coordenadas: { lat: -31.51140759, lng: -60.67838872 },
      tiempoDesdeInicio: "00:55:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV48",
      nombre: "GALPÓN EMP. MONTE VERA",
      coordenadas: { lat: -31.50918773, lng: -60.67810577 },
      tiempoDesdeInicio: "00:55:00",
      localidad: "Monte Vera"
    }
  ],
  montevera_santafe: [
    {
      id: "MV49",
      nombre: "GALPÓN EMP. MONTE VERA",
      coordenadas: { lat: -31.50918773, lng: -60.67810577 },
      tiempoDesdeInicio: "00:00:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV50",
      nombre: "BV. E. LOPEZ Y FORMOSA",
      coordenadas: { lat: -31.51106197, lng: -60.67847617 },
      tiempoDesdeInicio: "00:01:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV51",
      nombre: "BV. E. LOPEZ Y SGO. DEL ESTERO",
      coordenadas: { lat: -31.51277253, lng: -60.67868489 },
      tiempoDesdeInicio: "00:02:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV52",
      nombre: "BALDACINI Y SGO. DEL ESTERO",
      coordenadas: { lat: -31.51368662, lng: -60.67615001 },
      tiempoDesdeInicio: "00:04:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV53",
      nombre: "BALDACINI Y SANTA FE",
      coordenadas: { lat: -31.51561791, lng: -60.67628599 },
      tiempoDesdeInicio: "00:05:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV54",
      nombre: "BALDACINI Y BUENOS AIRES",
      coordenadas: { lat: -31.51774209, lng: -60.67649709 },
      tiempoDesdeInicio: "00:06:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV55",
      nombre: "BUENOS AIRES Y DR. PUCCIO",
      coordenadas: { lat: -31.51779915, lng: -60.67757397 },
      tiempoDesdeInicio: "00:08:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV56",
      nombre: "BV. E. LOPEZ Y BUENOS AIRES",
      coordenadas: { lat: -31.51811736, lng: -60.67898647 },
      tiempoDesdeInicio: "00:09:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV57",
      nombre: "BV. E. LOPEZ Y SANTA FE",
      coordenadas: { lat: -31.51575732, lng: -60.67878031 },
      tiempoDesdeInicio: "00:10:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV58",
      nombre: "AV. SAN MARTÍN Y ENTRE RIOS",
      coordenadas: { lat: -31.51657578, lng: -60.68102425 },
      tiempoDesdeInicio: "00:11:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV59",
      nombre: "AV. SAN MARTÍN Y NEUQUÉN",
      coordenadas: { lat: -31.51947604, lng: -60.6819561 },
      tiempoDesdeInicio: "00:12:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV60",
      nombre: "AV. SAN MARTÍN Y SANTA CRUZ",
      coordenadas: { lat: -31.5225258, lng: -60.68301078 },
      tiempoDesdeInicio: "00:14:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV61",
      nombre: "AV. SAN MARTÍN Y LA RIOJA",
      coordenadas: { lat: -31.52318159, lng: -60.68327125 },
      tiempoDesdeInicio: "00:15:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV62",
      nombre: "ESTACIÓN DE SERVICIO PUMA",
      coordenadas: { lat: -31.52715057, lng: -60.68450002 },
      tiempoDesdeInicio: "00:16:00",
      localidad: "Monte Vera"
    },
    {
      id: "MV63",
      nombre: "RUTA 2 Y RUTA 5",
      coordenadas: { lat: -31.54032387, lng: -60.68884276 },
      tiempoDesdeInicio: "00:17:00",
      localidad: "A. Mirta"
    },
    {
      id: "MV64",
      nombre: "RUTA 2 Y CEMENTERIO LAR DE PAZ",
      coordenadas: { lat: -31.54784427, lng: -60.69130503 },
      tiempoDesdeInicio: "00:19:00",
      localidad: "A. Mirta"
    },
    {
      id: "MV65",
      nombre: "ROTONDA ÁNGEL GALLARDO",
      coordenadas: { lat: -31.55531848, lng: -60.67940531 },
      tiempoDesdeInicio: "00:24:00",
      localidad: "A. Gallardo"
    },
    {
      id: "MV66",
      nombre: "A. DEL VALLE Y RUTA 2",
      coordenadas: { lat: -31.55497461, lng: -60.68662823 },
      tiempoDesdeInicio: "00:27:00",
      localidad: "A. Gallardo"
    },
    {
      id: "MV67",
      nombre: "A. DEL VALLE Y F. QUIROGA",
      coordenadas: { lat: -31.56860461, lng: -60.68965899 },
      tiempoDesdeInicio: "00:29:00",
      localidad: "Parada 10"
    },
    {
      id: "MV68",
      nombre: "A. DEL VALLE Y LOS NOGALES",
      coordenadas: { lat: -31.57143326, lng: -60.69014467 },
      tiempoDesdeInicio: "00:30:00",
      localidad: "Espora"
    },
    {
      id: "MV69",
      nombre: "A. DEL VALLE FRENTE CLUB BANCO PROVINCIA",
      coordenadas: { lat: -31.5734713, lng: -60.69045662 },
      tiempoDesdeInicio: "00:30:00",
      localidad: "Espora"
    },
    {
      id: "MV70",
      nombre: "A. DEL VALLE Y CALLEJÓN ROCA",
      coordenadas: { lat: -31.57699509, lng: -60.69021395 },
      tiempoDesdeInicio: "00:31:00",
      localidad: "Espora"
    },
    {
      id: "MV71",
      nombre: "A. DEL VALLE Y CALLEJÓN EL SABLE",
      coordenadas: { lat: -31.57969554, lng: -60.68949736 },
      tiempoDesdeInicio: "00:31:00",
      localidad: "Espora"
    },
    {
      id: "MV72",
      nombre: "A. DEL VALLE Y LAMOTHE",
      coordenadas: { lat: -31.58234439, lng: -60.69000798 },
      tiempoDesdeInicio: "00:32:00",
      localidad: "Espora"
    },
    {
      id: "MV73",
      nombre: "A. DEL VALLE Y A. STORNI",
      coordenadas: { lat: -31.58395674, lng: -60.69050256 },
      tiempoDesdeInicio: "00:32:00",
      localidad: "Espora"
    },
    {
      id: "MV74",
      nombre: "A. DEL VALLE Y C.A. GRAL. BELGRANO",
      coordenadas: { lat: -31.58702733, lng: -60.69137363 },
      tiempoDesdeInicio: "00:33:00",
      localidad: "Espora"
    },
    {
      id: "MV75",
      nombre: "A. DEL VALLE Y ALMONACID",
      coordenadas: { lat: -31.58947028, lng: -60.6919845 },
      tiempoDesdeInicio: "00:33:00",
      localidad: "Espora"
    },
    {
      id: "MV76",
      nombre: "A. DEL VALLE Y FRENCH",
      coordenadas: { lat: -31.59218767, lng: -60.69224184 },
      tiempoDesdeInicio: "00:34:00",
      localidad: "Espora"
    },
    {
      id: "MV77",
      nombre: "A. DEL VALLE Y LARREA",
      coordenadas: { lat: -31.59517012, lng: -60.69223526 },
      tiempoDesdeInicio: "00:35:00",
      localidad: "Espora"
    },
    {
      id: "MV78",
      nombre: "A. DEL VALLE Y AYACUCHO",
      coordenadas: { lat: -31.59705731, lng: -60.69200917 },
      tiempoDesdeInicio: "00:35:00",
      localidad: "Espora"
    },
    {
      id: "MV79",
      nombre: "A. DEL VALLE Y J. DE LA ROSA",
      coordenadas: { lat: -31.59907525, lng: -60.69196028 },
      tiempoDesdeInicio: "00:36:00",
      localidad: "Espora"
    },
    {
      id: "MV80",
      nombre: "A. DEL VALLE Y RISSO",
      coordenadas: { lat: -31.60103022, lng: -60.69208188 },
      tiempoDesdeInicio: "00:36:00",
      localidad: "Espora"
    },
    {
      id: "MV81",
      nombre: "A. DEL VALLE Y ESPORA",
      coordenadas: { lat: -31.60375394, lng: -60.69238973 },
      tiempoDesdeInicio: "00:37:00",
      localidad: "Espora"
    },
    {
      id: "MV82",
      nombre: "A. DEL VALLE Y CASTELLI",
      coordenadas: { lat: -31.60654316, lng: -60.69308219 },
      tiempoDesdeInicio: "00:38:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV83",
      nombre: "A. DEL VALLE Y A. CASANELLO",
      coordenadas: { lat: -31.60923063, lng: -60.69408495 },
      tiempoDesdeInicio: "00:39:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV84",
      nombre: "A. DEL VALLE Y PEDRO DE VEGA",
      coordenadas: { lat: -31.61119476, lng: -60.69477035 },
      tiempoDesdeInicio: "00:40:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV85",
      nombre: "A. DEL VALLE Y LAVAISE",
      coordenadas: { lat: -31.61280743, lng: -60.69568685 },
      tiempoDesdeInicio: "00:41:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV86",
      nombre: "A. DEL VALLE Y ESQUIÚ",
      coordenadas: { lat: -31.61484159, lng: -60.69688623 },
      tiempoDesdeInicio: "00:41:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV87",
      nombre: "A. DEL VALLE Y J.M. ZUVIRÍA",
      coordenadas: { lat: -31.6171541, lng: -60.69796048 },
      tiempoDesdeInicio: "00:42:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV88",
      nombre: "A. DEL VALLE Y MARTIN ZAPATA",
      coordenadas: { lat: -31.61987714, lng: -60.69869387 },
      tiempoDesdeInicio: "00:43:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV89",
      nombre: "A. DEL VALLE Y PADILLA",
      coordenadas: { lat: -31.62168543, lng: -60.69917834 },
      tiempoDesdeInicio: "00:43:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV90",
      nombre: "A. DEL VALLE Y L. TORRENT",
      coordenadas: { lat: -31.62444734, lng: -60.69973771 },
      tiempoDesdeInicio: "00:44:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV91",
      nombre: "A. DEL VALLE Y P. ZENTENO",
      coordenadas: { lat: -31.62720353, lng: -60.7003454 },
      tiempoDesdeInicio: "00:44:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV92",
      nombre: "A. DEL VALLE E ITURRASPE",
      coordenadas: { lat: -31.6290418, lng: -60.70074491 },
      tiempoDesdeInicio: "00:45:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV93",
      nombre: "A. DEL VALLE Y PJE. LARRAMENDI",
      coordenadas: { lat: -31.63179197, lng: -60.70141261 },
      tiempoDesdeInicio: "00:47:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV94",
      nombre: "25 DE MAYO Y BV. GÁLVEZ",
      coordenadas: { lat: -31.63537851, lng: -60.70247713 },
      tiempoDesdeInicio: "00:49:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV95",
      nombre: "25 DE MAYO Y JUNÍN",
      coordenadas: { lat: -31.63883499, lng: -60.70351072 },
      tiempoDesdeInicio: "00:50:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV96",
      nombre: "SUIPACHA Y SAN LUIS",
      coordenadas: { lat: -31.64081526, lng: -60.70158287 },
      tiempoDesdeInicio: "00:53:00",
      localidad: "Santa Fe"
    },
    {
      id: "MV97",
      nombre: "TERMINAL SANTA FE",
      coordenadas: { lat: -31.6442377, lng: -60.70065952 },
      tiempoDesdeInicio: "00:55:00",
      localidad: "Santa Fe"
    }
  ],
};

export const tarifas = {
  vigencia: "2025-01-17",
  matriz: {
    "Santa Fe": {
      "Espora": 1600.00,
      "Parada 10": 1600.00,
      "A. Gallardo": 1951.00,
      "A. Mirta": 2241.00,
      "Monte Vera": 2765.00
    },
    "Espora": {
      "Parada 10": 1600.00,
      "A. Gallardo": 1600.00,
      "A. Mirta": 1602.00,
      "Monte Vera": 2125.00
    },
    "Parada 10": {
      "A. Gallardo": 1600.00,
      "A. Mirta": 1600.00,
      "Monte Vera": 1660.00
    },
    "A. Gallardo": {
      "A. Mirta": 1600.00,
      "Monte Vera": 1600.00
    },
    "A. Mirta": {
      "Monte Vera": 1600.00
    },
    "Monte Vera": {
      "Santa Fe": 2765.00,
      "Espora": 2241.00,
      "Parada 10": 1951.00,
      "A. Gallardo": 1600.00,
      "A. Mirta": 1600.00
    }
  },
  metodoPago: "SUBE_UNICAMENTE",
  descuentos: null,
  abonos: null
};
