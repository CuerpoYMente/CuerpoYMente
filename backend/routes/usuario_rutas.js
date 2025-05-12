// backend/routes/usuario_rutas.js
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'un_secreto_para_probar'

// Reconstruir __dirname en ESM

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const USERS_FILE = path.join(__dirname, '../data/users.json')

// Helpers
async function loadUsers() {
  try {
    const content = await readFile(USERS_FILE, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeFile(USERS_FILE, '[]', 'utf8')
      return []
    }
    throw err
  }
}

async function saveUsers(users) {
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
}

// POST /api/usuarios/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Faltan campos' })
  }

  const users = await loadUsers()
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ msg: 'Email ya registrado' })
  }

  const hash = await bcrypt.hash(password, 10)
  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
    password: hash,
    plan_actual: '',
    carrito: []
  }
  users.push(newUser)
  await saveUsers(users)

  // Generar token y responder con user + token
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1d' })
  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      plan_actual: newUser.plan_actual,
      carrito: newUser.carrito
    }
  })
})

// POST /api/usuarios/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ msg: 'Faltan campos' })
  }

  const users = await loadUsers()
  const user = users.find(u => u.email === email)
  if (!user) {
    return res.status(401).json({ msg: 'Email o contraseña incorrectos' })
  }

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) {
    return res.status(401).json({ msg: 'Email o contraseña incorrectos' })
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' })
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan_actual: user.plan_actual || '',
      carrito: user.carrito || []
    }
  })
})


// POST /api/usuarios/:id/carrito
// Añade un producto al carrito del usuario y devuelve el usuario actualizado
router.post('/:id/carrito', async (req, res) => {
  const { id } = req.params
  const { productId } = req.body
  if (typeof productId !== 'number') {
    return res.status(400).json({ msg: 'Falta productId o tipo inválido' })
  }

  const users = await loadUsers()
  const idx = users.findIndex(u => u.id === Number(id))
  if (idx === -1) {
    return res.status(404).json({ msg: 'Usuario no encontrado (carrito)' })
  }

  const user = users[idx]
  if (!Array.isArray(user.carrito)) {
    user.carrito = []
  }
  if (!user.carrito.includes(productId)) {
    user.carrito.push(productId)
    await saveUsers(users)
  }

  // Generar nuevo token (opcional) o devolver mismo
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' })
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan_actual: user.plan_actual,
      carrito: user.carrito
    }
  })
})

// DELETE /api/usuarios/:id/carrito/:productId
router.delete('/:id/carrito/:productId', async (req, res) => {
  const userId    = Number(req.params.id)
  const productId = Number(req.params.productId)

  const users = await loadUsers()
  const idx   = users.findIndex(u => u.id === userId)
  if (idx === -1) {
    return res.status(404).json({ msg: 'Usuario no encontrado (productId)' })
  }

  // Filtramos el carrito
  users[idx].carrito = (users[idx].carrito || [])
    .filter(pid => pid !== productId)

  await saveUsers(users)

  // Devolvemos el usuario actualizado (y opcionalmente un token)
  const user = users[idx]
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' })
  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan_actual: user.plan_actual,
      carrito: user.carrito
    }
  })
})


// POST /api/usuarios/:id/saldo
router.post('/:id/saldo', async (req, res) => {
  const { amount } = req.body;
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ msg: 'Cantidad inválida' });
  }

  const users = await loadUsers();
  const idNum = Number(req.params.id);
  const idx   = users.findIndex(u => u.id === idNum);
  if (idx === -1) {
    return res.status(404).json({ msg: 'Usuario no encontrado (saldo)' });
  }

  // Actualiza saldo
  users[idx].saldo = (users[idx].saldo || 0) + amount;

  await saveUsers(users);

  // Devuelve el usuario actualizado (sin el password)
  const { password, ...safeUser } = users[idx];
  res.json({ user: safeUser });
});

export default router
