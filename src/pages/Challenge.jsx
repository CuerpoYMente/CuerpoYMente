// src/pages/Reto.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/Header'
import Footer from '../components/Footer'
import colors from '../theme/colors'
import { API_BASE , BACKEND } from '../constants/constantes'

const Reto = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [reto, setReto] = useState(null)
  const [aportes, setAportes] = useState([])
  const [nuevoAporte, setNuevoAporte] = useState('')
  const [error, setError] = useState(null)

  // Cargar reto y aportes desde backend
  useEffect(() => {
    // Detalle del reto
    fetch(`${BACKEND}${API_BASE}/retos/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Reto no encontrado')
        return res.json()
      })
      .then(setReto)
      .catch(err => setError(err.message))

    // Comentarios/aportes
    fetch(`${BACKEND}${API_BASE}/retos/${id}/aportes`)
      .then(res => res.json())
      .then(setAportes)
      .catch(err => console.error('Error cargando aportes:', err))
  }, [id])

  // Enviar un nuevo aporte
  const handleSubmit = e => {
    e.preventDefault()
    if (!nuevoAporte.trim()) return

    // Verificar sesión
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (!token || !userStr) {
      navigate('/login')
      return
    }
    const user = JSON.parse(userStr)
    const usuario = user.name || 'Usuario'

    fetch(`${BACKEND}${API_BASE}/retos/${id}/aportes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ usuario, mensaje: nuevoAporte.trim() })
    })
      .then(res => {
        if (!res.ok) return res.json().then(err => { throw new Error(err.msg || 'Error al enviar aporte') })
        return res.json()
      })
      .then(aporte => {
        setAportes(prev => [...prev, aporte])
        setNuevoAporte('')
      })
      .catch(err => alert(err.message))
  }

  if (error) return <p>{error}</p>
  if (reto === null) return <p>Cargando...</p>
  if (!reto) return <p>Reto no encontrado</p>

  return (
    <Container>
      <Header />
      <Main>
        <Titulo>{reto.titulo}</Titulo>
        <Descripcion>{reto.detalles}</Descripcion>
        <InfoExtra>
          <p><strong>Intensidad:</strong> {reto.intensidad}</p>
          <p><strong>Material:</strong> {reto.material}</p>
        </InfoExtra>

        <ContentWrapper>
          <VideoWrapper>
            <iframe
              src={reto.video}
              title={reto.titulo}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </VideoWrapper>

          <AportesColumn>
            <Subtitulo>Comentarios del reto</Subtitulo>
            <AportesList>
              {aportes.length === 0 ? (
              <EmptyMessage>
                Parece que nadie se anima a comentar. ¡Sé tú el primer comentario!
              </EmptyMessage>
            ) : (
              aportes.map((a, i) => (
                <Aporte key={i}>
                  <strong>{a.usuario}</strong>: {a.mensaje}
                  {a.fecha && <Fecha>{new Date(a.fecha).toLocaleString()}</Fecha>}
                </Aporte>
              ))
            )}
            </AportesList>

            <Form onSubmit={handleSubmit}>
              <Label htmlFor="aporte">Comparte tu experiencia:</Label>
              <TextArea
                id="aporte"
                value={nuevoAporte}
                onChange={e => setNuevoAporte(e.target.value)}
                placeholder="Escribe tu comentario..."
              />
              <Button type="submit">Enviar</Button>
            </Form>
          </AportesColumn>
        </ContentWrapper>
      </Main>
      <Footer />
    </Container>
  )
}

export default Reto

/* ========== Styled Components ========== */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  padding: 6rem 2rem 4rem;
  background-color: ${colors.purplePale};
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
`

const Titulo = styled.h2`
  font-size: 2rem;
  color: ${colors.purpleDark};
  margin-bottom: 1rem;
`

const Descripcion = styled.p`
  font-size: 1.1rem;
  color: ${colors.textSecondary};
  margin-bottom: 1rem;
`

const InfoExtra = styled.div`
  font-size: 0.95rem;
  color: ${colors.textSecondary};
  margin-bottom: 2rem;
  p { margin: 0.3rem 0; }
`

const ContentWrapper = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`

const VideoWrapper = styled.div`
  flex: 2;
  aspect-ratio: 16 / 9;
  min-width: 300px;
  iframe {
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }
`

const AportesColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${colors.white};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  max-height: 500px;
`

const Subtitulo = styled.h3`
  font-size: 1.2rem;
  color: ${colors.purpleMedium};
  margin-bottom: 1rem;
`

const AportesList = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 220px;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const Aporte = styled.div`
  background: ${colors.white};
  padding: 0.8rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.95rem;
  color: ${colors.textPrimary};
`

const TextArea = styled.textarea`
  padding: 0.6rem 1rem;
  border: 1px solid ${colors.grayMedium};
  border-radius: 8px;
  resize: vertical;
  min-height: 60px;
  font-size: 1rem;
  outline: none;
  &:focus { border-color: ${colors.purpleMedium}; }
`

const Button = styled.button`
  align-self: flex-start;
  background-color: ${colors.purpleLight};
  color: ${colors.white};
  border: none;
  border-radius: 30px;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover { background-color: ${colors.purpleMedium}; }
`

const EmptyMessage = styled.div`
  font-style: italic;
  color: ${colors.textSecondary};
  text-align: center;
  padding: 1rem;
`