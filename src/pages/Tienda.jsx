// src/pages/Tienda.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/Header'
import { Link } from 'react-router-dom' 
import Footer from '../components/Footer'
import colors from '../theme/colors'
import { API_BASE } from '../constants/constantes'
import { TIPO_PRODUCTO ,PRICE_RANGES} from '../constants/constantes'

const Tienda = () => {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('cualquiera')
  const [filtroPrecio, setFiltroPrecio] = useState('cualquiera')
  const navigate = useNavigate()

  // Carga productos desde backend
  useEffect(() => {
    fetch(`${API_BASE}/productos`)
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error cargando productos:', err))
  }, [])

  // Función para verificar rango de precio
  const matchPrecio = precio => {
    switch (filtroPrecio) {
      case '0-20': return precio <= 20
      case '20-50': return precio > 20 && precio <= 50
      case '50+': return precio > 50
      default:      return true
    }
  }

  // Filtrado combinado
  const productosFiltrados = productos
    .filter(p => p.name.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(p => filtroTipo === 'cualquiera' || p.tipo === filtroTipo)
    .filter(p => matchPrecio(p.precio))


  const handleAddToCart = async prod => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (!token || !userStr) {
      navigate('/login')
      return
    }

    const user = JSON.parse(userStr)
    try {
      const res = await fetch(
        `${API_BASE}/usuarios/${user.id}/carrito`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId: prod.id })
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.msg || 'Error al añadir al carrito')
      // Actualiza el usuario en localStorage con el carrito del backend
      localStorage.setItem('user', JSON.stringify(data.user))
      alert('Producto añadido al carrito')
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  return (
    <Container>
      <Header />
      <Main>
        <Titulo>Tienda de Artículos Deportivos</Titulo>

        <Filtros>
          <Filtro>
            <label>Buscar producto:</label>
            <SearchInput
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </Filtro>

          <Filtro>
            <label>Tipo de Producto:</label>
            <Select
              value={filtroTipo}
              onChange={e => setFiltroTipo(e.target.value)}
            >
              {TIPO_PRODUCTO.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </Filtro>

          <Filtro>
            <label>Precio:</label>
            <Select
              value={filtroPrecio}
              onChange={e => setFiltroPrecio(e.target.value)}
            >
              {PRICE_RANGES.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </Filtro>
        </Filtros>

        <Grid>
        {productosFiltrados.map(prod => (
            <Card
            key={prod.id}
            onClick={() => navigate(`/producto/${prod.id}`)}
            >
            <Image
                src={prod.imagenes[0] || '/assets/placeholder.png'}
                alt={prod.name}
            />
            <CardInfo>
                <h4>{prod.name}</h4>
                <p>{prod.descripción_corta}</p>
                <Precio>{prod.precio.toFixed(2)}€</Precio>

                <AddButton
                onClick={e => {
                    e.stopPropagation()           // esto evita que navegue
                    handleAddToCart(prod)
                }}
                >
                Añadir al carrito
                </AddButton>
            </CardInfo>
            </Card>
        ))}
        </Grid>
      </Main>
      <Footer />
    </Container>
  )
}

export default Tienda

/* ------------------ Styled Components ------------------ */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  background-color: ${colors.purplePale};
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`

const Titulo = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: ${colors.purpleDark};
  margin-bottom: 1.5rem;
`

const Filtros = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`

const Filtro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  label {
    font-size: 0.9rem;
    font-weight: 500;
    color: ${colors.textPrimary};
  }
`

const SearchInput = styled.input`
  padding: 0.6rem 1rem;
  border: 1px solid ${colors.grayMedium};
  border-radius: 8px;
  width: 200px;
`

const Select = styled.select`
  padding: 0.6rem;
  border: 1px solid ${colors.grayMedium};
  border-radius: 6px;
  background-color: ${colors.white};
  font-size: 0.9rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-4px);
  }
`

const Image = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`

const CardInfo = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Precio = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.purpleMedium};
`

const AddButton = styled.button`
  padding: 0.6rem;
  background-color: ${colors.purpleLight};
  color: ${colors.white};
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: ${colors.purpleMedium};
  }
`







// src/pages/Tienda.jsx
/*import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/Header'
import Footer from '../components/Footer'
import colors from '../theme/colors'
import { API_BASE } from '../constants/constantes'
import { TIPO_PRODUCTO } from '../constants/constantes'

// Rango de precios para filtro
const PRICE_RANGES = [
  { value: 'cualquiera', label: 'Cualquiera' },
  { value: '0-20', label: 'Menos de $20' },
  { value: '20-50', label: '$20–50' },
  { value: '50+', label: 'Más de $50' },
]

const Tienda = () => {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('cualquiera')
  const [filtroPrecio, setFiltroPrecio] = useState('cualquiera')
  const navigate = useNavigate()

  // Carga productos desde backend
  useEffect(() => {
    fetch(`${API_BASE}/productos`)
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error cargando productos:', err))
  }, [])

  // Función para verificar rango de precio
  const matchPrecio = precio => {
    switch (filtroPrecio) {
      case '0-20': return precio <= 20
      case '20-50': return precio > 20 && precio <= 50
      case '50+': return precio > 50
      default:      return true
    }
  }

  // Filtrado combinado
  const productosFiltrados = productos
    .filter(p => p.name.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(p => filtroTipo === 'cualquiera' || p.tipo === filtroTipo)
    .filter(p => matchPrecio(p.precio))

  return (
    <Container>
      <Header />
      <Main>
        <Titulo>Tienda de Artículos Deportivos</Titulo>

        <Filtros>
          <Filtro>
            <label>Buscardor</label>
            <SearchInput
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </Filtro>

          <Filtro>
            <label>Tipo de Producto:</label>
            <Select
              value={filtroTipo}
              onChange={e => setFiltroTipo(e.target.value)}
            >
              {TIPO_PRODUCTO.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </Filtro>

          <Filtro>
            <label>Precio:</label>
            <Select
              value={filtroPrecio}
              onChange={e => setFiltroPrecio(e.target.value)}
            >
              {PRICE_RANGES.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </Filtro>
        </Filtros>

        <Grid>
          {productosFiltrados.map(prod => (
            <Card key={prod.id}>
              <Image
                src={prod.imagenes[0] || '/assets/placeholder.png'}
                alt={prod.name}
              />
              <CardInfo>
                <h4>{prod.name}</h4>
                <p>{prod.descripción_corta}</p>
                <Precio>${prod.precio.toFixed(2)}</Precio>
                <AddButton onClick={() => {
                  const logged = !!localStorage.getItem('token')
                  if (!logged) return navigate('/login')
                  // lógica de carrito aquí
                }}>
                  Añadir al carrito
                </AddButton>
              </CardInfo>
            </Card>
          ))}
        </Grid>
      </Main>
      <Footer />
    </Container>
  )
}

export default Tienda*/

/* ------------------ Styled Components ------------------ */
/*
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  background-color: ${colors.purplePale};
  padding: 6rem 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`

const Titulo = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: ${colors.purpleDark};
  margin-bottom: 1.5rem;
`

const Filtros = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`

const Filtro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  label {
    font-size: 0.9rem;
    font-weight: 500;
    color: ${colors.textPrimary};
  }
`

const SearchInput = styled.input`
  padding: 0.6rem 1rem;
  border: 1px solid ${colors.grayMedium};
  border-radius: 8px;
  width: 200px;
`

const Select = styled.select`
  padding: 0.6rem;
  border: 1px solid ${colors.grayMedium};
  border-radius: 6px;
  background-color: ${colors.white};
  font-size: 0.9rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-4px);
  }
`

const Image = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`

const CardInfo = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Precio = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.purpleMedium};
`

const AddButton = styled.button`
  padding: 0.6rem;
  background-color: ${colors.purpleLight};
  color: ${colors.white};
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: ${colors.purpleMedium};
  }
`
*/