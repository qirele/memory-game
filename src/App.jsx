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
    if (!isDataFetched) {
      fetchAlbums(setData);
      console.log("Fetching items");
    } else {
      console.log("Already fetched");
    }
  }, [isDataFetched]);

  return (
    <>
      <div className="welcome">
        <h1>Memory game</h1>
        <p>Score points by remembering which albums you&apos;ve already clicked</p>
      </div>
      {
        isDataFetched && (
          <Albums albums={data} />
        )
      }
    </>
  );
}
