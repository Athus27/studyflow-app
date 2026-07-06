import { useEffect, useState } from 'react'

import { locationsService } from '../services/locationsService'
import type { Cidade, Estado } from '../types/location'

export const useLocations = () => {
  const [estadoSelecionado, setEstadoSelecionado] = useState('')
  const [listaEstados, setListaEstados] = useState<Estado[]>([])
  const [listaCidades, setListaCidades] = useState<Cidade[]>([])

  useEffect(() => {
    locationsService.getEstados().then(setListaEstados)
  }, [])

  useEffect(() => {
    if (!estadoSelecionado) {
      setListaCidades([])
      return
    }

    locationsService.getCidades(estadoSelecionado).then(setListaCidades)
  }, [estadoSelecionado])

  return {
    estadoSelecionado,
    setEstadoSelecionado,
    listaEstados,
    listaCidades,
  }
}