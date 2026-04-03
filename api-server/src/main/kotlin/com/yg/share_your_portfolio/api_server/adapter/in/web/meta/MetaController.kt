package com.yg.share_your_portfolio.api_server.adapter.`in`.web.meta

import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.AssetSearchResponse
import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.CodeLabelResponse
import com.yg.share_your_portfolio.api_server.application.port.`in`.meta.MetaUseCase
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/meta")
internal class MetaController(private val metaUseCase: MetaUseCase) {
    @GetMapping("/institutions", version = "v1")
    internal fun getInstitutions(): List<CodeLabelResponse> = metaUseCase.getInstitutions()
        .map { CodeLabelResponse(it.name, it.label) }

    @GetMapping("/account-types", version = "v1")
    internal fun getAccountTypes(): List<CodeLabelResponse> = metaUseCase.getAccountTypes()
        .map { CodeLabelResponse(it.name, it.label) }

    @GetMapping("/asset-types", version = "v1")
    internal fun getAssetTypes(): List<CodeLabelResponse> = metaUseCase.getAssetTypes()
        .map { CodeLabelResponse(it.name, it.label) }

    @GetMapping("/assets", version = "v1")
    internal fun searchAssets(@RequestParam q: String): List<AssetSearchResponse> = metaUseCase.searchAssets(q)
        .map {
            AssetSearchResponse(
                name = it.name,
                assetTypeCode = it.type.name,
                assetTypeLabel = it.type.label,
                currencyExposure = it.currencyExposure,
            )
        }
}
