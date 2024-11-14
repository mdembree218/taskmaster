package NCSU.CSC495.microservices.task.service;

import NCSU.CSC495.microservices.task.model.Category;
import NCSU.CSC495.microservices.task.model.Task;
import NCSU.CSC495.microservices.task.dto.ProgressReportDTO;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    Category createCategory(Category category);

    Category getCategoryById(Long id);

    Optional<Category> getCategoryByName(String name);

    List<Category> getAllCategories();

    Category updateCategory(Long id, Category category);

    void deleteCategory(Long id);

    ProgressReportDTO getCategoryProgress(Long id);

    List<Task> getTasksByCategory(Long id);

    void deleteAll();
}