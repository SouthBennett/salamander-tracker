import { useEffect, useState } from 'react';
import { getVideos } from '../api.js';
import { Link } from 'react-router-dom';

export default function Video(){
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    getVideos().then((data) => {
      setVideos(data);
      setLoading(false);
      
    })
        .catch((err) => {
        setError(err.message);
        setLoading(false);
    });
  }, []);

    if(loading){
        return(
            <p>Loading videos...</p>
        )

    }
    if (error) {
         return <p>Could not load videos: {error}</p>;
    }
    return(
        
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">
                    Available videos
                </h1>
                    <ul className="space-y-4">
                        {videos.map((filename) => (
                            <li key={filename}>
                                <Link 
                                    to={`/preview/${filename}`}
                                    className="
                                    block
                                    bg-zinc-800
                                    hover:bg-zinc-700
                                    p-4
                                    rounded-xl
                                    transition-colors
                                    "
                                >
                                    {filename}
                                </Link>
                            </li>
                        ))}
                    </ul>
            </div>
       
    );
}