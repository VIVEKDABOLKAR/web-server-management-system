package com.wsms.repository;

import com.wsms.entity.OSType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Repository
public interface OSTypeRepo extends JpaRepository<OSType,Long> {

}
