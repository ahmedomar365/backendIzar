import { ProductController } from "./controller/ProductController"
import { UserController } from "./controller/UserController"
// import {  } from "./controller/ProductController"
export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
    validation: [],
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
}, {
    method: "post",
    route: "/products",
    controller: ProductController,
    action: "save",
}, {
    method: "get",
    route: "/products",
    controller: ProductController,
    action: "all"
}, {
    method: "get",
    route: "/products/:id",
    controller: ProductController,
    action: "one"
}, {
    method: "delete",
    route: "/products/:id",
    controller: ProductController,
    action: "remove"
}, {
    method: "put",
    route: "/products/:id",
    controller: ProductController,
    action: "update"
}



]