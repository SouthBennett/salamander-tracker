export default function Home(){
    return(
        <div className="flex flex-col items-center text-center mt-20">
            <h1 className="text-5xl font-bold text-blue-500 mb-4">
                Salamander Tracker
            </h1>

            <p className="text-zinc-300 text-lg max-w-xl">
                Pick a video from the Videos page to start analyzing salamander detection footage.
            </p>
        </div>
    )
}