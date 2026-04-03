package com.yg.share_your_portfolio.api_server.adapter.`in`.dto

import com.yg.share_your_portfolio.api_server.domain.portfolio.Holding
import java.math.BigDecimal

internal data class ModifyHoldingRequest(
    val name: String,
    val assetTypeCode: String,
    val currencyExposure: Boolean,
    val principalValue: BigDecimal,
    val currentValue: BigDecimal?,
)

internal data class HoldingResponse(
    val id: Long,
    val accountId: Long,
    val assetName: String,
    val assetType: CodeLabelResponse,
    val currencyExposure: Boolean,
    val principalValue: BigDecimal,
    val currentValue: BigDecimal?,
    val unrealizedGain: BigDecimal?,
    val profitRate: BigDecimal?,
)

internal fun Holding.toResponse() = HoldingResponse(
    id = holdingId.value,
    accountId = accountId.value,
    assetName = asset.name,
    assetType = CodeLabelResponse(asset.type.name, asset.type.label),
    currencyExposure = asset.currencyExposure,
    principalValue = principalValue,
    currentValue = currentValue,
    unrealizedGain = unrealizedGain,
    profitRate = getProfitRate(),
)
