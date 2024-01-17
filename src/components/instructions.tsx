const Instructions = () => {
    return (
        <div className="mx-8 text-gray-500 w-[200px] text-[13px]">
            <h1 className="mb-4">Use the canvas to build your graph.</h1>
            <div className="mb-2">
                <p className="float-left text-gray-700 mr-2 font-bold">To add a vertex:</p>
                <p> double-click, then add a label by typing a unique 
                    <span className="italic"> alphabetic character </span>
                </p>
            </div>
            <div className="mb-2">
                <p className="float-left text-gray-700 mr-2 font-bold">To add an edge: </p>
                <p>shift+drag from one vertex to another, then add a weight by typing a
                    <span className="italic"> number</span>
                </p>
            </div>
            <div className="mb-2">
                <p className="float-left text-gray-700 mr-2 font-bold">To move a vertex: </p>
                <p>drag it</p>
            </div>
            <div className="mb-2">
                <p className="float-left text-gray-700 mr-2 font-bold">To edit an element: </p>
                <p>click it</p>
            </div>
            <div className="mb-8">
                <p className="float-left text-gray-700 mr-2 font-bold">To delete an element: </p>
                <p>press the 
                    <span className="italic"> delete </span>
                     key (fn + delete on mac)</p>
            </div>
        </div>
    )
}

export default Instructions;