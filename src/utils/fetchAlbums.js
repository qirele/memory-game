const artists = [
  "jurassic 5",
  "beastie boys",
  "a tribe called quest",
  "ghostface killah",
];

export default function fetchAlbums(setData) {
  const baseURL = `https://ws.audioscrobbler.com/2.0/`;
  const apiKey = `ce5e7f34b1972343c0feaf5829cbe842`;

  let URLS = [];
  artists.forEach((artist) => {
    URLS.push(
      `${baseURL}?method=artist.gettopalbums&artist=${artist}&api_key=${apiKey}&format=json`,
    );
  });

  // https://stackoverflow.com/a/31711496
  Promise.all(URLS.map((u) => fetch(u)))
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then((jsons) => {
      console.log(jsons);
      let albumsArr = [];
      jsons.forEach((json) => {
        const artistName = json.topalbums["@attr"].artist;
        const albums = json.topalbums.album.filter((el, idx) => idx < 3);
        albums.forEach((album) => {
          const obj = {};
          const albumImage = album.image.find((el) => el.size === "extralarge")[
            "#text"
          ];
          obj.albumName = album.name;
          obj.albumImage = albumImage;
          obj.artist = artistName;
          albumsArr.push(obj);
        });
      });
      setData(albumsArr);
      localStorage.setItem("albums", JSON.stringify(albumsArr));
    });
}
