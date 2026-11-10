package com.bolaofc.bolaofc.football;

import com.bolaofc.bolaofc.bolao.Bolao;
import com.bolaofc.bolaofc.palpite.Palpite;
import com.bolaofc.bolaofc.palpite.PalpiteRepository;
import com.bolaofc.bolaofc.palpite.PalpitesStatus;
import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.partida.PartidaRepository;
import com.bolaofc.bolaofc.partida.StatusPartida;
import com.bolaofc.bolaofc.pontuacao.PontuacaoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SchedulerServiceTest {

    @Mock
    private FootballApiService footballApiService;
    @Mock
    private PartidaRepository partidaRepository;
    @Mock
    private PalpiteRepository palpiteRepository;
    @Mock
    private PontuacaoService pontuacaoService;

    @InjectMocks
    private SchedulerService schedulerService;

    private String jsonPartida(String status, String home, String away) {
        return """
                {"matches":[{
                  "homeTeam":{"shortName":"Corinthians","crest":"c.png"},
                  "awayTeam":{"shortName":"Palmeiras","crest":"p.png"},
                  "competition":{"code":"BSA"},
                  "utcDate":"2026-11-10T20:00:00Z",
                  "status":"%s",
                  "score":{"fullTime":{"home":%s,"away":%s}}
                }]}
                """.formatted(status, home, away);
    }

    @Test
    void partidaAgendadaESalvaSemCalcularPontuacao() {
        when(footballApiService.buscarPartidas()).thenReturn(jsonPartida("TIMED", "null", "null"));
        when(partidaRepository.findByTimeCasaAndTimeForaAndDataPartida(anyString(), anyString(), any()))
                .thenReturn(Optional.empty());
        when(partidaRepository.save(any(Partida.class))).thenAnswer(inv -> inv.getArgument(0));

        schedulerService.sincronizarPartidas();

        ArgumentCaptor<Partida> captor = ArgumentCaptor.forClass(Partida.class);
        verify(partidaRepository).save(captor.capture());
        Partida salva = captor.getValue();
        assertEquals("Corinthians", salva.getTimeCasa());
        assertEquals("Palmeiras", salva.getTimeFora());
        assertEquals("BSA", salva.getLiga());
        assertEquals(StatusPartida.AGENDADA, salva.getStatus());
        verify(pontuacaoService, never()).calcularPontuacao(any());
    }

    @Test
    void partidaFinalizadaSalvaGolsECalculaPontuacao() {
        when(footballApiService.buscarPartidas()).thenReturn(jsonPartida("FINISHED", "2", "1"));
        when(partidaRepository.findByTimeCasaAndTimeForaAndDataPartida(anyString(), anyString(), any()))
                .thenReturn(Optional.empty());
        when(partidaRepository.save(any(Partida.class))).thenAnswer(inv -> {
            Partida p = inv.getArgument(0);
            p.setId(UUID.randomUUID());
            return p;
        });
        when(palpiteRepository.findByPartidaId(any())).thenReturn(List.of());

        schedulerService.sincronizarPartidas();

        ArgumentCaptor<Partida> captor = ArgumentCaptor.forClass(Partida.class);
        verify(partidaRepository).save(captor.capture());
        Partida salva = captor.getValue();
        assertEquals(StatusPartida.FINALIZADA, salva.getStatus());
        assertEquals(2, salva.getGolsCasa());
        assertEquals(1, salva.getGolsFora());
        verify(pontuacaoService).calcularPontuacao(salva);
    }

    @Test
    void partidaFinalizadaJaCalculadaNaoCalculaDeNovo() {
        Palpite jaCalculado = new Palpite();
        jaCalculado.setStatus(PalpitesStatus.PLACAR_EXATO);
        when(footballApiService.buscarPartidas()).thenReturn(jsonPartida("FINISHED", "2", "1"));
        when(partidaRepository.findByTimeCasaAndTimeForaAndDataPartida(anyString(), anyString(), any()))
                .thenReturn(Optional.empty());
        when(partidaRepository.save(any(Partida.class))).thenAnswer(inv -> {
            Partida p = inv.getArgument(0);
            p.setId(UUID.randomUUID());
            return p;
        });
        when(palpiteRepository.findByPartidaId(any())).thenReturn(List.of(jaCalculado));

        schedulerService.sincronizarPartidas();

        verify(pontuacaoService, never()).calcularPontuacao(any());
    }

    @Test
    void jsonSemMatchesNaoSalvaNada() {
        when(footballApiService.buscarPartidas()).thenReturn("{\"error\": \"Erro na API\"}");

        schedulerService.sincronizarPartidas();

        verify(partidaRepository, never()).save(any());
    }

    @Test
    void jsonInvalidoNaoEstouraExcecao() {
        when(footballApiService.buscarPartidas()).thenReturn("isso nao e json");

        assertDoesNotThrow(() -> schedulerService.sincronizarPartidas());

        verify(partidaRepository, never()).save(any());
    }
}