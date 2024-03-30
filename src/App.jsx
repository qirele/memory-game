import { useEffect, useState } from "react";
import fetchAlbums from './utils/fetchAlbums.js';
import './App.css';
import Albums from "./components/Albums.jsx";

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

    fetchAlbums(setData);

  }, [isDataFetched]);

  return (
    <>
      {
        isDataFetched && (
          <Albums albums={data} />
        )
      }
    </>
  );
}
