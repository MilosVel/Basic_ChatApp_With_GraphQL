import { GraphQLError } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { createMessage, getMessages } from './db/messages.js';

const pubSub = new PubSub();

export const resolvers = {
  Query: {
    messages: (_root, _args, { user }) => {
      if (!user) throw unauthorizedError();
      return getMessages();
    },
  },

  Mutation: {
    addMessage: async (_root, { text }, { user }) => {
      if (!user) throw unauthorizedError();
      const message = await createMessage(user, text);
      // message.text= 'PROMENA TEKSTA'
      pubSub.publish('MESSAGE_ADDED', { messageAdded: message }); // ovo ce biti dostupono na svim subscribovanim klijent masinama
      return message;
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: (_root, _args, { user }) => {
        console.log('Subscription on backend', user)
        if (!user) throw unauthorizedError();
        return pubSub.asyncIterator('MESSAGE_ADDED'); // ovim se sluca event MESSAGE_ADDED
      },
    },
  },
};

function unauthorizedError() {
  return new GraphQLError('Not authenticated', {
    extensions: { code: 'UNAUTHORIZED' },
  });
}
