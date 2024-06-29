
import style from './TabelaHeader.module.scss'

export default function TabelaHeader() {

    return (

        <span className={style.header}>
            <div>Tipo</div>
            <div>Código</div>
            <div>Unitário</div>
            <div>Tabela 1</div>
            <div>Tabela 2</div>
            <div>Tabela 3</div>
            <div>Fatores</div>
        </span>

    )

}