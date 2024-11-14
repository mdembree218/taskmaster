package NCSU.CSC495.microservices.task.service.impl;

import NCSU.CSC495.microservices.task.exception.ResourceNotFoundException;
import NCSU.CSC495.microservices.task.model.Category;
import NCSU.CSC495.microservices.task.model.Task;
import NCSU.CSC495.microservices.task.repository.CategoryRepository;
import NCSU.CSC495.microservices.task.service.CategoryService;
import NCSU.CSC495.microservices.task.dto.ProgressReportDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Category createCategory(Category category) {
        try {
            return categoryRepository.save(category);
        } catch (Exception e) {
            throw new RuntimeException("Error creating category: " + e.getMessage());
        }
    }

    @Override
    public Category getCategoryById(Long id) {
        try {
            return categoryRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving category: " + e.getMessage());
        }
    }

    @Override
    public Optional<Category> getCategoryByName(String name) {
        try {
            return categoryRepository.findByName(name);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving category by name: " + e.getMessage());
        }
    }

    @Override
    public List<Category> getAllCategories() {
        try {
            return categoryRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving categories: " + e.getMessage());
        }
    }

    @Override
    public Category updateCategory(Long id, Category categoryDetails) {
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));

            category.setName(categoryDetails.getName());
            category.setTasks(categoryDetails.getTasks());

            return categoryRepository.save(category);
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Category not found with id " + id);
        } catch (Exception e) {
            throw new RuntimeException("Error updating category: " + e.getMessage());
        }
    }

    @Override
    public void deleteCategory(Long id) {
        try {
            Category category = getCategoryById(id);
            categoryRepository.delete(category);
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Category not found with id " + id);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting category: " + e.getMessage());
        }
    }

    @Override
    public ProgressReportDTO getCategoryProgress(Long id) {
        try {
            List<Task> taskList = categoryRepository.getReferenceById(id).getTasks();
            int completedTasks = 0;
            int currentTasks = 0;
            int pendingTasks = 0;
            for (Task task : taskList) {
                switch (task.getStatus()) {
                    case COMPLETED:
                        completedTasks++;
                        break;
                    case IN_PROGRESS:
                        currentTasks++;
                        break;
                    case PENDING:
                        pendingTasks++;
                        break;
                }
            }
            return new ProgressReportDTO(completedTasks, currentTasks, pendingTasks);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving category progress: " + e.getMessage());
        }
    }

    @Override
    public List<Task> getTasksByCategory(Long id) {
        try {
            Category category = getCategoryById(id);
            return category.getTasks();
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving tasks by category: " + e.getMessage());
        }
    }

    @Override
    public void deleteAll() {
        try {
            categoryRepository.deleteAll();
        } catch (Exception e) {
            throw new RuntimeException("Error deleting all categories: " + e.getMessage());
        }
    }
}