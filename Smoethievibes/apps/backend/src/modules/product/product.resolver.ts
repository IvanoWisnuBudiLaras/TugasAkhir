import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { ProductService } from "./product.service";
import { Product } from "./product.model";
import { Category } from "./category.model";
import { CreateProductInput } from "./dto/create-product.input";
import { UpdateProductInput } from "./dto/update-product.input";

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  async createProduct(@Args("createProductInput") createProductInput: CreateProductInput) {
    return this.productService.create(createProductInput);
  }

  @Query(() => [Product], { name: "products" })
  async findAll() {
    return this.productService.findAll();
  }

  @Query(() => Product, { name: "product" })
  async findOne(@Args("id", { type: () => ID }) id: string) {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args("id", { type: () => ID }) id: string,
    @Args("updateProductInput") updateProductInput: UpdateProductInput
  ) {
    return this.productService.update(id, updateProductInput);
  }

  @Mutation(() => Product)
  async deleteProduct(@Args("id", { type: () => ID }) id: string) {
    return this.productService.remove(id);
  }

  @Query(() => [Product], { name: "productsByCategory" })
  async findByCategory(@Args("categoryId", { type: () => ID }) categoryId: string) {
    return this.productService.findByCategory(categoryId);
  }

  @Query(() => [Product], { name: "productsByCategorySlug" })
  async findByCategorySlug(@Args("categorySlug") categorySlug: string) {
    return this.productService.findByCategorySlug(categorySlug);
  }

  @Query(() => [Category], { name: "categories" })
  async findAllCategories() {
    return this.productService.findAllCategories();
  }

  @Query(() => Category, { name: "category" })
  async findOneCategory(@Args("id", { type: () => ID }) id: string) {
    return this.productService.findOneCategory(id);
  }
}