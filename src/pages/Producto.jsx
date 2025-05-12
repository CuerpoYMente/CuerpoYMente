// src/pages/Producto.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/Header'
import Footer from '../components/Footer'
import colors from '../theme/colors'
import { API_BASE, BACKEND } from '../constants/constantes'

const Producto = () => {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [comentarios, setComentarios] = useState([])
  const [nuevoComentario, setNuevoComentario] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${BACKEND}${API_BASE}/productos/${id}`)
      .then(res => res.json())
      .then(data => setProducto(data))
      .catch(err => console.error('Error cargando producto:', err))

    fetch(`${BACKEND}${API_BASE}/productos/${id}/comentarios`)
      .then(res => res.json())
      .then(setComentarios)
      .catch(err => console.error('Error cargando comentarios:', err))
  }, [id])

  const handleAddToCart = () => {
    const token = localStorage.getItem('token')
    if (!token) return navigate('/login')
    // lógica de añadir al carrito
  }

  const handleSendComment = () => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (!token || !userStr) return navigate('/login')
    const user = JSON.parse(userStr)
    const usuario = user.name

    fetch(`${BACKEND}${API_BASE}/productos/${id}/comentarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ usuario, mensaje: nuevoComentario })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al enviar comentario')
        return res.json()
      })
      .then(c => {
        setComentarios(prev => [...prev, c])
        setNuevoComentario('')
      })
      .catch(err => {
        console.error(err)
        alert('No se pudo enviar el comentario.')
      })
  }

  if (!producto) return <p>Cargando...</p>

  return (
    <Container>
      <Header />
      <Main>
        <Title>{producto.name}</Title>
        {producto.imagenes && producto.imagenes.length > 0 && (
          <ImageCarousel>
            {producto.imagenes.map((img, i) => (
              <CarouselImage key={i} src={img} alt={`${producto.name} ${i+1}`} />
            ))}
          </ImageCarousel>
        )}
        <Info>
          <ShortDesc>{producto['descripción_corta']}</ShortDesc>
          <LongDesc>{producto['descripción_larga']}</LongDesc>
          <Price>${producto.precio.toFixed(2)}</Price>
          <AddButton onClick={handleAddToCart}>Añadir al carrito</AddButton>
        </Info>
        <CommentsSection>
          <h3>Comentarios</h3>
          {comentarios.length === 0 ? (
            <p>No hay comentarios aún.</p>
          ) : (
            comentarios.map((c, i) => (
              <Comment key={i}>
                <strong>{c.usuario}</strong> <em>({new Date(c.fecha).toLocaleDateString()})</em>
                <p>{c.mensaje}</p>
              </Comment>
            ))
          )}
          <NewCommentContainer>
            <Textarea
              placeholder="Escribe tu comentario..."
              value={nuevoComentario}
              onChange={e => setNuevoComentario(e.target.value)}
            />
            <SendButton onClick={handleSendComment}>Enviar comentario</SendButton>
          </NewCommentContainer>
        </CommentsSection>
      </Main>
      <Footer />
    </Container>
  )
}

export default Producto

/* Styled Components */
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
const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: ${colors.purpleDark};
  margin-bottom: 1.5rem;
`
const ImageCarousel = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  margin-bottom: 2rem;
`
const CarouselImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`
const Info = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
const ShortDesc = styled.p`
  font-weight: 500;
`
const LongDesc = styled.p`
  color: ${colors.textSecondary};
`
const Price = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${colors.purpleMedium};
`
const AddButton = styled.button`
  padding: 0.8rem;
  background-color: ${colors.purpleLight};
  color: ${colors.white};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  align-self: start;

  &:hover {
    background-color: ${colors.purpleMedium};
  }
`
const CommentsSection = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
const Comment = styled.div`
  font-size: 0.9rem;
  color: ${colors.textPrimary};
`
const NewCommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
const Textarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.8rem;
  border: 1px solid ${colors.grayMedium};
  border-radius: 8px;
  resize: vertical;
  font-size: 0.9rem;
`
const SendButton = styled.button`
  padding: 0.6rem 1rem;
  align-self: flex-end;
  background-color: ${colors.purpleLight};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover { background-color: ${colors.purpleMedium}; }
`