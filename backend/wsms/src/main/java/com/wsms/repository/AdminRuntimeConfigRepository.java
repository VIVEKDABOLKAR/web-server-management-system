package com.wsms.repository;

import com.wsms.entity.AdminRuntimeConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRuntimeConfigRepository extends JpaRepository<AdminRuntimeConfig, Long> {
}
