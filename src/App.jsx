import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import {
  addTask,
  fetchTasks,
  updateTask,
  deleteTask,
} from "./components/tasks";

function App() {
  const [user, setUser] = useState(null);
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const userTasks = await fetchTasks();
        setTasks(userTasks);
      }
    });
  }, []);

  const handleSignIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Error logging in:", error.message);
    }
  };

  const handleSignUp = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Error signing up:", error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setTasks([]);
  };

  const handleAddTask = async () => {
    if (!taskText.trim()) return;
    await addTask(taskText);
    setTaskText("");
    setTasks(await fetchTasks());
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleEditTask = async (taskId) => {
    if (!editedTitle.trim()) return;
    await updateTask(taskId, editedTitle);
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, title: editedTitle } : task
      )
    ); 
    setEditingTaskId(null); 
  };

  const toggleComplete = async (taskId, currentStatus) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { completed: !currentStatus }); 
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        )
      ); 
    } catch (error) {
      console.error("Error updating completion status:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Task Manager 📝</h1>

      {!user ? (
        <div className="p-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded w-full mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded w-full mb-2"
          />
          <button
            onClick={() => handleSignUp(email, password)}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Sign Up
          </button>

          <button
            onClick={() => handleSignIn(email, password)} 
            className="bg-green-500 text-white px-4 py-2 rounded w-full mt-2"
          >
            Log In
          </button>
        </div>
      ) : (
        <>
          <p>Welcome, {user.email} 👋</p>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          >
            Sign Out
          </button>

          <div className="mb-4">
            <input
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Add a new task..."
              className="border p-2 w-full"
            />
            <button
              onClick={handleAddTask}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2 w-full"
            >
              ➕ Add Task
            </button>
          </div>

          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center bg-gray-100 p-2 my-2"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id, task.completed)}
                  className="mr-2 cursor-pointer"
                />

                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={() => handleEditTask(task.id)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleEditTask(task.id)
                    } // Save on Enter key
                    className="border p-1 w-full"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setEditedTitle(task.title);
                    }}
                    className={`cursor-pointer ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.title}
                  </span>
                )}

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 px-2"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
