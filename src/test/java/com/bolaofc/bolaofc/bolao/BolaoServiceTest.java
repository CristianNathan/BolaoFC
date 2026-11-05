package com.bolaofc.bolaofc.bolao;

import com.bolaofc.bolaofc.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BolaoServiceTest {

    @Mock
    private BolaoRepository bolaoRepository;
    @Mock
    private BolaoParticipanteRepository participanteRepository;

    @InjectMocks
    private BolaoService bolaoService;

    private User criarUser(String nome, String email) {
        User user = new User(nome, email, "senha123");
        user.setId(UUID.randomUUID());
        return user;
    }

    private Bolao criarBolao(User dono) {
        return new Bolao(UUID.randomUUID(), "Bolao teste Junit", "HGTG123", 10, 5, 20, false, List.of(), Status.ABERTO, LocalDateTime.now(), dono);
    }


    @Test
    void donoExcluiBolaoComSucesso() {
        User dono = criarUser("João", "joao@gmail.com");
        Bolao bolao = criarBolao(dono);
        List<BolaoParticipante> participantes = List.of(
                new BolaoParticipante(UUID.randomUUID(), 0L, LocalDateTime.now(), dono, bolao)
        );
        when(bolaoRepository.findById(bolao.getId())).thenReturn(Optional.of(bolao));
        when(participanteRepository.findByBolaoOrderByPontosTotalDesc(bolao)).thenReturn(participantes);

        bolaoService.excluirBolao(bolao.getId(), dono);

        verify(participanteRepository).deleteAll(participantes);
        verify(bolaoRepository).delete(bolao);
    }

    @Test
    void naoDonoNaoPodeExcluirBolao() {
        User dono = criarUser("João", "joao@gmail.com");
        User outro = criarUser("Maria", "maria@gmail.com");
        Bolao bolao = criarBolao(dono);
        when(bolaoRepository.findById(bolao.getId())).thenReturn(Optional.of(bolao));

        RuntimeException e = assertThrows(RuntimeException.class,
                () -> bolaoService.excluirBolao(bolao.getId(), outro));

        assertEquals("Apenas o dono pode excluir o bolão.", e.getMessage());
        verify(bolaoRepository, never()).delete(any());
        verify(participanteRepository, never()).deleteAll(any());
    }

    @Test
    void excluirBolaoNaoEncontrado() {
        User dono = criarUser("João", "joao@gmail.com");
        UUID idInexistente = UUID.randomUUID();
        when(bolaoRepository.findById(idInexistente)).thenReturn(Optional.empty());

        RuntimeException e = assertThrows(RuntimeException.class,
                () -> bolaoService.excluirBolao(idInexistente, dono));

        assertEquals("Bolão não encontrado.", e.getMessage());
        verify(bolaoRepository, never()).delete(any());
    }

    @Test
    void passarDonoESairBolaoNaoEncontrado() {
        User dono = criarUser("João", "joao@gmail.com");
        UUID idInexistente = UUID.randomUUID();
        when(bolaoRepository.findById(idInexistente)).thenReturn(Optional.empty());

        RuntimeException e = assertThrows(RuntimeException.class,
                () -> bolaoService.passarDonoESair(idInexistente, dono));

        assertEquals("Bolão não encontrado.", e.getMessage());
    }
    @Test
    void passarDonoESairSemOutrosParticipantes() {
        User dono = criarUser("João", "joao@gmail.com");
        Bolao bolao = criarBolao(dono);
        List<BolaoParticipante> participantes = List.of(
                new BolaoParticipante(UUID.randomUUID(), 0L, LocalDateTime.now(), dono, bolao)
        );
        when(bolaoRepository.findById(bolao.getId())).thenReturn(Optional.of(bolao));
        when(participanteRepository.findByBolaoOrderByPontosTotalDesc(bolao)).thenReturn(participantes);

        RuntimeException e = assertThrows(RuntimeException.class,
                () -> bolaoService.passarDonoESair(bolao.getId(), dono));

        assertEquals("Não há outros participantes. Exclua o bolão.", e.getMessage());
        verify(bolaoRepository, never()).save(any());
        verify(participanteRepository, never()).deleteByUserIdAndBolaoId(any(), any());
    }

    @Test
    void passarDonoParaQuemEntrouPrimeiro() {
        User dono = criarUser("João", "joao@gmail.com");
        User antigo = criarUser("Maria", "maria@gmail.com");
        User recente = criarUser("Pedro", "pedro@gmail.com");
        Bolao bolao = criarBolao(dono);

        BolaoParticipante pDono = new BolaoParticipante(UUID.randomUUID(), 50L, LocalDateTime.now().minusDays(10), dono, bolao);
        BolaoParticipante pRecente = new BolaoParticipante(UUID.randomUUID(), 30L, LocalDateTime.now().minusDays(1), recente, bolao);
        BolaoParticipante pAntigo = new BolaoParticipante(UUID.randomUUID(), 5L, LocalDateTime.now().minusDays(5), antigo, bolao);

        when(bolaoRepository.findById(bolao.getId())).thenReturn(Optional.of(bolao));
        when(participanteRepository.findByBolaoOrderByPontosTotalDesc(bolao))
                .thenReturn(List.of(pDono, pRecente, pAntigo));

        bolaoService.passarDonoESair(bolao.getId(), dono);

        assertEquals(antigo, bolao.getDono());
        verify(bolaoRepository).save(bolao);
        verify(participanteRepository).deleteByUserIdAndBolaoId(dono.getId(), bolao.getId());
    }

    @Test
    void criarBolaoDefineDadosECadastraCriadorComoParticipante() {
        User user = criarUser("João", "joao@gmail.com");
        BolaoRequestDTO dados = new BolaoRequestDTO("Meu Bolão", 10, 5, 20,false, List.of("Brasileirão"));
        when(bolaoRepository.save(any(Bolao.class))).thenAnswer(inv -> inv.getArgument(0));

        Bolao resultado = bolaoService.criarBolao(dados, user);

        ArgumentCaptor<Bolao> bolaoCaptor = ArgumentCaptor.forClass(Bolao.class);
        verify(bolaoRepository).save(bolaoCaptor.capture());
        Bolao salvo = bolaoCaptor.getValue();
        assertEquals("Meu Bolão", salvo.getNome());
        assertEquals(Status.ABERTO, salvo.getStatus());
        assertEquals(user, salvo.getDono());
        assertNotNull(salvo.getCodigoConvite());
        assertEquals(8, salvo.getCodigoConvite().length());

        ArgumentCaptor<BolaoParticipante> partCaptor = ArgumentCaptor.forClass(BolaoParticipante.class);
        verify(participanteRepository).save(partCaptor.capture());
        BolaoParticipante participante = partCaptor.getValue();
        assertEquals(user, participante.getUser());
        assertEquals(resultado, participante.getBolao());
        assertEquals(0L, participante.getPontosTotal());
    }

    @Test
    void listarBoloesPublicosComLigas() {
        UUID userId = UUID.randomUUID();
        List<String> ligas = List.of("Brasileirão");
        List<Bolao> esperado = List.of(criarBolao(criarUser("João", "joao@gmail.com")));
        when(bolaoRepository.findByPrivadoFalseAndLigasAndDonoIdNot(ligas, userId)).thenReturn(esperado);

        List<Bolao> resultado = bolaoService.listarBoloesPublicos(ligas, userId);

        assertEquals(esperado, resultado);
        verify(bolaoRepository, never()).findByPrivadoFalseAndDonoIdNot(any());
    }

    @Test
    void listarBoloesPublicosSemLigas() {
        UUID userId = UUID.randomUUID();
        List<Bolao> esperado = List.of(criarBolao(criarUser("João", "joao@gmail.com")));
        when(bolaoRepository.findByPrivadoFalseAndDonoIdNot(userId)).thenReturn(esperado);

        List<Bolao> resultado = bolaoService.listarBoloesPublicos(null, userId);

        assertEquals(esperado, resultado);
        verify(bolaoRepository, never()).findByPrivadoFalseAndLigasAndDonoIdNot(any(), any());
    }
}