import { useEffect, useState } from 'react';
import { getVideos } from '../mockApi.js';
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
        
            <div>
                <h1>Available videos</h1>
                    <ul>
                        {videos.map((filename) => (
                            <li key={filename}>
                                <Link to={`/preview/${filename}`}>{filename}</Link>
                                </li>
                        ))}
                    </ul>
            </div>
       
    );
}