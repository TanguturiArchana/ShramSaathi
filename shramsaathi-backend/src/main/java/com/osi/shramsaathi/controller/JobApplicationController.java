package com.osi.shramsaathi.controller;

import com.osi.shramsaathi.model.Job;
import com.osi.shramsaathi.model.JobApplication;
import com.osi.shramsaathi.model.JobPosting;
import com.osi.shramsaathi.repository.JobRepository;
import com.osi.shramsaathi.service.JobPostingService;
import com.osi.shramsaathi.repository.JobApplicationRepository;
import com.osi.shramsaathi.repository.UserRepository;
import com.osi.shramsaathi.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.osi.shramsaathi.service.TranslationService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class JobApplicationController {
     private final TranslationService translationService;

    private final JobApplicationRepository appRepo;
    private final JobRepository jobRepo;
    private final JobPostingService jobpostServ;
    private final UserRepository userRepo;
    

    public JobApplicationController(JobApplicationRepository appRepo, JobRepository jobRepo, JobPostingService jobpostServ,UserRepository userRespo,TranslationService translationService) {
        this.appRepo = appRepo;
        this.jobRepo = jobRepo;
        this.jobpostServ=jobpostServ;
        this.translationService = translationService;
        this.userRepo=userRespo;
    }

    @PostMapping
    public ResponseEntity<?> applyForJob(@RequestBody JobApplication application) {
        Optional<JobApplication> existing =appRepo.findByJobIdAndWorkerId(application.getJobId(), application.getWorkerId());
        if (existing.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "⚠️ You have already applied for this job.");
            response.put("existingApplication", existing.get());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
        User worker = userRepo.findById(application.getWorkerId()).orElseThrow(() -> new RuntimeException("Worker not found"));
        application.setWorkerName(worker.getName());
        application.setWorkerSkill(worker.getWorkType());
        application.setAppliedAt(LocalDateTime.now()); 
        JobApplication saved = appRepo.save(application);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "✅ Job application submitted successfully!");
        response.put("application", saved);
        return ResponseEntity.ok(response);
    }
    

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplication>> getApplicationsByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(appRepo.findByJobId(jobId));
    }
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<JobPosting>> getJobsByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(jobpostServ.getJobsByOwner(ownerId));
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<Map<String, Object>>> getApplicationsByWorker(@PathVariable Long workerId) {
        User worker = userRepo.findById(workerId).orElse(null);
        String lang = worker != null && worker.getPreferredLanguage() != null? worker.getPreferredLanguage(): "en";
        List<JobApplication> apps = appRepo.findByWorkerId(workerId);
        List<Map<String, Object>> response = new ArrayList<>();
        for (JobApplication app : apps) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", app.getId());
            map.put("workerId", app.getWorkerId());
            map.put("workerName", app.getWorkerName());
            map.put("workerSkill", translationService.translate(app.getWorkerSkill(), lang));
            map.put("status", app.getStatus());
            map.put("appliedAt", app.getAppliedAt());
            map.put("jobId", app.getJobId());
            jobRepo.findById(app.getJobId()).ifPresentOrElse(job -> {
                map.put("jobTitle",
                        translationService.translate(job.getTitle(), lang));
                map.put("location",
                        translationService.translate(job.getLocation(), lang));
                map.put("pay", job.getPay());
                map.put("duration", job.getDuration());

            }, () -> {
                map.put("jobTitle", "Job not found");
                map.put("location", "-");
                map.put("pay", "-");
            });

            response.add(map);
        }

        return ResponseEntity.ok(response);
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,@RequestParam String status) {
        JobApplication app = appRepo.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
        Long jobId = app.getJobId();
        Job job = jobRepo.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        LocalDate deadline = job.getDecisionDeadline();
        LocalDate today = LocalDate.now();
        if (deadline != null && today.isAfter(deadline)) {
            List<JobApplication> allApps = appRepo.findByJobId(jobId);
            for (JobApplication a : allApps) {
                if (a.getStatus().equalsIgnoreCase("PENDING")) {
                    a.setStatus("REJECTED");
                    appRepo.save(a);
                }
            }

            jobRepo.delete(job);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("⛔ Deadline passed. Job was automatically closed and removed.");
        }
        app.setStatus(status.toUpperCase());
        JobApplication saved = appRepo.save(app);
        return ResponseEntity.ok(saved);
    }
}
