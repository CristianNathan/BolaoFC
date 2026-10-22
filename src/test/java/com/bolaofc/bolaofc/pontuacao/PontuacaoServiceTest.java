package com.bolaofc.bolaofc.pontuacao;

import com.bolaofc.bolaofc.bolao.Bolao;
import com.bolaofc.bolaofc.bolao.BolaoRepository;
import com.bolaofc.bolaofc.bolao.Status;
import com.bolaofc.bolaofc.palpite.Palpite;
import com.bolaofc.bolaofc.palpite.PalpiteRepository;
import com.bolaofc.bolaofc.palpite.PalpitesStatus;
import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.partida.StatusPartida;
import com.bolaofc.bolaofc.ranking.RankingService;
import com.bolaofc.bolaofc.transacao.Tipo;
import com.bolaofc.bolaofc.transacao.TransacaoService;
import com.bolaofc.bolaofc.user.User;
import com.bolaofc.bolaofc.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@ExtendWith(MockitoExtension.class)
public class PontuacaoServiceTest {

    @Mock
    private PalpiteRepository palpiteRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private TransacaoService transacaoService;
    @Mock
    private RankingService rankingService;
    @Mock
    private BolaoRepository bolaoRepository;

    @InjectMocks
    private PontuacaoService pontuacaoService;

