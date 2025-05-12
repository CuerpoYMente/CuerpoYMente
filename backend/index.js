// backend/index.js
import dotenv from 'dotenv'
dotenv.config()                   // ← aquí cargas las vars

import express from 'express'
import cors from 'cors'

import videosRouter from './routes/video_rutas.js'
import retosRouter  from './routes/retos_rutas.js'
import usuariosRouter  from './routes/usuario_rutas.js'
import productosRouter from './routes/productos_rutas.js'
import pedidosRouter from './routes/pedidos_rutas.js'


const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente 🚀')
})

app.use('/api/videos', videosRouter)
app.use('/api/retos', retosRouter)
app.use('/api/usuarios', usuariosRouter)
app.use('/api/productos', productosRouter)
app.use('/api/pedidos', pedidosRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
