import styled from "styled-components"
import Header from "../components/Header"
import Footer from "../components/Footer"
import colors from "../theme/colors"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

const BlogSemanal = () => {
  const [retos, setRetos] = useState([])
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    fetch("http://localhost:5000/api/retos")
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar los retos")
        return res.json()
      })
      .then(data => setRetos(data))
      .catch(err => console.error(err))
  }, [])

  const retosFiltrados = retos.filter((r) =>
    r.titulo.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <Container>
      <Header />
      <Main>
        <Title>Retos Semanales</Title>

        <SearchInput
          type="text"
          placeholder="Buscar retos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <RetoList>
          {retosFiltrados.map((reto) => (
            <RetoItem key={reto.id}>
              <RetoImage src={reto.imagen} alt={reto.titulo} />
              <RetoContent>
                <RetoTitulo>{reto.titulo}</RetoTitulo>
                <RetoDescripcion>{reto.descripcion}</RetoDescripcion>
                <RetoExtra>
                  <p><strong>Intensidad:</strong> {reto.intensidad}</p>
                  <p><strong>Material:</strong> {reto.material}</p>
                </RetoExtra>
                <VerMas to={`/reto/${reto.id}`}>Ver más</VerMas>
              </RetoContent>
            </RetoItem>
          ))}
        </RetoList>
      </Main>
      <Footer />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  padding: 6rem 2rem 4rem;
  background-color: ${colors.purplePale};
`

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: ${colors.purpleDark};
  margin-bottom: 2rem;
`

const SearchInput = styled.input`
  padding: 0.8rem 1.2rem;
  border: 1px solid ${colors.grayMedium};
  border-radius: 30px;
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
  margin: 0 auto 2rem;
  display: block;

  &:focus {
    outline: none;
    border-color: ${colors.purpleMedium};
  }
`

const RetoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 900px;
  max-height: 500px;
  overflow-y: auto;
  margin: 0 auto;
  padding-right: 0.5rem;
`

const RetoItem = styled.div`
  display: flex;
  gap: 1.5rem;
  background: ${colors.white};
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const RetoImage = styled.img`
  width: 180px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
`

const RetoContent = styled.div`
  flex: 1;
`

const RetoTitulo = styled.h3`
  font-size: 1.3rem;
  color: ${colors.purpleDark};
  margin-bottom: 0.5rem;
`

const RetoDescripcion = styled.p`
  font-size: 1rem;
  color: ${colors.textSecondary};
`

const RetoExtra = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: ${colors.textSecondary};
`

const VerMas = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  font-weight: 500;
  color: ${colors.purpleMedium};
  text-decoration: none;

  &:hover {
    color: ${colors.purpleDark};
    text-decoration: underline;
  }
`

export default BlogSemanal
