import './App.css';
import Timetable from './components/Timetable';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Hello!
      </header>
      <Timetable stopId="HSL:1030701" date="20210612"/>
      <Timetable stopId="HSL:1030701" date="20210615"/>
    </div>
  );
}

export default App;
