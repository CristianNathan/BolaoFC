package com.bolaofc.bolaofc.bolao;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record BolaoResponseDTO(
        UUID id,
        String nome,
        String codigoConvite,
        Boolean privado,
        List<String> ligasPermitidas,
        String status,
        LocalDateTime criadoEm,
        DonoDTO dono
) {
    public record DonoDTO(UUID id, String nickname) {}

    public static BolaoResponseDTO from(Bolao b) {
        return new BolaoResponseDTO(
                b.getId(),
                b.getNome(),
                b.getCodigoConvite(),
                b.getPrivado(),
                b.getLigasPermitidas(),
                b.getStatus() != null ? b.getStatus().name() : null,
                b.getCriadoEm(),
                b.getDono() != null
                        ? new DonoDTO(b.getDono().getId(), b.getDono().getNickname())
                        : null
        );
    }
}