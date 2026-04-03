package com.yg.share_your_portfolio.api_server.adapter.out.portfolio.adapter

import com.yg.share_your_portfolio.api_server.adapter.out.portfolio.entity.AccountEntity
import com.yg.share_your_portfolio.api_server.adapter.out.portfolio.repository.AccountJdbcRepository
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.AccountPort
import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.portfolio.Account
import com.yg.share_your_portfolio.api_server.domain.vo.AccountType
import com.yg.share_your_portfolio.api_server.domain.vo.Institution
import org.springframework.stereotype.Component

@Component
class AccountJdbcAdapter(
    private val repository: AccountJdbcRepository,
) : AccountPort {

    override fun findAll(): List<Account> =
        repository.findAll().map { it.toDomain() }

    override fun findById(id: AccountId): Account? =
        repository.findById(id.value).map { it.toDomain() }.orElse(null)

    override fun save(account: Account): Account {
        val saved = repository.save(account.toEntity())
        return saved.toDomain()
    }

    override fun delete(id: AccountId) =
        repository.deleteById(id.value)

    private fun AccountEntity.toDomain() = Account(
        id = AccountId(id!!),
        institution = Institution.valueOf(institution),
        accountNumber = accountNumber,
        type = AccountType.valueOf(accountType),
        name = accountName,
    )

    private fun Account.toEntity() = AccountEntity(
        id = id.value.takeIf { it != 0L },
        institution = institution.name,
        accountNumber = accountNumber,
        accountType = type.name,
        accountName = name,
    )
}
