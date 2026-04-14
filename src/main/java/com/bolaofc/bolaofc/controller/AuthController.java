package com.bolaofc.bolaofc.controller;

import com.bolaofc.bolaofc.infraSecurity.TokenService;
import com.bolaofc.bolaofc.user.User;
import com.bolaofc.bolaofc.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody Map<String, String> data) {
        String nome = data.get("nome");
        String email = data.get("email");
        String senhaPura = data.get("senha");

        if (this.userService.buscarPorEmail(email) != null) {
            return ResponseEntity.badRequest().body("Usuário já existe");
        }

        User newUser = new User();
        newUser.setNome(nome);
        newUser.setEmail(email);
        newUser.setSenha(senhaPura);

        this.userService.salvar(newUser);

        return ResponseEntity.ok("Usuário criado com sucesso!");
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody Map<String, String> data){
        String email = data.get("email");
        String senhaDigitada = data.get("senha");

        System.out.println("--- DEBUG LOGIN ---");
        System.out.println("Email: " + email);
        System.out.println("Senha digitada: " + senhaDigitada);

        try {
            User user = userService.buscarPorEmail(email);
            if (user == null) return ResponseEntity.status(401).body("Usuário não encontrado");


            boolean matches = passwordEncoder.matches(senhaDigitada, user.getSenha());
            System.out.println("A senha bate no manual? " + matches);

            var usernameSenha = new UsernamePasswordAuthenticationToken(email, senhaDigitada);
            var auth = authenticationManager.authenticate(usernameSenha);

            var token = tokenService.generateToken((User) auth.getPrincipal());
            return ResponseEntity.ok(Map.of("token", token));

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Credenciais inválidas: " + e.getMessage());
        }
    }
}