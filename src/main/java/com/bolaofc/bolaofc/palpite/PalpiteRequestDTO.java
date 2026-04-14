package com.bolaofc.bolaofc.palpite;

import java.util.UUID;

public record PalpiteRequestDTO(
        UUID bolaoId,
        UUID jogoId,
        Integer golsMandante,
        Integer golsVisitante
) {}