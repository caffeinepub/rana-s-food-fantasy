import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    name: string;
    description: string;
    available: boolean;
    category: Category;
    price: bigint;
}
export enum Category {
    specialPerKg = "specialPerKg",
    gymProtein = "gymProtein",
    monthlyFood = "monthlyFood"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPersistentMenuItem(menuItem: MenuItem): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deletePersistentMenuItem(id: bigint): Promise<void>;
    getAllPersistentMenuItems(): Promise<Array<[bigint, MenuItem]>>;
    getAllPersistentMenuItemsByCategory(): Promise<Array<[Category, Array<[bigint, MenuItem]>]>>;
    getCallerUserRole(): Promise<UserRole>;
    getPersistentMenuItem(id: bigint): Promise<MenuItem>;
    getPersistentMenuItemsByCategory(category: Category): Promise<Array<MenuItem>>;
    isCallerAdmin(): Promise<boolean>;
    seedSampleItems(): Promise<void>;
    updatePersistentMenuItem(id: bigint, menuItem: MenuItem): Promise<void>;
}
