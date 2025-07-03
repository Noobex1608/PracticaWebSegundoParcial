interface Iartista{
    bio: string,
    nombre: string,
    redesSociales: {
        facebook?: string,
        instagram?: string,
        twitter?: string
    }
    generoMusical: string,
    fotoUrl:string;
}

const Artista = ({ bio, nombre, redesSociales, generoMusical, fotoUrl }: Iartista) => {
  return (
    <div className="artista" style={{ border: '1px solid gray', padding: '1rem', marginBottom: '1rem' }}>
      <img src={fotoUrl} alt={nombre} style={{ width: '150px', height: '150px' }} />
      <h2>{nombre}</h2>
      <p><strong>Género:</strong> {generoMusical}</p>
      <p>{bio}</p>
      <div>
        <strong>Redes Sociales:</strong>
        <ul>
          {redesSociales.facebook && <li>Facebook: {redesSociales.facebook}</li>}
          {redesSociales.instagram && <li>Instagram: {redesSociales.instagram}</li>}
          {redesSociales.twitter && <li>Twitter: {redesSociales.twitter}</li>}
        </ul>
      </div>
    </div>
  );
};
export default Artista;
export type { Iartista }; 
