import { useEffect, useState } from "react";
import './App.css';

const artists = ["mos def", "jurassic 5", "beastie boys", "artifacts", "dr octagon", "a tribe called quest"];

export default function App() {
  const [data, setData] = useState(() => {
    const albums = localStorage.getItem("albums");
    const initialValue = JSON.parse(albums);
    return initialValue || "";
  });

  const isDataFetched = typeof data === "object";

  useEffect(() => {
    if (isDataFetched) {
      console.log("Already fetched all albums");
      return;
    }

    const baseURL = `http://ws.audioscrobbler.com/2.0/`;
    const apiKey = `ce5e7f34b1972343c0feaf5829cbe842`;

    let URLS = [];
    artists.forEach(artist => {
      URLS.push(`${baseURL}?method=artist.gettopalbums&artist=${artist}&api_key=${apiKey}&format=json`);
    });

    // https://stackoverflow.com/a/31711496
    Promise.all(URLS.map(u => fetch(u))).then(responses =>
      Promise.all(responses.map(res => res.json()))
    ).then(jsons => {
      console.log(jsons);
      let albumsArr = [];
      jsons.forEach(json => {
        const artistName = json.topalbums["@attr"].artist;
        const albums = json.topalbums.album.filter((el, idx) => idx < 2);
        albums.forEach(album => {
          const obj = {};
          const albumImage = album.image.find(el => el.size === "extralarge")["#text"];
          obj.albumName = album.name;
          obj.albumImage = albumImage;
          obj.artist = artistName;
          albumsArr.push(obj);
        });
      });
      setData(albumsArr);
      localStorage.setItem("albums", JSON.stringify(albumsArr));
    });
  }, [isDataFetched]);

  return (
    <div className="albums">
      {
        isDataFetched &&
        (
          data.map(album =>
            <div className="album" key={album.artist + album.albumName}>
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
        )
      }
    </div>
  );
}
