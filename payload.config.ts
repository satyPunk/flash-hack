import { Config } from 'payload/config';
import Users from './collections/Users';
import Posts from './collections/Posts';

const config: Config = {
  serverURL: 'http://localhost:3000',
  collections: [
    Users,
    Posts,
  ],
  admin: {
    user: 'users',  // Reference to the Users collection
  }
};

export default config;
