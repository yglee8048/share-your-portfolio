package com.yg.share_your_portfolio.api_server.domain.identity

import com.yg.share_your_portfolio.api_server.domain.id.UserId

class User(
    val userId: UserId,
    name: String,
) {
    var name: String = name
        private set

    fun changeName(name: String) {
        require(name.isNotBlank()) { "이름은 공백일 수 없습니다." }
        this.name = name
    }
}
