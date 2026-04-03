package com.yg.share_your_portfolio.api_server.adapter.`in`.web.portfolio

import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.AccountResponse
import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.toResponse
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.AccountUseCase
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.ModifyAccountCommand
import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/accounts")
internal class AccountController(private val accountUseCase: AccountUseCase) {

    @GetMapping(version = "v1")
    fun getAccounts(): List<AccountResponse> = accountUseCase.getAccounts().map { it.toResponse() }

    @PostMapping(version = "v1")
    fun createAccount(@RequestBody command: ModifyAccountCommand): AccountResponse {
        return accountUseCase.createAccount(command).toResponse()
    }

    @GetMapping("/{id}", version = "v1")
    fun getAccount(@PathVariable id: Long): AccountResponse {
        return accountUseCase.getAccount(AccountId(id)).toResponse()
    }

    @PutMapping("/{id}", version = "v1")
    fun updateAccount(
        @PathVariable id: Long,
        @RequestBody command: ModifyAccountCommand,
    ): AccountResponse {
        return accountUseCase.updateAccount(AccountId(id), command).toResponse()
    }

    @DeleteMapping("/{id}", version = "v1")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteAccount(@PathVariable id: Long) {
        accountUseCase.deleteAccount(AccountId(id))
    }
}
