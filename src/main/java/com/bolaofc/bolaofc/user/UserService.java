package com.bolaofc.bolaofc.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public UserService(UserRepository userRepository,PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public User salvar(User user){
        user.setSenha(passwordEncoder.encode(user.getSenha()));
        return userRepository.save(user);
    }
    public User buscarPorEmail(String email){
        return userRepository.findByEmail(email);
    }
    public List<User> listarTodos(){
        return  userRepository.findAll();
    }

}
