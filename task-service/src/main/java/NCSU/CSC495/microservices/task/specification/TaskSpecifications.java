package NCSU.CSC495.microservices.task.specification;

import NCSU.CSC495.microservices.task.model.Task;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class TaskSpecifications {

    public static Specification<Task> hasKeyword(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            String likePattern = "%" + keyword.toLowerCase() + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), likePattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), likePattern)
            );
        };
    }

    public static Specification<Task> hasDueDate(LocalDateTime dueDate) {
        return (root, query, criteriaBuilder) -> {
            if (dueDate == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("dueDate"), dueDate);
        };
    }

    public static Specification<Task> hasCategoryId(Long id) {
        return (root, query, criteriaBuilder) -> {
            if (id == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("id"), id);
        };
    }

    public static Specification<Task> hasPriority(String priority) {
        return (root, query, criteriaBuilder) -> {
            if (priority == null || priority.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(criteriaBuilder.lower(root.get("priority")), priority.toLowerCase());
        };
    }
}
