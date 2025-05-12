// src/pages/Carrito.jsx
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/Header'
import Footer from '../components/Footer'
import colors from '../theme/colors'
import { API_BASE } from '../constants/constantes'
import { Trash2, ArrowLeft, ArrowRight } from 'lucide-react'

const Carrito = () => {
  const [items, setItems] = useState([])
  const [orders, setOrders] = useState([])
  const [imgIndex, setImgIndex] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    navigate('/login')
    return
  }
  const user = JSON.parse(userStr)

  // 1) cargo ítems del carrito (igual que antes)
  const carritoIds = Array.isArray(user.carrito) ? user.carrito : []
  Promise.all(
    carritoIds.map(id =>
      fetch(`${API_BASE}/productos/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Producto no encontrado')
          return res.json()
        })
    )
  )
    .then(setItems)
    .catch(err => {
      console.error('Error cargando productos:', err)
      setItems([])
    })

  // 2) cargo pedidos a partir de user.pedidos
  const pedidoIds = Array.isArray(user.pedidos) ? user.pedidos : []
    if (pedidoIds.length > 0) {
      Promise.all(
        pedidoIds.map(async orderId => {
          // traigo el pedido
          const orderRes = await fetch(`${API_BASE}/pedidos/${orderId}`)
          const order = await orderRes.json()
          // traigo la imágenes de cada producto
          const images = await Promise.all(
            order.items.map(id =>
              fetch(`${API_BASE}/productos/${id}`)
                .then(r => r.json())
                .then(prod => prod.imagenes?.[0] || '/assets/placeholder.png')
            )
          )
          return { ...order, images }
        })
      )
      .then(list => {
        setOrders(list)
        // inicializo idx a 0 para cada pedido
        const idxs = {}
        list.forEach(o => { idxs[o.id] = 0 })
        setImgIndex(idxs)
      })
      .catch(() => setOrders([]))
    }
  }, [navigate])

  const shiftImages = (orderId, delta) => {
    setImgIndex(prev => {
      const maxStart = orders.find(o=>o.id===orderId).images.length - 3
      let next = prev[orderId] + delta
      if (next < 0) next = 0
      if (next > maxStart) next = maxStart
      return { ...prev, [orderId]: next }
    })
  }


  const handleRemove = async id => {
    const user = JSON.parse(localStorage.getItem('user')||'{}')
    const res = await fetch(
      `${API_BASE}/usuarios/${user.id}/carrito/${id}`,
      { method:'DELETE', headers:{ Authorization:`Bearer ${localStorage.getItem('token')}` } }
    )
    if (!res.ok) {
      const e = await res.json();
      return alert(e.msg||'Error')
    }
    const { user: updated } = await res.json()
    localStorage.setItem('user', JSON.stringify(updated))
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const user = JSON.parse(localStorage.getItem('user')||'{}')
  const balance = (user.saldo||0).toFixed(2)
  const total = items.reduce((s,i) => s + (i.precio||0), 0)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleSwitch = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <Container>
      <Header />
      <ContentWrapper>

        <Sidebar>
          <Block>
            <Title>Saldo Actual</Title>
            <Balance>{balance}€</Balance>
            <Button onClick={() => navigate('/ingresardinero')}>Añadir Saldo</Button>
          </Block>

          <Block>
            <Title>Resumen de Pedido</Title>
            <SummaryLine>
              <span>Total:</span>
              <strong>{total.toFixed(2)}€</strong>
            </SummaryLine>
            <Button onClick={() => navigate('/realizarpedido')}>Tramitar Pedido</Button>
          </Block>

          <AccountActions>
            <ActionButton onClick={handleSwitch}>Cambiar de Cuenta</ActionButton>
            <ActionButton onClick={handleLogout}>Cerrar Sesión</ActionButton>
          </AccountActions>
        </Sidebar>

        <CartSection>
          <Title>Tu Cesta</Title>
          <CartScroll>
            {items.length === 0 ? (
              <Empty>Tu cesta está vacía.</Empty>
            ) : (
              items.map(item => (
                <Item key={item.id}>
                  {/* 1. Imagen */}
                  <Link to={`/producto/${item.id}`}>
                    <Img src={item.imagenes?.[0] || '/assets/placeholder.png'} alt={item.name} />
                  </Link>

                  {/* 2. Info (titulo + desc) */}
                  <Link to={`/producto/${item.id}`} style={{ textDecoration:'none', color:'inherit' }}>
                    <Details>
                      <Name>{item.name}</Name>
                      <Desc>{item['descripción_corta']}</Desc>
                    </Details>
                  </Link>

                  {/* 3. Precio */}
                  <Price>{item.precio.toFixed(2)}€</Price>

                  {/* 4. Basura */}
                  <Del onClick={() => handleRemove(item.id)}>
                    <Trash2 size={18}/>
                  </Del>
                </Item>
              ))
            )}
          </CartScroll>
        </CartSection>

        <OrdersSection>
      <Title>Tus Pedidos</Title>
      <OrdersScroll>
        {orders.length === 0
          ? <Empty>No hay pedidos</Empty>
          : orders.map(o => {
              const start = imgIndex[o.id] || 0
              const imgs  = o.images.slice(start, start + 3)
              return (
                <Order key={o.id}>
                  <ImagesRow>
                    {start > 0 &&
                      <NavArrow left onClick={() => shiftImages(o.id, -1)}>
                        <ArrowLeft size={20}/>
                      </NavArrow>
                    }
                    {imgs.map((src,i) => (
                      <Thumb key={i} src={src} alt="" />
                    ))}
                    {start + 3 < o.images.length &&
                      <NavArrow onClick={() => shiftImages(o.id, +1)}>
                        <ArrowRight size={20}/>
                      </NavArrow>
                    }
                  </ImagesRow>
                  <OrdLine><strong>Total:</strong> {o.total.toFixed(2)}€</OrdLine>
                  <OrdLine><strong>Fecha:</strong> {new Date(o.fecha).toLocaleDateString()}</OrdLine>
                </Order>
              )
            })
        }
      </OrdersScroll>
    </OrdersSection>

      </ContentWrapper>
      <Footer />
    </Container>
  )
}

export default Carrito

/* Styled Components */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 6rem auto;
  flex: 1;
  padding: 0 2rem;
`

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const Block = styled.div`
  background: ${colors.white};
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`

const Title = styled.h3`
  margin: 0 0 .5rem;
  color: ${colors.purpleDark};
`

const Balance = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.purpleMedium};
  margin-bottom: .5rem;
`

const Button = styled.button`
  padding: .5rem 1rem;
  background: ${colors.purpleLight};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background .2s;
  &:hover { background: ${colors.purpleMedium}; }
`

const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: .5rem;
`

const AccountActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: .5rem;
  margin-top: .5rem;
`

const ActionButton = styled.button`
  padding: .5rem 1rem;
  background: #f5f5f5;
  color: ${colors.textPrimary};
  border: 1px solid ${colors.grayMedium};
  border-radius: 6px;
  cursor: pointer;
  transition: background .2s;
  &:hover { background: ${colors.grayMedium}20; }
`

const CartSection = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
`

const CartScroll = styled.div`
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Item = styled.div`
  display: grid;
  /* 60px para la imagen, 1fr para la info, auto para precio y auto para botón */
  grid-template-columns: 60px 1fr auto auto;
  align-items: center;
  gap: 1rem;
  background: ${colors.white};
  padding: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.1);
`;


const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  cursor: pointer;
`

const Img = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: .25rem;
`

const Name = styled.span`
  font-weight: 600;
  color: ${colors.textPrimary};
`

const Desc = styled.span`
  font-size: .9rem;
  color: ${colors.textSecondary};
`

const Price = styled.span`
  font-weight: 600;
  color: ${colors.purpleMedium};
`

const Del = styled.button`
  background: none;
  border: none;
  color: ${colors.red};
  cursor: pointer;
`

const OrdersSection = styled.div``

const OrdersScroll = styled.div`
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Order = styled.div`
  background: ${colors.white};
  padding: .75rem;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.1);
`

const OrdLine = styled.div`
  font-size: .9rem;
  color: ${colors.textSecondary};
`

const Empty = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: italic;
  color: ${colors.textSecondary};
`

const ImagesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`
const Thumb = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`
const NavArrow = styled.button`
  background: none;
  border: none;
  color: ${colors.purpleDark};
  cursor: pointer;
  display: flex;
  align-items: center;
  ${(p) => p.left && `transform: rotate(180deg);`}
`
