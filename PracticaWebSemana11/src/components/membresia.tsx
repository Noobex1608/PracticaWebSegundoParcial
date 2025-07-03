import type { Iusuario } from "../components/usuario";
export interface IMembresia {
  id: number;
  usuarioID: number;
  monto: number;
}

interface Props {
  membresia: IMembresia;
  usuario: Iusuario;
}

const MembresiaCard = ({ membresia, usuario }: Props) => {
  return (
    <div style={{ border: '1px solid #999', padding: '1rem', marginBottom: '1rem' }}>
      <h3>🧾 Membresía #{membresia.id}</h3>
      <p>👤 Usuario: {usuario.nombre} ({usuario.correo})</p>
      <p>💰 Monto: ${membresia.monto}</p>
    </div>
  );
};

export default MembresiaCard;
