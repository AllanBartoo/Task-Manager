import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const addTask = async (taskText) => {
  if (!auth.currentUser) return;
  try {
    await addDoc(collection(db, "tasks"), {
      userId: auth.currentUser.uid, // Assign task to logged-in user
      title: taskText,
      completed: false,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

export const fetchTasks = async () => {
  if (!auth.currentUser) return [];
  const q = query(
    collection(db, "tasks"),
    where("userId", "==", auth.currentUser.uid)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const toggleComplete = async (taskId, currentStatus) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { completed: !currentStatus });
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

export const updateTask = async (taskId, newTitle) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { title: newTitle }); // Update title in Firestore
  } catch (error) {
    console.error("Error updating task:", error);
  }
};
