// src/components/CrudManager.jsx
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { API_BASE, BACKEND } from '../constants/constantes'
import colors from '../theme/colors'


export default function CrudManager({
  apiEndpoint,
  label,
  getItemId = x => x.id,
  renderItem = x => JSON.stringify(x),
  fields, // [{ name, label, type: 'text'|'number'|'select', options?: [{value,label}] }]
  showList = true
}) {
  const [items, setItems] = useState([])
  const [form, setForm]   = useState(
    Object.fromEntries(fields.map(f => [f.name, '']))
  )
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchItems()
  }, [apiEndpoint])

  const fetchItems = async () => {
    const res = await fetch(`${BACKEND}${API_BASE}${apiEndpoint}`)
    const data = await res.json()
    setItems(data)
  }

  const handleDelete = async item => {
    const id = getItemId(item)
    if (!window.confirm(`¿Borrar ${label.toLowerCase()} ${id}?`)) return
    const res = await fetch(`${BACKEND}${API_BASE}${apiEndpoint}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    if (res.ok) setItems(prev => prev.filter(i => getItemId(i)!==id))
    else {
      const err = await res.json()
      alert(err.msg || 'Error al borrar')
    }
  }

  const handleCreate = async e => {
    e.preventDefault()
    // validación mínima: campos no vacíos
    for (let f of fields) {
      if (!form[f.name].toString().trim()) {
        return alert(`El campo "${f.label}" es obligatorio`)
      }
    }
    // POST
    const res = await fetch(`${BACKEND}${API_BASE}${apiEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization':`Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(
        // para los number fields convertimos:
        fields.reduce((acc,f)=>{
          acc[f.name] = f.type==='number'
            ? Number(form[f.name])
            : form[f.name]
          return acc
        }, {})
      )
    })
    const data = await res.json()
    if (!res.ok) return alert(data.msg||'Error al crear')
    fetchItems()
    // reset form
    setForm(Object.fromEntries(fields.map(f=>[f.name,''])))
  }

  const filtered = items.filter(i =>
    renderItem(i).toString().toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <Wrapper>
      

      {showList && (
        
        <List>
          <Search
            type="text"
            placeholder={`Buscar ${label.toLowerCase()}...`}
            value={filter}
            onChange={e=>setFilter(e.target.value)}
          />
            {filtered.map((item, idx) => (
            <ListItem key={`${getItemId(item)}-${idx}`}>
                <ItemLabel>{renderItem(item)}</ItemLabel>
                <DeleteBtn onClick={() => handleDelete(item)}>Borrar</DeleteBtn>
            </ListItem>
            ))}
            {filtered.length === 0 && <Empty>— ninguno —</Empty>}
        </List>
        )}

      <Form onSubmit={handleCreate}>
        <FormTitle>Crear {label}</FormTitle>
        {fields.map(f=>(
          <Field key={f.name}>
            <Label>{f.label}</Label>
            {f.type==='select' ? (
              <Select
                name={f.name}
                value={form[f.name]}
                onChange={e=>setForm({...form,[f.name]:e.target.value})}
              >
                <option value="">–</option>
                {f.options.map(o=>(
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            ) : (
              <Input
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={e=>setForm({...form,[f.name]:e.target.value})}
              />
            )}
          </Field>
        ))}
        <SubmitBtn type="submit">Crear</SubmitBtn>
      </Form>
    </Wrapper>
  )
}

/* ==== Styled ==== */
const Wrapper = styled.div`max-width:800px;margin:2rem auto;display:grid;gap:1.5rem;`
const Search = styled.input`padding:.5rem;border:1px solid #ccc;border-radius:4px;width:100%;`
const List = styled.div`display:flex;flex-direction:column;gap:.5rem;`
const ListItem = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  background:white;padding:.75rem;border-radius:6px;box-shadow:0 1px 4px rgba(0,0,0,0.1);
`
const ItemLabel = styled.span`flex:1`
const DeleteBtn = styled.button`
  background:#e74c3c;color:white;border:none;padding:.3rem .6rem;border-radius:4px;
  cursor:pointer;&:hover{background:#c0392b;}
`
const Empty = styled.div`font-style:italic;color:#666;text-align:center;`
const Form = styled.form`display:grid;gap:1rem;background:white;padding:1rem;border-radius:6px;`
const FormTitle = styled.h4`margin:0;color:#333;`
const Field = styled.div`display:flex;flex-direction:column;`
const Label = styled.label`font-size:.9rem;margin-bottom:.3rem;`
const Input = styled.input`padding:.5rem;border:1px solid #ccc;border-radius:4px;`
const Select = styled.select`padding:.5rem;border:1px solid #ccc;border-radius:4px;`
const SubmitBtn = styled.button`
  align-self:start;padding:.6rem 1.2rem;
  background:${colors.purpleLight};
  color:white;border:none;border-radius:4px;cursor:pointer;
  &:hover{background:${colors.purpleMedium}}
`
