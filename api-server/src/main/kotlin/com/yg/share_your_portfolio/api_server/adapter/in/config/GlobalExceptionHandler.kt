package com.yg.share_your_portfolio.api_server.adapter.`in`.config

import com.yg.share_your_portfolio.api_server.adapter.`in`.dto.ApiResponse
import com.yg.share_your_portfolio.api_server.application.error.BusinessException
import com.yg.share_your_portfolio.api_server.application.error.ErrorCode
import com.yg.share_your_portfolio.api_server.application.error.SystemException
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
internal class GlobalExceptionHandler {

    private val log = LoggerFactory.getLogger(javaClass)

    @ExceptionHandler(NoSuchElementException::class)
    fun handleNotFound(e: NoSuchElementException): ResponseEntity<ApiResponse<Nothing>> {
        log.info("Not found: {}", e.message)
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ErrorCode.NOT_FOUND))
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgument(e: IllegalArgumentException): ResponseEntity<ApiResponse<Nothing>> {
        log.info("Bad request: {}", e.message)
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(ErrorCode.BAD_REQUEST))
    }

    @ExceptionHandler(BusinessException::class)
    fun handleBusiness(e: BusinessException): ResponseEntity<ApiResponse<Nothing>> {
        log.info("Business exception: {}", e.message)
        return ResponseEntity.status(e.errorCode.httpStatus).body(ApiResponse.error(e.errorCode))
    }

    @ExceptionHandler(SystemException::class)
    fun handleSystem(e: SystemException): ResponseEntity<ApiResponse<Nothing>> {
        log.warn("System exception: {}", e.message, e)
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error(ErrorCode.INTERNAL_SERVER_ERROR))
    }

    @ExceptionHandler(Exception::class)
    fun handleUnknown(e: Exception): ResponseEntity<ApiResponse<Nothing>> {
        log.error("Unknown error: {}", e.message, e)
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error(ErrorCode.UNKNOWN_ERROR))
    }
}
