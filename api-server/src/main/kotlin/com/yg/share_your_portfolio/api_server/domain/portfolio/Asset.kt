package com.yg.share_your_portfolio.api_server.domain.portfolio

import com.yg.share_your_portfolio.api_server.domain.vo.AssetType

data class Asset(
    val ticker: String,
    val name: String,
    val type: AssetType,
    val currencyExposure: Boolean,
)
