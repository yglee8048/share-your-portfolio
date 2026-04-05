package com.yg.share_your_portfolio.api_server.adapter.`in`.dto

import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.ModifyHoldingCommand
import com.yg.share_your_portfolio.api_server.domain.id.AssetTicker
import com.yg.share_your_portfolio.api_server.domain.portfolio.Holding
import java.math.BigDecimal

internal data class ModifyHoldingRequest(
    val assetTicker: String,
    val principalValue: BigDecimal,
    val currentValue: BigDecimal?,
)

internal data class HoldingResponse(
    val id: Long,
    val accountId: Long,
    val asset: AssetResponse,
    val principalValue: BigDecimal,
    val currentValue: BigDecimal?,
    val unrealizedGain: BigDecimal?,
    val profitRate: BigDecimal?,
)

internal fun ModifyHoldingRequest.toCommand() = ModifyHoldingCommand(
    assetTicker = AssetTicker(assetTicker),
    principalValue = principalValue,
    currentValue = currentValue,
)

internal fun Holding.toResponse() = HoldingResponse(
    id = holdingId.value,
    accountId = accountId.value,
    asset = asset.toResponse(),
    principalValue = principalValue,
    currentValue = currentValue,
    unrealizedGain = unrealizedGain,
    profitRate = getProfitRate(),
)
