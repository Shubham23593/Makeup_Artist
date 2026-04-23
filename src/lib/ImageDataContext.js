"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const ImageDataContext = createContext({
  images: [],
  loading: true,
});

export function ImageDataProvider({ children }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchImages() {
      try {
        const res = await fetch("/api/images");
        const data = await res.json();
        if (!cancelled && data.success && data.images) {
          setImages(data.images);
        }
      } catch (err) {
        // Silently fail — components use fallback data
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchImages();
    return () => { cancelled = true; };
  }, []);

  return (
    <ImageDataContext.Provider value={{ images, loading }}>
      {children}
    </ImageDataContext.Provider>
  );
}

export function useImageData() {
  return useContext(ImageDataContext);
}
