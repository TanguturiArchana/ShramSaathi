package com.osi.shramsaathi.repository;

import com.osi.shramsaathi.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    

    List<JobApplication> findByJobId(Long jobId);
    

    long countByJobId(Long jobId);


    List<JobApplication> findByWorkerId(Long workerId);

    Optional<JobApplication> findByJobIdAndWorkerId(Long jobId, Long workerId);
}
