import { useState, useEffect } from "react";
import "./App.css";
import Auth from "./components/Auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [moviesList, setMoviesList] = useState([]);

  // NEW MOVIE STATUS

  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setnewReleaseDate] = useState(0);
  const [newMovieOscar, setnewMovieOscar] = useState(false);

  // UPDATED TITLE

  const [updatedTitle, setUpdatedTitle] = useState("");

  // File
  const [fileUploaded, setFileUploaded] = useState(null);

  const movieCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    // READ DATA
    // SET THE MOVIELIST
    // here used function async because of useEffect is asynchronous that y used
    try {
      const data = await getDocs(movieCollectionRef);
      const filteredDate = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // console.log(filteredDate);
      setMoviesList(filteredDate);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
  };

  const uploadFile = async () => {
    if (!fileUploaded) return;
    const filesFolderRef = ref(storage, `projectfiles/${fileUploaded.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUploaded);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
  });

  const onSubmitMovie = async () => {
    try {
      await addDoc(movieCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: newMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <Auth />

      <div>
        <input
          placeholder="Movit title..."
          onChange={(e) => setNewMovieTitle(e.target.value)}
          value={newMovieTitle}
        />
        <input
          placeholder="Release Date..."
          type="number"
          onChange={(e) => setnewReleaseDate(Number(e.target.value))}
          value={newReleaseDate}
        />
        <input
          type="checkbox"
          id="oscar"
          onChange={(e) => setnewMovieOscar(e.target.checked)}
          value={newMovieOscar}
        />
        <label htmlFor="oscar">Received An Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>
      <br />
      <div>
        {moviesList.map((movie) => (
          <div key={movie.id}>
            <h1
              style={{
                color: movie.receivedAnOscar ? "green" : "red",
              }}
            >
              Movie: {movie.title}
            </h1>
            <h3>Release Date: {movie.releaseDate}</h3>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
            <input
              placeholder="new title..."
              onChange={(e) => setUpdatedTitle(e.target.value)}
              // value={updatedTitle}
            />
            <button onClick={() => updateMovieTitle(movie.id)}>
              Update Title
            </button>
          </div>
        ))}
      </div>
      <div>
        <input
          type="file"
          onChange={(e) => setFileUploaded(e.target.files[0])}
        />
        <button onClick={() => uploadFile()}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
