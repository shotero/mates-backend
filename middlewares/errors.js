import objection from 'objection';

async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    console.error(err);
    const e = errorParser(err);
    ctx.status = e.status;
    ctx.body = e.body;
  }
}

function errorParser(err) {
  if (err instanceof objection.ValidationError) {
    switch (err.type) {
      case 'ModelValidation':
        return {
          status: 400,
          body: {
            message: err.message,
            type: err.type,
            data: err.data
          }
        };
      case 'RelationExpression':
        return {
          status: 400,
          body: {
            message: err.message,
            type: 'RelationExpression',
            data: {}
          }
        };
      case 'UnallowedRelation':
        return {
          status: 400,
          body: {
            message: err.message,
            type: err.type,
            data: {}
          }
        };
      case 'InvalidGraph':
        return {
          status: 400,
          body: {
            message: err.message,
            type: err.type,
            data: {}
          }
        };
      default:
        return {
          status: 400,
          body: {
            message: err.message,
            type: 'UnknownValidationError',
            data: {}
          }
        };
    }
  } else if (err instanceof objection.NotFoundError) {
    return {
      status: 404,
      body: {
        message: err.message,
        type: 'NotFound',
        data: {}
      }
    };
  } else if (err instanceof objection.UniqueViolationError) {
    return {
      status: 409,
      body: {
        message: err.message,
        type: 'UniqueViolation',
        data: {
          columns: err.columns,
          table: err.table,
          constraint: err.constraint
        }
      }
    };
  } else if (err instanceof objection.NotNullViolationError) {
    return {
      status: 400,
      body: {
        message: err.message,
        type: 'NotNullViolation',
        data: {
          column: err.column,
          table: err.table
        }
      }
    };
  } else if (err instanceof objection.ForeignKeyViolationError) {
    return {
      status: 409,
      body: {
        message: err.message,
        type: 'ForeignKeyViolation',
        data: {
          table: err.table,
          constraint: err.constraint
        }
      }
    };
  } else if (err instanceof objection.CheckViolationError) {
    return {
      status: 400,
      body: {
        message: err.message,
        type: 'CheckViolation',
        data: {
          table: err.table,
          constraint: err.constraint
        }
      }
    };
  } else if (err instanceof objection.DataError) {
    return {
      status: 400,
      body: {
        message: err.message,
        type: 'InvalidData',
        data: {}
      }
    };
  } else if (err instanceof objection.DBError) {
    return {
      status: 500,
      body: {
        message: err.message,
        type: 'UnknownDatabaseError',
        data: {}
      }
    };
  } else {
    return {
      status: 500,
      body: {
        message: err.message,
        type: 'UnknownError',
        data: {}
      }
    };
  }
}

export {
  errorHandler, errorParser
};
