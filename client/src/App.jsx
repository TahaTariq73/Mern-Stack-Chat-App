import { Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';
import Form from './components/authentication/Form';
import Panel from './components/Panel';
import './App.css';

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/chats" element={<Panel />} />
      </Routes>
    </Fragment>
  )
}

export default App;