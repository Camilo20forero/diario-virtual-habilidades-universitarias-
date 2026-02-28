// data.js
// Aquí estarán todas las entradas de tu diario.

export const diaryEntries = [
  {
    id: 1,
    date: '27 Febrero 2026',
    title: 'Introducción al Pensamiento Crítico',
    tags: ['reflexion', 'teoria'],
    reflection: 'Hoy fue la primera clase. Hablamos sobre cómo cuestionar las premisas básicas de nuestro diseño. Entendí que muchas veces diseñamos sin pensar en el impacto real del objeto.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop', // Imagen de fallback de bosquejo
    modelUrl: null // Sin modelo 3D aún
  },
  {
    id: 2,
    date: '5 Marzo 2026',
    title: 'Prototipado Rápido con Materiales Reciclados',
    tags: ['practica', 'taller', 'diseño'],
    reflection: 'La clase más divertida hasta ahora. Tuvimos que construir un soporte para celular en 15 minutos solo con cartón. Me di cuenta de que las ideas fluyen mejor cuando las manos están ocupadas.',
    // Un modelo 3D de ejemplo de google model viewer
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    image: null
  },
  {
    id: 3,
    date: '12 Marzo 2026',
    title: 'Presentaciones Efectivas y Storytelling',
    tags: ['habilidades blandas', 'exposicion'],
    reflection: 'Tuvimos que vender nuestra idea al grupo. El storytelling no es solo para marketing, es vital para que un diseño sea aceptado. El profesor enfatizó en "el viaje del usuario".',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Chair.glb', // Otro modelo de ejemplo
    image: null
  }
];

// Generar una lista de etiquetas únicas para los filtros
export const getUniqueTags = () => {
  const tagsSet = new Set();
  diaryEntries.forEach(entry => {
    if(entry.tags) {
      entry.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  return Array.from(tagsSet).sort();
};
