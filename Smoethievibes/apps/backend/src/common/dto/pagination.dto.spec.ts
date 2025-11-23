import { PaginationDto } from './pagination.dto';
import { validate } from 'class-validator';

describe('PaginationDto', () => {
  describe('validation', () => {
    it('should validate with default values', async () => {
      const dto = new PaginationDto();
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(10);
      expect(dto.sortBy).toBe('createdAt');
      expect(dto.order).toBe('desc');
    });

    it('should validate with custom values', async () => {
      const dto = new PaginationDto();
      dto.page = 2;
      dto.limit = 20;
      dto.sortBy = 'name';
      dto.order = 'ASC';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect(dto.page).toBe(2);
      expect(dto.limit).toBe(20);
      expect(dto.sortBy).toBe('name');
      expect(dto.order).toBe('asc');
    });

    it('should validate maximum limit', async () => {
      const dto = new PaginationDto();
      dto.limit = 100;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect(dto.limit).toBe(100);
    });

    it('should fail validation for limit over 100', async () => {
      const dto = new PaginationDto();
      dto.limit = 101;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('limit');
    });

    it('should fail validation for invalid order', async () => {
      const dto = new PaginationDto();
      dto.order = 'invalid' as any;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('order');
    });

    it('should fail validation for negative page', async () => {
      const dto = new PaginationDto();
      dto.page = -1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('page');
    });

    it('should fail validation for zero limit', async () => {
      const dto = new PaginationDto();
      dto.limit = 0;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('limit');
    });
  });
});

describe('PaginatedResponse', () => {
  it('should create paginated response', () => {
    const response = {
      data: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }],
      meta: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };

    expect(response.data).toHaveLength(2);
    expect(response.meta.total).toBe(2);
    expect(response.meta.page).toBe(1);
    expect(response.meta.limit).toBe(10);
    expect(response.meta.totalPages).toBe(1);
  });
});