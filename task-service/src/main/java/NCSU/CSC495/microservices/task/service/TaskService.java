package NCSU.CSC495.microservices.task.service;

import NCSU.CSC495.microservices.task.dto.TaskSummaryDTO;
import NCSU.CSC495.microservices.task.model.Comment;
import NCSU.CSC495.microservices.task.model.Reminder;
import NCSU.CSC495.microservices.task.model.Task;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskService {

    Task createTask(Task task);

    List<Task> getAllTasks();

    Task getTaskById(Long taskId);

    Task updateTask(Long taskId, Task taskDetails);

    void deleteTask(Long taskId);

    List<Task> searchTasks(String keyword, LocalDateTime dueDate, Long id, String priority);

    List<Task> filterTasks(LocalDateTime dueDate, Long id, String priority);

    Comment addComment(Comment comment);

    List<Comment> getCommentsByTaskId(Long taskId);

    Reminder addReminder(Reminder reminder);

    List<Reminder> getRemindersByTaskId(Long taskId);

    void deleteReminder(Long taskId, Long reminderId);

    TaskSummaryDTO getTaskSummary(Long userId);

    List<LocalDateTime> getUpcomingDeadlines(Long userId);

    void deleteAll();
}
