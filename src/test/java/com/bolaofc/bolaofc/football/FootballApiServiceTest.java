package com.bolaofc.bolaofc.football;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FootballApiServiceTest {

    @Mock
    private RestTemplate restTemplate;

    private FootballApiService footballApiService;

    @BeforeEach
    void setUp() {
        footballApiService = new FootballApiService(restTemplate);
        ReflectionTestUtils.setField(footballApiService, "apiKey", "chave-teste");
        ReflectionTestUtils.setField(footballApiService, "apiUrl", "http://api.teste");
    }

    @Test
    void devolveCorpoDaResposta() {
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.ok("{\"matches\": []}"));

        String resultado = footballApiService.buscarPartidas();

        assertEquals("{\"matches\": []}", resultado);
    }

    @Test
    void montaUrlEHeaderCorretos() {
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.ok("ok"));

        footballApiService.buscarPartidas();

        ArgumentCaptor<String> urlCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<HttpEntity> entityCaptor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).exchange(urlCaptor.capture(), eq(HttpMethod.GET), entityCaptor.capture(), eq(String.class));

        String esperadoInicio = "http://api.teste/matches?dateFrom=" + LocalDate.now().minusDays(4)
                + "&dateTo=" + LocalDate.now().plusDays(5);
        assertTrue(urlCaptor.getValue().startsWith(esperadoInicio));
        assertTrue(urlCaptor.getValue().endsWith("&competitions=BSA,CL,PL,PD,BL1,SA,FL1,WC"));
        assertEquals("chave-teste", entityCaptor.getValue().getHeaders().getFirst("X-Auth-Token"));
    }

    @Test
    void devolveJsonDeErroQuandoApiFalha() {
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class)))
                .thenThrow(new RestClientException("falhou"));

        String resultado = footballApiService.buscarPartidas();

        assertEquals("{\"error\": \"Erro na API\"}", resultado);
    }
}