    @Test
    void pontosDePlacarExato(){
        User user = new User("João", "joao123@gmail.com","joao123");
        Bolao bolao = new Bolao(UUID.randomUUID(), "Bolao teste Junit", "HGTG123", 10, 5, 20, false, List.of(), Status.ABERTO, LocalDateTime.now(), user);
        Partida partida = new Partida(UUID.randomUUID(),"Corinthians","Palmeiras",2,1, StatusPartida.FINALIZADA,LocalDateTime.now(),bolao);
        Palpite palpite = new Palpite(UUID.randomUUID(), 2, 1, 0, PalpitesStatus.PENDENTE, user, partida, bolao);
        when(palpiteRepository.findByPartidaId(partida.getId())).thenReturn(List.of(palpite));
        pontuacaoService.calcularPontuacao(partida);
        assertEquals(10,palpite.getPontosGanhos());
        assertEquals(PalpitesStatus.PLACAR_EXATO, palpite.getStatus());
        assertEquals(10.0, user.getSaldo());
        verify(transacaoService).registrarTransacao(user, 10.0, Tipo.CREDITO, "Palpite correto - Corinthians x Palmeiras");
        verify(userRepository).save(user);
        verify(palpiteRepository).save(palpite);
    }
    @Test
    void pontosAcertouOVencedor(){
        User user = new User("João", "joao123@gmail.com","joao123");
        Bolao bolao = new Bolao(UUID.randomUUID(), "Bolao teste Junit", "HGTG123", 10, 5, 20, false, List.of(), Status.ABERTO, LocalDateTime.now(), user);
        Partida partida = new Partida(UUID.randomUUID(),"Corinthians","Palmeiras",3,1, StatusPartida.FINALIZADA,LocalDateTime.now(),bolao);
        Palpite palpite = new Palpite(UUID.randomUUID(), 2, 1, 0, PalpitesStatus.PENDENTE, user, partida, bolao);
        when(palpiteRepository.findByPartidaId(partida.getId())).thenReturn(List.of(palpite));
        pontuacaoService.calcularPontuacao(partida);
        assertEquals(5,palpite.getPontosGanhos());
        assertEquals(PalpitesStatus.ACERTOU_VENCEDOR, palpite.getStatus());
        assertEquals(5.0, user.getSaldo());
        verify(transacaoService).registrarTransacao(user, 5.0, Tipo.CREDITO, "Palpite correto - Corinthians x Palmeiras");
        verify(userRepository).save(user);
        verify(palpiteRepository).save(palpite);

    }
    @Test
    void errouTudo(){
        User user = new User("João", "joao123@gmail.com","joao123");
        Bolao bolao = new Bolao(UUID.randomUUID(), "Bolao teste Junit", "HGTG123", 10, 5, 20, false, List.of(), Status.ABERTO, LocalDateTime.now(), user);
        Partida partida = new Partida(UUID.randomUUID(),"Corinthians","Palmeiras",0,2, StatusPartida.FINALIZADA,LocalDateTime.now(),bolao);
        Palpite palpite = new Palpite(UUID.randomUUID(), 1, 1, 0, PalpitesStatus.PENDENTE, user, partida, bolao);
        when(palpiteRepository.findByPartidaId(partida.getId())).thenReturn(List.of(palpite));
        pontuacaoService.calcularPontuacao(partida);
        assertEquals(0,palpite.getPontosGanhos());
        assertEquals(PalpitesStatus.INCORRETO, palpite.getStatus());
        assertEquals(0.0, user.getSaldo());
        verify(transacaoService, never()).registrarTransacao(any(), anyDouble(), any(), anyString());
        verify(userRepository, never()).save(any());
        verify(palpiteRepository).save(palpite);

    }
    @Test
    void acertouVencedorVisitante(){
        User user = new User("João", "joao123@gmail.com","joao123");
        Bolao bolao = new Bolao(UUID.randomUUID(), "Bolao teste Junit", "HGTG123", 10, 5, 20, false, List.of(), Status.ABERTO, LocalDateTime.now(), user);
        Partida partida = new Partida(UUID.randomUUID(),"Corinthians","Palmeiras",2,3, StatusPartida.FINALIZADA,LocalDateTime.now(),bolao);
        Palpite palpite = new Palpite(UUID.randomUUID(), 1, 3, 0, PalpitesStatus.PENDENTE, user, partida, bolao);
        when(palpiteRepository.findByPartidaId(partida.getId())).thenReturn(List.of(palpite));
        pontuacaoService.calcularPontuacao(partida);
        assertEquals(5,palpite.getPontosGanhos());
        assertEquals(PalpitesStatus.ACERTOU_VENCEDOR, palpite.getStatus());
        assertEquals(5.0, user.getSaldo());
        verify(transacaoService).registrarTransacao(user, 5.0, Tipo.CREDITO, "Palpite correto - Corinthians x Palmeiras");
        verify(userRepository).save(user);
        verify(palpiteRepository).save(palpite);
    }
    @Test
    void empatePlacarDiferente(){
        User user = new User("João", "joao123@gmail.com","joao123");
        Bolao bolao = new Bolao(UUID.randomUUID(), "Bolao teste Junit", "HGTG123", 10, 5, 20, false, List.of(), Status.ABERTO, LocalDateTime.now(), user);
        Partida partida = new Partida(UUID.randomUUID(),"Corinthians","Palmeiras",2,2, StatusPartida.FINALIZADA,LocalDateTime.now(),bolao);
        Palpite palpite = new Palpite(UUID.randomUUID(), 1, 1, 0, PalpitesStatus.PENDENTE, user, partida, bolao);
        when(palpiteRepository.findByPartidaId(partida.getId())).thenReturn(List.of(palpite));
        pontuacaoService.calcularPontuacao(partida);
        assertEquals(5,palpite.getPontosGanhos());
        assertEquals(PalpitesStatus.ACERTOU_VENCEDOR, palpite.getStatus());
        assertEquals(5.0, user.getSaldo());
        verify(transacaoService).registrarTransacao(user, 5.0, Tipo.CREDITO, "Palpite correto - Corinthians x Palmeiras");
        verify(userRepository).save(user);
        verify(palpiteRepository).save(palpite);
    }
    @Test
    void empatePlacarExato(){
        User user = new User("João", "joao123@gmail.com","joao123");
        Bolao bolao = new Bolao(UUID.randomUUID(), "Bolao teste Junit", "HGTG123", 10, 5, 20, false, List.of(), Status.ABERTO, LocalDateTime.now(), user);
        Partida partida = new Partida(UUID.randomUUID(),"Corinthians","Palmeiras",1,1, StatusPartida.FINALIZADA,LocalDateTime.now(),bolao);
        Palpite palpite = new Palpite(UUID.randomUUID(), 1, 1, 0, PalpitesStatus.PENDENTE, user, partida, bolao);
        when(palpiteRepository.findByPartidaId(partida.getId())).thenReturn(List.of(palpite));
        pontuacaoService.calcularPontuacao(partida);
        assertEquals(10,palpite.getPontosGanhos());
        assertEquals(PalpitesStatus.PLACAR_EXATO, palpite.getStatus());
        assertEquals(10.0, user.getSaldo());
        verify(transacaoService).registrarTransacao(user, 10.0, Tipo.CREDITO, "Palpite correto - Corinthians x Palmeiras");
        verify(userRepository).save(user);
        verify(palpiteRepository).save(palpite);
    }
    @Test
    void pontuacaoNaoConfiguradaPlacarExato(){
        User user = new User("João", "joao123@gmail.com","joao123");
        Bolao bolao = new Bolao(UUID.randomUUID(), "Bolao teste Junit", "HGTG123", null, null, 20, false, List.of(), Status.ABERTO, LocalDateTime.now(), user);
        Partida partida = new Partida(UUID.randomUUID(),"Corinthians","Palmeiras",2,1, StatusPartida.FINALIZADA,LocalDateTime.now(),bolao);
        Palpite palpite = new Palpite(UUID.randomUUID(), 2, 1, 0, PalpitesStatus.PENDENTE, user, partida, bolao);
        when(palpiteRepository.findByPartidaId(partida.getId())).thenReturn(List.of(palpite));
        pontuacaoService.calcularPontuacao(partida);
        assertEquals(10,palpite.getPontosGanhos());
        assertEquals(PalpitesStatus.PLACAR_EXATO, palpite.getStatus());
        assertEquals(10.0, user.getSaldo());
        verify(transacaoService).registrarTransacao(user, 10.0, Tipo.CREDITO, "Palpite correto - Corinthians x Palmeiras");
        verify(userRepository).save(user);
        verify(palpiteRepository).save(palpite);
    }
    @Test
    void pontuacaoNaoConfiguradaAcertouVencedor(){
        User user = new User("João", "joao123@gmail.com","joao123");
        Bolao bolao = new Bolao(UUID.randomUUID(), "Bolao teste Junit", "HGTG123", null, null, 20, false, List.of(), Status.ABERTO, LocalDateTime.now(), user);
        Partida partida = new Partida(UUID.randomUUID(),"Corinthians","Palmeiras",3,1, StatusPartida.FINALIZADA,LocalDateTime.now(),bolao);
        Palpite palpite = new Palpite(UUID.randomUUID(), 2, 1, 0, PalpitesStatus.PENDENTE, user, partida, bolao);
        when(palpiteRepository.findByPartidaId(partida.getId())).thenReturn(List.of(palpite));
        pontuacaoService.calcularPontuacao(partida);
        assertEquals(5,palpite.getPontosGanhos());
        assertEquals(PalpitesStatus.ACERTOU_VENCEDOR, palpite.getStatus());
        assertEquals(5.0, user.getSaldo());
        verify(transacaoService).registrarTransacao(user, 5.0, Tipo.CREDITO, "Palpite correto - Corinthians x Palmeiras");
        verify(userRepository).save(user);
        verify(palpiteRepository).save(palpite);
    }


}
