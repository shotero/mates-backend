async function isLoggedIn(ctx, next) {
  // is the jwt invalid or expired
  // then return 401 unauthenticated
  // else
  ctx.state.user = JWT.verify(context.request.getHeader('Authorization'), ctx.config.secret)
  return next();
}

async function hasPermission(ctx, next) {
  return next();
}

export { isLoggedIn, hasPermission };
