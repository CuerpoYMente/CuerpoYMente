// src/pages/Admin.jsx
import React from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/Header'
import Footer from '../components/Footer'
import colors from '../theme/colors'
import DeleteManager from '../components/DeleteManager'
import CrudManager   from '../components/CrudManager'
import {
  DEPORTE,
  INTENSIDAD,
  MATERIALES,
  ZONA_TRABAJADA,
  TIPO_PRODUCTO
} from '../constants/constantes'

export default function Admin() {
  const navigate = useNavigate()
  const location = useLocation()
  const isPath = path => location.pathname.startsWith(path)


  return (
    <Container>
      <Header />
      <Main>
        <Title>Panel de Administración</Title>

        <Grid>
          <ActionButton onClick={() => navigate('/admin/videos/new')}>Nuevo Video</ActionButton>
          <ActionButton onClick={() => navigate('/admin/videos/delete')}>Borrar Videos</ActionButton>
          <ActionButton onClick={() => navigate('/admin/retos/new')}>Nuevo Reto</ActionButton>
          <ActionButton onClick={() => navigate('/admin/retos/delete')}>Borrar Retos</ActionButton>
          <ActionButton onClick={() => navigate('/admin/productos/new')}>Nuevo Producto</ActionButton>
          <ActionButton onClick={() => navigate('/admin/productos/delete')}>Borrar Productos</ActionButton>
        </Grid>

        {isPath('/admin/videos/delete') && (
          <DeleteManager
            apiEndpoint="/videos"
            labelPlural="Videos"
            getItemId={v => v.id}
            renderItem={v => `${v.id} – ${v.titulo}`}
          />
        )}
        {isPath('/admin/videos/new') && (
          <CrudManager
            apiEndpoint="/videos"
            label="Video"
            showList={false}
            fields={[
              { name: 'titulo', label: 'Título', type: 'text' },
              { name: 'url', label: 'URL (embed)', type: 'text' },
              { name: 'duracion', label: 'Duración (min)', type: 'number' },
              { name: 'deporte', label: 'Deporte', type: 'select', options: DEPORTE },
              { name: 'intensidad', label: 'Intensidad', type: 'select', options: INTENSIDAD },
              { name: 'material', label: 'Material', type: 'select', options: MATERIALES },
              { name: 'zona', label: 'Zona ejercitada', type: 'select', options: ZONA_TRABAJADA },
            ]}
          />
        )}
        {isPath('/admin/retos/delete') && (
          <DeleteManager
            apiEndpoint="/retos"
            labelPlural="Retos"
            getItemId={r => r.id}
            renderItem={r => `${r.id} – ${r.titulo}`}
          />
        )}
        {isPath('/admin/retos/new') && (
          <CrudManager
            apiEndpoint="/retos"
            label="Reto"
            showList={false}
            fields={[
              { name: 'titulo', label: 'Título', type: 'text' },
              { name: 'descripcion', label: 'Descripción corta', type: 'text' },
              { name: 'detalles', label: 'Detalles', type: 'text' },
              { name: 'intensidad', label: 'Intensidad', type: 'select', options: INTENSIDAD },
              { name: 'material', label: 'Material', type: 'select', options: MATERIALES },
              { name: 'imagen', label: 'URL Imagen', type: 'text' },
              { name: 'video', label: 'URL Video (embed)', type: 'text' },
            ]}
          />
        )}
        {isPath('/admin/productos/delete') && (
          <DeleteManager
            apiEndpoint="/productos"
            labelPlural="Productos"
            getItemId={p => p.id}
            renderItem={p => `${p.id} – ${p.name} – ${p.precio.toFixed(2)}€`}
          />
        )}
        {isPath('/admin/productos/new') && (
          <CrudManager
            apiEndpoint="/productos"
            label="Producto"
            showList={false}
            fields={[
              { name: 'tipo', label: 'Tipo', type: 'select', options: TIPO_PRODUCTO },
              { name: 'name', label: 'Nombre', type: 'text' },
              { name: 'descripción_corta', label: 'Descripción corta', type: 'text' },
              { name: 'descripción_larga', label: 'Descripción larga', type: 'text' },
              { name: 'precio', label: 'Precio', type: 'number' },
              { name: 'imagenes', label: 'URLs Imágenes (separadas por comas)', type: 'text' },
            ]}
          />
        )}
      </Main>
      <Footer />
    </Container>
  )
}

/* Styled Components */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  width: 50%;              // ocupa todo el ancho disponible
  max-width: 1400px;        // o el valor que prefieras (más que 1000px)
  min-width: 1200px;        // opcional, para evitar que se haga pequeño
  margin: 6rem auto 2rem;
  padding: 0 2rem;
  background-color: ${colors.purplePale};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`


const Title = styled.h2`
  font-size: 2rem;
  color: ${colors.purpleDark};
  text-align: center;
  margin-bottom: 2rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`

const ActionButton = styled.button`
  padding: 1rem;
  background-color: ${colors.purpleLight};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background-color: ${colors.purpleMedium}; }
`
