package com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.HoldingId
import com.yg.share_your_portfolio.api_server.domain.portfolio.Holding
import java.math.BigDecimal

interface HoldingUseCase {
    fun getHoldings(accountId: AccountId): List<Holding>

    fun createHolding(
        accountId: AccountId,
        command: ModifyHoldingCommand,
    ): Holding

    fun updateHolding(
        accountId: AccountId,
        holdingId: HoldingId,
        command: ModifyHoldingCommand,
    ): Holding

    fun deleteHolding(
        accountId: AccountId,
        holdingId: HoldingId,
    )
}

data class ModifyHoldingCommand(
    val assetTicker: String,
    val principalValue: BigDecimal,
    val currentValue: BigDecimal?,
)
