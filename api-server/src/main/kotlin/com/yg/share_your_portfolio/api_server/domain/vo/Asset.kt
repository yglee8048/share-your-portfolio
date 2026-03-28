package com.yg.share_your_portfolio.api_server.domain.vo

data class Asset(
    val name: String,
    val type: AssetType,
    val ticker: Ticker?,
    val currency: Currency,
)
