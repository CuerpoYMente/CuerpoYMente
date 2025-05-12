// backend/routes/productos_rutas.js
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const DATA_FILE  = path.join(__dirname, '../data/productos.json')

async function loadProducts() {
  try {
    const content = await readFile(DATA_FILE, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeFile(DATA_FILE, '[]', 'utf8')
      return []
    }
    throw err
  }
}

// GET /api/productos
router.get('/', async (req, res) => {
  const products = await loadProducts()
  res.json(products)
})

// **ESTE** GET por ID es el que necesitas:
router.get('/:id', async (req, res) => {
  const products = await loadProducts()
  const idNum = Number(req.params.id)
  const product = products.find(p => p.id === idNum)
  if (!product) {
    return res.status(404).json({ msg: 'Producto no encontrado' })
  }
  res.json(product)
})


// tras tus router.get('/:id', …)

// GET /api/productos/:id/comentarios
router.get('/:id/comentarios', async (req, res) => {
  const products = await loadProducts()
  const idNum = Number(req.params.id)
  const product = products.find(p => p.id === idNum)
  if (!product) return res.status(404).json({ msg: 'Producto no encontrado' })

  // devolvemos array de comentarios (si no lo tiene, devolvemos [])
  res.json(product.comentarios || [])
})

// POST /api/productos/:id/comentarios
router.post('/:id/comentarios', async (req, res) => {
    console.log('▶️  POST /api/productos/'+req.params.id+'/comentarios', req.body)
    const { usuario, mensaje } = req.body
    if (!usuario || !mensaje) {
        return res.status(400).json({ msg: 'Faltan campos: usuario, mensaje' })
    }

    const products = await loadProducts()
    const idNum    = Number(req.params.id)
    const idx      = products.findIndex(p => p.id === idNum)
    if (idx === -1) return res.status(404).json({ msg: 'Producto no encontrado' })

    // inicializa array si no existía
    if (!Array.isArray(products[idx].comentarios)) {
        products[idx].comentarios = []
    }

    const nuevo = { usuario, mensaje, fecha: new Date().toISOString() }
    products[idx].comentarios.push(nuevo)

    // vuelve a grabar TODO el fichero
    await writeFile(DATA_FILE, JSON.stringify(products, null, 2), 'utf8')

    res.status(201).json(nuevo)
})


export default router
