import React, { useEffect, useRef, useState } from "react";
import "./App.scss";

import axios from "axios";

function App() {
  const [images, setImages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const loader = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");

  const fetchImages = (page: number) =>
    axios.get(
      `https://api.unsplash.com/photos/?client_id=${process.env.REACT_APP_ACCESS_KEY}&per_page=20&page=${page}`
    );

  const searchImages = (page: number, query: string) =>
    axios.get(
      `https://api.unsplash.com/search/photos/?client_id=${process.env.REACT_APP_ACCESS_KEY}&page=${page}&query=${query}`
    );

  useEffect(() => {
    if (query) {
      searchImages(page, query).then((response: any) => {
        setImages((prevImages) => [...prevImages, ...response.data.results]);
      });
    } else {
      fetchImages(page).then((response) =>
        setImages((prevImages) => [...prevImages, ...response.data])
      );
    }
  }, [page, query]);

  const handleObserver = (entities: any) => {
    const [target] = entities;
    if (target.intersectionRatio > 0) {
      setPage((page) => page + 1);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      treshold: 1,
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setImages([]);
    setPage(1);
    setQuery(inputValue);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Fancy Gallery</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </header>
      <main>
        <div className="image-grid">
          {images.map((image: any) => {
            const { id, alt_description, urls } = image;

            return (
              <div key={id} className="image-item">
                <img src={urls.small} alt={alt_description} />
              </div>
            );
          })}
        </div>
        <div ref={loader}>Loading...</div>
      </main>
    </div>
  );
}

export default App;
