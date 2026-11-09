interface EncabezadoProps {
    mesaId?:number;
}

export default function Encabezado ({mesaId}: EncabezadoProps){
    return (
        <header>
            <h1>Cafeteria Origen</h1>

            if(mesaId){
                <p>{`mesa ${mesaId}`}</p>
            }
        </header>
    )
}