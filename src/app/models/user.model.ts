export interface User {
    userId: string;
    password: string;
    consumerId?: string;
    billNumber?: string;
    customerName?: string;
    email?: string;
    countryCode?: string;
    mobile?: string;
    registeredAt?: string;
}

export interface LoginCredentials {
    userId: string;
    password: string;
} 