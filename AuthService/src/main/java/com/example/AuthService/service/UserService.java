package com.example.AuthService.service;

import com.example.AuthService.dto.req.UserRequestDto;
import com.example.AuthService.dto.resp.UserResponseDto;
import com.example.AuthService.enitiy.UserEnitiy;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<UserResponseDto> getAllUser();
    public UserResponseDto createUser(UserRequestDto userRequestDto);
    public Long getUserIdByEmail(String email);
}
