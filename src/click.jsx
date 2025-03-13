import React, { useState } from "react";

const Example = () => {  // This is a functional component named Example
    // useState 採用 0 為初始值
    const [count, setCount] = useState(0);  // This is the state variable that will store the count

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    );
};
export default Example;
