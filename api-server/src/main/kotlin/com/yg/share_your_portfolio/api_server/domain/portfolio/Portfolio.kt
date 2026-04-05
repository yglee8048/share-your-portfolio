package com.yg.share_your_portfolio.api_server.domain.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import java.math.BigDecimal

class Portfolio(
    val accountId: AccountId,
    val name: String,
    val description: String?,
    val items: List<PortfolioItem>,
)

class PortfolioItem(
    val asset: Asset,
    val targetRatio: BigDecimal,
) {
    init {
        check(targetRatio > BigDecimal.ZERO) { "목표 비율은 0 보다 커야합니다." }
    }
}
