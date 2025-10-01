
import React, { useState } from "react";

function TodoApp() {
  const [task, setTask] = useState("");        // For input field
  const [todos, setTodos] = useState([]);      // For list of tasks

  const addTask = () => {
    if (task.trim() !== "") {
      setTodos([...todos, task]);
      setTask(""); // clear input
    }
  };

  // Remove task by index
  const removeTask = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 text-center p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>

      <div className="flex mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 transition-colors cursor-pointer"        >
          Add
        </button>
      </div>

      <ul className="list-none p-0">
        {todos.map((todo, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 border-b border-gray-200"
          >
            <span>{todo}</span>
            <button
              onClick={() => removeTask(index)}
              className="text-red-500 hover:text-red-700 cursor-pointer"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
