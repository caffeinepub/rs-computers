import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Service {
    id: bigint;
    duration: string;
    name: string;
    description: string;
    price: number;
}
export interface ShopInfo {
    hours: string;
    name: string;
    email: string;
    address: string;
    phone: string;
}
export interface Product {
    id: bigint;
    inStock: boolean;
    name: string;
    description: string;
    category: Category;
    price: number;
}
export enum Category {
    Accessories = "Accessories",
    Laptop = "Laptop",
    Desktop = "Desktop",
    Monitors = "Monitors"
}
export interface backendInterface {
    addProduct(name: string, description: string, price: number, category: Category, inStock: boolean): Promise<bigint>;
    addService(name: string, description: string, price: number, duration: string): Promise<bigint>;
    deleteProduct(id: bigint): Promise<void>;
    deleteService(id: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getAllServices(): Promise<Array<Service>>;
    getProduct(id: bigint): Promise<Product>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getService(id: bigint): Promise<Service>;
    getShopInfo(): Promise<ShopInfo>;
    resetData(): Promise<void>;
    seedData(): Promise<void>;
    updateProduct(id: bigint, name: string, description: string, price: number, category: Category, inStock: boolean): Promise<void>;
    updateService(id: bigint, name: string, description: string, price: number, duration: string): Promise<void>;
}
