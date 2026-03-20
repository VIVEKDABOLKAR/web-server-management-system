package com.wsms.repository;

import com.wsms.entity.WebServerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WebServerTypeRepo extends JpaRepository<WebServerType,Long> {

}
