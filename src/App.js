import React, { Fragment } from 'react';
import InputTodo from "./components/InputTodo";
import ListTodos from "./components/ListTodos";
import ShowEnvironment from "./components/ShowEnvironment";

function App() {
  return (
    <Fragment>
      <div className="container">
        <InputTodo />
        <ListTodos />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ShowEnvironment />
        </div>
      </div>
    </Fragment>
  )
};

export default App;
