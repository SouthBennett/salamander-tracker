import { Link, useParams } from 'react-router-dom';
import { getThumbnail } from '../mockApi.js';
import {useEffect, useState , useRef} from 'react';

export default function Preview() {
  const { filename } = useParams();

  const [thumbnail, setThumbnail] = useState("");
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [imageReady, setImageReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetColor, setTargetColor] = useState("#ff0000");
  const [tolerance, setTolerance] = useState(75);

  function hexToRgb(colorString){
    colorString = colorString.replace("#","");

    return {
      red: parseInt(colorString.substring(0,2), 16),
      blue: parseInt(colorString.substring(2,4), 16),
      green: parseInt(colorString.substring(4,6), 16),
    }
  }

  useEffect(() => {
    if(!thumbnail) return;
    setImageReady(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      setImageReady(true);
    };
    img.src = thumbnail;

  },[thumbnail]);

  useEffect(() => {
    console.log("rewdrawing");
    if (!imageReady) return;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = data.data;

    for (let i = 0; i < px.length; i += 4) {
      // px[i]     = red channel of this pixel (0-255)
      // px[i + 1] = green channel
      // px[i + 2] = blue channel
      // px[i + 3] = alpha (transparency, usually leave alone)
    
      const target = hexToRgb(targetColor);
      // console.log(target);


      const red = px[i];
      const green = px[i + 1];
      const blue = px[i + 2];

      const distance = Math.sqrt(
        Math.pow(red - target.red, 2) + Math.pow(green - target.green, 2) + Math.pow(blue - target.blue, 2)
      );

      if(distance <= Number(tolerance)){
        px[1] = 255;
        px[i +1] = 255;
        px[i+2] =255;
      } else {
        px[i] = 0;
        px[i + 1] = 0;
        px[i + 2] = 0;
      }

    }

    ctx.putImageData(data, 0, 0);
  }, [imageReady, targetColor, tolerance]);

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

      {/* <p className="text-zinc-300">
        Thumbnail and tuning controls will go here in a future
        pair program.
      </p> */}

      <div className="flex items-center gap-6 mt-6">

        <div className="flex items-center gap-2">
          <div>
            <label>Target Color</label>
            
            <input 
              type="color" 
              value={targetColor}
              onChange={(e) => {
                console.log(e.target.value);
                setTargetColor(e.target.value);
              }}
            />
            <span>{targetColor}</span>
          </div>
          
          <div>
            <label>Tolerance</label>

            <input 
              type="range" 
              min="0"
              max="255"
              value={tolerance}
              onChange={(e) => {
                console.log(e.target.value)
                setTolerance(Number(e.target.value))}}
            />
            <span>{tolerance}</span>
          </div>
        </div>
         
      </div>

      <div className='flex row gap-2' >
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
        <canvas ref={canvasRef} className=' border 1px solid mt-6 rounded-xl' />
      </div>
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