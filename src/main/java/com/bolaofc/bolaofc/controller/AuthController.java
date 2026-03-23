package com.bolaofc.bolaofc.controller;

import com.bolaofc.bolaofc.user.User;
import com.bolaofc.bolaofc.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService){
        this.userService = userService;
    }


    @PostMapping("/register")
    public ResponseEntity register(@RequestBody User data){
        if(this.userService.buscarPorEmail(data.getEmail())!=null)
            return ResponseEntity.badRequest().build();
        String encryptedPassword = new BCryptPasswordEncoder().encode(data.getSenha());
        User newUser = new User(data.getNome(),data.getEmail(),encryptedPassword);
        this.userService.salvar(newUser);
        return ResponseEntity.ok().build();
    }

}

