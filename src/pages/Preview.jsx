import { Link, useParams } from 'react-router-dom';
import { getThumbnail } from '../mockApi.js';
import {useEffect, useState } from 'react';

export default function Preview() {
  const { filename } = useParams();

  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getThumbnail(filename)
      .then((url) => {
        setThumbnail(url);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [filename])

  if (loading) {
    return(
      <p>Loading thumbnail...</p>
    )
  }
  if (error) {
    return <p>Could not load thumbnail: {error}</p>
  }

  return (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold mb-2">
        Preview: {filename}
      </h1>

      <p className="text-zinc-300">
        Thumbnail and tuning controls will go here in a future
        pair program.
      </p>

      <img 
        src={thumbnail} 
        alt={filename}
        className="
          mt-6
          rounded-xl
          border
          border-zinc-700
        "
      />
      <p>{thumbnail}</p>
    </div>

    <Link
      to="/videos"
      className="
        inline-block
        bg-blue-600
        hover:bg-blue-500
        px-4
        py-2
        rounded-lg
        transition-colors
      "
    >
      Back to Videos
    </Link>
  </div>
);
}