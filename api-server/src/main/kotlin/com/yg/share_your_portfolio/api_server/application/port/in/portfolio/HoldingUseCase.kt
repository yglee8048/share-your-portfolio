package com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.HoldingId
import com.yg.share_your_portfolio.api_server.domain.portfolio.Holding
import com.yg.share_your_portfolio.api_server.domain.vo.AssetType
import java.math.BigDecimal

data class CreateHoldingCommand(
    val name: String,
    val assetType: AssetType,
    val currencyExposure: Boolean,
    val principalValue: BigDecimal,
    val currentValue: BigDecimal?,
)

data class UpdateHoldingCommand(
    val name: String,
    val assetType: AssetType,
    val currencyExposure: Boolean,
    val principalValue: BigDecimal,
    val currentValue: BigDecimal?,
)

interface HoldingUseCase {
    fun getHoldings(accountId: AccountId): List<Holding>
    fun createHolding(accountId: AccountId, command: CreateHoldingCommand): Holding
    fun updateHolding(accountId: AccountId, holdingId: HoldingId, command: UpdateHoldingCommand): Holding
    fun deleteHolding(accountId: AccountId, holdingId: HoldingId)
}
