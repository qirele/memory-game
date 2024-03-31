import { useState } from 'react';
import Album from './Album.jsx';

export default function Albums({ albums }) {
  const [highestScore, setHighestScore] = useState(0);
  const [previousAlbums, setPreviousAlbums] = useState([]);
  const [reorderedAlbums, setReorderedAlbums] = useState(albums);

  const currentScore = previousAlbums.length;

  const handleClick = (e) => {
    const currentId = e.currentTarget.id
    const albumAlreadyClicked = previousAlbums.findIndex(el => el === currentId) !== -1;
    setReorderedAlbums(() => {
      let clonedArray = JSON.parse(JSON.stringify(albums))
      for (let i = clonedArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [clonedArray[i], clonedArray[j]] = [clonedArray[j], clonedArray[i]];
      }
      return clonedArray;
    });

    if (albumAlreadyClicked) {
      if (currentScore > highestScore) {
        setHighestScore(currentScore);
      }
      setPreviousAlbums([]);
    } else {
      if ((currentScore + 1) >= highestScore) {
        setHighestScore(currentScore + 1);
      }
      setPreviousAlbums([...previousAlbums, currentId])
    }
  }

  return (
    <>
      <div className="score">
        <p>Score: {currentScore}</p>
        <p>Highest score: {highestScore}</p>

        {currentScore === 12 &&
          <p className="congrats">
            Congratulations, you won the memory game
          </p>
        }
      </div>

      <div className="albums">

        {
          reorderedAlbums.map(album =>
            <Album
              key={album.artist + album.albumName}
              album={album}
              onClick={handleClick}
            />
          )
        }
      </div>
    </>
  )
}
