package com.yg.share_your_portfolio.api_server.application.service.portfolio

import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.AccountSummary
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.AccountUseCase
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.ModifyAccountCommand
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.AccountPort
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.HoldingPort
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.PortfolioPort
import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.portfolio.Account
import com.yg.share_your_portfolio.api_server.domain.portfolio.Holding
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.math.RoundingMode

@Service
internal class AccountService(
    private val accountPort: AccountPort,
    private val holdingPort: HoldingPort,
    private val portfolioPort: PortfolioPort,
) : AccountUseCase {

    @Transactional(readOnly = true)
    override fun getAccounts(): List<AccountSummary> {
        return accountPort.findAll()
            .map { account ->
                toSummary(account, holdingPort.findByAccountId(account.id))
            }
    }

    @Transactional(readOnly = true)
    override fun getAccount(id: AccountId): AccountSummary {
        val account = accountPort.findById(id) ?: throw NoSuchElementException("존재하지 않는 계좌: $id")
        return toSummary(account, holdingPort.findByAccountId(id))
    }

    @Transactional
    override fun createAccount(command: ModifyAccountCommand): AccountSummary {
        val account = Account(
            id = AccountId(0L),
            institution = command.institution,
            accountNumber = command.accountNumber,
            type = command.accountType,
            name = command.accountName,
        )
        val saved = accountPort.save(account)
        return toSummary(saved, emptyList())
    }

    @Transactional
    override fun updateAccount(
        id: AccountId,
        command: ModifyAccountCommand,
    ): AccountSummary {
        accountPort.findById(id) ?: throw NoSuchElementException("존재하지 않는 계좌: $id")
        val updated = Account(
            id = id,
            institution = command.institution,
            accountNumber = command.accountNumber,
            type = command.accountType,
            name = command.accountName,
        )
        val saved = accountPort.save(updated)
        return toSummary(saved, holdingPort.findByAccountId(id))
    }

    @Transactional
    override fun deleteAccount(id: AccountId) {
        accountPort.findById(id) ?: throw NoSuchElementException("존재하지 않는 계좌: $id")
        holdingPort.deleteByAccountId(id)
        portfolioPort.deleteByAccountId(id)
        accountPort.delete(id)
    }

    private fun toSummary(
        account: Account,
        holdings: List<Holding>,
    ): AccountSummary {
        val principalKrw = holdings.sumOf { it.principalValue }
        val currentValueKrw = holdings.sumOf { it.currentValue ?: it.principalValue }
        val profitRate = if (principalKrw > BigDecimal.ZERO) {
            (currentValueKrw - principalKrw)
                .divide(principalKrw, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal(100))
                .setScale(2, RoundingMode.HALF_UP)
        } else {
            BigDecimal.ZERO
        }
        return AccountSummary(
            account = account,
            holdingsCount = holdings.size,
            currentValueKrw = currentValueKrw,
            principalKrw = principalKrw,
            profitRate = profitRate,
        )
    }
}
