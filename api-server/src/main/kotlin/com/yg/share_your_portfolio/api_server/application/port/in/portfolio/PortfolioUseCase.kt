package com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.AssetTicker
import com.yg.share_your_portfolio.api_server.domain.portfolio.Portfolio
import com.yg.share_your_portfolio.api_server.domain.portfolio.PortfolioGap
import java.math.BigDecimal

interface PortfolioUseCase {
    fun getPortfolio(accountId: AccountId): Portfolio

    fun modifyPortfolio(
        accountId: AccountId,
        command: ModifyPortfolioCommand,
    ): Portfolio

    fun deletePortfolio(accountId: AccountId)

    fun getPortfolioGap(accountId: AccountId): PortfolioGap
}

data class ModifyPortfolioCommand(
    val name: String,
    val description: String?,
    val items: List<ModifyPortfolioItemCommand>,
)

data class ModifyPortfolioItemCommand(
    val assetTicker: AssetTicker,
    val targetRatio: BigDecimal,
)
