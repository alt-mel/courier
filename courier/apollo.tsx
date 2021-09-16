import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-community/async-storage';

const URI = 'http://localhost:4000/';

const httpLink = createHttpLink({
  uri: URI
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization:
        token ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzYzOTc0YjZmMjZjNmNkNzg4MTE4MyIsImlhdCI6MTYzMTcxMzEyOSwiZXhwIjoxNjM0MzA1MTI5fQ.-FcVUin-N599AZhmAoD6gRuhRvReNS4SnyftoMaLjz4'
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
