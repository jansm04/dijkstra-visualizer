import Link from "next/link"

const Footer = () => {
    return (
        <footer className="mt-8 p-8 h-fit w-[100%] text-center text-white">
            <div>
                Created by 
                    {<Link href='https://github.com/jansm04' target="_blank">
                        <div className="text-indigo-400 inline"> Jan S. </div>
                    </Link>} 
                in January 2024
            </div>
        </footer>
    )
}

export default Footer