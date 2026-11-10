package com.bolaofc.bolaofc.infraSecurity;

import com.bolaofc.bolaofc.user.User;
import com.bolaofc.bolaofc.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthorizationServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthorizationService authorizationService;

    @Test
    void retornaUsuarioQuandoEncontrado() {
        User user = new User("João", "joao123@gmail.com", "joao123");
        when(userRepository.findByEmail("joao123@gmail.com")).thenReturn(user);

        UserDetails resultado = authorizationService.loadUserByUsername("joao123@gmail.com");

        assertEquals(user, resultado);
    }

    @Test
    void lancaExcecaoQuandoUsuarioNaoEncontrado() {
        when(userRepository.findByEmail("naoexiste@gmail.com")).thenReturn(null);

        assertThrows(UsernameNotFoundException.class,
                () -> authorizationService.loadUserByUsername("naoexiste@gmail.com"));
    }
}
