package com.yg.share_your_portfolio.api_server.adapter.`in`.dto

import java.math.BigDecimal

data class CreateHoldingRequest(
    val name: String,
    val assetTypeCode: String,
    val currencyExposure: Boolean,
    val principalValue: BigDecimal,
    val currentValue: BigDecimal?,
)

data class HoldingResponse(
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
