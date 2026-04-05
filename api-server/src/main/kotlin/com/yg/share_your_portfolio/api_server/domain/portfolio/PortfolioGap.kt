package com.yg.share_your_portfolio.api_server.domain.portfolio

import java.math.BigDecimal

class PortfolioGap(
    val items: List<PortfolioGapItem>,
) {
    val totalCurrentValue: BigDecimal = items.sumOf { it.currentAmount }
    val needsRebalancing: Boolean = items.any { it.needsRebalancing }
}

class PortfolioGapItem(
    val asset: Asset,
    val targetRatio: BigDecimal,
    val currentRatio: BigDecimal,
    val gap: BigDecimal,
    val targetAmount: BigDecimal,
    val currentAmount: BigDecimal,
) {
    val needsRebalancing: Boolean = gap.abs() > REBALANCING_THRESHOLD

    companion object {
        val REBALANCING_THRESHOLD = BigDecimal("5")
    }
}
