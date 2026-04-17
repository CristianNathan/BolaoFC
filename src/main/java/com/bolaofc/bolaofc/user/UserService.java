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
    public User salvar(User user) {
        if (userRepository.existsByNickname(user.getNickname())) {
            throw new RuntimeException("Nickname já está em uso.");
        }
        if (!user.getNickname().matches("^[a-zA-Z0-9_]{3,20}$")) {
            throw new RuntimeException("Nickname inválido. Use só letras, números e _ (3 a 20 caracteres).");
        }
        user.setSenha(passwordEncoder.encode(user.getSenha()));
        return userRepository.save(user);
    }
    public User buscarPorEmail(String email){
        return userRepository.findByEmail(email);
    }
    public List<User> listarTodos(){
        return  userRepository.findAll();
    }
    public boolean existePorNickname(String nickname) {
        return userRepository.existsByNickname(nickname);
    }


}

