package com.yg.share_your_portfolio.api_server.domain.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AssetTicker
import com.yg.share_your_portfolio.api_server.domain.vo.AssetType

class Asset(
    val ticker: AssetTicker,
    val name: String,
    val type: AssetType,
    val currencyExposure: Boolean,
)
