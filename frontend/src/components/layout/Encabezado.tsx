interface EncabezadoProps {
    mesaId?:number;
}

export default function Encabezado ({mesaId}: EncabezadoProps){
    return (
        <header>
            <h1>Cafeteria Origen</h1>

            <p>
                {mesaId !== undefined
                    ?  `mesa ${mesaId}`
                    : "retiro en barra"   
                }
            </p>

        </header>
    )
}