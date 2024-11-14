import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  getTask,
  getUsers,
  getTaskReminders,
  setTaskReminder,
  deleteTaskReminder,
  shareTask // Assuming you have an API function to share the task
} from '../api';
import '../style/Style.css'; // Assuming you have a CSS file for styling

const Reminder = ({ taskId }) => {
  const [reminders, setReminders] = useState([]);
  const [newReminderTime, setNewReminderTime] = useState('');

  const remindersRef = useRef(reminders);
  useEffect(() => {
    remindersRef.current = reminders;
  }, [reminders]);

  const fetchReminders = useCallback(async () => {
    try {
      const response = await getTaskReminders(taskId);
      setReminders(response.data || []);
    } catch (error) {
      console.error('There was an error fetching the reminders!', error);
    }
  }, [taskId]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleDeleteReminder = useCallback(async (reminderId) => {
    try {
      await deleteTaskReminder(taskId, reminderId);
      setReminders(reminders.filter(reminder => reminder.id !== reminderId));
    } catch (error) {
      console.error('There was an error deleting the reminder!', error);
    }
  }, [taskId, reminders]);

  useEffect(() => {
    console.log('Setting up interval to check reminders');
    const interval = setInterval(() => {
      const now = new Date();
      console.log('Checking reminders:', remindersRef.current);
      remindersRef.current.forEach(async (reminder) => {
        const reminderDate = new Date(reminder.reminderTime);
      if (reminderDate <= now) {
        const task = (await getTask(taskId)).data;
        console.log('Reminder triggered for task:', task);

        for (const assignee of task.assignees) {
          const users = (await getUsers()).data;
          console.log('Users:', users);
          const recipient = users.find(user => user.userId === assignee);
          if (recipient.enableNotifications) {
            handleShareTask(taskId, assignee, recipient.email);
          }
        }
        // Optionally, you can delete the reminder after sharing the task
        handleDeleteReminder(reminder.id);
      }
    });
  }, 10000); // Check every minute

  return () => clearInterval(interval);
}, [reminders, taskId, handleDeleteReminder]);

const handleShareTask = async (taskId, recipientId, recipientEmail) => {
  try {
    const taskInfo = (await getTask(taskId)).data.id;
    const shareTaskDTO = {
      taskId,
      recipientId,
      recipientEmail,
      taskInfo
    };
    await shareTask(shareTaskDTO);
    alert('Task shared successfully');
  } catch (error) {
    console.error('Error sharing task:', error);
    alert('Failed to share task');
  }
};

const handleCreateReminder = async () => {
  try {
    const reminderDate = new Date(newReminderTime);
    const reminderToCreate = {
      reminderTime: [
        reminderDate.getFullYear(),
        reminderDate.getMonth() + 1, // Months are zero-based in JavaScript
        reminderDate.getDate(),
        reminderDate.getHours(),
        reminderDate.getMinutes(),
        reminderDate.getSeconds(),
        reminderDate.getMilliseconds() * 1000 // Convert milliseconds to nanoseconds
      ],
      taskId
    };
    const response = await setTaskReminder(taskId, reminderToCreate);
    setReminders([...reminders, response.data]);
    setNewReminderTime('');
  } catch (error) {
    console.error('There was an error creating the reminder!', error);
  }
};

return (
  <div className="reminder-container">
    <h2>Reminders</h2>
    <div className="new-reminder">
      <label htmlFor="new-reminder-time">New Reminder Time</label>
      <input
        id="new-reminder-time"
        type="datetime-local"
        value={newReminderTime}
        onChange={(e) => setNewReminderTime(e.target.value)}
        placeholder="New Reminder Time"
      />
      <button onClick={handleCreateReminder}>Create Reminder</button>
    </div>
    <ul className="reminders-list">
      {reminders.map((reminder, index) => (
        <li key={`${reminder.id}-${index}`} className="reminder-item">
          <span className="reminder-time">
            {(
              new Date(reminder.reminderTime).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              })
            )}
          </span>
          <button className="reminder-action-button" onClick={() => handleDeleteReminder(reminder.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
);
};

export default Reminder;