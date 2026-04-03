package com.yg.share_your_portfolio.api_server.adapter.`in`.dto

internal data class CodeLabelResponse(
    val code: String,
    val label: String,
)

internal data class AssetSearchResponse(
    val name: String,
    val assetTypeCode: String,
    val assetTypeLabel: String,
    val currencyExposure: Boolean,
)
