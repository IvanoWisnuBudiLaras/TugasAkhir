import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

export const ApiResponseType = <TModel extends Type<any>>(
  model: TModel,
  options?: Omit<ApiResponseOptions, 'type'>,
) => {
  return applyDecorators(
    ApiResponse({
      type: model,
      ...options,
    }),
  );
};