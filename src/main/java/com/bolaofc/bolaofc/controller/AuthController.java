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
        String nickname = data.get("nickname");
        String email = data.get("email");
        String senhaPura = data.get("senha");

        // Valida email duplicado
        if (userService.buscarPorEmail(email) != null) {
            return ResponseEntity.badRequest().body(Map.of("message", "E-mail já está em uso."));
        }

        if (userService.existePorNickname(nickname)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Nickname já está em uso. Escolha outro."));
        }

        // Valida formato do nickname
        if (nickname == null || !nickname.matches("^[a-zA-Z0-9_]{3,20}$")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Nickname inválido. Use só letras, números e _ (3 a 20 caracteres)."));
        }

        User newUser = new User();
        newUser.setNickname(nickname);
        newUser.setEmail(email);
        newUser.setSenha(senhaPura);

        userService.salvar(newUser);

        return ResponseEntity.ok(Map.of("message", "Usuário criado com sucesso!"));
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        String senhaDigitada = data.get("senha");

        try {
            User user = userService.buscarPorEmail(email);
            if (user == null) return ResponseEntity.status(401).body("Usuário não encontrado");

            var usernameSenha = new UsernamePasswordAuthenticationToken(email, senhaDigitada);
            var auth = authenticationManager.authenticate(usernameSenha);

            var token = tokenService.generateToken((User) auth.getPrincipal());
            return ResponseEntity.ok(Map.of("token", token));

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Credenciais inválidas: " + e.getMessage());
        }
    }
}