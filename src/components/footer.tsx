import Link from "next/link";

const Footer = () => {
    return (
        <div className="mt-6 p-6 text-gray-500 text-center text-[13px]">
            Made by {
                <Link href="https://www.janbegovic.com/" target="_blank">
                    <div className="text-sky-600 inline"> Jan Smailbegovic </div>
                </Link>
            } in 2024&nbsp; •&nbsp; 
            {<Link href='https://github.com/jansm04/dav' target="_blank">
                <div className="text-sky-600 inline"> GitHub </div>
            </Link>}
        </div>
    )
}

export default Footer;