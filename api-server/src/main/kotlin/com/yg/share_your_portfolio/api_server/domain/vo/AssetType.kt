package com.yg.share_your_portfolio.api_server.domain.vo

enum class AssetType(
    val label: String,
) {
    CASH("현금"),
    DEPOSIT("예금"),
    SAVINGS("적금"),
    NOTE("어음"),
    RP("RP"),
    MMF("MMF"),
    DOMESTIC_STOCK("국내주식"),
    FOREIGN_STOCK("해외주식"),
    DOMESTIC_BOND("국내채권"),
    FOREIGN_BOND("해외채권"),
    GOLD("금"),
    COMMODITY("원자재"),
    ;
}
