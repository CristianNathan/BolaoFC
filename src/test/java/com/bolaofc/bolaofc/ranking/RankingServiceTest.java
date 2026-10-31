package com.bolaofc.bolaofc.ranking;

import com.bolaofc.bolaofc.bolao.Bolao;
import com.bolaofc.bolaofc.bolao.BolaoParticipante;
import com.bolaofc.bolaofc.bolao.BolaoParticipanteRepository;
import com.bolaofc.bolaofc.bolao.Status;
import com.bolaofc.bolaofc.palpite.Palpite;
import com.bolaofc.bolaofc.palpite.PalpiteRepository;
import com.bolaofc.bolaofc.palpite.PalpitesStatus;
import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.partida.StatusPartida;
import com.bolaofc.bolaofc.user.User;
import com.bolaofc.bolaofc.bolao.BolaoParticipante;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class RankingServiceTest {

    @Mock
    private
    BolaoParticipanteRepository participanteRepository;
    @Mock
    private PalpiteRepository palpiteRepository;

    @InjectMocks
    private RankingService rankingService;

    @Test
    void somaPontosDosPalpitesDoParticipante() {
        User user = new User("João", "joao123@gmail.com","joao123");
        Bolao bolao = new Bolao(UUID.randomUUID(), "Bolao teste Junit", "HGTG123", null, null, 20, false, List.of(), Status.ABERTO, LocalDateTime.now(), user);
        Partida partida = new Partida(UUID.randomUUID(),"Corinthians","Palmeiras",2,1, StatusPartida.FINALIZADA,LocalDateTime.now(),bolao);
        BolaoParticipante participante = new BolaoParticipante(UUID.randomUUID(), 0L, LocalDateTime.now(), user, bolao);
        Palpite palpite1 = new Palpite(UUID.randomUUID(), 2, 1, 10, PalpitesStatus.PENDENTE, user, partida, bolao);
        Palpite palpite2 = new Palpite(UUID.randomUUID(), 3, 1, 5, PalpitesStatus.PENDENTE, user, partida, bolao);
        when(participanteRepository.findAll()).thenReturn(List.of(participante));
        when(palpiteRepository.findByUserAndBolaoId(user, bolao.getId())).thenReturn(List.of(palpite1, palpite2));
        rankingService.atualizarEnviarRanking(bolao.getId());
        assertEquals(15L, participante.getPontosTotal());
        verify(participanteRepository).save(participante);
    }
    @Test
    void palpiteComPontosNulosContaComoZero() {
        User user = new User("João", "joao123@gmail.com","joao123");
        Bolao bolao = new Bolao(UUID.randomUUID(), "Bolao teste Junit", "HGTG123", 10, 5, 20, false, List.of(), Status.ABERTO, LocalDateTime.now(), user);
        Partida partida = new Partida(UUID.randomUUID(),"Corinthians","Palmeiras",2,1, StatusPartida.FINALIZADA,LocalDateTime.now(),bolao);
        BolaoParticipante participante = new BolaoParticipante(UUID.randomUUID(), 0L, LocalDateTime.now(), user, bolao);
        Palpite palpite1 = new Palpite(UUID.randomUUID(), 2, 1, 10, PalpitesStatus.PENDENTE, user, partida, bolao);
        Palpite palpite2 = new Palpite(UUID.randomUUID(), 3, 1, null, PalpitesStatus.PENDENTE, user, partida, bolao);
        when(participanteRepository.findAll()).thenReturn(List.of(participante));
        when(palpiteRepository.findByUserAndBolaoId(user, bolao.getId())).thenReturn(List.of(palpite1, palpite2));

        rankingService.atualizarEnviarRanking(bolao.getId());

        assertEquals(10L, participante.getPontosTotal());
        verify(participanteRepository).save(participante);
    }
    @Test
    void obterRankingFiltraPorBolaoEOrdenaDoMaiorPraMenor() {
        User user1 = new User("João", "joao123@gmail.com", "joao123");
        User user2 = new User("Maria", "maria@gmail.com", "maria123");
        User user3 = new User("Pedro", "pedro@gmail.com", "pedro123");
        Bolao bolao = new Bolao(UUID.randomUUID(), "Bolao A", "HGTG123", 10, 5, 20, false, List.of(), Status.ABERTO, LocalDateTime.now(), user1);
        Bolao outroBolao = new Bolao(UUID.randomUUID(), "Bolao B", "XYZ789", 10, 5, 20, false, List.of(), Status.ABERTO, LocalDateTime.now(), user1);

        BolaoParticipante p1 = new BolaoParticipante(UUID.randomUUID(), 5L, LocalDateTime.now(), user1, bolao);
        BolaoParticipante p2 = new BolaoParticipante(UUID.randomUUID(), 20L, LocalDateTime.now(), user2, bolao);
        BolaoParticipante p3 = new BolaoParticipante(UUID.randomUUID(), 99L, LocalDateTime.now(), user3, outroBolao);

        when(participanteRepository.findAll()).thenReturn(List.of(p1, p2, p3));

        List<BolaoParticipante> ranking = rankingService.obterRankingDoBolao(bolao.getId());

        assertEquals(2, ranking.size());
        assertEquals(p2, ranking.get(0));
        assertEquals(p1, ranking.get(1));
    }
}
