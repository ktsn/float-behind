# floatbehind
[![Build Status](https://travis-ci.org/ktsn/float-behind.svg?branch=master)](https://travis-ci.org/ktsn/float-behind)

This is the node server for the floatbehind app!

## Development
### ENV
We store environment specific configurations to `/.env` file. e.g. the server hostname, OAuth secrets of extra services.

Variable name       | Description
------------------- | -------------------------------------------------------------------------------
NODE_ENV            | Indicates what environment the server is running. `development` or `production`
SERVICE_HOST        | The hostname of the service. `http://localhost.floatbehind.io:3000`
SLACK_CLIENT_ID     | The client id of Slack app.
SLACK_CLIENT_SECRET | The client secret of Slack app.
DB_PASS             | The password for production database
DB_HOST             | The hostname for production database
REDIS_HOST          | The hostname for production redis
SESSION_SECRET      | The secret value to hash user session.

### Vagrant
requires: vagrant-hostsupdater, vagrant-vbguest

```sh
$ vagrant plugin install vagrant-hostsupdater vagrant-vbguest
$ vagrant up
```

### Migration

```sh
$ npm install -g knex
$ knex migrate:latest
```

### MariaDB config
NODE_ENV=development
- user: floatbehind
- password: floatbehind_pwd
- database: floatbehind_db
