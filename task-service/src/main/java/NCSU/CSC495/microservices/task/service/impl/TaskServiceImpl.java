package NCSU.CSC495.microservices.task.service.impl;

import NCSU.CSC495.microservices.task.exception.ResourceNotFoundException;
import NCSU.CSC495.microservices.task.model.Category;
import NCSU.CSC495.microservices.task.model.Comment;
import NCSU.CSC495.microservices.task.model.Reminder;
import NCSU.CSC495.microservices.task.model.Task;
import NCSU.CSC495.microservices.task.repository.CategoryRepository;
import NCSU.CSC495.microservices.task.repository.CommentRepository;
import NCSU.CSC495.microservices.task.repository.ReminderRepository;
import NCSU.CSC495.microservices.task.repository.TaskRepository;
import NCSU.CSC495.microservices.task.service.TaskService;
import NCSU.CSC495.microservices.task.specification.TaskSpecifications;
import NCSU.CSC495.microservices.task.dto.TaskSummaryDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ReminderRepository reminderRepository;

    @Override
    public Task createTask(Task task) {
        try {
            task.setStatus(Task.Status.PENDING);
            return taskRepository.save(task);
        } catch (Exception e) {
            throw new RuntimeException("Error creating task: " + e.getMessage());
        }
    }

    @Override
    public List<Task> getAllTasks() {
        try {
            return taskRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving tasks: " + e.getMessage());
        }
    }

    @Override
    public Task getTaskById(Long taskId) {
        try {
            return taskRepository.findById(taskId)
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + taskId));
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving task: " + e.getMessage());
        }
    }

    @Override
    public Task updateTask(Long taskId, Task taskDetails) {
        try {
            Task task = getTaskById(taskId);
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setStatus(taskDetails.getStatus());
            task.setDueDate(taskDetails.getDueDate());
            task.setPriority(taskDetails.getPriority());
            task.setAssignees(taskDetails.getAssignees());
            task.setOwner(taskDetails.getOwner());
            return taskRepository.save(task);
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Task not found with id " + taskId);
        } catch (Exception e) {
            throw new RuntimeException("Error updating task: " + e.getMessage());
        }
    }

    @Override
    public void deleteTask(Long taskId) {
        try {
            Task task = getTaskById(taskId);
            for(Category category : categoryRepository.findAll()) {
                if(category.getTasks().contains(task)) {
                    category.getTasks().remove(task);
                    categoryRepository.save(category);
                }
            }
            taskRepository.delete(task);
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Task not found with id " + taskId);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting task: " + e.getMessage());
        }
    }

    @Override
    public List<Task> searchTasks(String keyword, LocalDateTime dueDate, Long id, String priority) {
        try {
            Specification<Task> spec = Specification.where(
                    TaskSpecifications.hasKeyword(keyword)).and(TaskSpecifications.hasDueDate(dueDate))
                    .and(TaskSpecifications.hasCategoryId(id))
                    .and(TaskSpecifications.hasPriority(priority));

            return taskRepository.findAll(spec);
        } catch (Exception e) {
            throw new RuntimeException("Error searching tasks: " + e.getMessage());
        }
    }

    @Override
    public List<Task> filterTasks(LocalDateTime dueDate, Long id, String priority) {
        try {
            Specification<Task> spec = Specification.where(
                    TaskSpecifications.hasDueDate(dueDate)).and(TaskSpecifications.hasCategoryId(id))
                    .and(TaskSpecifications.hasPriority(priority));

            return taskRepository.findAll(spec);
        } catch (Exception e) {
            throw new RuntimeException("Error filtering tasks: " + e.getMessage());
        }
    }

    @Override
    public Comment addComment(Comment comment) {
        try {
            if(comment.getTaskId() == null) {
                throw new RuntimeException("Task ID is required");
            }
            else if(comment.getAuthor() == null || comment.getAuthor().isEmpty()) {
                throw new RuntimeException("Author is required");
            }
            else if(comment.getContent() == null || comment.getContent().isEmpty()) {
                throw new RuntimeException("Content is required");
            } else if(comment.getContent().length() > 1000) {
                throw new RuntimeException("Content must be less than 1000 characters");
            } else if (comment.getTimestamp() == null) {
                comment.setTimestamp(LocalDateTime.now());
            }
            return commentRepository.save(comment);
        } catch (Exception e) {
            throw new RuntimeException("Error adding comment: " + e.getMessage());
        }
    }

    @Override
    public List<Comment> getCommentsByTaskId(Long taskId) {
        try {
            return commentRepository.findByTaskId(taskId);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving comments: " + e.getMessage());
        }
    }

    @Override
    public Reminder addReminder(Reminder reminder) {
        try {
            return reminderRepository.save(reminder);
        } catch (Exception e) {
            throw new RuntimeException("Error adding reminder: " + e.getMessage());
        }
    }

    @Override
    public List<Reminder> getRemindersByTaskId(Long taskId) {
        try {
            return reminderRepository.findByTaskId(taskId);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving reminders: " + e.getMessage());
        }
    }

    @Override
    public void deleteReminder(Long taskId, Long reminderId) {
        try {
            Reminder reminder = reminderRepository.findById(reminderId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Reminder not found with id " + reminderId + " for task " + taskId));
            reminderRepository.delete(reminder);
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Reminder not found with id " + reminderId + " for task " + taskId);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting reminder: " + e.getMessage());
        }
    }

    @Override
    public TaskSummaryDTO getTaskSummary(Long userId) {
        try {
            List<Task> taskList = taskRepository.findAllByAssigneesContains(userId);
            int completedTasks = 0, currentTasks = 0, pendingTasks = 0;
            for (Task task : taskList) {
                if (task.getStatus().equals(Task.Status.COMPLETED)) {
                    completedTasks++;
                } else if (task.getStatus().equals(Task.Status.IN_PROGRESS)) {
                    currentTasks++;
                } else {
                    pendingTasks++;
                }
            }
            return new TaskSummaryDTO(completedTasks, currentTasks, pendingTasks);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving task summary: " + e.getMessage());
        }
    }

    @Override
    public List<LocalDateTime> getUpcomingDeadlines(Long userId) {
        try {
            List<Task> taskList = taskRepository.findAllByAssigneesContains(userId);
            return taskList.stream()
                    .map(Task::getDueDate)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving upcoming deadlines: " + e.getMessage());
        }
    }

    @Override
    public void deleteAll() {
        try {
            taskRepository.deleteAll();
        } catch (Exception e) {
            throw new RuntimeException("Error deleting all tasks: " + e.getMessage());
        }
    }
}