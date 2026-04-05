package com.yg.share_your_portfolio.api_server.adapter.`in`.web.portfolio

import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.PortfolioRequest
import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.PortfolioResponse
import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.toCommand
import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.toResponse
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.PortfolioUseCase
import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/{version}/accounts/{accountId}/portfolio")
internal class PortfolioController(
    private val portfolioUseCase: PortfolioUseCase,
) {

    @GetMapping(version = "v1")
    fun getPortfolio(@PathVariable accountId: Long): PortfolioResponse {
        return portfolioUseCase.getPortfolio(AccountId(accountId)).toResponse()
    }

    @PutMapping(version = "v1")
    fun modifyPortfolio(
        @PathVariable accountId: Long,
        @RequestBody request: PortfolioRequest,
    ): PortfolioResponse {
        return portfolioUseCase.modifyPortfolio(
            accountId = AccountId(accountId),
            command = request.toCommand(),
        ).toResponse()
    }

    @DeleteMapping(version = "v1")
    fun deletePortfolio(@PathVariable accountId: Long) {
        portfolioUseCase.deletePortfolio(AccountId(accountId))
    }

    @GetMapping("/gap", version = "v1")
    fun getPortfolioGap(@PathVariable accountId: Long) {

    }
}
