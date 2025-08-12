//package com.example.TelConnect.exception;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.context.request.WebRequest;
//
//import java.time.LocalDateTime;
//
//@ControllerAdvice
//public class GlobalExceptionHandler {
//
//    // Handle specific exception: Customer not found
//    @ExceptionHandler(CustomerNotFoundException.class)
//    public ResponseEntity<ErrorResponse> handleCustomerNotFoundException(CustomerNotFoundException ex, WebRequest request) {
//        ErrorResponse errorDetails = new ErrorResponse(
//                LocalDateTime.now(),
//                HttpStatus.NOT_FOUND.value(),
//                ex.getMessage(),
//                request.getDescription(false));
//        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
//    }
//
//    // Handle specific exception: Duplicate customer registration
//    @ExceptionHandler(DuplicateCustomerException.class)
//    public ResponseEntity<ErrorResponse> handleDuplicateCustomerException(DuplicateCustomerException ex, WebRequest request) {
//        ErrorResponse errorDetails = new ErrorResponse(
//                LocalDateTime.now(),
//                HttpStatus.CONFLICT.value(),
//                ex.getMessage(),
//                request.getDescription(false));
//        return new ResponseEntity<>(errorDetails, HttpStatus.CONFLICT);
//    }
//
//    // Handle generic exceptions
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
//        ErrorResponse errorDetails = new ErrorResponse(
//                LocalDateTime.now(),
//                HttpStatus.INTERNAL_SERVER_ERROR.value(),
//                ex.getMessage(),
//                request.getDescription(false));
//        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//@ExceptionHandler(DocumentNotFoundException.class)
//public ResponseEntity<ErrorResponse> handleDocumentNotFoundException(DocumentNotFoundException ex, WebRequest request) {
//    ErrorResponse errorDetails = new ErrorResponse(
//            LocalDateTime.now(),
//            HttpStatus.NOT_FOUND.value(),
//            ex.getMessage(),
//            request.getDescription(false));
//    return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
//}
//
//// Handle InvalidDocumentTypeException
//@ExceptionHandler(InvalidDocumentTypeException.class)
//public ResponseEntity<ErrorResponse> handleInvalidDocumentTypeException(InvalidDocumentTypeException ex, WebRequest request) {
//    ErrorResponse errorDetails = new ErrorResponse(
//            LocalDateTime.now(),
//            HttpStatus.BAD_REQUEST.value(),
//            ex.getMessage(),
//            request.getDescription(false));
//    return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
//}
//
//// Generic exception handler
//@ExceptionHandler(Exception.class)
//public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
//    ErrorResponse errorDetails = new ErrorResponse(
//            LocalDateTime.now(),
//            HttpStatus.INTERNAL_SERVER_ERROR.value(),
//            ex.getMessage(),
//            request.getDescription(false));
//    return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
////
//}