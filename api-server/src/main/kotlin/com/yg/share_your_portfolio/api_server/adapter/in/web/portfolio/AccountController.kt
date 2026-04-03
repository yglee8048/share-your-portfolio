package com.yg.share_your_portfolio.api_server.adapter.`in`.web.portfolio

import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.AccountResponse
import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.ModifyAccountRequest
import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.toResponse
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
internal class AccountController(private val accountUseCase: AccountUseCase) {

    @GetMapping(version = "v1")
    fun getAccounts(): List<AccountResponse> = accountUseCase.getAccounts().map { it.toResponse() }

    @PostMapping(version = "v1")
    fun createAccount(@RequestBody request: ModifyAccountRequest): AccountResponse {
        val command = CreateAccountCommand(
            institution = Institution.valueOf(request.institutionCode),
            accountNumber = request.accountNumber,
            accountType = AccountType.valueOf(request.accountTypeCode),
            accountName = request.accountName,
        )
        return accountUseCase.createAccount(command).toResponse()
    }

    @GetMapping("/{id}", version = "v1")
    fun getAccount(@PathVariable id: Long): AccountResponse {
        return accountUseCase.getAccount(AccountId(id)).toResponse()
    }

    @PutMapping("/{id}", version = "v1")
    fun updateAccount(
        @PathVariable id: Long,
        @RequestBody request: ModifyAccountRequest,
    ): AccountResponse {
        val command = UpdateAccountCommand(
            institution = Institution.valueOf(request.institutionCode),
            accountNumber = request.accountNumber,
            accountType = AccountType.valueOf(request.accountTypeCode),
            accountName = request.accountName,
        )
        return accountUseCase.updateAccount(AccountId(id), command).toResponse()
    }

    @DeleteMapping("/{id}", version = "v1")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteAccount(@PathVariable id: Long) {
        accountUseCase.deleteAccount(AccountId(id))
    }
}
