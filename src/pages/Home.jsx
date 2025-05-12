import Header from "../components/Header"
import HeroSection from "../components/HeroSection"
import FeaturedVideos from "../components/FeaturedVideos"
import Footer from "../components/Footer"
import styled from "styled-components"
import colors from "../theme/colors"

const Home = () => (
  <Container>
    <Header />
    <MainContent>
      <HeroSection />
      <FeaturedVideos />
    </MainContent>
    <Footer />
  </Container>
)

const Container = styled.div`
  width: 100vw; /* Fuerza el ancho al total del viewport */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${colors.white};
  color: ${colors.textPrimary};
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  position: relative;
`

const MainContent = styled.main`
  margin-top: 70px; /* Para compensar el header fijo */
  flex: 1; /* Ocupa el espacio vertical restante */
  width: 100%;
  display: flex;
  flex-direction: column;
`

export default Home
