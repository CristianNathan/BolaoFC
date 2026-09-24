package com.bolaofc.bolaofc.partida;

import com.bolaofc.bolaofc.bolao.BolaoRepository;
import com.bolaofc.bolaofc.pontuacao.PontuacaoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PartidaServiceTest {
    @Mock
    private PartidaRepository partidaRepository;

    @Mock
    private PontuacaoService pontuacaoService;

    @Mock
    private BolaoRepository bolaoRepository;

    @InjectMocks
    private PartidaService partidaService;

    @Test
    void partidaAtualizou(){
        Partida partida = new Partida(UUID.randomUUID(),"Corinthians","Palmeiras",null,null, StatusPartida.EM_ANDAMENTO, LocalDateTime.now(),null);
        when(partidaRepository.findById(partida.getId())).thenReturn(Optional.of(partida));
        when(partidaRepository.save(any(Partida.class))).thenReturn(partida);
        Partida resultado = partidaService.atualizarResultado(partida.getId(),3,1);
        assertEquals(3, resultado.getGolsCasa());
        assertEquals(1, resultado.getGolsFora());
        assertEquals(StatusPartida.FINALIZADA, resultado.getStatus());
        verify(pontuacaoService).calcularPontuacao(partida);

    }
    @Test
    void partidaNaoEncontrada(){
        when(partidaRepository.findById(any(UUID.class))).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> partidaService.atualizarResultado(UUID.randomUUID(),3,1));
    }
}
