import './assets/styles/App.css';
import { UserStatements } from "./components/UserStatements";

function App() {
  return (
    <section className="app-container">
      <div className="chat-box-container">
          <UserStatements />
      </div>
    </section>
  );
}

export default App;
