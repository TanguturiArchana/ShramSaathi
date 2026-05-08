package com.osi.shramsaathi.controller;

import com.osi.shramsaathi.dto.JobRequest;
import com.osi.shramsaathi.dto.JobResponse;
import com.osi.shramsaathi.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {
    private final JobService jobService;
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/{workerId}")
    public ResponseEntity<List<JobResponse>> getAllJobs(@PathVariable Long workerId) {
        List<JobResponse> jobs = jobService.getAllJobs(workerId);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<JobResponse>> getJobsByOwner(@PathVariable Long ownerId) {
        List<JobResponse> jobs = jobService.getJobsByOwner(ownerId);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/analytics/{ownerId}")
    public ResponseEntity<List<JobResponse>> analyticsJobs(@PathVariable Long ownerId) {
        return ResponseEntity.ok(jobService.getAnalyticsJobsByOwner(ownerId));
    }

    
    @PostMapping
    public ResponseEntity<JobResponse> createJob(@RequestBody JobRequest jobRequest) {
        JobResponse job = jobService.createJob(jobRequest);
        return ResponseEntity.ok(job);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/recent")
    public List<JobResponse> getRecentJobs() {
        return jobService.getRecentJobs();
    }

}
