import "./App.css";
import { Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import Room from "./Pages/room/Room";
function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Chatpage} />
      <Route path="/room/:roomId" component={Room} />
    </div>
  );
}

export default App;
