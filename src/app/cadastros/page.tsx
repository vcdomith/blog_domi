import { IProduto } from "@/interfaces/IProduto"
import { dbConnect } from "@/utils/db/supabase"
import { createClient } from "@supabase/supabase-js"

//Exportando 'revalidate' com valor 0, desse componente, a API do supabase sabe que deve revalidar os dados a cada refresh assim como um getServerSideProps
export const revalidate = 0

export default async function Cadastros() {
    
    const supabase = dbConnect()
    const {data: cadastros} = await supabase.from('cadastros').select()

    // const 

    return (
    <>
    <div
        style={{
            width: '400px',
            height: 'auto',
            padding: '1rem',
            backgroundColor: 'wheat'
        }}
    >
        {cadastros?.map( ({id, created_at, produtos}) => 
            <div key={id}>
                <p>{created_at}</p>
                {produtos.map(({ id, unitario, fatores }: IProduto) => 
                    <div key={id}>
                        <p>{unitario}</p>
                    </div>
                )}
            </div>
        )}
    </div>
    </>
    )

}
