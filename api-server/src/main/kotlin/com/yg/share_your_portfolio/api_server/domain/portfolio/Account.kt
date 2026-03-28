package com.yg.share_your_portfolio.api_server.domain.portfolio

import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.UserId
import com.yg.share_your_portfolio.api_server.domain.vo.AccountType

class Account(
    val accountId: AccountId,
    val userId: UserId,
    val accountType: AccountType,
    name: String?,
) {
    var name: String? = name
        private set

    fun changeName(name: String) {
        require(name.isNotBlank()) { "이름은 공백일 수 없습니다." }
        this.name = name
    }
}
