import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import styled from "styled-components"
import Header from "../components/Header"
import Footer from "../components/Footer"
import colors from "../theme/colors"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch("http://localhost:5000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.msg || "Error de autenticación")

      localStorage.setItem("token", data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate("/")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Container>
      <Header />
      <Main>
        <FormContainer onSubmit={handleSubmit}>
          <Title>Iniciar Sesión</Title>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tucorreo@correo.com"
            required
          />

          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            required
          />

          <LoginButton type="submit">Entrar</LoginButton>

          <RegisterLink to="/signup">
            ¿No tienes cuenta? Regístrate aquí
          </RegisterLink>
        </FormContainer>
      </Main>
      <Footer />
    </Container>
  )
}

export default Login

/* ------------------ Styled ------------------ */

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
  max-width: 400px;
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
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
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

const LoginButton = styled.button`
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

const RegisterLink = styled(Link)`
  font-size: 0.9rem;
  color: ${colors.textSecondary};
  text-decoration: none;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
    color: ${colors.purpleMedium};
  }
`
