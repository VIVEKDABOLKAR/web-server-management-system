//package com.wsms.controller;
//
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/admin")
//public class AdminController {
//
//    /**
//     * vaild-test for user is admin or not
//     */
//    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
////    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/is_admin")
//    public String isAdmin(Authentication authentication) {
//        System.out.println(authentication.getAuthorities());
//        return "You are admin";
//    }
//}
