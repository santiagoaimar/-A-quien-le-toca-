// Colores tomados del mockup de Figma
// Cortado (calendario): colores vibrantes con transparencia
// Legend pills y tarjetas: mismos colores

export const DEFAULT_CONFIG = {
  viernesFeliz: {
    // Orden de rotación. El primero en la lista fue el primero en traer comida.
    participants: [
      { name: 'Kevin', color: '#7de3ff' }, // celeste
      { name: 'Nico',  color: '#e97dff' }, // lila/violeta
      { name: 'Santi', color: '#7dffa8' }, // verde menta
      { name: 'Bruno', color: '#ff9f9f' }, // coral suave
      { name: 'Tomi',  color: '#ecff7d' }, // amarillo-verde
    ],
    // Viernes en que Kevin tuvo su primer turno
    baseDate: '2026-03-06',
  },

  cortado: {
    // Santi inicia la rotación. Bruno NO está aquí (corrido fijo).
    participants: [
      { name: 'Santi', color: '#7dffa8' },
      { name: 'Nico',  color: '#e97dff' },
      { name: 'Kevin', color: '#7de3ff' },
      { name: 'Tomi',  color: '#ecff7d' },
    ],
    // Lunes en que Santi comenzó su primera semana de cortado
    baseDate: '2026-03-02',
  },

  bruno: {
    name: 'Bruno',
    color: '#ff9f9f',
    schedule: 'corrido',
  },

  // Ruta del modelo 3D (dentro de /public/models/)
  modelPath: '/models/Pastelito1.glb',
};
