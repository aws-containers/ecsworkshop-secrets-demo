import React, { Fragment } from 'react';

import InputTodo from "./components/InputTodo";
import ListTodos from "./components/ListTodos";

function App() {
  return (
    <Fragment>
      <div className="container">
        <InputTodo />
        <ListTodos />
        <table>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>HOST</td>
                        <td>{process.env.POSTGRES_HOST}</td>
                    </tr>
                    <tr>
                        <td>PASS</td>
                        <td>{process.env.POSTGRES_PASS}</td>
                    </tr>
                    <tr>
                        <td>USER</td>
                        <td>{process.env.POSTGRES_USER}</td>
                    </tr>
                    <tr>
                        <td>NAME</td>
                        <td>{process.env.POSTGRES_NAME}</td>
                    </tr>
                    <tr>
                        <td>PORT</td>
                        <td>{process.env.POSTGRES_PORT}</td>
                    </tr>
                    <tr>
                        <td>GITHUB_TOKEN</td>
                        <td>{process.env.GITHUB_TOKEN}</td>
                    </tr>
                </tbody>
            </table>
      </div>
    </Fragment>
  )
};

export default App;
