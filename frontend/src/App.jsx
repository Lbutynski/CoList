import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
const App = () => {
  const [list, setList] = useState([]);
  const socket = useRef(null);
  useEffect(() => {
    socket.current = io("http://localhost:3001", { withCredentials: true });
    socket.current.on("updateList", (updatedList) => {
      setList(updatedList);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);
  const inputText = useRef("");
  const handleAdd = () => {
    socket.current.emit("addItem", inputText.current.value);
    inputText.current.value = "";
  };
  const handleDelete = (index) => {
    socket.current.emit("removeItem", index);
  };
  const handleChange = (index, change) => {
    socket.current.emit("changeItem", index, change);
  };
  return (
    <>
      <ul>
        {list.map((item, index) => (
          <li key={index}>
            <input
              type="text"
              value={item}
              onChange={(e) => handleChange(index, e.target.value)}
            />
            <button onClick={() => handleDelete(index)}>delete</button>
          </li>
        ))}
      </ul>
      <input ref={inputText}></input>
      <button onClick={handleAdd}>Add Item</button>
    </>
  );
};
export default App;
