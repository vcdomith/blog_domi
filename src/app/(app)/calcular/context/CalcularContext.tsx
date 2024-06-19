'use client'
import useFornecedor, { useFornecedorReturn } from "@/hooks/useFornecedor";
import usePedido, { usePedidoReturn } from "@/hooks/usePedido";
import useProduto, { useProdutoReturn } from "@/hooks/useProduto";
import { IFornecedor } from "@/interfaces/IFornecedor";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNotification } from "../../(contexts)/NotificationContext";
import { IFator } from "@/interfaces/IFator";

interface CalcularContextProps {

    fornecedorContext: useFornecedorReturn
    pedidoContext: usePedidoReturn
    produtoContext: useProdutoReturn
    displayControl: IDisplayControl 
    valid: boolean
    tabela: produtoCadastro[]

    submitForm: () => void

}

interface fatoresContext {

    base: string
    fatorBaseNormal: string
    fatorBaseST: string

    transporte: string
    st: string

    ipi: string
    desconto: string 

}

interface produtoCadastro {

    id: number
    codigo: string
    
    st: boolean
    unitario: string
    unitarioNota: string
    composto: string[] | null

    fatores: fatoresContext

}

interface IDisplayControl {

    fatorTransportePedido: boolean
    fatorSTPedido: boolean
    desconto: boolean
    ipi: boolean
    unitarioPedido: boolean
    unitarioNota: boolean
    unitarioComposto: boolean

}

export const CalcularContext = createContext<CalcularContextProps | undefined>(undefined)
CalcularContext.displayName = 'Calcular'

export const useCalcular = () => {
    const context = useContext(CalcularContext)
    if (!context) throw new Error('useCalcular must be used within a CalcularProvider')
    return context
}

export const CalcularProvider = ({ children }: { children: React.ReactNode}) => {

    const {notifications, addNotification} = useNotification()

    const fornecedorContext = useFornecedor()
    const pedidoContext = usePedido()
    const produtoContext = useProduto()

    // TABELA CONTEXT _ TODO

    const {fornecedorData} = fornecedorContext
    const {pedidoData} = pedidoContext
    const {produtoData, resetForm} = produtoContext

    type ControlledInputDataKeys = keyof typeof controlledInputData;
    const controlledInputData = useMemo(() => {
        return {...fornecedorData, ...pedidoData, ...produtoData}
    }, [fornecedorData, pedidoData, produtoData])

    const [tabela, setTabela] = useState<produtoCadastro[]>([])

    // Quando implementar tabela esse estado será o estado tabelaContext: produtoCadastro[]
    // const [produtoCadastros, setProdutoCadastros] = useState<produtoCadastro>() 

    type DisplayControlKeys = typeof displayControl;
    const displayControl: IDisplayControl = (produtoData.st)
        ? {

            fatorTransportePedido: fornecedorData.transporte,
            fatorSTPedido: fornecedorData.st,
            desconto: fornecedorData.desconto,
            ipi: fornecedorData.ipi,

            unitarioPedido: (!fornecedorData.composto && !fornecedorData.unitarioNota), 
            // unitarioNota: (fornecedorData.composto) ? true : fornecedorData.unitarioNota,
            unitarioNota: true,
            unitarioComposto: fornecedorData.composto,

        }
        : {

            fatorTransportePedido: false,
            fatorSTPedido: false,
            desconto: fornecedorData.desconto,
            ipi: false,

            unitarioPedido: (!fornecedorData.composto && !fornecedorData.unitarioNota), 
            unitarioNota: (fornecedorData.composto) ? true : fornecedorData.unitarioNota,
            unitarioComposto: fornecedorData.composto,

        }

    // const validKeys = Object.fromEntries(Object.entries(displayControl).filter( item => item[1] ))                               
    const validKeys = Object.keys(displayControl)
                            .filter( key => displayControl[key as keyof DisplayControlKeys] )

    interface BaseCheck {
        
        codigo: string
    
        fatorBase: string
        fatorBaseNormal: string
        fatorBaseST: string 

        [key: string]: any
        
    }

    const check = useMemo(() => {

        const baseCheck: BaseCheck = {
            codigo: produtoData.codigo,
    
            fatorBase: fornecedorData.fatorBase,
            fatorBaseNormal: fornecedorData.fatorBaseNormal,
            fatorBaseST: fornecedorData.fatorBaseST,   
        }

        validKeys.map((key) => {
            baseCheck[key] = controlledInputData[key as ControlledInputDataKeys]
        })

        return baseCheck

    }, [fornecedorData, produtoData, validKeys, controlledInputData])

    console.log(validKeys);
    console.table(check)

    const valid = useMemo(() => {
        return Object.values(check).every( value => value !== '' )
    }, [check])

    const unitario = useMemo(() => {
        
        if (!fornecedorData.unitarioNota && !fornecedorData.composto)return controlledInputData.unitarioPedido
        if (fornecedorData.unitarioNota) return controlledInputData.unitarioNota
        if (fornecedorData.composto) return controlledInputData.unitarioComposto

    }, [fornecedorData, controlledInputData])

    const submitForm = () => {

        let produto: produtoCadastro = {
            
            id: new Date().getTime(),
            codigo: controlledInputData.codigo,
            st: controlledInputData.st,
            unitario: unitario || '0',
            unitarioNota: controlledInputData.unitarioNota || '0',
            composto: [

                controlledInputData.composto1 || '', 
                controlledInputData.composto2 || '',

            ],
            fatores: {

                base: controlledInputData.fatorBase || '1',
                fatorBaseNormal: (!controlledInputData.st) ? controlledInputData.fatorBaseNormal : '1',
                fatorBaseST: (controlledInputData.st) ? controlledInputData.fatorBaseST : '1',
        
                transporte: controlledInputData.fatorTransportePedido || '1',
                st: controlledInputData.fatorSTPedido || '1',
        
                ipi: controlledInputData.ipi || '1',
                desconto: controlledInputData.desconto || '1',

            }
        }

        const produtoCadastro: produtoCadastro = {

            id: new Date().getTime(),
            codigo: produtoData.codigo,
            st: produtoData.st,
            unitario: produtoData.unitarioPedido,
            unitarioNota: produtoData.unitarioNota,
            composto: [produtoData.composto1, produtoData.composto2],
            fatores: {

                base: fornecedorData.fatorBase,
                fatorBaseNormal: fornecedorData.fatorBaseNormal,
                fatorBaseST: fornecedorData.fatorBaseST,
        
                transporte: pedidoData.fatorTransportePedido,
                st: pedidoData.fatorSTPedido,
        
                ipi: produtoData.ipi,
                desconto: produtoData.desconto,

            }
          
        }

        if(!valid) addNotification({tipo: 'erro', mensagem: 'Não foi possível adicionar o produto na tabela, preencha todos os dados!'}) 

        setTabela( prev => ([...prev, produto]) )
        resetForm()

    }

    return <CalcularContext.Provider
        value={{
            fornecedorContext,
            pedidoContext,
            produtoContext,
            displayControl,
            valid,
            tabela,
            submitForm,
        }}
    >
        {children}
    </CalcularContext.Provider>

}