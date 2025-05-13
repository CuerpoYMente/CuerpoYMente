import styled from "styled-components"
import heroImage from "/assets/MujerComba.png" // Asumiendo que tienes esta imagen en assets
import colors from "../theme/colors"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

function HeroSection() {
  return (
    <HeroContainer>
      <HeroImg src={heroImage} alt="Imagen de entrenamiento deportivo" />

      <HeroContent>
        <PresentationCard>
          <h3>Bienvenido a Cuerpo y Mente</h3>
          <h2>No va de Cuerpo sino de Actitud</h2>
          <p>Descubre planes de entrenamiento, productos y consejos para llevar una vida más saludable. Todo en un solo lugar.</p>
        </PresentationCard>

        <HeroMessage>
          <HeroTitle>¡Empieza a disfrutar del deporte ahora mismo!</HeroTitle>
          <HeroLink as={Link} to="/planes">
            <span>Ver Planes</span>
            <ArrowRight size={20} />
          </HeroLink>
        </HeroMessage>
      </HeroContent>
    </HeroContainer>

  )
}

const HeroContainer = styled.section`
  position: relative;
  width: 100%;
  height: calc(100vh - 70px); /* Ajustado para el header fijo */
  overflow: hidden;
  background-color: ${colors.purpleDark};
`

const HeroImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7) grayscale(30%);
`

const HeroContent = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  flex-wrap: wrap; /* Para que sea responsive */
  gap: 2rem;
`


const HeroMessage = styled.div`
  max-width: 500px;
  background-color: rgba(42, 26, 58, 0.7);
  backdrop-filter: blur(5px);
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: fadeIn 1s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const HeroTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  color: ${colors.white};
  margin-bottom: 2rem;
  line-height: 1.2;
`

const HeroLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${colors.purpleLight};
  color: ${colors.white};
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${colors.purpleMedium};
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`

const PresentationCard = styled.div`
  flex: 1;
  max-width: 400px;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  padding: 2rem;
  border-radius: 8px;
  margin-right: 2rem;
  color: ${colors.white};

  h3 {
    font-size: 1.6rem;
    margin-bottom: 1rem;
    color: ${colors.white};
  }

  h2 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: ${colors.white};
  }

  p {
    font-size: 1rem;
    line-height: 1.5;
    color: ${colors.white};
  }
`


export default HeroSection
