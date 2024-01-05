import Link from "next/link";

const Header = () => {
    return (
        <header>
            <h1 className="mt-12 mb-4 text-center text-3xl italic">
                Dijkstra's Algorithm Visualizer
            </h1>
            <p className="m-1 text-gray-400 text-center text-[14px]">
                A graph visualization tool that can simulate Dijkstra's shortest path algorithm.
            </p>
            <div className="mb-12 text-gray-400 text-center text-[14px]">
                Made by 
                    {<Link href='https://github.com/jansm04' target="_blank">
                        <div className="text-indigo-400 inline"> Jan S. </div>
                    </Link>} 
                in January 2024.
            </div>
            
        </header>
    )
}

export default Header;