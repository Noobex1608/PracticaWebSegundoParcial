interface Iusuario{
    id: number,
    nombre: string,
    correo: string,
    edad?: number,
    descripcion?: string
}

interface IusuarioProps{
    nombre:string,
    correo:string,
}

const Bienvenida = ({ nombre, correo }: IusuarioProps) => (
  <div className="usuario" style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
    <h2 style={{ color: "#5D6363" }}>Hola {nombre}, bienvenido/a</h2>
    <p>📧 Correo: {correo}</p>
  </div>
);

export default Bienvenida;

export type { Iusuario };
