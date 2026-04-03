package com.yg.share_your_portfolio.api_server.adapter.`in`.web.portfolio

import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.CodeLabelResponse
import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.CreateHoldingRequest
import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.HoldingResponse
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.CreateHoldingCommand
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.HoldingUseCase
import com.yg.share_your_portfolio.api_server.application.port.`in`.portfolio.UpdateHoldingCommand
import com.yg.share_your_portfolio.api_server.domain.id.AccountId
import com.yg.share_your_portfolio.api_server.domain.id.HoldingId
import com.yg.share_your_portfolio.api_server.domain.portfolio.Holding
import com.yg.share_your_portfolio.api_server.domain.vo.AssetType
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/accounts/{accountId}/holdings")
class HoldingController(private val holdingUseCase: HoldingUseCase) {

    @GetMapping
    fun getHoldings(@PathVariable accountId: Long): List<HoldingResponse> =
        holdingUseCase.getHoldings(AccountId(accountId)).map { it.toResponse() }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createHolding(
        @PathVariable accountId: Long,
        @RequestBody request: CreateHoldingRequest,
    ): HoldingResponse {
        val command = CreateHoldingCommand(
            name = request.name,
            assetType = AssetType.valueOf(request.assetTypeCode),
            currencyExposure = request.currencyExposure,
            principalValue = request.principalValue,
            currentValue = request.currentValue,
        )
        return holdingUseCase.createHolding(AccountId(accountId), command).toResponse()
    }

    @PutMapping("/{holdingId}")
    fun updateHolding(
        @PathVariable accountId: Long,
        @PathVariable holdingId: Long,
        @RequestBody request: CreateHoldingRequest,
    ): HoldingResponse {
        val command = UpdateHoldingCommand(
            name = request.name,
            assetType = AssetType.valueOf(request.assetTypeCode),
            currencyExposure = request.currencyExposure,
            principalValue = request.principalValue,
            currentValue = request.currentValue,
        )
        return holdingUseCase.updateHolding(AccountId(accountId), HoldingId(holdingId), command).toResponse()
    }

    @DeleteMapping("/{holdingId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteHolding(@PathVariable accountId: Long, @PathVariable holdingId: Long) =
        holdingUseCase.deleteHolding(AccountId(accountId), HoldingId(holdingId))
}

private fun Holding.toResponse() = HoldingResponse(
    id = holdingId.value,
    accountId = accountId.value,
    assetName = asset.name,
    assetType = CodeLabelResponse(asset.type.name, asset.type.label),
    currencyExposure = asset.currencyExposure,
    principalValue = principalValue,
    currentValue = currentValue,
    unrealizedGain = unrealizedGain,
    profitRate = getProfitRate(),
)
