package com.bolaofc.bolaofc.infraSecurity;

import com.bolaofc.bolaofc.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class TokenServiceTest {

    private TokenService tokenService;

    @BeforeEach
    void setUp() {
        tokenService = new TokenService();
        ReflectionTestUtils.setField(tokenService, "secret", "segredo-de-teste");
    }

    @Test
    void geraTokenEValidaDevolvendoOEmail() {
        User user = new User("João", "joao123@gmail.com", "joao123");

        String token = tokenService.generateToken(user);
        String subject = tokenService.validateToken(token);

        assertNotNull(token);
        assertEquals("joao123@gmail.com", subject);
    }

    @Test
    void tokenInvalidoDevolveVazio() {
        assertEquals("", tokenService.validateToken("token-invalido"));
    }

    @Test
    void tokenAssinadoComOutroSegredoDevolveVazio() {
        User user = new User("João", "joao123@gmail.com", "joao123");
        String token = tokenService.generateToken(user);

        TokenService outro = new TokenService();
        ReflectionTestUtils.setField(outro, "secret", "outro-segredo");

        assertEquals("", outro.validateToken(token));
    }
}