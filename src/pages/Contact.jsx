import styled from "styled-components"
import Header from "../components/Header"
import Footer from "../components/Footer"
import colors from "../theme/colors"

const Contacto = () => {
  return (
    <Container>
      <Header />
      <Main>
        <Title>Contacta conmigo</Title>
        <ContactGrid>
          <FormSection>
            <Subtitle>Envíame un mensaje</Subtitle>
            <ContactForm>
              <Label htmlFor="nombre">Nombre</Label>
              <Input type="text" id="nombre" placeholder="Tu nombre" />

              <Label htmlFor="email">Correo electrónico</Label>
              <Input type="email" id="email" placeholder="tucorreo@correo.com" />

              <Label htmlFor="mensaje">Mensaje</Label>
              <Textarea id="mensaje" placeholder="¿En qué puedo ayudarte?" />

              <SubmitButton type="submit">Enviar mensaje</SubmitButton>
            </ContactForm>
          </FormSection>

          <InfoSection>
            <Subtitle>También puedes contactarme por:</Subtitle>
            <InfoItem>📧 contacto@cuerpoymente.com</InfoItem>
            <InfoItem>📱 WhatsApp: +34 600 123 456</InfoItem>
            <InfoItem>🕒 Lunes a Viernes de 9:00 a 18:00</InfoItem>
          </InfoSection>
        </ContactGrid>
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
  margin-bottom: 3rem;
`

const ContactGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
  justify-content: center;
`

const FormSection = styled.div`
  flex: 1;
  min-width: 300px;
`

const InfoSection = styled.div`
  flex: 1;
  min-width: 250px;
`

const Subtitle = styled.h3`
  font-size: 1.2rem;
  color: ${colors.purpleMedium};
  margin-bottom: 1.5rem;
`

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Label = styled.label`
  font-size: 0.9rem;
  color: ${colors.textPrimary};
`

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid ${colors.grayMedium};
  border-radius: 8px;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: ${colors.purpleMedium};
  }
`

const Textarea = styled.textarea`
  padding: 0.8rem 1rem;
  border: 1px solid ${colors.grayMedium};
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  outline: none;

  &:focus {
    border-color: ${colors.purpleMedium};
  }
`

const SubmitButton = styled.button`
  margin-top: 1rem;
  padding: 0.8rem;
  background-color: ${colors.purpleLight};
  color: ${colors.white};
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: ${colors.purpleMedium};
  }
`

const InfoItem = styled.p`
  font-size: 1rem;
  color: ${colors.textSecondary};
  margin-bottom: 1rem;
`

export default Contacto
