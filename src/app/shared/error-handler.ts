import { HttpErrorResponse } from "@angular/common/http";

export function getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
        return `Client-side error: ${error.error.message}`;
    } else {
        if (typeof error.error === "string") {
            return error.error;
        } else {
            switch (error.status) {
                case 400:
                    return "Bad request. Please check you input";
                case 401:
                    return "Unauthorized. Please log in again.";
                case 403:
                    return "Forbidden. You do not have permission to access this resource.";
                case 404:
                    return "Not found. The requested resource could not be found.";
                case 500:
                    return "Internal server error. Please try again later."
                case 503:
                    return "Service not available. Please try again later.";
                default:
                    return `Unexpected error: ${error.message || 'Unknown error'}`;
            }
        }
    }
}