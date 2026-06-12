import { Link, useParams } from 'react-router-dom';
import { getThumbnail } from '../api.js';
import {useEffect, useState , useRef} from 'react';




function findLargestConnectedRegion(px, width, height) {

  // Tracks which pixels have already been visited
  const visited = new Set();

  // Stores the current largest group found
  let largestGroup = null;

  
  //  Converts an x,y position into the correct
  //  location inside the RGBA pixel array.
   
  function getPixelIndex(x, y) {
    return (y * width + x) * 4;
  }

  //   Checks if a pixel is white.

  //   White pixels are considered "active"
  //   and belong to a connected group.
  function isActive(x, y) {
    const i = getPixelIndex(x, y);

    return (
      px[i] === 255 &&
      px[i + 1] === 255 &&
      px[i + 2] === 255
    );
  }

  // Loop through every pixel in the image
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {

      const key = `${x},${y}`;

      // Skip pixels that are already visited
      // or are not active
      if (visited.has(key) || !isActive(x, y)) {
        continue;
      }

      // Stack used for DFS traversal
      const stack = [{ x, y }];

      // Mark starting pixel as visited
      visited.add(key);

      // Track group statistics
      let size = 0;
      let sumX = 0;
      let sumY = 0;

      
        // DFS:
        // Continue exploring until every connected
        // white pixel has been visited.
      
      while (stack.length > 0) {

        const current = stack.pop();

        // Increase group size
        size++;

        // Add coordinates for centroid calculation
        sumX += current.x;
        sumY += current.y;

        // Four-direction movement
        const neighbors = [
          { x: current.x + 1, y: current.y }, // right
          { x: current.x - 1, y: current.y }, // left
          { x: current.x, y: current.y + 1 }, // down
          { x: current.x, y: current.y - 1 }  // up
        ];

        // Check every neighboring pixel
        for (const neighbor of neighbors) {

          const nx = neighbor.x;
          const ny = neighbor.y;

          const neighborKey = `${nx},${ny}`;

          // Ensure neighbor:
          // 1. Is inside image bounds
          // 2. Has not been visited
          // 3. Is a white pixel
          if (
            nx >= 0 &&
            nx < width &&
            ny >= 0 &&
            ny < height &&
            !visited.has(neighborKey) &&
            isActive(nx, ny)
          ) {

            visited.add(neighborKey);

            stack.push({
              x: nx,
              y: ny
            });
          }
        }
      }

      // Calculate centroid of the group
      const group = {
        size,
        centroidX: sumX / size,
        centroidY: sumY / size
      };

      // Save this group if it is larger
      // than any previous group found
      if (
        !largestGroup ||
        group.size > largestGroup.size
      ) {
        largestGroup = group;
      }
    }
  }

  // Return the largest connected region found
  return largestGroup;
}

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
  const [jobId, setJobId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [jobStatus, setJobStatus] = useState(null); // state for the current status of the job
  const [csvUrl, setCsvUrl] = useState(null); // state to store the csv path when the job is finished
  const [jobError, setJobError] = useState(null); // state to store processing errors from endpoints
  const [largestGroupData, setLargestGroupData] = useState(null);


  function hexToRgb(colorString){
    colorString = colorString.replace("#","");

    return {
      red: parseInt(colorString.substring(0,2), 16),
      green: parseInt(colorString.substring(2,4), 16),
      blue: parseInt(colorString.substring(4,6), 16),
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
    // console.log(px);

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
        px[i] = 255;
        px[i +1] = 255;
        px[i+2] =255;
      } else {
        px[i] = 0;
        px[i + 1] = 0;
        px[i + 2] = 0;
      }

    }

    ctx.putImageData(data, 0, 0);
    const largestGroup = findLargestConnectedRegion(
      px,
      canvas.width,
      canvas.height
    );
    
    if (largestGroup) {

      setLargestGroupData(largestGroup)

      ctx.beginPath();
      ctx.arc(
        largestGroup.centroidX,
        largestGroup.centroidY,
        8,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "red";
      ctx.fill();
    }
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

  // poll the backend while a processing job is active
  useEffect(() => {
    // dont start polling until we have a job ID
    if(!jobId) return;

    const id = setInterval(async () => {
      try {
        console.log("polling...")

        const response = await fetch(
          `http://localhost:3000/api/process/${jobId}/status`
        );

        const data = await response.json();

        console.log("Status response:", data);

        // update the current job status
        setJobStatus(data.status);

        // console.log(data);
        // Job finished succesfully
        if (data.status === "done") {
          console.log("Done response:", data);
          setCsvUrl(data.result);
          clearInterval(id);
        }

        // job fails
        if (data.status === "error") {
          setJobError(data.result);
          clearInterval(id);
        }
      } catch (error){
        console.error("Error checking job status", error);
      }
    }, 1500);

    // Cleanup when component unmounts
    return () => clearInterval(id);
  }, [jobId]);

  
  if (loading) {
    return(
      <p>Loading thumbnail...</p>
    )
  }
  if (error) {
    return <p>Could not load thumbnail: {error}</p>
  }

  async function handleProcessVideo() {
    try {
      setSubmitting(true);
      // await new Promise(resolve => setTimeout(resolve, 3000));
      setSubmitError(null);
      const colorWithoutHash = targetColor.replace("#", "");
  
      const response = await fetch(
        `http://localhost:3000/api/process/${filename}?targetColor=${colorWithoutHash}&threshold=${tolerance}`,
        {
          method: "POST"
        }
      );
  
      const data = await response.json();
      // console.log(data);

  
      if (!response.ok) {
        throw new Error(data.error || "Could not start processing job");
      }
  
      setJobId(data.jobID);
      console.log("Job started:", data.jobID);
      setSubmitting(false);

    } catch (error) {
      setSubmitting(false);
      setSubmitError(error.message);
      console.error("Error starting processing job:", error);
    }
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
        {largestGroupData && (
          <div className="mt-4">
            <p>Largest Group Size: {largestGroupData.size}</p>
            <p>Centroid X: {largestGroupData.centroidX.toFixed(2)}</p>
            <p>Centroid Y: {largestGroupData.centroidY.toFixed(2)}</p>
          </div>
        )}
      </div>
      {/* <p>{thumbnail}</p> */}
    </div>
    
<button
onClick={handleProcessVideo}
disabled={submitting}
className=" bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold
  px-6 py-3 rounded-lg shadow-md transition-all duration-200 cursor-pointer mt-4">
{submitting ? "Starting Job" : "Process Video with These Settings"}
</button>

<p>Job ID: {jobId}</p>

{submitError && (
  <p className="text-red-500">
    {submitError}
  </p>
)}

{/* Show the current job status */}
{jobStatus && (
  <div>
    <p>Status: {jobStatus}</p>

    {/* progress indicator */}
    {jobStatus === "processing" && (
      <p className="animate-pulse">
        Processing...
      </p>
    )}
  </div>
)}

{/* Show processing errors */}
{jobError && (
  <p className="text-red-500">
    {jobError}
  </p>
)}

{/* Show csv link when processing is finished */}
{csvUrl && (
  <a 
    href={`http://localhost:3000/results/${csvUrl.split("/").pop()}`}
    target="_blank"
    rel="noreferrer"
    className="text-blue-500 underline block mt-2"
  >
    Download Results CSV
  </a>
)}

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