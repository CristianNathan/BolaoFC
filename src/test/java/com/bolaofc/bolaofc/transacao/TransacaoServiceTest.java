package com.bolaofc.bolaofc.transacao;

import com.bolaofc.bolaofc.user.User;
import com.bolaofc.bolaofc.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TransacaoServiceTest {

    @Mock
    private TransacaoRepository transacaoRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private TransacaoService transacaoService;

    @Test
    void registrarTransacaoComDadosCorretos(){
        User user = new User();
        when(transacaoRepository.save(any(Transacao.class))).thenReturn(new Transacao());
        Transacao resultado = transacaoService.registrarTransacao(user,10.0,Tipo.DEBITO,"Palpite no Bolão: Teste");
        ArgumentCaptor<Transacao> captor = ArgumentCaptor.forClass(Transacao.class);
        verify(transacaoRepository).save(captor.capture());

        Transacao salvar = captor.getValue();
        assertEquals(10.0,salvar.getValor());
        assertEquals(Tipo.DEBITO,salvar.getTipo());
        assertEquals("Palpite no Bolão: Teste", salvar.getDescricao());
        assertEquals(user, salvar.getUser());

    }
}
