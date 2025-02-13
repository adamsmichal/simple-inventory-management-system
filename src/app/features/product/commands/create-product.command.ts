import { Command } from 'src/lib/cqrs/command-bus';

import { CreateProductPayload } from '../models/product.models';

export class CreateProductCommand implements Command<CreateProductPayload> {
  type = 'CREATE_PRODUCT';

  constructor(public payload: CreateProductPayload) {}
}
