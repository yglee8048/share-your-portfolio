package com.yg.share_your_portfolio.api_server.application.service.portfolio

import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.AccountSummary
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.AccountUseCase
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.CreateAccountCommand
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.UpdateAccountCommand
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.AccountPort
import com.yg.share_your_portfolio.api_server.application.port.out.portfolio.HoldingPort
import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.portfolio.Account
import com.yg.share_your_portfolio.api_server.domain.portfolio.Holding
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.math.RoundingMode

@Service
@Transactional
class AccountService(
    private val accountPort: AccountPort,
    private val holdingPort: HoldingPort,
) : AccountUseCase {

    override fun getAccounts(): List<AccountSummary> =
        accountPort.findAll().map { account ->
            toSummary(account, holdingPort.findByAccountId(account.id))
        }

    override fun getAccount(id: AccountId): AccountSummary {
        val account = accountPort.findById(id) ?: throw NoSuchElementException("계좌를 찾을 수 없습니다.")
        return toSummary(account, holdingPort.findByAccountId(id))
    }

    override fun createAccount(command: CreateAccountCommand): AccountSummary {
        val account = Account(
            id = AccountId(0L),
            institution = command.institution,
            accountNumber = maskAccountNumber(command.accountNumber),
            type = command.accountType,
            name = command.accountName,
        )
        val saved = accountPort.save(account)
        return toSummary(saved, emptyList())
    }

    override fun updateAccount(id: AccountId, command: UpdateAccountCommand): AccountSummary {
        accountPort.findById(id) ?: throw NoSuchElementException("계좌를 찾을 수 없습니다.")
        val updated = Account(
            id = id,
            institution = command.institution,
            accountNumber = maskAccountNumber(command.accountNumber),
            type = command.accountType,
            name = command.accountName,
        )
        val saved = accountPort.save(updated)
        return toSummary(saved, holdingPort.findByAccountId(id))
    }

    override fun deleteAccount(id: AccountId) {
        accountPort.findById(id) ?: throw NoSuchElementException("계좌를 찾을 수 없습니다.")
        holdingPort.deleteByAccountId(id)
        accountPort.delete(id)
    }

    private fun maskAccountNumber(accountNumber: String): String {
        val last4 = accountNumber.takeLast(4)
        return "****-****-$last4"
    }

    private fun toSummary(account: Account, holdings: List<Holding>): AccountSummary {
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
