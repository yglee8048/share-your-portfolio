package com.yg.share_your_portfolio.api_server.adapter.`in`.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ApiVersionConfigurer
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
internal class WebConfig(
    @Value("\${cors.allowed-origins}") private val allowedOrigins: Array<String>,
) : WebMvcConfigurer {

    override fun configureApiVersioning(configurer: ApiVersionConfigurer) {
        configurer
            .usePathSegment(1) // /api/{version}/... 에서 버전 추출
            .setVersionRequired(true) // 버전 없는 요청 → HTTP 400
            .addSupportedVersions("v1") // 현재 지원 버전
    }

    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/api/**")
            .allowedOrigins(*allowedOrigins)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
    }
}
