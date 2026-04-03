package com.yg.share_your_portfolio.api_server.domain.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.vo.AccountType
import com.yg.share_your_portfolio.api_server.domain.vo.Institution

class Account(
    val id: AccountId,
    val institution: Institution,
    val accountNumber: String,
    val type: AccountType,
    val name: String,
) {
    init {
        require(name.isNotBlank()) { "이름은 공백일 수 없습니다." }
    }
}
