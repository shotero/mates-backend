const DEFAULT_PAGE_SIZE = 1000;

class BaseController {
  constructor(model, id, sort) {
    this.model = model;
    this.id = id;
    this.sort = sort || 'created_at';
  }

  async create(ctx) {
    let data = ctx.request.body;
    ctx.status = 201;
    ctx.body = await this.model.query().insert(data).returning('*');
  }

  async list(ctx) {
    const query = ctx.request.query;
    let dbQuery = this.model
      .query()
      .withGraphJoined(`[${query.include ? query.include : ''}]`)
      .filter(query.where || {})
      .alias('me')
      .skipUndefined();

    if (query.sort) {
      const sort = query.sort
        .split(',')
        .map((i) =>
          i.startsWith('-')
            ? { column: i.substr(1), order: 'desc' }
            : { column: i, order: 'asc' }
        );
      dbQuery = dbQuery.orderBy(sort);
    } else {
      dbQuery = dbQuery.orderBy([{ column: this.sort, order: 'desc' }]);
    }

    if (query.page) {
      dbQuery = dbQuery.page(
        query.page && query.page.number,
        query.page && query.page.size
      );
    } else {
      dbQuery = dbQuery.page(0, DEFAULT_PAGE_SIZE);
    }

    ctx.body = await dbQuery;
  }

  async show(ctx) {
    const id = ctx.request.params[this.id];
    const query = ctx.request.query;
    ctx.status = 200;
    ctx.body = await this.model
      .query()
      .withGraphJoined(`[${query.include ? query.include : ''}]`)
      .alias('me')
      .findById(id);
  }

  async update(ctx) {
    // TODO: implementation
    ctx.status = 204;
    ctx.body = null;
  }

  async destroy(ctx) {
    // TODO: implementation
    ctx.status = 204;
    ctx.body = null;
  }
}

export default BaseController;
