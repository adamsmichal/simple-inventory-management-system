import { Command } from 'src/lib/cqrs/command-bus';

import { RestockProductPayload } from '../models/product.models';

export class RestockProductCommand implements Command<RestockProductPayload> {
  type = 'RESTOCK_PRODUCT';

  constructor(public payload: RestockProductPayload) {}
}
