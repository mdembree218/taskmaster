import React, { useEffect, useState } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTasks,
  getCategoryProgress
} from '../api';
import '../style/Style.css'; // Assuming you have a CSS file for styling

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProgress, setCategoryProgress] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []); // Ensure response.data is an array
    } catch (error) {
      console.error('There was an error fetching the categories!', error);
    }
  };

  const fetchTasksByCategory = async (id) => {
    try {
      const response = await getCategoryTasks(id);
      console.log('Fetched tasks response:', response.data); // Debugging log
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
      }
      setSelectedCategory({ id, view: 'tasks' });
    } catch (error) {
      console.error('There was an error fetching the tasks!', error);
    }
  };

  const handleCreateCategory = async () => {
    try {
      const response = await createCategory({ name: newCategoryName });
      setCategories([...categories, response.data]);
      setNewCategoryName('');
    } catch (error) {
      console.error('There was an error creating the category!', error);
    }
  };

  const handleUpdateCategory = async (id, newName, tasks) => {
    try {
      const response = await updateCategory(id, { name: newName }, {tasks: tasks});
      setCategories(categories.map(cat => (cat.id === id ? response.data : cat)));
    } catch (error) {
      console.error('There was an error updating the category!', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('There was an error deleting the category!', error);
    }
  };

  const handleGetCategoryProgress = async (id) => {
    try {
      const response = await getCategoryProgress(id);
      console.log('Category progress:', response.data); // Debugging log
      setCategoryProgress(response.data);
      setSelectedCategory({ id, view: 'progress' });
    }
    catch (error) {
      console.error('There was an error fetching the category progress!', error);
    }
  }

  return (
    <div className="categories-container">
      <h2>Categories</h2>
      <div className="new-category">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New Category Name"
        />
        <button onClick={handleCreateCategory}>Create Category</button>
      </div>
      <ul className="categories-list">
        {Array.isArray(categories) && categories.map(category => (
          <li key={category.id} className="category-item">
            <span className="category-name">{category.name}</span>
            <div className="category-actions">
              <button className="category-action-button" onClick={() => toggleCategoryView(category.id, 'tasks')}>View Tasks</button>
              <button className="category-action-button" onClick={() => toggleCategoryView(category.id, 'progress')}>View Progress</button>
              <button className="category-action-button" onClick={() => handleUpdateCategory(category.id, prompt('New name:', category.name), category.tasks)}>Edit</button>
              <button className="category-action-button" onClick={() => handleDeleteCategory(category.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {selectedCategory && selectedCategory.view === 'tasks' && (
        <div className="tasks-container">
          <h3>Tasks for Category {categories.find(cat => cat.id === selectedCategory.id)?.name}</h3>
          <ul className="tasks-list">
            {tasks.map(task => (
              <li key={task.id} className="task-item">{task.title}</li>
            ))}
          </ul>
        </div>
      )}
      {selectedCategory && selectedCategory.view === 'progress' && categoryProgress && (
        <div className="tasks-container">
          <h3>Category Progress</h3>
          <div className="task-summary">
            <p>Total Tasks: {categoryProgress.totalTasks}</p>
            <p>Pending Tasks: {categoryProgress.pendingTasks}</p>
            <p>Current Tasks: {categoryProgress.currentTasks}</p>
            <p>Completed Tasks: {categoryProgress.completedTasks}</p>
            <p>Completion Rate: {categoryProgress.completionRate}%</p>
          </div>
        </div>
      )}
    </div>
  );

  function toggleCategoryView(categoryId, view) {
    if (selectedCategory && selectedCategory.id === categoryId && selectedCategory.view === view) {
      setSelectedCategory(null);
    } else {
      if (view === 'tasks') {
        fetchTasksByCategory(categoryId);
      } else if (view === 'progress') {
        handleGetCategoryProgress(categoryId);
      }
    }
  }
};

export default Categories;