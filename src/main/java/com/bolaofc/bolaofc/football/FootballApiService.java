package com.bolaofc.bolaofc.football;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDate; // Importante para as datas

@Service
public class FootballApiService {
    @Value("${football.api.key}")
    private String apiKey;
    @Value("${football.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public FootballApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String buscarPartidas() {
        String ontem = LocalDate.now().minusDays(1).toString();
        String amanha = LocalDate.now().plusDays(2).toString(); // Aumentei um dia pra garantir o próximo fim de semana

        // Códigos das ligas que você quer:
        String ligas = "BSA,CL,PL,PD,BL1,SA,FL1";

        // Montamos a URL com datas E as competições escolhidas
        String urlPartidas = String.format(
                "%s/matches?dateFrom=%s&dateTo=%s&competitions=%s",
                apiUrl, ontem, amanha, ligas
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Auth-Token", apiKey);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            System.out.println("Buscando apenas ligas principais: " + ligas);
            ResponseEntity<String> response = restTemplate.exchange(
                    urlPartidas,
                    HttpMethod.GET,
                    entity,
                    String.class
            );
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Erro ao filtrar ligas: " + e.getMessage());
            return "{\"error\": \"Erro na API\"}";
        }
    }
}