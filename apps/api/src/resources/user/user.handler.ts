import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import { User } from 'types';
import { DATABASE_DOCUMENTS } from 'app-constants';

import logger from 'logger';
import ioEmitter from 'io-emitter';

const { USERS } = DATABASE_DOCUMENTS;

eventBus.on(`${USERS}.updated`, (data: InMemoryEvent<User>) => {
  try {
    const user = data.doc;

    ioEmitter.publishToUser(user._id, 'user:updated', user);
  } catch (err) {
    logger.error(`${USERS}.updated handler error: ${err}`);
  }
});
