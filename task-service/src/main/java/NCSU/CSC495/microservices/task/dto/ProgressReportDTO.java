package NCSU.CSC495.microservices.task.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressReportDTO {
    private int totalTasks;
    private int completedTasks;
    private int currentTasks;
    private int pendingTasks;
    private double completionRate; // Represented as a percentage (e.g., 75.0 for 75%)

    // Constructor
    public ProgressReportDTO(int completedTasks, int currentTasks, int pendingTasks) {
        this.completedTasks = completedTasks;
        this.currentTasks = currentTasks;
        this.pendingTasks = pendingTasks;
        this.totalTasks = completedTasks + pendingTasks;
        this.completionRate = setCompletionRate();
    }

    // Private methods to update metrics
    private double setCompletionRate() {
        if (totalTasks == 0) return 0.0;
        return ((double) completedTasks / totalTasks) * 100;
    }

    @Override
    public String toString() {
        return "ProgressReport{" +
                "totalTasks=" + totalTasks +
                ", completedTasks=" + completedTasks +
                ", pendingTasks=" + pendingTasks +
                ", completionRate=" + completionRate + "%" +
                '}';
    }
}
