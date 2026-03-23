package com.bolaofc.bolaofc.user;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }
    public User salvar(User user){
        return userRepository.save(user);
    }
    public User buscarPorEmail(String email){
        return userRepository.findByEmail(email);
    }
    public List<User> listarTodos(){
        return  userRepository.findAll();
    }

}
