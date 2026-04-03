package com.yg.share_your_portfolio.api_server.adapter.out.portfolio.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.math.BigDecimal

@Table("holdings")
internal data class HoldingEntity(
    @Id val id: Long? = null,
    val accountId: Long,
    val assetTicker: String,
    val principalValue: BigDecimal,
    val currentValue: BigDecimal?,
)
