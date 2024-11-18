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
  return (
    <ul>
      {list.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};
export default App;
