import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import colors from "../theme/colors"
import logoImage from "/assets/Logo.png"
import { ADMIN_EMAILS } from "../constants/roles"

export default function Header() {
  const [openMenu, setOpenMenu] = useState(null)
  const [isLogged, setIsLogged] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isAdmin, setIsAdmin]   = useState(false)
  const navigate = useNavigate()
  const navRef = useRef(null)

  useEffect(() => {
    setIsLogged(!!localStorage.getItem('token'))
  }, [])

  useEffect(() => {
    function onClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [])


   useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) return
    try {
      const user = JSON.parse(userStr)
      setCartCount(Array.isArray(user.carrito) ? user.carrito.length : 0)
      setIsAdmin(ADMIN_EMAILS.includes(user.email))
    } catch (e) {
      console.error('Error parsing user from localStorage', e)
    }
  }, [])

  const handleCartClick = () => {
    const token = localStorage.getItem('token')
    if (!token) return navigate('/login')
    navigate('/carrito')
  }


  const toggleMenu = (menu) => setOpenMenu(openMenu === menu ? null : menu)
  const handleAccount = () => isLogged ? navigate('/carrito') : navigate('/login')

  return (
    <HeaderContainer>
      <Logo as={Link} to="/">
        <LogoImg src={logoImage} alt="Logo Cuerpo Y Mente" />
        <SiteName>Cuerpo Y Mente</SiteName>
      </Logo>

      <Nav ref={navRef}>
        <NavItem as={Link} to="/">Inicio</NavItem>

        <DropdownWrapper>
          <NavItem onClick={() => toggleMenu('entrena')}>Entrena</NavItem>
          {openMenu === 'entrena' && (
            <Dropdown>
              <Item as={Link} to="/planes">Planes</Item>
              <Item as={Link} to="/videos">Videos</Item>
            </Dropdown>
          )}
        </DropdownWrapper>

        <NavItem as={Link} to="/blog">Blog</NavItem>
        <NavItem as={Link} to="/tienda">Tienda</NavItem>

        <DropdownWrapper>
          <NavItem onClick={() => toggleMenu('ayuda')}>Ayuda</NavItem>
          {openMenu === 'ayuda' && (
            <Dropdown>
              <Item as={Link} to="/sobremi">Conóceme</Item>
              <Item as={Link} to="/contacto">Contacto</Item>
              <Item as={Link} to="/faqs">Preguntas Frecuentes</Item>
            </Dropdown>
          )}
        </DropdownWrapper>

        
        <VerticalDivider />
        <AccountBtn onClick={handleAccount}>Mi Cuenta</AccountBtn>

        {/* → Aparece solo si isAdmin es true ← */}
        {isAdmin && (
          <NavItemAdmin as={Link} to="/admin">
            Administrar
          </NavItemAdmin>
        )}


      </Nav>
    </HeaderContainer>
  )
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: ${colors.purpleDark}80;
  backdrop-filter: blur(5px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
`

const LogoImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
`

const SiteName = styled.h1`
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 1px;
  color: ${colors.white};
  margin: 0;
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 3rem;
  position: relative;
`

const NavItem = styled.div`
  position: relative;
  font-size: 0.9rem;
  color: ${colors.white};
  cursor: pointer;
  user-select: none;
  &:hover { color: ${colors.grayLight}; }
`

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: ${colors.white};
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  overflow: hidden;
  z-index: 10;
  min-width: 140px;
`

const DropdownWrapper = styled.div`
  position: relative;
`


const Item = styled(Link)`
  display: block;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: ${colors.purpleDark};
  text-decoration: none;
  &:hover { background: ${colors.purpleLight}; color: ${colors.white}; }
`

const Spacer = styled.div`
  width: 10px;
`

const VerticalDivider = styled.div`
  width: 1px;
  height: 24px;
  background: ${colors.white}60;
`

const AccountBtn = styled.button`
  background: none;
  border: none;
  color: ${colors.white};
  font-size: 0.9rem;
  cursor: pointer;
  &:hover { color: ${colors.grayLight}; }
`

// Un estilo separado para que haya algo de margin a la izquierda
const NavItemAdmin = styled(Link)`
  font-size: 0.9rem;
  color: ${colors.white};
  text-decoration: none;
  margin-right: 1.5rem;
  &:hover { color: ${colors.grayLight}; }
`










/*import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import colors from "../theme/colors"
import logoImage from "/assets/Logo.png"

export default function Header() {
  const [openMenu, setOpenMenu] = useState(null)
  const [isLogged, setIsLogged] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    setIsLogged(!!localStorage.getItem('token'))
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleMenuToggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu)
  }

  const handleAccountClick = () => {
    if (!isLogged) return navigate('/login')
    navigate('/carrito')
  }

  return (
    <HeaderContainer>
      <LogoContainer to="/">
        <LogoImg src={logoImage} alt="Logo Cuerpo Y Mente" />
        <SiteName>Cuerpo Y Mente</SiteName>
      </LogoContainer>

      <Nav ref={dropdownRef}>
        <NavItem as={Link} to="/">Inicio</NavItem>

        <NavItem onClick={() => handleMenuToggle('entrena')}>
          Entrena ▾
        </NavItem>
        {openMenu === 'entrena' && (
          <Dropdown>
            <DropdownItem as={Link} to="/planes">Planes</DropdownItem>
            <DropdownItem as={Link} to="/videos">Videos</DropdownItem>
          </Dropdown>
        )}

        <NavItem as={Link} to="/blog">Blog</NavItem>
        <NavItem as={Link} to="/tienda">Tienda</NavItem>

        <NavItem onClick={() => handleMenuToggle('ayuda')}>
          Ayuda ▾
        </NavItem>
        {openMenu === 'ayuda' && (
          <Dropdown>
            <DropdownItem as={Link} to="/sobremi">Conóceme</DropdownItem>
            <DropdownItem as={Link} to="/contacto">Contacto</DropdownItem>
            <DropdownItem as={Link} to="/faqs">Preguntas Frecuentes</DropdownItem>
          </Dropdown>
        )}

        <Spacer />

        <AccountButton onClick={handleAccountClick}>
          Mi Cuenta
        </AccountButton>
      </Nav>
    </HeaderContainer>
  )
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: ${colors.purpleDark}80;
  backdrop-filter: blur(5px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
`

const LogoImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
`

const SiteName = styled.h1`
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 1px;
  color: ${colors.white};
  margin: 0;
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  position: relative;
`

const NavItem = styled.div`
  margin: 0 1rem;
  font-size: 0.9rem;
  color: ${colors.white};
  cursor: pointer;
  user-select: none;
  &:hover { color: ${colors.grayLight}; }
`

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: ${colors.white};
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  overflow: hidden;
  z-index: 10;
  min-width: 120px;
`

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: ${colors.purpleDark};
  text-decoration: none;
  &:hover { background: ${colors.purpleLight}; color: ${colors.white}; }
`

const Spacer = styled.div`
  flex: 1;
`

const AccountButton = styled.button`
  background: none;
  border: none;
  color: ${colors.white};
  font-size: 0.9rem;
  cursor: pointer;
  &:hover { color: ${colors.grayLight}; }
`
*/

