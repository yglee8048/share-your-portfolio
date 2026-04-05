package com.yg.share_your_portfolio.api_server.adapter.out.portfolio.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("portfolios")
internal data class PortfolioEntity(
    @Id val accountId: Long,
    val name: String,
    val description: String?,
)
