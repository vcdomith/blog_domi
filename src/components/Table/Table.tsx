import { IValores } from "@/interfaces/IValores"

import styles from './Table.module.css'

interface TableProps {
    valores: IValores[]
}

const Table = ({ valores }: TableProps) => {
  return (
    <>
    
    {valores.length > 0 ?
    <table className={styles.table}>
        <thead className={styles.thead}>
            <tr>
                <th className={styles.th}>Valor Unitário</th>
                <th className={styles.th}>Valor Tabela 1</th>
                <th className={styles.th}>Valor Tabela 2</th>
                <th className={styles.th}>Valor Tabela 3</th>
            </tr>
        </thead>
        <tbody className={styles.tbody}>
            {valores.map((produto, index) => 
                <tr className={styles.tr} key={index}>
                    <td>{produto.unitario}</td>
                    <td>{produto.tabela1}</td>
                    <td>{produto.tabela2}</td>
                    <td>{produto.tabela3}</td>
                </tr>)}
        </tbody>
    </table>
    : <div>sem Dados</div>
    }
    </>
  )
}

export default Table