import * as jose from 'jose';
/*
Two ways of registration:
  - Invite
  - Request to join

Invite flow #1:
  - existing user creates users
  - existing/another user invites new users
  - users click on invite link
  - signs up and gets added to the batch

Register flow:
  - A user signs up
  - user creates the batch

Register flow #2:
  - A user signs up
  - requests to be added to a batch


These flows will be followed both by callback
*/

async function response(ctx) {
  // validate response
  const body =
    (ctx.session && ctx.session.grant && ctx.session.grant.response) ||
    ctx.body;
  if (!body) {
    return ctx.throw(400, 'authentication error');
  }
  const profile = body.profile;
  let user = {};
  let account = {};

  // find user account
  // login
  const accounts = await ctx.db('public.user_accounts as ua').where({
    email: profile.email
  });

  // if there is a db user but the provider don't match
  // create alternative account
  // return the db user
  const hasAccount = accounts.find(
    (acc) => acc.provider === 'google' && acc.external_id === profile.sub
  );
  const userId = accounts.length && accounts[0].user_id;

  if (accounts.length && !hasAccount) {
    const accountData = {
      email: profile.email,
      external_id: profile.sub,
      provider: 'google',
      user_id: userId
    };

    account = await ctx
      .db('public.user_accounts')
      .insert(accountData)
      .returning('*');
  }

  if (!account.length) {
    // if no db user or account
    // create user account
    const userData = {
      full_name: profile.name,
      display_name: profile.given_name
    };
    user = await ctx.db('public.users').insert(user).returning('*');

    const accountData = {
      email: profile.email,
      external_id: profile.sub,
      provider: 'google',
      user_id: user.length && user.id
    };

    account = await ctx
      .db('public.user_accounts')
      .insert(account)
      .returning('*');

    // find the invite_id from session
    // associate the user if there is a batch in session

    // if there is no session invite_id
    // then take the user to onboarding
  }
  return (ctx.body = { user, account });
}

export { response };
