// src/pages/RealizaPedido.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/Header'
import Footer from '../components/Footer'
import colors from '../theme/colors'
import { API_BASE } from '../constants/constantes'

export default function RealizaPedido() {
  const navigate = useNavigate()

  // --- Estados ---
  const [items, setItems]       = useState([])
  const [shipping, setShipping] = useState({
    nombre: '', direccion: '', ciudad: '', postal: '', pais: ''
  })
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(true)

  // --- Usuario y carrito ---
  const user       = JSON.parse(localStorage.getItem('user') || '{}')
  const saldo      = (user.saldo || 0).toFixed(2)
  const carritoIds = Array.isArray(user.carrito) ? user.carrito : []

  // --- Cargar productos del carrito ---
  useEffect(() => {
    if (!user.id) return navigate('/login')
    if (carritoIds.length === 0) {
      setItems([])
      setLoading(false)
      return
    }
    Promise.all(
      carritoIds.map(id =>
        fetch(`${API_BASE}/productos/${id}`).then(r => r.json())
      )
    )
      .then(prods => {
        setItems(prods)
        setLoading(false)
      })
      .catch(() => {
        setError('No se pudieron cargar los productos.')
        setLoading(false)
      })
  }, [navigate, carritoIds, user.id])

  // --- Cálculo del total ---
  const totalNumber  = items.reduce((sum, i) => sum + (i.precio || 0), 0)
  const totalDisplay = totalNumber.toFixed(2)

  // --- Handlers del formulario ---
  const handleChange = e => {
    const { name, value } = e.target
    setShipping(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)

    // Validaciones
    for (let key of ['nombre','direccion','ciudad','postal','pais']) {
      if (!shipping[key].trim()) {
        setError('Completa todos los campos de envío.')
        return
      }
    }
    if (carritoIds.length === 0) {
      setError('Tu carrito está vacío.')
      return
    }
    if (totalNumber > user.saldo) {
      setError('No tienes suficiente saldo.')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const res   = await fetch(`${API_BASE}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          items: carritoIds,
          total: totalNumber,   // número
          envio: shipping       // propiedad "envio", no "direccion"
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.msg || 'Error al realizar pedido')

      // Actualizar localStorage con user devuelto (saldo restado, carrito vacío)
      localStorage.setItem('user', JSON.stringify({
        ...data.user,
        carrito: []
      }))

      navigate('/carrito')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Container>
      <Header />

      <Main>
        {/* Resumen del pedido */}
        <Section>
          <SectionTitle>Resumen del Pedido</SectionTitle>
          {loading
            ? <p>Cargando...</p>
            : items.length === 0
              ? <Empty>Cesta vacía.</Empty>
              : (
                <>
                  <ItemsList>
                    {items.map(i => (
                      <Item key={i.id}>
                        <span>{i.name}</span>
                        <span>{i.precio.toFixed(2)}€</span>
                      </Item>
                    ))}
                  </ItemsList>
                  <TotalLine>
                    <span>Total:</span>
                    <strong>{totalDisplay}€</strong>
                  </TotalLine>
                </>
              )
          }
        </Section>

        {/* Saldo disponible */}
        <Section>
          <SectionTitle>Saldo Disponible</SectionTitle>
          <Balance>{saldo}€</Balance>
          <AddSaldoButton onClick={() => navigate('/ingresardinero')}>
            Añadir Saldo
          </AddSaldoButton>
        </Section>

        {/* Formulario de envío */}
        <FormSection onSubmit={handleSubmit}>
          <FormTitle>Datos de Envío</FormTitle>
          {error && <ErrorMsg>{error}</ErrorMsg>}

          <Label>Nombre completo</Label>
          <Input name="nombre"   value={shipping.nombre}   onChange={handleChange} />
          <Label>Dirección</Label>
          <Input name="direccion" value={shipping.direccion} onChange={handleChange} />
          <Label>Ciudad</Label>
          <Input name="ciudad"   value={shipping.ciudad}   onChange={handleChange} />

          <Row>
            <Field>
              <Label>Código postal</Label>
              <Input name="postal"  value={shipping.postal}   onChange={handleChange} />
            </Field>
            <Field>
              <Label>País</Label>
              <Input name="pais"    value={shipping.pais}     onChange={handleChange} />
            </Field>
          </Row>

          <SubmitButton type="submit">Confirmar y Pagar</SubmitButton>
        </FormSection>
      </Main>

      <Footer />
    </Container>
  )
}

/* ===== Styled Components ===== */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  max-width: 800px;
  margin: 6rem auto 2rem;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 2rem;
`

const Section = styled.div`
  background: ${colors.white};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`

const SectionTitle = styled.h3`
  margin: 0 0 1rem;
  color: ${colors.purpleDark};
  font-size: 1.2rem;
`

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const Item = styled.div`
  display: flex;
  justify-content: space-between;
`

const TotalLine = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
`

const Balance = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.purpleMedium};
  text-align: center;
`

const AddSaldoButton = styled.button`
  display: block;
  margin: 1rem auto 0;
  padding: 0.5rem 1rem;
  background: ${colors.purpleLight};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: ${colors.purpleMedium}; }
`

const FormSection = styled.form`
  background: ${colors.white};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  grid-column: 2;
  grid-row: 1 / span 2;
`

const FormTitle = styled.h3`
  margin: 0 0 .5rem;
  color: ${colors.purpleDark};
`

const Label = styled.label`
  font-size: .9rem;
  color: ${colors.textPrimary};
`

const Input = styled.input`
  padding: .6rem 1rem;
  border: 1px solid ${colors.grayMedium};
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  width: 100%;
  &:focus { border-color: ${colors.purpleMedium}; }
`

const Row = styled.div`
  display: flex;
  gap: 1rem;
`

const Field = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const SubmitButton = styled.button`
  padding: .8rem;
  background-color: ${colors.purpleLight};
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background .3s;
  &:hover { background-color: ${colors.purpleMedium}; }
`

const ErrorMsg = styled.div`
  color: #e74c3c;
  font-size: .9rem;
  text-align: center;
`

const Empty = styled.div`
  font-style: italic;
  color: ${colors.textSecondary};
`
