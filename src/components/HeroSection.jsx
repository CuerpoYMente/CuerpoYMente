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
  position: absolute;
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
  justify-content: flex-end;
  align-items: center;
  padding: 0 5%;
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

export default HeroSection
