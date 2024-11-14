import React, { useEffect, useState } from 'react';
import {
  getTasks,
  getCategories,
  getUsers,
  createTask,
  updateTask,
  deleteTask,
  shareTask,
  getUserTaskSummary,
  getUser,
  updateCategory,
  getTask
} from '../api';
import AsyncSelect from 'react-select/async';
import '../style/Style.css'; // Assuming you have a CSS file for styling
import Comment from './Comments';
import Reminder from './Reminders';
import { jwtDecode } from 'jwt-decode';

const getUsernameFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token", decoded);
    return decoded.sub; // assuming "sub" holds the username
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};


const Tasks = () => {
  const currentUsername = getUsernameFromToken(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'LOW', owner: '', assignees: [], status: 'PENDING' });
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTaskForComments, setSelectedTaskForComments] = useState(null);
  const [selectedTaskForReminders, setSelectedTaskForReminders] = useState(null);
  const [userTaskSummary, setUserTaskSummary] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser(currentUsername);
        setUser(response.data);
      } catch (error) {
        console.error('There was an error fetching the user!', error);
      }
    };

    if (currentUsername) {
      fetchUser();
    }
  }, [currentUsername]);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
    fetchUsers();
    if (user) {
      setNewTask(prevTask => ({ ...prevTask, owner: user.userId }));
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('There was an error fetching the tasks!', error);
      setTasks([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('There was an error fetching the categories!', error);
      setCategories([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('There was an error fetching the users!', error);
      setUsers([]);
    }
  };

  const loadOptions = async (inputValue) => {
    try {
      const response = await getUsers();
      const filteredUsers = response.data
        .filter(user => user.username.toLowerCase().includes(inputValue.toLowerCase()))
        .map(user => ({ value: user.userId, label: user.username }));
      return filteredUsers;
    } catch (error) {
      console.error('There was an error loading the options!', error);
      return [];
    }
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const handleCreateTask = async () => {
    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        dueDate: isValidDate(newTask.dueDate) ? new Date(newTask.dueDate).toISOString() : null,
        priority: newTask.priority,
        owner: newTask.owner,
        assignees: newTask.assignees.map(assignee => parseInt(assignee, 10)),
        status: newTask.status
      };

      const response = await createTask(taskData);
      setTasks([...tasks, response.data]);

      if (selectedCategory) {
        console.log("Category Selected", selectedCategory);
        await updateCategory(selectedCategory.id, { ...selectedCategory, tasks: [...selectedCategory.tasks, taskData] });
        console.log("Category Updated", selectedCategory);
      }

      // Share the task with all assignees
      for (const assignee of newTask.assignees) {
        const users = (await getUsers()).data;
        console.log('Users:', users);
        const recipient = users.find(user => user.userId === assignee);
        const taskInfo = (await getTask(response.data.id)).data.id;
        if (recipient.enableNotifications) {
          await shareTask({ taskId: response.data.id, recipientId: assignee, recipientEmail: users.find(user => user.userId === assignee)?.email, taskInfo });
        }
      }

      setNewTask({ title: '', description: '', dueDate: '', priority: 'LOW', owner: '', assignees: [], status: 'PENDING' });
    } catch (error) {
      console.error('There was an error creating the task!', error);
    }
  };

  const handleUpdateTask = async () => {
    try {
      const taskData = {
        ...editingTask,
        dueDate: isValidDate(editingTask.dueDate) ? new Date(editingTask.dueDate).toISOString() : null,
        assignees: editingTask.assignees.map(assignee => parseInt(assignee, 10))
      };

      const response = await updateTask(editingTask.id, taskData);
      setTasks(tasks.map(task => (task.id === editingTask.id ? response.data : task)));

      // Update the selected category with the edited task
      if (selectedCategory) {
        console.log("Category Selected", selectedCategory);
        await updateCategory(selectedCategory.id, { ...selectedCategory, tasks: [...selectedCategory.tasks, taskData] });
        console.log("Category Updated", selectedCategory);
      }

      // Share the task with all assignees
      for (const assignee of editingTask.assignees) {
        const users = (await getUsers()).data;
        console.log('Users:', users);
        const recipient = users.find(user => user.userId === assignee);
        const taskInfo = (await getTask(editingTask.id)).data.id;
        if (recipient.enableNotifications) {
          await shareTask({ taskId: editingTask.id, recipientId: assignee, recipientEmail: users.find(user => user.userId === assignee)?.email, taskInfo });
        }
      }

      setEditingTask(null);
    } catch (error) {
      console.error('There was an error updating the task!', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));

      // Remove the task from the selected category
      if (selectedCategory) {
        // Remove task from category logic here
      }
    } catch (error) {
      console.error('There was an error deleting the task!', error);
    }
  };

  const handleViewUserTaskSummary = async (userId) => {
    try {
      const response = await getUserTaskSummary(userId);
      console.log('User Task Summary:', response.data);
      setUserTaskSummary(response.data);
    } catch (error) {
      console.error('There was an error fetching the user task summary!', error);
    }
  };

  // Add this useEffect to log the updated userTaskSummary
  useEffect(() => {
    if (userTaskSummary) {
      console.log('Updated User Task Summary:', userTaskSummary);
    }
  }, [userTaskSummary]);

  return (
    <div className="tasks-container">
      <h2>Tasks</h2>
      <div className="task-inputs">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="New Task Title"
        />
        <input
          type="text"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="New Task Description"
        />
        <input
          type="datetime-local"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          placeholder="Due Date"
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <AsyncSelect
          isMulti
          cacheOptions
          loadOptions={loadOptions}
          onChange={(selectedOptions) => setNewTask({ ...newTask, assignees: selectedOptions.map(option => option.value) })}
          value={newTask.assignees.map(assignee => ({ value: assignee, label: users.find(user => user.userId === assignee)?.username }))}
          placeholder="Select Assignees"
          className="async-select"
        />
        <select
          value={selectedCategory ? selectedCategory.id : ''}
          onChange={(e) => {
            const selectedCat = categories.find(category => category.id === parseInt(e.target.value, 10));
            setSelectedCategory(selectedCat);
          }}
        >
          <option value="">Select Category</option>
          {Array.isArray(categories) && categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button onClick={handleCreateTask}>Create Task</button>
      </div>
      <div className="user-summary">
        <h3>View User Task Summary</h3>
        <AsyncSelect
          cacheOptions
          loadOptions={loadOptions}
          onChange={(selectedOption) => {
            setSelectedUser(selectedOption);
            handleViewUserTaskSummary(selectedOption.value);
          }}
          placeholder="Select User"
          className="async-select"
        />
        {selectedUser && (
          <>
            <h4>Task Summary for {selectedUser.label}</h4>
            <div className="task-summary">
              <p>Total Tasks: {userTaskSummary?.totalTasks ?? 0}</p>
              <p>Pending Tasks: {userTaskSummary?.pendingTasks ?? 0}</p>
              <p>Current Tasks: {userTaskSummary?.currentTasks ?? 0}</p>
              <p>Completed Tasks: {userTaskSummary?.completedTasks ?? 0}</p>
            </div>
          </>
        )}
      </div>
      <ul className="tasks-list">
        {Array.isArray(tasks) && tasks.map(task => (
          <li key={task.id}>
            {task.title} - {task.description} - {task.status}
            <div>
              <button className="edit" onClick={() => setEditingTask(editingTask?.id === task.id ? null : task)}>Edit</button>
              <button className="delete" onClick={() => handleDeleteTask(task.id)}>Delete</button>
              <button className="comments" onClick={() => {
                if (selectedTaskForComments === task.id) {
                  setSelectedTaskForComments(null);
                } else {
                  setSelectedTaskForComments(task.id);
                  setSelectedTaskForReminders(null);
                }
              }}>Comments</button>
              <button className="reminders" onClick={() => {
                if (selectedTaskForReminders === task.id) {
                  setSelectedTaskForReminders(null);
                } else {
                  setSelectedTaskForReminders(task.id);
                  setSelectedTaskForComments(null);
                }
              }}>Reminders</button>
            </div>
            {selectedTaskForComments && (
              <Comment taskId={selectedTaskForComments} username={currentUsername} />
            )}
            {selectedTaskForReminders && (
              <Reminder taskId={selectedTaskForReminders} />
            )}
          </li>
        ))}
      </ul>
      {editingTask && (
        <div className="edit-task-container">
          <h3>Edit Task</h3>
          <input
            type="text"
            value={editingTask.title}
            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
            placeholder="Task Title"
          />
          <input
            type="text"
            value={editingTask.description}
            onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
            placeholder="Task Description"
          />
          <input
            type="datetime-local"
            value={isValidDate(editingTask.dueDate) ? new Date(editingTask.dueDate).toISOString().slice(0, 16) : ''}
            onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
            placeholder="Due Date"
          />
          <select
            value={selectedCategory ? selectedCategory.id : ''}
            onChange={(e) => {
              const selectedCat = categories.find(category => category.id === parseInt(e.target.value, 10));
              setSelectedCategory(selectedCat);
            }}
          >
            <option value="">Select Category</option>
            {Array.isArray(categories) && categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={editingTask.priority}
            onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <select
            value={editingTask.status}
            onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <AsyncSelect
            isMulti
            cacheOptions
            loadOptions={loadOptions}
            onChange={(selectedOptions) => setEditingTask({ ...editingTask, assignees: selectedOptions.map(option => option.value) })}
            value={editingTask.assignees.map(assignee => ({ value: assignee, label: users.find(user => user.userId === assignee)?.username }))}
            placeholder="Select Assignees"
            className="async-select"
          />
          <button onClick={handleUpdateTask}>Update Task</button>
        </div>
      )}
    </div>
  );
};

export default Tasks;