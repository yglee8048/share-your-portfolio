package com.yg.share_your_portfolio.api_server.adapter.`in`.dto

import com.yg.share_your_portfolio.api_server.domain.portfolio.Asset

internal data class AssetResponse(
    val ticker: String,
    val name: String,
    val type: CodeLabelResponse,
    val currencyExposure: Boolean,
)

internal fun Asset.toResponse() = AssetResponse(
    ticker.value,
    name,
    CodeLabelResponse(type.name, type.label),
    currencyExposure,
)
