import { useState, useEffect } from "react"
import styled from "styled-components"
import Header from "../components/Header"
import Footer from "../components/Footer"
import colors from "../theme/colors"
import { BACKEND } from '../constants/constantes'
import {
  API_BASE,
  VIDEOS_ENDPOINT,
  DURACIONES,
  INTENSIDAD,
  DEPORTE,
  ZONA_TRABAJADA,
  MATERIALES,
  BACKEND
} from '../constants/constantes'

const Videos = () => {
  const [videos, setVideos] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [filtroDuracion, setFiltroDuracion] = useState("cualquiera")
  const [filtroIntensidad, setFiltroIntensidad] = useState("cualquiera")
  const [filtroDeporte, setFiltroDeporte] = useState("cualquiera")
  const [filtrosMaterial, setFiltrosMaterial] = useState([])
  const [filtroZona, setFiltroZona] = useState("cualquiera")


  const handleMaterialChange = (e) => {
    const { value, checked } = e.target
    setFiltrosMaterial(prev =>
      checked
        ? [...prev, value]
        : prev.filter(m => m !== value)
    )
  }




  // Carga los vídeos desde el backend
  useEffect(() => {
    fetch(`${BACKEND}${API_BASE}${VIDEOS_ENDPOINT}`)
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((error) => console.error("Error al cargar los videos:", error))
  }, [])

  const videosFiltrados = videos
  .filter(v =>
    v.titulo.toLowerCase().includes(busqueda.toLowerCase())
  )
  .filter(v => {
    const d = parseInt(v.duracion) || 0
    switch (filtroDuracion) {
      case "0-5":   return d <= 5
      case "5-10":  return d > 5 && d <= 10
      case "10-15": return d > 10 && d <= 15
      case "15-20": return d > 15 && d <= 20
      case "20-25": return d > 20 && d <= 25
      case "30+":   return d > 30
      default:      return true
    }
  }).filter(v => {
    if (filtroIntensidad === "cualquiera") return true
    return v.intensidad.toLowerCase() === filtroIntensidad
  }).filter(v => {
    if (filtroDeporte === "cualquiera") return true
    return v.deporte.toLowerCase() === filtroDeporte
  }).filter(v => {
    // Si no hay ningún checkbox marcado => no filtrar
    if (filtrosMaterial.length === 0) return true
  
    // Para cada opción marcada, comprueba coincidencias
    return filtrosMaterial.some(mat => {
      if (mat === "nada") {
        // “nada” coincide si material === "Ninguno"
        return v.material === "" || v.material.toLowerCase() === "ninguno"
      }
      return v.material.toLowerCase() === mat
    })
    
  }).filter(v => {
    if (filtroZona === "cualquiera") return true
    return v.zona.toLowerCase() === filtroZona
  })
  


  return (
    <Container>
      <Header />
      <Main>
        <Titulo>Videos de Entrenamiento</Titulo>

        <SearchBarContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Buscar por título..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </SearchBarContainer>

        <SelectsRow>
          <Filtro>
            <label>Duración:</label>
            <Select
              value={filtroDuracion}
                onChange={e => setFiltroDuracion(e.target.value)}
              >
                {DURACIONES.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
            </Select>
          </Filtro>

          <Filtro>
            <label>Intensidad:</label>
            <Select
              value={filtroIntensidad}
                onChange={e => setFiltroIntensidad(e.target.value)}
              >
                {INTENSIDAD.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
            </Select>
          </Filtro>

          <Filtro>
            <label>Deporte:</label>
            <Select
              value={filtroDeporte}
                onChange={e => setFiltroDeporte(e.target.value)}
              >
                {DEPORTE.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
            </Select>
          </Filtro>

          <Filtro>
            <label>Zona Trabajada:</label>
            <Select
              value={filtroZona}
                onChange={e => setFiltroZona(e.target.value)}
              >
                {ZONA_TRABAJADA.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
            </Select>
          </Filtro>
        </SelectsRow>

        {/* --- checklist de materiales justo debajo --- */}
        <MaterialsRow>
          <span>Material Disponible:</span>
          <CheckboxGroup>
            {MATERIALES.map(mat => (
              <label key={mat.value}>
                <input
                  type="checkbox"
                  value={mat.value}
                  checked={filtrosMaterial.includes(mat.value)}
                  onChange={handleMaterialChange}
                />
                {mat.label}
              </label>
            ))}
          </CheckboxGroup>
        </MaterialsRow>




        <ScrollContainer>
          <VideoGrid>
            {videosFiltrados.map((video, index) => (
              <VideoCard key={index}>
                <IframeWrapper>
                  <iframe
                    src={video.url}
                    title={video.titulo}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </IframeWrapper>
                <VideoInfo>
                  <h4>{video.titulo}</h4>
                  <p><strong>Duración:</strong> {video.duracion} min</p>
                  <p><strong>Deporte:</strong> {video.deporte}</p>
                  <p><strong>Intensidad:</strong> {video.intensidad}</p>
                  <p><strong>Material:</strong> {video.material}</p>
                  <p><strong>Zona:</strong> {video.zona}</p>
                </VideoInfo>
              </VideoCard>
            ))}
          </VideoGrid>
        </ScrollContainer>
      </Main>
      <Footer />
    </Container>
)

}

export default Videos

/* ------------------ Styled Components ------------------ */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  padding: 6rem 2rem 4rem;
  background-color: ${colors.purplePale};
  max-width: 1400px;
  margin: 0 auto;
`

const Titulo = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: ${colors.purpleDark};
  margin-bottom: 2rem;
`

const SearchBarContainer = styled.div`
  position: relative;
  width: 50%;
  margin: 0 auto 2rem;
`

const SearchIcon = styled.span`
  position: absolute;
  top: 50%;
  left: 0.8rem;
  transform: translateY(-50%);
  font-size: 1.1rem;
  color: ${colors.grayMedium};
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  font-size: 1rem;
  border: 1px solid ${colors.grayMedium};
  border-radius: 8px;
`

const ScrollContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;
`

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const SelectsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  justify-content: flex-start;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const Filtro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  label {
    font-weight: 500;
    color: ${colors.textPrimary};
  }
`

const MaterialsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  span {
    font-weight: 500;
    color: ${colors.textPrimary};
  }
`


const VideoCard = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const FiltroRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  label {
    font-weight: 500;
    color: ${colors.textPrimary};
  }
`

const Select = styled.select`
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid ${colors.grayMedium};
  background-color: ${colors.white};
  font-size: 0.9rem;
`

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.9rem;
    color: ${colors.textPrimary};
  }

  input {
    transform: scale(1.1);
  }
`



const IframeWrapper = styled.div`
  aspect-ratio: 16 / 9;

  iframe {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
`

const VideoInfo = styled.div`
  font-size: 0.85rem;
  color: ${colors.textSecondary};

  h4 {
    color: ${colors.purpleDark};
    margin-bottom: 0.5rem;
  }
  p {
    margin: 0.2rem 0;
  }
`
