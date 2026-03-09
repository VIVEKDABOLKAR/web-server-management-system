package com.wsms.repository;

import com.wsms.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);


    Optional<User> findByUsername(String email);

    boolean existsByUsername(String email);
}
