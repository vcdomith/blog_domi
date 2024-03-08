import { IFatores } from '@/interfaces/IFatores'
import './TableBody.scss'
import { IValores } from '@/interfaces/IValores'
import FatoresTable from '@/components/FatoresTable/FatoresTable'
import { IProduto } from '@/interfaces/IProduto'
import { Dispatch, MouseEvent, SetStateAction, TransitionEvent, useEffect, useState } from 'react'
import { animated, useSpring, useTransition } from '@react-spring/web'
import Converter from '@/utils/typeConversion'
import { get } from 'http'

interface TableBodyProps {

    controleProdutos: IProduto[]
    setControleProdutos: (fator: (arr:IProduto[]) => IProduto[]) => void

    setFatores: (index: number) => (id: string, valor: string) => void

    setValor: (index: number) => ((valor: string) => void)

    fatoresDisplay: boolean[]
    setFatoresDisplay: Dispatch<SetStateAction<boolean[]>>

    getIndex: (id: number) => number
}

const TableBody = ({ controleProdutos, setControleProdutos, setFatores, setValor, fatoresDisplay, setFatoresDisplay, getIndex }: TableBodyProps) => {

    const { stringToFloat } = Converter

    const [visiblity, setVisibility] = useState(true)
    const [listLength, setListLength] = useState(0)

    const transitions = useTransition(
        controleProdutos.map(({ id }, index) => ({ id, index })),
        {   
          key: ({ id }: { id: string }) => id,
          from: { opacity: 0, height: 0 },
          enter: { opacity: 1, height: 'auto' },
          leave: { opacity: 0, height: 0, zIndex: -2 },
          config: { tension: 220, friction: 20 } // Adjust as needed
        }
      );

    // const transitions = useTransition(controleProdutos, {
    //     from: { opacity: 0, x: -100 },
    //     enter: { opacity: 1, x: 0 },
    //     leave: { opacity: 0, x: 100 },
    //   })

    let displayControl = Array(controleProdutos.length).fill(false)

    // const [fatoresDisplay, setFatoresDisplay] = useState<boolean[]>(displayControl)

    // const getIndex = (id: number): number => {

    //     return controleProdutos.findIndex(produto => produto.id === id)

    // }

    function calcularTabela(valor: number, args: number[]): number {

        return customRound(args.reduce((acc, atual) => acc * atual, valor))
    
    }

    function customRound(value: number): number {
        const floorValue = Math.floor(value);
        const halfFloorValue = floorValue + 0.5;
        const nextFloorValue = floorValue + 1;
      
        const diffToFloor = Math.abs(value - floorValue);
        const diffToHalfFloor = Math.abs(value - halfFloorValue);
        const diffToNextFloor = Math.abs(value - nextFloorValue);
    
        let a = {
          value: value,
          floor: floorValue, 
          halfFloor: halfFloorValue,
          doubleFloor: nextFloorValue,
          diffToFloor: diffToFloor,
          diffToHalfFloor: diffToHalfFloor,
          diffToNextFloor: diffToNextFloor
        }
        
        // console.table(a);
      
        if (diffToFloor <= diffToHalfFloor && diffToFloor <= diffToNextFloor) {
          return floorValue - 0.02;
        } else if (diffToHalfFloor <= diffToNextFloor) {
          return halfFloorValue;
        } else {
          return nextFloorValue - 0.02;
        }
    }

    const excluirLinha = (index: number) => {

        // setValores((valores).filter((valor, id) => index !== id))

        // const indexToRemove = controleProdutos.indexOf(id)
        // const arrToRemove = controleProdutos.filter(produto => produto.id === id)
        
        // if(listLength > 0) setListLength(prev => prev-1)

        setControleProdutos((prev) => {
            const updated = prev.filter((_, idx) => idx !== index);
            return updated;
        });
        // setControleProdutos((prev) => {
        //     const updated = [...prev];

        //     (updated.length > 1) 
        //         ? updated.splice(index, 1)
        //         : updated.splice(0, 1)
 
        //     return updated
        // })

    }

    const mostrarFatores = (index: number) => {

        setFatoresDisplay((prev) => {
            
            const control = [...displayControl]
            control[index] = (control[index] === prev[index])? true : false
            return control
        
        })

        // console.log(controleProdutos[index]);

    }

    const handleModalClick = (index: number, e: MouseEvent<HTMLElement, MouseEvent<Element, MouseEvent>>) => {

      if ((e.target as HTMLElement).localName === 'section') {

        mostrarFatores(index)
        return

      }
    //    else {

    //     return

    //   }

    }

    const getTabelas = (index: number): number[] => {

        const produto = controleProdutos[index]
        if (!produto) {
            console.log(`Produto no ${index} não existe`)
            return []
        }  
        
        const {fatores, unitario} = controleProdutos[index]
        const listaFatores = Object.values((fatores)).map(fator => stringToFloat(fator))

        const valorNumerico = parseFloat(unitario.replace(/,/g, '.'))
        const tabelas: IValores = {
            unitario: valorNumerico,
            tabela1: calcularTabela(valorNumerico, listaFatores),
            tabela2: customRound(valorNumerico*1.5),
            tabela3: customRound((calcularTabela(valorNumerico, listaFatores))*1.3)
        }
        return Object.values(tabelas)

       
    }

    // const handleListLength = () => {

    //     if (listLength > 0) setListLength(prev => prev-1)

    // }

    useEffect(() => {

        if (controleProdutos.length !== fatoresDisplay.length)
            setFatoresDisplay(Array(controleProdutos.length).fill(false))

    }, [controleProdutos, fatoresDisplay.length, setFatoresDisplay])

  return(
    <div 
        className='tbody' 
        style={{height: `${controleProdutos.length*55.2}px`}}
    >  
        {/* {transitions((style, { id, index }) => (
            <animated.div
                style={style}
                className={`tr`}
                onClick={() => console.log()}
                key={id}
            >

                {getTabelas(index).map((valor: string | number, index: number) => 
                        <div 
                            className='td'
                            key={index}
                        >{
                            (typeof valor === 'number')
                            ? valor.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 4})
                            : valor
                        }
                        </div>
                    )}
                    <>
                    
                    <svg 
                        onClick={() => mostrarFatores(index)}
                        width="25px" 
                        height="25px" 
                        viewBox="0 0 32 32" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                            <path 
                                d="M6.001 7.128L6 10.438l19.998-.005L26 7.124zM6.001 21.566L6 24.876l19.998-.006.002-3.308zM6.001 14.341L6 17.65l19.998-.004.002-3.309z"
                            />
                    </svg>
                    
                    <svg 
                        onClick={() => excluirLinha(getIndex(id))}
                        width="25px" 
                        height="25px" 
                        viewBox="0 0 32 32" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                            <path 
                                d="M7.004 23.087l7.08-7.081-7.07-7.071L8.929 7.02l7.067 7.069L23.084 7l1.912 1.913-7.089 7.093 7.075 7.077-1.912 1.913-7.074-7.073L8.917 25z"
                            />
                    </svg>
                    <>
                    <section 
                        className='backdrop'
                        hidden={!fatoresDisplay[index]}
                        onClick={(e) => handleModalClick(index, e as any)}
                    >    
                    </section>
                    <FatoresTable
                        display={fatoresDisplay[index]}
                        fatores={controleProdutos[index].fatores}
                        setFatores={setFatores(getIndex(id))}
                        valor={controleProdutos[index].unitario}
                        setValor={setValor(getIndex(id))}
                        handleSubmit={e => {
                            e.preventDefault()
                            mostrarFatores(index)
                        }}
                    />
                    </>

                    </>


            </animated.div>
        ))} */}
        {transitions((style, produto) => {
            
            const { id, index } = produto

            return (
                <animated.div
                style={style}
                className={`tr`}
                onClick={() => console.log()}
                key={id}
                >
                    {getTabelas(index).map((valor: string | number, index: number) => 
                                    <div 
                                        className='td'
                                        key={index}
                                    >{
                                        (typeof valor === 'number')
                                        ? valor.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 4})
                                        : valor
                                    }
                                    </div>
                    )}
                    <>
                    
                    <svg 
                        onClick={() => mostrarFatores(index)}
                        width="25px" 
                        height="25px" 
                        viewBox="0 0 32 32" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                            <path 
                                d="M6.001 7.128L6 10.438l19.998-.005L26 7.124zM6.001 21.566L6 24.876l19.998-.006.002-3.308zM6.001 14.341L6 17.65l19.998-.004.002-3.309z"
                            />
                    </svg>
                    
                    <svg 
                        onClick={() => excluirLinha(getIndex(id))}
                        width="25px" 
                        height="25px" 
                        viewBox="0 0 32 32" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                            <path 
                                d="M7.004 23.087l7.08-7.081-7.07-7.071L8.929 7.02l7.067 7.069L23.084 7l1.912 1.913-7.089 7.093 7.075 7.077-1.912 1.913-7.074-7.073L8.917 25z"
                            />
                    </svg>

                    <>
                    <section 
                        className='backdrop'
                        hidden={!fatoresDisplay[index]}
                        onClick={(e) => handleModalClick(index, e as any)}
                    >    
                    </section>
                    <FatoresTable
                        display={fatoresDisplay[index]}
                        fatores={controleProdutos[index].fatores}
                        setFatores={setFatores(getIndex(id))}
                        valor={controleProdutos[index].unitario}
                        setValor={setValor(getIndex(id))}
                        handleSubmit={e => {
                            e.preventDefault()
                            mostrarFatores(index)
                        }}
                    />
                    </>

                    </>
                </animated.div>
            );
            })}
        {/* {transitions((style, produto, b) => {

            let index = controleProdutos.indexOf(produto)
            if (index === -1 || !produto) return null // Checa para ver se existe o produto e indice
            let id = produto.id

            return (
            <animated.div  
            className={`tr`}
            style={style}

            // onClick={() => toggleVisibility()}
            // onClick={() => handleListLength()}
            key={(index*3.1415)}
            >
            {getTabelasSpring(produto).map((valor: string | number, index: number) => 
                <div 
                    className='td'
                    key={index}
                >{
                    (typeof valor === 'number')
                    ? valor.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 4})
                    : valor
                }
                </div>
            )}
            <>

            <svg 
                onClick={() => mostrarFatores(index)}
                width="25px" 
                height="25px" 
                viewBox="0 0 32 32" 
                xmlns="http://www.w3.org/2000/svg"
            >
                    <path 
                        d="M6.001 7.128L6 10.438l19.998-.005L26 7.124zM6.001 21.566L6 24.876l19.998-.006.002-3.308zM6.001 14.341L6 17.65l19.998-.004.002-3.309z"
                    />
            </svg>

            <svg 
                onClick={() => excluirLinhaSpring(produto)}
                width="25px" 
                height="25px" 
                viewBox="0 0 32 32" 
                xmlns="http://www.w3.org/2000/svg"
            >
                    <path 
                        d="M7.004 23.087l7.08-7.081-7.07-7.071L8.929 7.02l7.067 7.069L23.084 7l1.912 1.913-7.089 7.093 7.075 7.077-1.912 1.913-7.074-7.073L8.917 25z"
                    />
            </svg>
            <>
            <section 
                className='backdrop'
                hidden={!fatoresDisplay[index]}
                onClick={(e) => handleModalClick(index, e as any)}
            >    
            </section>
            <FatoresTable
                display={fatoresDisplay[index]}
                fatores={controleProdutos[index].fatores}
                setFatores={setFatores(getIndex(id))}
                valor={controleProdutos[index].unitario}
                setValor={setValor(getIndex(id))}
                handleSubmit={e => {
                    e.preventDefault()
                    mostrarFatores(index)
                }}
            />
            </>

            </>

            </animated.div>)}
        
        )}  */}
            {/* {controleProdutos.map(({ id }, index) => 
                <div  
                    className={`tr`}

                    // onClick={() => toggleVisibility()}
                    // onClick={() => handleListLength()}
                    key={(index*3.1415)}
                >
                    {getTabelas(index).map((valor: string | number, index: number) => 
                        <div 
                            className='td'
                            key={index}
                        >{
                            (typeof valor === 'number')
                            ? valor.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 4})
                            : valor
                        }
                        </div>
                    )}
                    <>
                    
                    <svg 
                        onClick={() => mostrarFatores(index)}
                        width="25px" 
                        height="25px" 
                        viewBox="0 0 32 32" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                            <path 
                                d="M6.001 7.128L6 10.438l19.998-.005L26 7.124zM6.001 21.566L6 24.876l19.998-.006.002-3.308zM6.001 14.341L6 17.65l19.998-.004.002-3.309z"
                            />
                    </svg>
                    
                    <svg 
                        onClick={() => excluirLinha(getIndex(id))}
                        width="25px" 
                        height="25px" 
                        viewBox="0 0 32 32" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                            <path 
                                d="M7.004 23.087l7.08-7.081-7.07-7.071L8.929 7.02l7.067 7.069L23.084 7l1.912 1.913-7.089 7.093 7.075 7.077-1.912 1.913-7.074-7.073L8.917 25z"
                            />
                    </svg>
                    <>
                    <section 
                        className='backdrop'
                        hidden={!fatoresDisplay[index]}
                        onClick={(e) => handleModalClick(index, e as any)}
                    >    
                    </section>
                    <FatoresTable
                        display={fatoresDisplay[index]}
                        fatores={controleProdutos[index].fatores}
                        setFatores={setFatores(getIndex(id))}
                        valor={controleProdutos[index].unitario}
                        setValor={setValor(getIndex(id))}
                        handleSubmit={e => {
                            e.preventDefault()
                            mostrarFatores(index)
                        }}
                    />
                    </>

                    </>
                    
                </div>
            )} */}
    </div>
  )
}

export default TableBody