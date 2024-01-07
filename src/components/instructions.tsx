
const Instructions = () => {
    return (
        <div className="mx-8 mt-12 text-gray-400 max-w-[240px] text-[14px]">
            <h1 className="mb-8">Use the canvas to build your graph.</h1>
            <div className="mb-2">
                <p className="float-left text-gray-300 mr-2 font-bold">To add a vertex:</p>
                <p> double-click</p>
            </div>
            <div className="mb-2">
                <p className="float-left text-gray-300 mr-2 font-bold">To add an edge: </p>
                <p>shift+drag from one vertex to another</p>
            </div>
            <div className="mb-2">
                <p className="float-left text-gray-300 mr-2 font-bold">To move a vertex: </p>
                <p>drag it</p>
            </div>
            <div className="mb-2">
                <p className="float-left text-gray-300 mr-2 font-bold">To delete an element: </p>
                <p>press the delete key (fn + delete on mac)</p>
            </div>
            <div className="mb-2 mt-8">
                <p>A vertex label will only accept a unique character from the alphabet.</p>
            </div>
            <div className="mb-2">
                <p>An edge weight will only accept a valid integer.</p>
            </div>
        </div>
    )
}

export default Instructions;