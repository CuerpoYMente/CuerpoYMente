import styled from "styled-components"
import Header from "../components/Header"
import Footer from "../components/Footer"
import colors from "../theme/colors"

import img1 from "/assets/SaludoAlSol.png"
import img3 from "/assets/Baile.png"
import img2 from "/assets/Plancha.png"

const bloques = [
  {
    texto: "Soy Carolina Peñalver Mantas y vengo para ayudar a que te enamores del deporte tanto como lo estoy yo, para que empices a practicarlo frecuentemente lo antes posible.\nTengo conocimientos sobre yoga, pilates, baile y ejercicios de fuerza para que las actividades físicas no se hagan monótonas ni repetititvas.\n Además seguro que lo pasamos super bien mientras aprovechamos el tiempo al 100%.",
    imagen: img1,
    invertido: false,
  },
  {
    texto: "Siempre me llenado ayudar a las personas a cumplir sus objetivos y si estos están relacionados con el deporte, te aseguro que no va a ser un error el contar conmigo.\n",
    imagen: img2,
    invertido: true,
  },
  {
    texto: "Así que te invito a que acordemos una cita y empecemos lo antes posible, el tiempo es oro!.\nContacta conmigo a traves de mi correo o incluso por WhatsApp, lo que más cómodo te parezca.",
    imagen: img3,
    invertido: false,
  },
]

const SobreMi = () => (
  <Container>
    <Header />
    <Main>
      <Title>Sobre Mí</Title>
      {bloques.map((bloque, i) => (
        <Bloque key={i} invertido={bloque.invertido}>
          <Imagen src={bloque.imagen} alt={`Imagen ${i + 1}`} />
          <Texto>{bloque.texto}</Texto>
        </Bloque>
      ))}
    </Main>
    <Footer />
  </Container>
)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  padding: 6rem 8rem 4rem; /* antes era 2rem, ahora 4rem */
  background-color: ${colors.purplePale};

  @media (max-width: 768px) {
    padding: 6rem 1.5rem 3rem; /* padding lateral más reducido en móvil */
  }
`


const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: ${colors.purpleDark};
  margin-bottom: 3rem;
`

const Bloque = styled.div`
  display: flex;
  flex-direction: ${({ invertido }) => (invertido ? "row-reverse" : "row")};
  align-items: center;
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const Imagen = styled.img`
  width: 50%;
  border-radius: 12px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const Texto = styled.p`
  width: 50%;
  font-size: 1rem;
  color: ${colors.textPrimary};
  line-height: 1.6;

  @media (max-width: 768px) {
    width: 100%;
  }
`

export default SobreMi
