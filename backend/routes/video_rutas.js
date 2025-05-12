// backend/routes/videos_rutas.js
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'

const router = express.Router()

// Reconstruir __dirname en ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// Ruta fija a backend/data/videos.json
const VIDEOS_FILE = path.join(__dirname, '../data/videos.json')

// Helpers
async function loadVideos() {
  try {
    const content = await readFile(VIDEOS_FILE, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeFile(VIDEOS_FILE, '[]', 'utf8')
      return []
    }
    throw err
  }
}

async function saveVideos(videos) {
  await writeFile(VIDEOS_FILE, JSON.stringify(videos, null, 2), 'utf8')
}

// Rutas

// GET /api/videos/ → lista todos los vídeos
router.get('/', async (req, res) => {
  const videos = await loadVideos()
  res.json(videos)
})

// GET /api/videos/:id → detalle de un vídeo
router.get('/:id', async (req, res) => {
  const videos = await loadVideos()
  const vid = videos.find(v => String(v.id) === req.params.id)
  if (!vid) return res.status(404).json({ msg: 'Vídeo no encontrado' })
  res.json(vid)
})

// POST /api/videos/ → añadir un vídeo con tu modelo
router.post('/', async (req, res) => {
  const {
    titulo,
    url,
    duracion,
    deporte,
    intensidad,
    material,
    zona
  } = req.body

  // Verificamos campos obligatorios
  if (!titulo || !url || duracion == null || !deporte) {
    return res.status(400).json({ 
      msg: 'Faltan campos obligatorios: titulo, url, duracion, deporte' 
    })
  }

  const videos = await loadVideos()
  const newVideo = {
    id: videos.length ? Math.max(...videos.map(v => v.id)) + 1 : 1,
    titulo,
    url,
    duracion,
    deporte,
    intensidad: intensidad || '',
    material: material || '',
    zona: zona || ''
  }

  videos.push(newVideo)
  await saveVideos(videos)

  res.status(201).json(newVideo)
})

// PUT /api/videos/:id → editar un vídeo
router.put('/:id', async (req, res) => {
  const videos = await loadVideos()
  const idx = videos.findIndex(v => String(v.id) === req.params.id)
  if (idx === -1) return res.status(404).json({ msg: 'Vídeo no encontrado' })

  const updated = {
    ...videos[idx],
    ...req.body,
    id: videos[idx].id  // nunca cambias ID
  }
  videos[idx] = updated
  await saveVideos(videos)

  res.json(updated)
})

// DELETE /api/videos/:id → borrar un vídeo
router.delete('/:id', async (req, res) => {
  let videos = await loadVideos()
  const before = videos.length
  videos = videos.filter(v => String(v.id) !== req.params.id)

  if (videos.length === before) {
    return res.status(404).json({ msg: 'Vídeo no encontrado' })
  }

  await saveVideos(videos)
  res.json({ msg: 'Vídeo eliminado' })
})

export default router
