import { useEffect, useState } from "react";

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
          const albumImage = album.image.find(el => el.size === "large")["#text"];
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
    <div>
      {
        isDataFetched &&
        (
          data.map(album =>
            <div key={album.artist + album.albumName}>
              <div>
                <img src={album.albumImage} alt="" />
              </div>
              <div>
                <p>{album.albumName}</p>
                <p>{album.artist}</p>
              </div>

            </div>
          )
        )
      }
    </div>
  );
}


/*

  // http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=Cher&api_key=YOUR_API_KEY&format=json
  // /2.0/?method=artist.gettopalbums&artist=cher&api_key=YOUR_API_KEY&format=json 
  useEffect(() => {
    if (typeof data === "object") return;
    const baseURL = `http://ws.audioscrobbler.com/2.0/`;
    const apiKey = `ce5e7f34b1972343c0feaf5829cbe842`;

    let albumsArr = [];
    for (let i = 0; i < artists.length; i++) {
      let URL = `${baseURL}?method=artist.gettopalbums&artist=${artists[i]}&api_key=${apiKey}&format=json`;
      fetchData(URL).then(json => {
        const obj = {};
        obj.artist = json.topalbums["@attr"].artist;
        obj.albums = json.topalbums.album.filter((el, idx) => idx < 2)
          .map(album => {
            const albumImage = album.image.find(el => el.size === "large")["#text"];
            return { name: album.name, image: albumImage }
          });
        albumsArr.push(obj);
        console.log(obj);
      });
    }

    async function fetchData(url) {
      const response = await fetch(url);
      const json = await response.json();
      return json;
    }

    setData(albumsArr);
    localStorage.setItem("albums", JSON.stringify(albumsArr));

  }, [data]);


  */
