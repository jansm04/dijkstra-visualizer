import Link from "next/link";

const Footer = () => {
    return (
        <div className="mt-6 p-6 text-gray-500 text-center text-[14px]">
            Made by 
                {<Link href='https://github.com/jansm04/dav' target="_blank">
                    <div className="text-sky-700 inline"> @jansm04 </div>
                </Link>} 
            in January 2024
        </div>
    )
}

export default Footer;