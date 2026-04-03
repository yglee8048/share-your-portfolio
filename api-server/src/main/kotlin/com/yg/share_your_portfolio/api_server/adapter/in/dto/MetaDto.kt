package com.yg.share_your_portfolio.api_server.adapter.`in`.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class CodeLabelResponse(
    val code: String,
    val label: String,
)

data class AssetSearchResponse(
    val name: String,
    @JsonProperty("asset_type_code") val assetTypeCode: String,
    @JsonProperty("asset_type_label") val assetTypeLabel: String,
    @JsonProperty("currency_exposure") val currencyExposure: Boolean,
)
