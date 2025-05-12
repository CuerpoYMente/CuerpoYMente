// backend/routes/retos_rutas.js
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'

const router = express.Router()

// Reconstruir __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ruta fija a backend/data/retos.json
const RETOS_FILE = path.join(__dirname, '../data/retos.json')

// Helpers
async function loadRetos() {
  try {
    const content = await readFile(RETOS_FILE, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeFile(RETOS_FILE, '[]', 'utf8')
      return []
    }
    throw err
  }
}

async function saveRetos(retos) {
  await writeFile(RETOS_FILE, JSON.stringify(retos, null, 2), 'utf8')
}

// Rutas de retos

// GET /api/retos → lista todos los retos
router.get('/', async (req, res) => {
  const retos = await loadRetos()
  res.json(retos)
})

// GET /api/retos/:id → detalle de un reto
router.get('/:id', async (req, res) => {
  const retos = await loadRetos()
  const reto = retos.find(r => r.id === req.params.id)
  if (!reto) return res.status(404).json({ msg: 'Reto no encontrado' })
  res.json(reto)
})

// POST /api/retos → crea un nuevo reto
router.post('/', async (req, res) => {
  const {
    id,
    titulo,
    descripcion,
    detalles,
    intensidad,
    material,
    imagen,
    video,
    aportes = []
  } = req.body

  // Campos obligatorios
  if (!id || !titulo || !descripcion) {
    return res.status(400).json({ msg: 'Faltan campos obligatorios: id, titulo, descripcion' })
  }

  const retos = await loadRetos()
  if (retos.find(r => r.id === id)) {
    return res.status(409).json({ msg: 'ID de reto ya existe' })
  }

  const newReto = {
    id,
    titulo,
    descripcion,
    detalles: detalles || '',
    intensidad: intensidad || '',
    material: material || '',
    imagen: imagen || '',
    video: video || '',
    aportes
  }

  retos.push(newReto)
  await saveRetos(retos)

  res.status(201).json(newReto)
})

// PUT /api/retos/:id → actualiza un reto
router.put('/:id', async (req, res) => {
  const retos = await loadRetos()
  const idx = retos.findIndex(r => r.id === req.params.id)
  if (idx === -1) return res.status(404).json({ msg: 'Reto no encontrado' })

  const updated = {
    ...retos[idx],
    ...req.body,
    id: retos[idx].id
  }
  retos[idx] = updated
  await saveRetos(retos)

  res.json(updated)
})

// DELETE /api/retos/:id → borra un reto
router.delete('/:id', async (req, res) => {
  let retos = await loadRetos()
  const before = retos.length
  retos = retos.filter(r => r.id !== req.params.id)

  if (retos.length === before) {
    return res.status(404).json({ msg: 'Reto no encontrado' })
  }

  await saveRetos(retos)
  res.json({ msg: 'Reto eliminado' })
})

// POST /api/retos/:id/aportes → añade un aporte a un reto existente
router.post('/:id/aportes', async (req, res) => {
  const { usuario, mensaje } = req.body
  if (!usuario || !mensaje) {
    return res.status(400).json({ msg: 'Faltan campos obligatorios: usuario, mensaje' })
  }

  const retos = await loadRetos()
  const idx = retos.findIndex(r => r.id === req.params.id)
  if (idx === -1) return res.status(404).json({ msg: 'Reto no encontrado' })

  const nuevoAporte = { usuario, mensaje }
  retos[idx].aportes.push(nuevoAporte)
  await saveRetos(retos)

  res.status(201).json(nuevoAporte)
})

// GET /api/retos/:id/aportes
router.get('/:id/aportes', async (req, res) => {
  const retos = await loadRetos()
  const reto = retos.find(r => r.id === req.params.id)
  if (!reto) {
    return res.status(404).json({ msg: 'Reto no encontrado' })
  }
  // Devolver los aportes existentes (o array vacío)
  res.json(reto.aportes || [])
})


export default router
