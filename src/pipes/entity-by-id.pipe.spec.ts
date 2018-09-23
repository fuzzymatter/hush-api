import { ArgumentMetadata, NotFoundException } from '@nestjs/common';
import uuid from 'uuid';
import { EntityByIdPipe } from '../pipes/entity-by-id.pipe';

describe('EntityByIdPipe', () => {
  describe('transform', () => {
    describe('`metadata` requirements are not met', () => {
      it('should behave as an identity function', async () => {
        const mockRepository = { findOne: jest.fn() };
        const pipe = new EntityByIdPipe(() => mockRepository as any);
        const value = 'test';

        expect(await pipe.transform(value, {} as any)).toBe(value);
        expect(mockRepository.findOne).toHaveBeenCalledTimes(0);
      });
    });

    describe('`metadata` requirements are not met', () => {
      it('return an entity', async () => {
        const metadata: ArgumentMetadata = {
          type: 'param',
          metatype: Function,
          data: 'id',
        };

        const id = uuid.v4();
        const entity = { id };
        const mockRepository = { findOne: jest.fn().mockResolvedValue(entity) };
        const pipe = new EntityByIdPipe(() => mockRepository as any);

        await expect(pipe.transform(id, metadata)).resolves.toBe(entity);
        expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      });

      it('should throw NotFoundException if entity not found', async () => {
        const metadata: ArgumentMetadata = {
          type: 'param',
          metatype: Function,
          data: 'id',
        };

        const id = uuid.v4();
        const mockRepository = { findOne: jest.fn().mockResolvedValue(null) };
        const pipe = new EntityByIdPipe(() => mockRepository as any);

        await expect(pipe.transform(id, metadata)).rejects.toThrowError(
          NotFoundException,
        );
        expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      });
    });
  });
});
