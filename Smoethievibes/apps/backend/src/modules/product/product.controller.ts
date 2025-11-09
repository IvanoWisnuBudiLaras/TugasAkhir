import { Controller, Get } from "@nestjs/common";

@Controller("products")
export class ProductController {
  @Get()
  list() {
    return [{ id: "p1", name: "Sample Product", price: 15000 }];
  }
}
