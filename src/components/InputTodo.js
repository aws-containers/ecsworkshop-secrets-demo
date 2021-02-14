import React, { Fragment, useState } from 'react';

const InputTodo = () => {

    const [description, setDescription] = useState("");

    const onSubmitForm = async (e) => {
        e.preventDefault();
        if (description === "") {
            alert("Please enter a value.")
        } else {
            try {
                const body = { description };
                console.log(body);
                await fetch(`/todos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                window.location.href = "/";
                //console.log(response);
            } catch (error) {
                console.error(error.message)
            }
        }

    };

    return (
        <Fragment>
            <h1 className="text-center mt-5">Todo List Example</h1>
            <form className="d-flex mt-5" onSubmit={onSubmitForm}>
                <input type="text" className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
                <button className="btn btn-success">Add</button>
            </form>
        </Fragment>
    )
};

export default InputTodo;
