package NCSU.CSC495.microservices.task.dto;

import lombok.Builder;
import lombok.AllArgsConstructor;

import lombok.NoArgsConstructor;

import lombok.Data;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskSummaryDTO {
    private int totalTasks;
    private int completedTasks;
    private int currentTasks;
    private int pendingTasks;

    // Constructor
    public TaskSummaryDTO(int completedTasks, int currentTasks, int pendingTasks) {
        this.completedTasks = completedTasks;
        this.currentTasks = currentTasks;
        this.pendingTasks = pendingTasks;
        this.totalTasks = completedTasks + pendingTasks;
    }

    @Override
    public String toString() {
        return "TaskSummary{" +
                "completedTasks=" + completedTasks +
                ", currentTasks=" + currentTasks +
                ", pendingTasks=" + pendingTasks +
                ", totalTasks=" + totalTasks +
                '}';
    }
}
