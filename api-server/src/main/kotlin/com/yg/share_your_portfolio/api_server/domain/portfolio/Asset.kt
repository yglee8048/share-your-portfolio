package com.yg.share_your_portfolio.api_server.domain.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AssetId
import com.yg.share_your_portfolio.api_server.domain.vo.AssetType
import com.yg.share_your_portfolio.api_server.domain.vo.Currency

data class Asset(
    val assetId: AssetId,
    val name: String,
    val type: AssetType,
    val currency: Currency,
)
