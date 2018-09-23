import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class EntityByIdPipe implements PipeTransform<string, {}> {
  private readonly repository: Repository<{}>;

  constructor(private readonly getRepository: () => Repository<{}>) {
    this.repository = getRepository();
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' && metadata.data !== 'id') {
      return value;
    }
    const entity = await this.repository.findOne(value);

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }
}
