import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import styled from "styled-components"
import Header from "../components/Header"
import Footer from "../components/Footer"
import colors from "../theme/colors"
import { BACKEND } from '../constants/constantes'

const Registro = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
  e.preventDefault()
  setError(null)

  if (email !== confirmEmail) {
    return setError("Los correos no coinciden")
  }
  if (password !== confirmPassword) {
    return setError("Las contraseñas no coinciden")
  }

  try {
    const res = await fetch(`${BACKEND}/api/usuarios/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.msg || "Error al registrar usuario.")

    // === AUTO-LOGIN ===
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    setSuccess(true)
    // redirige a home (o donde prefieras) tras el mensaje
    setTimeout(() => navigate("/"), 1500)
  } catch (err) {
    setError(err.message)
  }
}


  return (
    <Container>
      <Header />
      <Main>
        <FormContainer onSubmit={handleSubmit}>
          <Title>Crear una cuenta</Title>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          {success && <SuccessMsg>¡Usuario creado! Redirigiendo…</SuccessMsg>}

          <Label>Nombre</Label>
          <Input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <Label>Correo electrónico</Label>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <Label>Repite tu correo electrónico</Label>
          <Input
            type="email"
            value={confirmEmail}
            onChange={e => setConfirmEmail(e.target.value)}
            required
          />

          <Label>Contraseña</Label>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <Label>Confirmar contraseña</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />

          <RegisterButton type="submit">
            Registrarse
          </RegisterButton>

          <LoginLink to="/login">
            ¿Ya tienes cuenta? Inicia sesión aquí
          </LoginLink>
        </FormContainer>
      </Main>
      <Footer />
    </Container>
  )
}

export default Registro

/* ------------------ Styled Components ------------------ */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.purplePale};
  padding: 4rem 2rem;
`

const FormContainer = styled.form`
  background-color: ${colors.white};
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Title = styled.h2`
  font-size: 1.8rem;
  color: ${colors.purpleDark};
  margin-bottom: 1rem;
`

const ErrorMsg = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
`

const SuccessMsg = styled.div`
  color: #27ae60;
  font-size: 0.9rem;
`

const Label = styled.label`
  text-align: left;
  font-size: 0.9rem;
  color: ${colors.textPrimary};
  width: 100%;
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

const RegisterButton = styled.button`
  padding: 0.8rem;
  background-color: ${colors.purpleLight};
  color: ${colors.white};
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 100%;

  &:hover {
    background-color: ${colors.purpleMedium};
  }
`

const LoginLink = styled(Link)`
  font-size: 0.9rem;
  color: ${colors.textSecondary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    color: ${colors.purpleMedium};
  }
`
