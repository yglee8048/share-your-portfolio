package com.yg.share_your_portfolio.api_server.domain.identity

import com.yg.share_your_portfolio.api_server.domain.id.UserId
import com.yg.share_your_portfolio.api_server.domain.vo.InvitationCode
import java.time.LocalDateTime

class Invitation(
    val invitationCode: InvitationCode,
    val ownerId: UserId,
    active: Boolean,
    accept: Boolean,
    acceptBy: UserId?,
    val createdAt: LocalDateTime,
    updatedAt: LocalDateTime,
) {
    var active: Boolean = active
        private set
    var accepted: Boolean = accept
        private set
    var acceptBy: UserId? = acceptBy
        private set
    var updatedAt: LocalDateTime = updatedAt
        private set

    fun accept(by: UserId) {
        check(active) { "취소된 초대코드입니다." }
        check(!accepted) { "이미 수락된 초대코드입니다." }
        accepted = true
        this.acceptBy = by
        updatedAt = LocalDateTime.now()
    }

    fun cancel() {
        check(!accepted) { "이미 수락된 초대코드입니다." }
        active = false
        updatedAt = LocalDateTime.now()
    }
}
