package com.yg.share_your_portfolio.api_server.adapter.`in`.dto

import com.fasterxml.jackson.annotation.JsonProperty
import java.math.BigDecimal

data class CreateHoldingRequest(
    val name: String,
    @JsonProperty("asset_type_code") val assetTypeCode: String,
    @JsonProperty("currency_exposure") val currencyExposure: Boolean,
    @JsonProperty("principal_value") val principalValue: BigDecimal,
    @JsonProperty("current_value") val currentValue: BigDecimal?,
)

data class HoldingResponse(
    val id: Long,
    @JsonProperty("account_id") val accountId: Long,
    @JsonProperty("asset_name") val assetName: String,
    @JsonProperty("asset_type") val assetType: CodeLabelResponse,
    @JsonProperty("currency_exposure") val currencyExposure: Boolean,
    @JsonProperty("principal_value") val principalValue: BigDecimal,
    @JsonProperty("current_value") val currentValue: BigDecimal?,
    @JsonProperty("unrealized_gain") val unrealizedGain: BigDecimal?,
    @JsonProperty("profit_rate") val profitRate: BigDecimal?,
)
