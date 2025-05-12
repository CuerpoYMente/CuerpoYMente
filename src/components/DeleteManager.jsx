// src/components/DeleteManager.jsx
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { API_BASE, BACKEND} from '../constants/constantes'

export default function DeleteManager({
  apiEndpoint,
  labelPlural,
  getItemId,
  renderItem,
  itemClassName
}) {
  const [items, setItems]   = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetch(`${BACKEND}${API_BASE}${apiEndpoint}`)
      .then(r => r.json())
      .then(setItems)
      .catch(console.error)
  }, [apiEndpoint])

  // Extrae el texto a buscar de cada item
  const getItemText = item => {
    // Ajusta aquí el campo que quieras buscar
    if (item.titulo) return item.titulo
    if (item.name)   return item.name
    if (item.nombre) return item.nombre
    return String(getItemId(item))
  }

  // Lista filtrada
  const visible = items.filter(item =>
    getItemText(item)
      .toLowerCase()
      .includes(filter.toLowerCase())
  )

  const handleDelete = async (item, idx) => {
    const id = getItemId(item)
    if (!window.confirm(
      `¿Estás seguro que quieres borrar ` +
      `${labelPlural.slice(0, -1).toLowerCase()} ` +
      `con ID ${id}?`
    )) return

    const res = await fetch(
      `${BACKEND}${API_BASE}${apiEndpoint}/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    if (!res.ok) {
      const err = await res.json()
      return alert(err.msg || 'Error al borrar')
    }

    // Elimina el elemento por índice
    setItems(prev => {
      const next = [...prev]
      next.splice(idx, 1)
      return next
    })
  }

  return (
    <Wrapper>
      <SearchInput
        type="text"
        placeholder={`Buscar ${labelPlural.toLowerCase()}...`}
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      <List>
        {visible.map((item, idx) => (
          <ListItem key={`${getItemId(item)}-${idx}`} className={itemClassName}>
            <ItemLabel>{renderItem(item)}</ItemLabel>
            <DeleteBtn onClick={() => handleDelete(item, idx)}>
              Borrar
            </DeleteBtn>
          </ListItem>
        ))}

        {visible.length === 0 && (
          <Empty>— No se han encontrado {labelPlural.toLowerCase()} —</Empty>
        )}
      </List>
    </Wrapper>
  )
}

/* ========== Styled Components ========== */

const Wrapper = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const SearchInput = styled.input`
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  width: 100%;

  &:focus {
    border-color: #888;
  }
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
`

const ItemLabel = styled.span`
  font-size: 0.95rem;
`

const DeleteBtn = styled.button`
  padding: 0.3rem 0.6rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: #c0392b; }
`

const Empty = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 1rem 0;
`
