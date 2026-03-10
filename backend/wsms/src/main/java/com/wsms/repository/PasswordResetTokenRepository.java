package com.wsms.repository;

import com.wsms.entity.PasswordResetToken;
import com.wsms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByUserAndOtpAndUsedFalse(User user, String otp);

    void deleteByCreatedAtBefore(LocalDateTime cutoff);
}
