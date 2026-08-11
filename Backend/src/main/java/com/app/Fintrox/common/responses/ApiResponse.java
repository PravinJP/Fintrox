package com.app.Fintrox.common.responses;



import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Standard API Response Wrapper for all REST endpoints
 * Provides consistent response structure across the application
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private String error;
    private LocalDateTime timestamp;
    private String path;

    // ===== Success Responses =====


    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message("Success")
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }


    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }


    public static <T> ApiResponse<T> success(String message, T data, String path) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .path(path)
                .build();
    }


    public static <T> ApiResponse<T> success(String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }


    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .error(message)
                .timestamp(LocalDateTime.now())
                .build();
    }


    public static <T> ApiResponse<T> error(String message, String error) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .error(error)
                .timestamp(LocalDateTime.now())
                .build();
    }


    public static <T> ApiResponse<T> error(String message, String error, String path) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .error(error)
                .timestamp(LocalDateTime.now())
                .path(path)
                .build();
    }


    public static <T> ApiResponse<T> validationError(String message, T errors) {
        return ApiResponse.<T>builder()
                .success(false)
                .message("Validation failed")
                .error(message)
                .data(errors)
                .timestamp(LocalDateTime.now())
                .build();
    }


    public boolean isSuccess() {
        return success;
    }


    public boolean hasData() {
        return data != null;
    }


    public boolean hasError() {
        return error != null;
    }
}
