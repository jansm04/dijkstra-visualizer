import { RefObject } from "react"

const PriorityQueue = ({
    pqRef
} : {
    pqRef: RefObject<HTMLTableElement>
}) => {
    return (
        <div className="w-[200px] mx-8">
            <h1 className="mb-2 text-gray-700 text-[15px] text-center font-bold">Priority Queue</h1>
            <table ref={pqRef} className="w-full">
                <tbody>
                    <tr className="h-[30px] text-[14px]">
                        <th className="border border-[gray]">Vertex</th>
                        <th className="border border-[gray]">Distance</th>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default PriorityQueue;