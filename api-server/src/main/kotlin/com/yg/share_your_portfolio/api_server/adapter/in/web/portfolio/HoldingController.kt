package com.yg.share_your_portfolio.api_server.adapter.`in`.web.portfolio

import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.HoldingResponse
import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.toResponse
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.HoldingUseCase
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.ModifyHoldingCommand
import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.HoldingId
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/{version}/accounts/{accountId}/holdings")
internal class HoldingController(private val holdingUseCase: HoldingUseCase) {

    @GetMapping(version = "v1")
    fun getHoldings(@PathVariable accountId: Long): List<HoldingResponse> {
        return holdingUseCase.getHoldings(AccountId(accountId)).map { it.toResponse() }
    }

    @PostMapping(version = "v1")
    @ResponseStatus(HttpStatus.CREATED)
    fun createHolding(
        @PathVariable accountId: Long,
        @RequestBody command: ModifyHoldingCommand,
    ): HoldingResponse {
        return holdingUseCase.createHolding(AccountId(accountId), command).toResponse()
    }

    @PutMapping("/{holdingId}", version = "v1")
    fun updateHolding(
        @PathVariable accountId: Long,
        @PathVariable holdingId: Long,
        @RequestBody command: ModifyHoldingCommand,
    ): HoldingResponse {
        return holdingUseCase.updateHolding(AccountId(accountId), HoldingId(holdingId), command)
            .toResponse()
    }

    @DeleteMapping("/{holdingId}", version = "v1")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteHolding(
        @PathVariable accountId: Long,
        @PathVariable holdingId: Long,
    ) {
        holdingUseCase.deleteHolding(AccountId(accountId), HoldingId(holdingId))
    }
}
