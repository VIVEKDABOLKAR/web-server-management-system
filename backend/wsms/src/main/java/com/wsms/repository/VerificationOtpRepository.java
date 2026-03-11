package com.wsms.repository;

import com.wsms.entity.OtpPurpose;
import com.wsms.entity.User;
import com.wsms.entity.VerificationOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface VerificationOtpRepository extends JpaRepository<VerificationOtp, Long> {

    Optional<VerificationOtp> findByUserAndOtpAndPurposeAndUsedFalse(User user, String otp, OtpPurpose purpose);

    void deleteByCreatedAtBefore(LocalDateTime cutoff);
}
