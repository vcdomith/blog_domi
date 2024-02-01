'use client'

import { FormEvent, useEffect, useState } from 'react'
import { IValores } from '@/interfaces/IValores'
import Table from '@/components/Table/Table'
import Container from '@/components/Container/Container'
import NumberInput from '@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput'
import { IFatores } from '@/interfaces/IFatores'
import FatoresTable from '@/components/FatoresTable/FatoresTable'
import { IProduto } from '@/interfaces/IProduto'
import Converter from '@/utils/typeConversion'

import './padrao.css'
import page from './page.module.scss'
import input from './Inputs.module.scss'

export default function Home() {

  const { stringToFloat, floatToString } = Converter

  // Estados para cadastros de preços na tabela
  const [valor, setValor] = useState('')
  // const [fatores, setFatores] = useState<IFatores>({
  //   padrao: '3',
  //   st: '1,01',
  //   transporte: '1,1',
  //   fator: '1,4',
  //   ipi: '1,065'
  // })
  const [fatores, setFatores] = useState<IFatores>({
    padrao: '',
    st: '',
    transporte: '',
    fator: '',
    ipi: ''
  })
  const [valores, setValores] = useState<IValores[]>([])
  const [controleProdutos, setControleProdutos] = useState<IProduto[]>([])

  // Estados para configurações inciais (Transporte e ST)  
  const [valorTransporte, setValorTransporte] = useState('')
  const [valorTotalProdutos, setValorTotalProdutos] = useState('')
  const [valorST, setValorST] = useState('')
  const [valorTotalProdutosST, setValorTotalProdutosST] = useState('')


  const adicionarValor = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    if (valor) {

      setControleProdutos([...controleProdutos, {
        fatores: fatores,
        unitario: valor,
      }])

      setValor('')
    }
  }
  
  const updateFatoresAtuais = (id: string, valor: string) => {

      setFatores((prev) => {
        
        const updateFator = {...prev, [id]: valor}
        return updateFator
        
      })

  }

  const updateFatoresProduto = (index: number) => {

    // let indexSalvo = index

    return (id: string, valor: string) => setControleProdutos(prev => {

      const updatedProducts = [...prev];
      const updatedFatores = { ...updatedProducts[index].fatores }

      updatedFatores[id as keyof IFatores] = valor as string

      updatedProducts[index] = {
        ...updatedProducts[index],
        fatores: updatedFatores,
      };

      return updatedProducts

    })

  }

  const updateValorProduto = (index: number): ((valor: string) => void) => {

    return (valor) => {

      setControleProdutos(prev => {
        const update = [...prev]
        update[index].unitario = valor
        return update
      })

    }
    
  }
 
  const calcularFatorTransporte = () => {

    const fatorTransporte = (stringToFloat(valorTransporte) * 3.4) / stringToFloat(valorTotalProdutos)
    return floatToString(fatorTransporte)

  }

  const calcularFatorST = () => {

    const fatorST = stringToFloat(valorTotalProdutosST) / stringToFloat(valorST)
    return floatToString(fatorST)

  }

  const handleConfiguracaoInicial = (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    setFatores( prev => {
      const update = {
        ...prev,
        ['transporte']: calcularFatorTransporte(),
        ['st']: calcularFatorST(),
      }
      return update
    })

  }

  return (
    <section className={page.section}>
      <Container>
        <div
          className={page.container_descricao}
        >
          <div>
            <span className={page.span}>
              <svg className={page.logo}
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path d="M5.35,14.78a1.84,1.84,0,0,1,1.15.37,3.76,3.76,0,0,0,2.18.64,3.74,3.74,0,0,0,2.18-.64,2,2,0,0,1,2.3,0,4,4,0,0,0,4.36,0,2,2,0,0,1,2.3,0,3.77,3.77,0,0,0,2.16.64v-2a1.89,1.89,0,0,1-1.15-.36,4,4,0,0,0-4.36,0,1.77,1.77,0,0,1-1.15.36,1.89,1.89,0,0,1-1.15-.36,4,4,0,0,0-4.36,0,1.77,1.77,0,0,1-1.15.36,1.89,1.89,0,0,1-1.15-.36,3.82,3.82,0,0,0-2.18-.65,3.82,3.82,0,0,0-2.18.65A1.77,1.77,0,0,1,2,13.77v2a3.9,3.9,0,0,0,2.2-.64A1.84,1.84,0,0,1,5.35,14.78Z"/>
                  <path d="M22,15.79s0,0,0,0h0Z"/>
                  <path d="M16.49,18a1.77,1.77,0,0,1-1.15.36A1.89,1.89,0,0,1,14.19,18,3.82,3.82,0,0,0,12,17.31,3.88,3.88,0,0,0,9.82,18a1.75,1.75,0,0,1-1.15.36A1.77,1.77,0,0,1,7.52,18a3.87,3.87,0,0,0-2.18-.65A3.88,3.88,0,0,0,3.15,18,1.77,1.77,0,0,1,2,18.32v2a4,4,0,0,0,2.19-.65,1.82,1.82,0,0,1,1.15-.37,1.84,1.84,0,0,1,1.15.37,3.87,3.87,0,0,0,2.18.65,4,4,0,0,0,2.19-.65,2,2,0,0,1,2.3,0,4,4,0,0,0,4.36,0,2,2,0,0,1,2.3,0,3.82,3.82,0,0,0,2.18.65h0v-2A1.77,1.77,0,0,1,20.85,18,4,4,0,0,0,16.49,18Z"/>
                  <path d="M22,6.69h0Z"/>
                  <path d="M5.35,5.68A1.89,1.89,0,0,1,6.5,6a3.85,3.85,0,0,0,2.18.65A3.82,3.82,0,0,0,10.86,6,1.77,1.77,0,0,1,12,5.68,1.89,1.89,0,0,1,13.16,6a4,4,0,0,0,4.36,0,1.77,1.77,0,0,1,1.15-.36A1.89,1.89,0,0,1,19.82,6,3.78,3.78,0,0,0,22,6.69v-2a1.84,1.84,0,0,1-1.15-.37,4,4,0,0,0-4.36,0,2,2,0,0,1-2.3,0,4,4,0,0,0-4.36,0,2,2,0,0,1-2.3,0,3.82,3.82,0,0,0-2.18-.65,3.82,3.82,0,0,0-2.18.65A1.84,1.84,0,0,1,2,4.67v2A3.91,3.91,0,0,0,4.2,6,1.77,1.77,0,0,1,5.35,5.68Z"/>
                  <path d="M20.85,8.85a4,4,0,0,0-4.36,0,2,2,0,0,1-2.3,0A3.74,3.74,0,0,0,12,8.21a3.87,3.87,0,0,0-2.19.64,1.82,1.82,0,0,1-1.15.37,1.78,1.78,0,0,1-1.15-.37,3.78,3.78,0,0,0-2.18-.64,3.87,3.87,0,0,0-2.19.64A1.84,1.84,0,0,1,2,9.22v2a3.88,3.88,0,0,0,2.19-.65,1.75,1.75,0,0,1,1.15-.36,1.77,1.77,0,0,1,1.15.36,4,4,0,0,0,4.37,0A1.77,1.77,0,0,1,12,10.23a1.89,1.89,0,0,1,1.15.36,4,4,0,0,0,4.36,0,1.77,1.77,0,0,1,1.15-.36,1.89,1.89,0,0,1,1.15.36,3.82,3.82,0,0,0,2.18.65h0v-2A1.84,1.84,0,0,1,20.85,8.85Z"/>
                </g>
                <rect width="24" height="24" fill="none"/>
              </svg>
              <h2>DATA FLOW</h2>
            </span>
            {/* <p>
              Bem vindo ao Data Flow, para calcular os preços das tabelas dos produtos você pode começar preenchendo esses espaços abaixo ou, se preferir, preencher diretamente os fatores ao lado! Depois que preencher todos os preços são calculados automáticamente! Experimente:
            </p> */}
            <form
              className={input.form}
              onSubmit={handleConfiguracaoInicial}
            >
              <span className={input.span}>
                <NumberInput
                  label='Transporte' 
                  placeholder={'Valor Transporte'} 
                  valor={valorTransporte} 
                  setValor={setValorTransporte}              
                />
                <NumberInput
                  label='Total Produtos' 
                  placeholder={'Total Produtos'} 
                  valor={valorTotalProdutos} 
                  setValor={setValorTotalProdutos}              
                />
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M18.629 15.997l-7.083-7.081L13.462 7l8.997 8.997L13.457 25l-1.916-1.916z"/></svg>
              </span>
              <span className={input.span}>
                <NumberInput
                  label='Total Produtos com ST' 
                  placeholder={'Total Produtos ST'} 
                  valor={valorTotalProdutosST} 
                  setValor={setValorTotalProdutosST}              
                />
                <NumberInput
                  label='Total ST' 
                  placeholder={'Valor Total ST'} 
                  valor={valorST} 
                  setValor={setValorST}              
                />
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M18.629 15.997l-7.083-7.081L13.462 7l8.997 8.997L13.457 25l-1.916-1.916z"/></svg>
              </span>
              <input type="submit" hidden/>
            </form>
          </div>
          
        </div>
        <div className={page.container_tabela}>
          <FatoresTable
            display={true}
            fatores={fatores}
            setFatores={updateFatoresAtuais}
            valor={valor}
            setValor={setValor}
            handleSubmit={adicionarValor}
          />
        </div>
        </Container>
        <Table 
          valores={valores} 
          controleProdutos={controleProdutos}
          setControleProdutos={setControleProdutos}
          setFatores={updateFatoresProduto}
          setValor={updateValorProduto}
        />
    </ section>

  )
}
