import styled from "styled-components"
import Header from "../components/Header"
import Footer from "../components/Footer"
import colors from "../theme/colors"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    pregunta: "¿Qué incluye el Plan Básico?",
    respuesta:
      "Incluye rutinas generales, acceso limitado a videos y soporte por correo.",
  },
  {
    pregunta: "¿Puedo cambiar de plan en cualquier momento?",
    respuesta:
      "Sí, puedes cambiar de plan desde tu perfil cuando lo necesites.",
  },
  {
    pregunta: "¿Los entrenamientos requieren material?",
    respuesta:
      "Algunos ejercicios sí, pero ofrecemos alternativas sin equipamiento.",
  },
  {
    pregunta: "¿Puedo entrenar desde casa?",
    respuesta:
      "Sí, todos nuestros planes están diseñados para casa o gimnasio.",
  },
  {
    pregunta: "¿Hay algún tipo de seguimiento nutricional?",
    respuesta:
      "En los planes Avanzado y Premium ofrecemos asesoramiento nutricional personalizado.",
  },
  {
    pregunta: "¿Qué incluye el Plan Básico?",
    respuesta:
      "Incluye rutinas generales, acceso limitado a videos y soporte por correo.",
  },
  {
    pregunta: "¿Puedo cambiar de plan en cualquier momento?",
    respuesta:
      "Sí, puedes cambiar de plan desde tu perfil cuando lo necesites.",
  },
  {
    pregunta: "¿Los entrenamientos requieren material?",
    respuesta:
      "Algunos ejercicios sí, pero ofrecemos alternativas sin equipamiento.",
  },
  {
    pregunta: "¿Puedo entrenar desde casa?",
    respuesta:
      "Sí, todos nuestros planes están diseñados para casa o gimnasio.",
  },
  {
    pregunta: "¿Hay algún tipo de seguimiento nutricional?",
    respuesta:
      "En los planes Avanzado y Premium ofrecemos asesoramiento nutricional personalizado.",
  },
]

const PreguntasFrecuentes = () => {
  const [activa, setActiva] = useState(null)

  const togglePregunta = (index) => {
    setActiva(activa === index ? null : index)
  }

  return (
    <Container>
      <Header />
      <Main>
        <Content>
          <Title>Preguntas Frecuentes</Title>
          <FAQList>
            {faqs.map((item, index) => (
              <FAQItem key={index}>
                <Pregunta onClick={() => togglePregunta(index)}>
                  {item.pregunta}
                  <Flecha activa={activa === index}>
                    <ChevronDown size={20} />
                  </Flecha>
                </Pregunta>
                <Respuesta activa={activa === index}>{item.respuesta}</Respuesta>
              </FAQItem>
            ))}
          </FAQList>
        </Content>
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
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

const Content = styled.div`
  background-color: ${colors.white};         // fondo claro para contraste
  padding: 3rem 2rem;
  border-radius: 16px;
  max-width: 1000px;
  width: 100%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
`

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: ${colors.purpleDark};
  margin-bottom: 3rem;
`

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FAQItem = styled.div`
  background-color: ${colors.white};
  border: 1px solid ${colors.grayMedium};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`

const Pregunta = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  color: ${colors.purpleDark};
  cursor: pointer;

  &:hover {
    background-color: ${colors.grayLight};
  }
`

const Flecha = styled.span`
  margin-left: 1rem;
  display: flex;
  transition: transform 0.3s ease;

  svg {
    transform: ${({ activa }) => (activa ? "rotate(180deg)" : "rotate(0deg)")};
    transition: transform 0.3s ease;
  }
`

const Respuesta = styled.div`
  max-height: ${({ activa }) => (activa ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.4s ease;
  padding: ${({ activa }) => (activa ? "1rem" : "0 1rem")};
  color: ${colors.textSecondary};
  font-size: 0.95rem;
`

export default PreguntasFrecuentes
