import styled from "styled-components"
import { Facebook, Instagram, Youtube } from "lucide-react"
import colors from "../theme/colors"
import logoImage from "/assets/Logo.png"
import { Link } from "react-router-dom"

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <FooterContainer>
      <FooterContent>
        <BrandSection as={Link} to="/">
          <LogoContainer>
            <LogoCircle src={logoImage} alt="Logo Cuerpo Y Mente" />
          </LogoContainer>
          <SiteName>Cuerpo Y Mente</SiteName>
        </BrandSection>

        <SocialSection>
          <SocialLink href="#" aria-label="Facebook">
            <Facebook size={20} />
          </SocialLink>
          <SocialLink href="#" aria-label="Instagram">
            <Instagram size={20} />
          </SocialLink>
          <SocialLink href="#" aria-label="YouTube">
            <Youtube size={20} />
          </SocialLink>
          <Copyright>© {currentYear} Cuerpo Y Mente</Copyright>
        </SocialSection>

        <LegalSection>
          <LegalLink href="#">Aviso de Privacidad</LegalLink>
        </LegalSection>
      </FooterContent>
    </FooterContainer>
  )
}

const FooterContainer = styled.footer`
  width: 100vw; /* Ocupa todo el ancho del viewport */
  padding: 1rem 2rem;
  background-color: ${colors.purpleDark};
  backdrop-filter: blur(5px);
`

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const LogoCircle = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
`

const SiteName = styled.h2`
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 1px;
  color: ${colors.white};
  margin: 0;
`

const SocialSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`

const SocialLink = styled.a`
  color: ${colors.white};
  transition: color 0.3s ease, transform 0.2s ease;

  &:hover {
    color: ${colors.purpleLight};
    transform: translateY(-3px);
  }
`

const Copyright = styled.span`
  color: ${colors.grayMedium};
  font-size: 0.9rem;
  margin-left: 1rem;
`

const LegalSection = styled.div`
  display: flex;
  gap: 1.5rem;
`

const LegalLink = styled.a`
  color: ${colors.white};
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: ${colors.purpleLight};
    text-decoration: underline;
  }
`

export default Footer
