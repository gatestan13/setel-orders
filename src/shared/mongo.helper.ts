import * as config from 'config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export function getMongoConfig(): MongooseModuleOptions {
  return {
    uri: config.get('mongodb.uri'),
  };
}
