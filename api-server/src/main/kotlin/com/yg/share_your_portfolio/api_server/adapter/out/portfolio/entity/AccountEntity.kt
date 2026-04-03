package com.yg.share_your_portfolio.api_server.adapter.out.portfolio.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("accounts")
internal data class AccountEntity(
    @Id val id: Long? = null,
    val institutionCode: String,
    val accountNumber: String,
    val type: String,
    val name: String,
)
