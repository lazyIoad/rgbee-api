import session from 'koa-session';

const config: Partial<session.opts> = {
  key: 'rgbee.sess',
  overwrite: true,
  httpOnly: true,
  renew: true,
  // secure: true,
};

export default config;
