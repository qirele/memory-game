export default function Album({ album, onClick }) {
  return (
    <div className="album" id={album.albumName.replace(/\s/g, '')} onClick={onClick}>
      <div className="albumName">
        <h1> {album.albumName} </h1>
      </div>
      <div className="albumArtist">
        <h1> {album.artist} </h1>
      </div>
      <div className="albumImage">
        <img src={album.albumImage} alt="" />
      </div>
    </div>
  )
}
