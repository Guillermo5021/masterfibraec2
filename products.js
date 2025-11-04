// Imagenes representativas por ahora (puedes cambiarlas por una por producto)
const IMG = {
  carrocerias: 'images/buses.webp',
  macetas: 'images/macetas.webp',
  piezas: 'images/piezas.webp',
};

// Catálogo base (puedes ampliar precios, descripciones e imágenes individuales)
const PRODUCTS = [
  // Carrocerías
  { id:'car-001', name:'Parachoques frontal bus', price:100, category:'carrocerias', categoryLabel:'Carrocerías', image:IMG.carrocerias, short:'Parachoques en fibra de alto impacto.', long:'Parachoques frontal fabricado en fibra de vidrio, alta resistencia y excelente acabado. Ideal para flota urbana e interprovincial.' },
  { id:'car-002', name:'Panel lateral bus', price:160, category:'carrocerias', categoryLabel:'Carrocerías', image:IMG.carrocerias, short:'Panel lateral resistente.', long:'Panel lateral en fibra de vidrio, liviano y duradero. Fabricación a medida según modelo.' },

  // Macetas
  { id:'mac-001', name:'Maceta esférica M', price:40, category:'macetas', categoryLabel:'Macetas', image:IMG.macetas, short:'Maceta esférica tamaño mediano.', long:'Acabado premium, ideal para interiores o exteriores. Peso liviano y alta resistencia.' },
  { id:'mac-002', name:'Maceta esférica L con base', price:55, category:'macetas', categoryLabel:'Macetas', image:IMG.macetas, short:'Incluye base metálica.', long:'Maceta grande con base metálica. Personalizable en color y tamaño.' },

  // Piezas personalizadas
  { id:'pie-001', name:'Alero/deflector a medida', price:60, category:'piezas', categoryLabel:'Piezas personalizadas', image:IMG.piezas, short:'Fabricación bajo plano/medida.', long:'Producimos piezas personalizadas en fibra de vidrio según requerimiento técnico.' },
  { id:'pie-002', name:'Cubierta técnica', price:75, category:'piezas', categoryLabel:'Piezas personalizadas', image:IMG.piezas, short:'Cubierta liviana y resistente.', long:'Cubiertas y carcasas para equipos. Terminación profesional y alta durabilidad.' },
];

