// backend/routes/pedidos_rutas.js
import express from 'express'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import jwt from 'jsonwebtoken'

const router = express.Router()
const __filename   = fileURLToPath(import.meta.url)
const __dirname    = path.dirname(__filename)
const ORDERS_FILE  = path.join(__dirname, '../data/pedidos.json')
const USERS_FILE   = path.join(__dirname, '../data/users.json')

// Helpers para pedidos
async function loadOrders() {
  try {
    const content = await readFile(ORDERS_FILE, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeFile(ORDERS_FILE, '[]', 'utf8')
      return []
    }
    throw err
  }
}
async function saveOrders(orders) {
  await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8')
}

// Helpers para usuarios
async function loadUsers() {
  try {
    const content = await readFile(USERS_FILE, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    if (err.code === 'ENOENT') {
      // si no existía, lo creamos con un array vacío
      await writeFile(USERS_FILE, '[]', 'utf8')
      return []
    }
    throw err
  }
}
async function saveUsers(users) {
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
}

// POST /api/pedidos
router.post('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ msg: 'No autorizado' })
  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return res.status(401).json({ msg: 'Token inválido' })
  }

  const { userId, items, total, envio } = req.body
  if (
    payload.id !== userId ||
    !Array.isArray(items) ||
    typeof total !== 'number' ||
    !envio
  ) {
    return res.status(400).json({ msg: 'Datos de pedido inválidos' })
  }

  // 1) Crear pedido
  const orders = await loadOrders()
  const newOrder = {
    id: orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1,
    userId,
    items,
    total,
    envio,
    fecha: new Date().toISOString()
  }
  orders.push(newOrder)
  await saveOrders(orders)

  // 2) Actualizar usuario: restar saldo y añadir id de pedido
  const users = await loadUsers()
  const uid = Number(userId)
  const idx = users.findIndex(u => u.id == uid)
  if (idx === -1) return res.status(404).json({ msg: 'Usuario no encontrado (pedidos)' })

  // restar saldo
  users[idx].saldo = (users[idx].saldo || 0) - total
  // inicializar array pedidos si hace falta
  if (!Array.isArray(users[idx].pedidos)) users[idx].pedidos = []
  users[idx].pedidos.push(newOrder.id)

  await saveUsers(users)

  // devolver ambos: pedido y usuario actualizado (sin password)
  const { password, ...safeUser } = users[idx]
  res.status(201).json({ order: newOrder, user: safeUser })
})


// GET /api/pedidos/:id
router.get('/:id', async (req, res) => {
  const orders = await loadOrders()
  const order = orders.find(o => String(o.id) === req.params.id)
  if (!order) return res.status(404).json({ msg: 'Pedido no encontrado' })
  res.json(order)
})


export default router
