import * as config from 'config';

export function getJwtConfig() {
  return {
    secret: config.get('jwt.secret'),
  };
}
