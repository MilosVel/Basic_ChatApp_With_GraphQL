import { ApolloClient, ApolloLink, concat, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';
import { createClient as createWsClient } from 'graphql-ws';
import { getAccessToken } from '../auth';

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

const httpLink = concat(authLink, createHttpLink({  // ukljucena autentifikacija
  uri: 'http://localhost:9000/graphql'
}));

const wsLink = new GraphQLWsLink(createWsClient({
  url: 'ws://localhost:9000/graphql',
  connectionParams: () => ({ accessToken: getAccessToken() }),
}));

export const apolloClient = new ApolloClient({
  link: split(isSubscription, wsLink, httpLink), // if is isSubscription onda cemo da koristimo wsLink, a ako to nije slucaj onda httpLink
  cache: new InMemoryCache(),
});

function isSubscription(operation) {// mora se odrediti da li je operacija subscription ili nije
  // console.log(operation)
  const definition = getMainDefinition(operation.query);
  return definition.kind === Kind.OPERATION_DEFINITION
    && definition.operation === OperationTypeNode.SUBSCRIPTION;
}
