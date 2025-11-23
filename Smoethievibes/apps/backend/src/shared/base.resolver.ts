import { Query, Mutation, Args, ID } from '@nestjs/graphql';

export abstract class BaseResolver {
  protected abstract service: any;

  @Query()
  async findAll(@Args('pagination') pagination: any) {
    return this.service.findAll(pagination);
  }

  @Query()
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return this.service.findOne(id);
  }

  @Mutation()
  async create(@Args('input') input: any) {
    return this.service.create(input);
  }

  @Mutation()
  async update(@Args('id', { type: () => ID }) id: string, @Args('input') input: any) {
    return this.service.update(id, input);
  }

  @Mutation()
  async remove(@Args('id', { type: () => ID }) id: string) {
    return this.service.remove(id);
  }
}