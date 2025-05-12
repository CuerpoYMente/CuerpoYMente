import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import styled from 'styled-components'
import Header from '../components/Header'
import Footer from '../components/Footer'
import colors from '../theme/colors'
import { API_BASE } from '../constants/constantes'

export default function PagoInmediato() {
  const location = useLocation()
  const navigate = useNavigate()
  const plan = location.state || { nombre: '', precio: 0 }

  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    try {
      const res = await fetch(`${API_BASE}/usuarios/${user.id}/saldo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: plan.precio })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.msg || 'Error al procesar el pago')

      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/carrito')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Container>
      <Header />
      <Main>
        <Title>Pago del {plan.nombre}</Title>
        <Summary>
          Estás a punto de adquirir el <strong>{plan.nombre}</strong> por <strong>{plan.precio.toFixed(2)}€</strong>
        </Summary>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMsg>{error}</ErrorMsg>}

          <Label>Titular de la tarjeta</Label>
          <Input value={cardName} onChange={e => setCardName(e.target.value)} required />

          <Label>Número de tarjeta</Label>
          <Input value={cardNumber} onChange={e => setCardNumber(e.target.value)} required />

          <SmallFields>
            <Field>
              <Label>Expiración</Label>
              <Input value={expiry} onChange={e => setExpiry(e.target.value)} required />
            </Field>
            <Field>
              <Label>CVV</Label>
              <Input value={cvv} onChange={e => setCvv(e.target.value)} required />
            </Field>
          </SmallFields>

          <SubmitButton type="submit">Pagar {plan.precio.toFixed(2)}€</SubmitButton>
        </Form>
      </Main>
      <Footer />
    </Container>
  )
}

/* ========== Styled Components ========== */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  background-color: ${colors.purplePale};
  padding: 6rem 2rem 4rem;
  max-width: 480px;
  margin: 0 auto;
`

const Title = styled.h2`
  font-size: 2rem;
  color: ${colors.purpleDark};
  text-align: center;
  margin-bottom: 2rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Label = styled.label`
  font-size: 0.9rem;
  color: ${colors.textPrimary};
`

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid ${colors.grayMedium};
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  width: 100%;

  &:focus {
    border-color: ${colors.purpleMedium};
  }
`

const SmallFields = styled.div`
  display: flex;
  gap: 1rem;
`

const Field = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const SubmitButton = styled.button`
  padding: 0.8rem;
  background-color: ${colors.purpleLight};
  color: ${colors.white};
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background-color: ${colors.purpleMedium};
  }
`

const ErrorMsg = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  text-align: center;
`

const Summary = styled.p`
  font-size: 1rem;
  color: ${colors.textPrimary};
  text-align: center;
  margin-bottom: 2rem;

  strong {
    color: ${colors.purpleDark};
  }
`