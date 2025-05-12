// src/pages/IngresarDinero.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/Header'
import Footer from '../components/Footer'
import colors from '../theme/colors'
import { API_BASE } from '../constants/constantes'

export default function IngresarDinero() {
  const [amount, setAmount] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Introduce una cantidad válida.');
      return;
    }

    const token = localStorage.getItem('token');
    const user  = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      const res = await fetch(
        `${API_BASE}/usuarios/${user.id}/saldo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ amount: val })
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Error al ingresar saldo');

      // Actualiza localStorage con el usuario devuelto
      localStorage.setItem('user', JSON.stringify(data.user));
      // Redirige de vuelta al carrito (o donde quieras)
      navigate('/carrito');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <Header />
      <Main>
        <Title>Ingresar Dinero</Title>
        <Form onSubmit={handleSubmit}>
          {error && <ErrorMsg>{error}</ErrorMsg>}

          <Label htmlFor="amount">Cantidad (€)</Label>
          <Input
            id="amount"
            type="number"
            min="1"
            step="0.01"
            placeholder="Ej. 50.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <Label htmlFor="cardName">Titular de la tarjeta</Label>
          <Input
            id="cardName"
            type="text"
            placeholder="Nombre como aparece en la tarjeta"
            value={cardName}
            onChange={e => setCardName(e.target.value)}
          />

          <Label htmlFor="cardNumber">Número de tarjeta</Label>
          <Input
            id="cardNumber"
            type="text"
            maxLength="19"
            placeholder="#### #### #### ####"
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
          />

          <SmallFields>
            <Field>
              <Label htmlFor="expiry">Fecha expiración</Label>
              <Input
                id="expiry"
                type="text"
                placeholder="MM/AA"
                maxLength="5"
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                placeholder="123"
                maxLength="3"
                value={cvv}
                onChange={e => setCvv(e.target.value)}
              />
            </Field>
          </SmallFields>

          <SubmitButton type="submit">Añadir Saldo</SubmitButton>
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
