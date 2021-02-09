import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

function App() {
  return (
    <div className="App">
      <FontAwesomeIcon icon={faHome} />
      React komponenta
    </div>
  );
}

export default App;
