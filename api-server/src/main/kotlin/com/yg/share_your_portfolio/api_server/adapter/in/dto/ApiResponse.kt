package com.yg.share_your_portfolio.api_server.adapter.`in`.dto

import com.yg.share_your_portfolio.api_server.application.error.ErrorCode

internal data class ApiResponse<T>(
    val success: Boolean,
    val errorCode: ErrorCode?,
    val errorMessage: String?,
    val data: T?,
) {
    companion object {
        fun <T> success(data: T?) = ApiResponse(
            success = true,
            errorCode = null,
            errorMessage = null,
            data = data,
        )

        fun error(errorCode: ErrorCode) = ApiResponse(
            success = false,
            errorCode = errorCode,
            errorMessage = errorCode.message,
            data = null,
        )
    }
}
