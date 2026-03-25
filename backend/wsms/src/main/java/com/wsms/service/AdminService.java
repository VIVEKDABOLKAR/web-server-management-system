package com.wsms.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wsms.entity.Server;
import com.wsms.entity.User;
import com.wsms.repository.ServerRepository;
import com.wsms.repository.UserRepository;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServerRepository serverRepository;

    public Map<String, Object> getDashboardData() {
        Map<String, Object> data = new HashMap<>();
        List<User> users = userRepository.findAll();
        List<Server> servers = serverRepository.findAll();
        data.put("users", users);
        data.put("servers", servers);
        return data;
    }

    @Transactional
    public void updateUserVerification(Long userId, boolean isVerified) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setVerified(isVerified);

//    userRepository.saveAndFlush(user);
    }
}
