import { useEffect } from 'react';
import { getVideos } from '../mockApi.js';

export default function Video(){

    useEffect(() => {
    getVideos().then((data) => {
      console.log("getVideos returned:", data);
    });
  }, []);

    return(
        <div>
            <h1>Available videos</h1>
            <p>Video list will go here.</p>
        </div>
    );
}