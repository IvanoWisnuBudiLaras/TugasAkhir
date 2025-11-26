import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const isGraphQL = context.getClass().name.includes('GraphQL');
    
    if (isGraphQL) {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req.user;
    } else {
      // REST request
      const request = context.switchToHttp().getRequest();
      return request.user;
    }
  },
);