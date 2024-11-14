package NCSU.CSC495.microservices.task.repository;

import NCSU.CSC495.microservices.task.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByTaskId(Long taskId);
}
