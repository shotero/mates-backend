import { Model, QueryBuilder, AjvValidator } from 'objection';
import { splitAt, isEmpty } from 'ramda';
import addFormats from 'ajv-formats';

const operations = {
  eq: (builder, columnName, value) => {
    return builder.where(columnName, '=', value.trim());
  },
  gt: (builder, columnName, value) => {
    return builder.where(columnName, '>', value.trim());
  },
  lt: (builder, columnName, value) => {
    return builder.where(columnName, '<', value.trim());
  },
  in: (builder, columnName, value) => {
    return builder.whereIn(
      columnName,
      value.split(',').map((i) => i.trim())
    );
  },
  near: (builder, columnName, value) => {
    return builder;
  },
  search: (builder, columnName, value) => {
    return builder;
  }
};

class BaseQueryBuilder extends QueryBuilder {
  filter(querySet) {
    return Object.keys(querySet).reduce((builder, param) => {
      const parsedParam = param.split('::');
      const columnName = parsedParam[0];
      const operation = operations[parsedParam[1]];
      return operation(builder, columnName, querySet[param]);
    }, this);
  }
}

class Base extends Model {
  static get QueryBuilder() {
    return BaseQueryBuilder;
  }
  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats(ajv);
      },
      options: {
        allErrors: true,
        validateSchema: false,
        ownProperties: true,
        v5: true
      }
    });
  }
}

export default Base;
