package com.yg.share_your_portfolio.api_server.adapter.`in`.web.portfolio

import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.AccountResponse
import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.CodeLabelResponse
import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.CreateAccountRequest
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.AccountSummary
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.AccountUseCase
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.CreateAccountCommand
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.UpdateAccountCommand
import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.vo.AccountType
import com.yg.share_your_portfolio.api_server.domain.vo.Institution
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/accounts")
class AccountController(private val accountUseCase: AccountUseCase) {

    @GetMapping
    fun getAccounts(): List<AccountResponse> =
        accountUseCase.getAccounts().map { it.toResponse() }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createAccount(@RequestBody request: CreateAccountRequest): AccountResponse {
        val command = CreateAccountCommand(
            institution = Institution.valueOf(request.institutionCode),
            accountNumber = request.accountNumber,
            accountType = AccountType.valueOf(request.accountTypeCode),
            accountName = request.accountName,
        )
        return accountUseCase.createAccount(command).toResponse()
    }

    @GetMapping("/{id}")
    fun getAccount(@PathVariable id: Long): AccountResponse =
        accountUseCase.getAccount(AccountId(id)).toResponse()

    @PutMapping("/{id}")
    fun updateAccount(@PathVariable id: Long, @RequestBody request: CreateAccountRequest): AccountResponse {
        val command = UpdateAccountCommand(
            institution = Institution.valueOf(request.institutionCode),
            accountNumber = request.accountNumber,
            accountType = AccountType.valueOf(request.accountTypeCode),
            accountName = request.accountName,
        )
        return accountUseCase.updateAccount(AccountId(id), command).toResponse()
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteAccount(@PathVariable id: Long) =
        accountUseCase.deleteAccount(AccountId(id))
}

private fun AccountSummary.toResponse() = AccountResponse(
    id = account.id.value,
    institution = CodeLabelResponse(account.institution.name, account.institution.label),
    accountNumber = account.accountNumber,
    accountType = CodeLabelResponse(account.type.name, account.type.label),
    accountName = account.name,
    holdingsCount = holdingsCount,
    currentValueKrw = currentValueKrw,
    principalKrw = principalKrw,
    profitRate = profitRate,
)
