package com.bolaofc.bolaofc.football;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


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
    public String buscarPartidas(){
        String urlPartidas = apiUrl +"/matches";
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Auth-Token",apiKey);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        try {
            System.out.println("Chamada API: "+urlPartidas);
            ResponseEntity<String> response = restTemplate.exchange(
                    urlPartidas,
                    HttpMethod.GET,
                    entity,
                    String.class
            );
            return response.getBody();
        }catch (Exception e){
            System.out.println("Erro ao chamar API de Futebol: "+ e.getMessage());
            return  "Erro: "+ e.getMessage();
        }
    }
}
