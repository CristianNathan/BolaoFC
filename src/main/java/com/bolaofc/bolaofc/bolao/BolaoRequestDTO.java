package com.bolaofc.bolaofc.bolao;

import java.util.List;

public record BolaoRequestDTO(
        String nome,
        Integer pontosPlacarExato,
        Integer pontosVencedor,
        Integer maxParticipantes,
        Boolean privado,
        List<String> ligasPermitidas
) {}