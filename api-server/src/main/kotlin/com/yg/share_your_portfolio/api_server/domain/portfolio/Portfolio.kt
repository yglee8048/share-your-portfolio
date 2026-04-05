package com.yg.share_your_portfolio.api_server.domain.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import java.math.BigDecimal

class Portfolio(
    val accountId: AccountId,
    val name: String,
    val description: String?,
    val items: List<PortfolioItem>,
) {
    init {
        check(items.sumOf { it.targetRatio }.compareTo(HUNDRED_PERCENT) == 0) { "포트폴리오 비율 합은 100% 여야 합니다." }
    }

    companion object {
        val HUNDRED_PERCENT = BigDecimal("100")
    }
}

class PortfolioItem(
    val asset: Asset,
    val targetRatio: BigDecimal,
) {
    init {
        check(targetRatio > BigDecimal.ZERO) { "목표 비율은 0 보다 커야합니다." }
    }
}
