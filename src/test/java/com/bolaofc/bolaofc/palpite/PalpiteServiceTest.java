package com.bolaofc.bolaofc.palpite;

import com.bolaofc.bolaofc.bolao.Bolao;
import com.bolaofc.bolaofc.bolao.BolaoRepository;
import com.bolaofc.bolaofc.bolao.Status;
import com.bolaofc.bolaofc.partida.Partida;
import com.bolaofc.bolaofc.partida.PartidaRepository;
import com.bolaofc.bolaofc.partida.StatusPartida;
import com.bolaofc.bolaofc.transacao.Tipo;
import com.bolaofc.bolaofc.transacao.TransacaoService;
import com.bolaofc.bolaofc.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PalpiteServiceTest {

    @Mock
    private PalpiteRepository palpiteRepository;

    @Mock
    private PartidaRepository partidaRepository;

    @Mock
    private BolaoRepository bolaoRepository;

    @Mock
    private TransacaoService transacaoService;

    @InjectMocks
    private PalpiteService palpiteService;

    @Test
    void getPalpite() {
        //Arrange
    User user = new User("João", "joao123@gmail.com","joao123");
    Partida partida = new Partida(UUID.randomUUID(),"Corinthians","Palmeiras",null,null, StatusPartida.AGENDADA, LocalDateTime.now(),null);
    Bolao bolao = new Bolao(UUID.randomUUID(),"Bolao teste Junit","HGTG123",10,5,20,false, List.of(), Status.ABERTO,LocalDateTime.now(),user);
    PalpiteRequestDTO data = new PalpiteRequestDTO(bolao.getId(),partida.getId(),2,1);
    when(partidaRepository.findById(data.jogoId())).thenReturn(Optional.of(partida));
    when(palpiteRepository.findByUserAndPartidaAndBolao(user,partida,bolao)).thenReturn(Optional.empty());
    when(bolaoRepository.findById(data.bolaoId())).thenReturn(Optional.of(bolao));
    Palpite palpiteSalvo = new Palpite(UUID.randomUUID(), 2, 1, 0, PalpitesStatus.PENDENTE, user, partida, bolao);
    when(palpiteRepository.save(any(Palpite.class))).thenReturn(palpiteSalvo);
        //Act
        Palpite resultado = palpiteService.fazerPalpite(data,user);
        //Assert
        assertEquals(palpiteSalvo,resultado);
        verify(transacaoService).registrarTransacao(user,10.0,Tipo.DEBITO,"Palpite no Bolão: "+ bolao.getNome());
    }
    @Test
    void partidaNaoAgendada() {
        User user = new User("João", "joao123@gmail.com","joao123");
        Partida partida = new Partida(UUID.randomUUID(),"Corinthians","Palmeiras",null,null, StatusPartida.FINALIZADA, LocalDateTime.now(),null);
        Bolao bolao = new Bolao(UUID.randomUUID(),"Bolao teste Junit","HGTG123",10,5,20,false, List.of(), Status.ABERTO,LocalDateTime.now(),user);
        PalpiteRequestDTO data = new PalpiteRequestDTO(bolao.getId(),partida.getId(),2,1);
        when(partidaRepository.findById(data.jogoId())).thenReturn(Optional.of(partida));
        when(bolaoRepository.findById(data.bolaoId())).thenReturn(Optional.of(bolao));
        //Act e Assert
        assertThrows(IllegalStateException.class, () -> palpiteService.fazerPalpite(data,user));
    }
    @Test
    void partidaNaoEncontrada() {
        User user = new User("João", "joao123@gmail.com","joao123");
        PalpiteRequestDTO data = new PalpiteRequestDTO(UUID.randomUUID(),UUID.randomUUID(),2,1);
        when(partidaRepository.findById(data.jogoId())).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> palpiteService.fazerPalpite(data,user));
    }
    @Test
    void bolaoNaoEncontrada() {
        User user = new User("João", "joao123@gmail.com","joao123");
        Partida partida = new Partida(UUID.randomUUID(),"Corinthians","Palmeiras",null,null, StatusPartida.AGENDADA, LocalDateTime.now(),null);
        PalpiteRequestDTO data = new PalpiteRequestDTO(UUID.randomUUID(),UUID.randomUUID(),2,1);
        when(partidaRepository.findById(data.jogoId())).thenReturn(Optional.of(partida));
        when(bolaoRepository.findById(data.bolaoId())).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> palpiteService.fazerPalpite(data,user));
    }


}