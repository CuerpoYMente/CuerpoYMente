import styled from "styled-components"
import Header from "../components/Header"
import Footer from "../components/Footer"
import colors from "../theme/colors"
import { Link } from "react-router-dom"


const Planes = () => (
  <Container>
    <Header />
    <MainContent>
      <Title>Planes de Entrenamiento</Title>
      <Grid>
        <PlanCard>
          <PlanName>Plan Básico</PlanName>
          <Price>9,99 €/mes</Price>
          <FeatureList>
            <li>Rutinas generales</li>
            <li>Acceso limitado a videos</li>
            <li>Soporte por correo</li>
          </FeatureList>
          <SelectButton as={Link} to="/pago" state={{ nombre: "Plan Básico", precio: 9.99 }}>
            Elegir Este Plan
          </SelectButton>
        </PlanCard>

        <PlanCard destacado>
          <PlanName>Plan Avanzado</PlanName>
          <Price>14,99 €/mes</Price>
          <FeatureList>
            <li>Rutinas personalizadas</li>
            <li>Acceso completo a videos</li>
            <li>Asesoramiento mensual</li>
          </FeatureList>
          <SelectButton as={Link} to="/pago" state={{ nombre: "Plan Avanzado", precio: 14.99 }}>
            Elegir Este Plan
          </SelectButton>
        </PlanCard>

        <PlanCard>
          <PlanName>Plan Premium</PlanName>
          <Price>19,99 €/mes</Price>
          <FeatureList>
            <li>Entrenamiento 1:1</li>
            <li>Nutrición + seguimiento</li>
            <li>Atención directa por WhatsApp</li>
          </FeatureList>
          <SelectButton as={Link} to="/pago" state={{ nombre: "Plan Premium", precio: 19.99 }}>
            Elegir Este Plan
          </SelectButton>
        </PlanCard>
      </Grid>
      <AboutLink to="/sobremi">Infórmate más sobre mí</AboutLink>
    </MainContent>
    <Footer />
  </Container>
)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const MainContent = styled.main`
  margin-top: 70px;
  padding: 4rem 2rem;
  background-color: ${colors.purplePale};
  flex: 1;
`

const Title = styled.h2`
  text-align: center;
  color: ${colors.purpleDark};
  font-size: 2rem;
  margin-bottom: 3rem;
`

const Grid = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
`

const PlanCard = styled.div`
  background-color: ${colors.white};
  border: 2px solid
    ${({ destacado }) => (destacado ? colors.purpleMedium : colors.grayMedium)};
  border-radius: 12px;
  width: 280px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`

const PlanName = styled.h3`
  font-size: 1.5rem;
  color: ${colors.purpleDark};
  margin-bottom: 1rem;
`

const Price = styled.p`
  font-size: 1.2rem;
  color: ${colors.purpleMedium};
  font-weight: bold;
  margin-bottom: 1rem;
`

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 2rem;

  li {
    font-size: 0.95rem;
    color: ${colors.textSecondary};
    margin-bottom: 0.5rem;
  }
`

const SelectButton = styled.a`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: ${colors.purpleLight};
  color: ${colors.white};
  border-radius: 30px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.3s ease;

  &:hover {
    background-color: ${colors.purpleMedium};
  }
`
const AboutLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 2rem;
  font-size: 1rem;
  color: ${colors.purpleMedium};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
    color: ${colors.purpleDark};
  }
`
export default Planes
