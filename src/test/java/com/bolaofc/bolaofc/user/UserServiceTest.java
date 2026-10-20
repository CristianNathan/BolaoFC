package com.bolaofc.bolaofc.user;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @InjectMocks
    private UserService userService;

    @Test
    void salvarUsuarioESenhaCripto(){
        User user = new User("cris","cris1234@gmail.com","c1234");
        user.setNickname("cris_12");
        when(userRepository.existsByNickname(user.getNickname())).thenReturn(false);
        when(passwordEncoder.encode(user.getPassword())).thenReturn("senhaCriptografada");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User resultado = userService.salvar(user);
        assertEquals("senhaCriptografada",resultado.getPassword());
        verify(userRepository).save(user);
        }

        @Test
        void nicknameJaEmUso(){
        User user = new User("cris","cris1234@gmail.com","c1234");
            user.setNickname("cris_12");
            when(userRepository.existsByNickname(user.getNickname())).thenReturn(true);
            assertThrows(RuntimeException.class,()->userService.salvar(user));
        }

        @Test
        void nicknameInvalido(){
        User user = new User("cris","cris1234@gmail.com","c1234");
            user.setNickname("c12@");
            when(userRepository.existsByNickname(user.getNickname())).thenReturn(false);
            assertThrows(RuntimeException.class,()->userService.salvar(user));
        }
    }


