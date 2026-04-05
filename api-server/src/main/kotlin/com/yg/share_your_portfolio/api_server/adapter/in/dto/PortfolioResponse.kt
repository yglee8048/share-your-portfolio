package com.yg.share_your_portfolio.api_server.adapter.`in`.dto

import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.ModifyPortfolioCommand
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.ModifyPortfolioItemCommand
import com.yg.share_your_portfolio.api_server.domain.id.AssetTicker
import com.yg.share_your_portfolio.api_server.domain.portfolio.Portfolio
import com.yg.share_your_portfolio.api_server.domain.portfolio.PortfolioItem
import java.math.BigDecimal

internal data class PortfolioRequest(
    val accountId: Long,
    val name: String,
    val description: String?,
    val items: List<PortfolioItemRequest>,
)

internal data class PortfolioItemRequest(
    val assetTicker: String,
    val targetRatio: BigDecimal,
)

internal data class PortfolioResponse(
    val accountId: Long,
    val name: String,
    val description: String?,
    val items: List<PortfolioItemResponse>,
)

internal data class PortfolioItemResponse(
    val asset: AssetResponse,
    val targetRatio: BigDecimal,
)

internal fun PortfolioRequest.toCommand() = ModifyPortfolioCommand(
    name = name,
    description = description,
    items = items.map { it.toCommand() },
)

internal fun PortfolioItemRequest.toCommand() = ModifyPortfolioItemCommand(
    assetTicker = AssetTicker(assetTicker),
    targetRatio = targetRatio,
)

internal fun Portfolio.toResponse() = PortfolioResponse(
    accountId = accountId.value,
    name = name,
    description = description,
    items = items.map { it.toResponse() },
)

internal fun PortfolioItem.toResponse() = PortfolioItemResponse(
    asset = asset.toResponse(),
    targetRatio = targetRatio,
)
