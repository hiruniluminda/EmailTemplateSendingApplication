package com.example.AuthService.repo;

import com.example.AuthService.enitiy.UserEnitiy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<UserEnitiy,Long> {

    public Optional<UserEnitiy> findByEmail(String email);

}
