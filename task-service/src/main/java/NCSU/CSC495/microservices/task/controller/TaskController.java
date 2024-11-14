package NCSU.CSC495.microservices.task.controller;

import NCSU.CSC495.microservices.task.dto.TaskSummaryDTO;
import NCSU.CSC495.microservices.task.exception.ResourceNotFoundException;
import NCSU.CSC495.microservices.task.model.Comment;
import NCSU.CSC495.microservices.task.model.Reminder;
import NCSU.CSC495.microservices.task.model.Task;
import NCSU.CSC495.microservices.task.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // 1. GET /tasks
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    // 2. POST /tasks
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        try {
            Task createdTask = taskService.createTask(task);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating task: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        try {
            Task task = taskService.getTaskById(id);
            if (task == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
            }
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving task: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        try {
            Task updatedTask = taskService.updateTask(id, taskDetails);
            return ResponseEntity.ok(updatedTask);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating task: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting task: " + e.getMessage());
        }
    }

    // 6. POST /tasks/{taskId}/reminders
    @PostMapping("/{taskId}/reminders")
    public ResponseEntity<Void> addReminder(@PathVariable Long taskId, @RequestBody Reminder reminder) {
        try {
            reminder.setTaskId(taskId); // Ensure the reminder is associated with the correct task
            taskService.addReminder(reminder);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 7. GET /tasks/{taskId}/reminders
    @GetMapping("/{taskId}/reminders")
    public ResponseEntity<List<Reminder>> getReminders(@PathVariable Long taskId) {
        try {
            List<Reminder> reminders = taskService.getRemindersByTaskId(taskId);
            return ResponseEntity.ok(reminders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 8. DELETE /tasks/{taskId}/reminders/{reminderId}
    @DeleteMapping("/{taskId}/reminders/{reminderId}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long taskId, @PathVariable Long reminderId) {
        try {
            taskService.deleteReminder(taskId, reminderId);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{taskId}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long taskId, @RequestBody Comment comment) {
        try {
            comment.setTaskId(taskId); // Ensure the comment is associated with the correct task
            Comment createdComment = taskService.addComment(comment);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding comment: " + e.getMessage());
        }
    }

    // 11. GET /tasks/{taskId}/comments
    @GetMapping("/{taskId}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long taskId) {
        try {
            List<Comment> comments = taskService.getCommentsByTaskId(taskId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 15. GET /tasks/search
    @GetMapping("/search")
    public ResponseEntity<List<Task>> searchTasks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String dueDate,
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String priority) {
        try {
            // Parse dueDate to LocalDateTime if provided
            LocalDateTime parsedDueDate = (dueDate != null) ? LocalDateTime.parse(dueDate) : null;
            List<Task> tasks = taskService.searchTasks(keyword, parsedDueDate, id, priority);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 16. GET /tasks/filter
    @GetMapping("/filter")
    public ResponseEntity<List<Task>> filterTasks(
            @RequestParam(required = false) String dueDate,
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String priority) {
        try {
            // Parse dueDate to LocalDateTime if provided
            LocalDateTime parsedDueDate = (dueDate != null) ? LocalDateTime.parse(dueDate) : null;
            List<Task> tasks = taskService.filterTasks(parsedDueDate, id, priority);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 17. GET /tasks/{userId}/summary
    @GetMapping("/{userId}/summary")
    public ResponseEntity<TaskSummaryDTO> getTaskSummary(@PathVariable Long userId) {
        try {
            TaskSummaryDTO taskSummary = taskService.getTaskSummary(userId);
            return ResponseEntity.ok(taskSummary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}