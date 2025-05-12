// src/constants/constantes.js
export const API_BASE = '/api'          // proxy de Vite
export const VIDEOS_ENDPOINT = '/videos'
export const RETOS_ENDPOINT  = '/retos'

// valores de filtro…
export const DURACIONES = [
  { value: 'cualquiera', label: 'Cualquiera' },  
  { value: '0-5',   label: '0–5 min' },
  { value: '5-10',   label: '5-10 min' },
  { value: '10-15',   label: '10-15 min' },
  { value: '15-20',   label: '15-20 min' },
  { value: '20-25',   label: '20-25 min' },
  { value: '25-30',   label: '25-30 min' },
  { value: '30-',   label: 'Mas de 30 min' },
]

// listas estáticas, etc.
export const MATERIALES = [
  { value: 'nada', label: 'Nada' },
  { value: 'esterilla', label: 'Esterilla' },
  { value: 'mancuernas', label: 'Mancuernas' },
  { value: 'pelota_pilates', label: 'Pelota De Pilates' },
  { value: 'banco', label: 'Banco' },
  { value: 'goma', label: 'Goma Deprtiva' },
]

export const INTENSIDAD = [
  { value: 'cualquiera', label: 'Cualquiera' },
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
]

export const DEPORTE = [
  { value: 'cualquiera', label: 'Cualquiera' },
  { value: 'fuerza', label: 'Fuerza' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'baile', label: 'Baile' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'pilates', label: 'Pilates' },
]

export const ZONA_TRABAJADA = [
  { value: 'cualquiera', label: 'Cualquiera' },
  { value: 'total_body', label: 'Total Body' },
  { value: 'tren_superior', label: 'Tren Superior' },
  { value: 'tren_inferior', label: 'Tren Inferior' },
  { value: 'core', label: 'Core' },
]


export const TIPO_PRODUCTO = [
    { value: 'cualquiera', label: 'Cualquiera' },
    { value: 'suplementos', label: 'Suplementos' },
    { value: 'material_deportivo', label: 'Material Deportivo' },
    { value: 'ropa_deportiva', label: 'Ropa Deportiva' },
]

export const PRICE_RANGES = [
  { value: 'cualquiera', label: 'Cualquiera' },
  { value: '0-20', label: 'Menos de $20' },
  { value: '20-50', label: '$20–50' },
  { value: '50+', label: 'Más de $50' },
]