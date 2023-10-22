import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { addMessageMutation, messageAddedSubscription, messagesQuery } from './queries';

export function useAddMessage() {
  const [mutate] = useMutation(addMessageMutation);

  const addMessage = async (text) => {
    const { data: { message } } = await mutate({
      variables: { text },
      // update: (cache, { data }) => { // kesiranje
      //   const newMessage = data.message;
      //   cache.updateQuery({ query: messagesQuery }, ({ messages }) => {
      //     return { messages: [...messages, newMessage] };
      //   });
      // },
    });
    return message;
  };

  return { addMessage };
}

export function useMessages() {
  const { data } = useQuery(messagesQuery);
  useSubscription(messageAddedSubscription,{
    onData: ({ client, data }) => { // ovo je listener function koja ce biti pozvana za svaku notifikaciju
      const newMessage = data.data.newMessageAdded;
      // console.log('New message', newMessage)
      client.cache.updateQuery({ query: messagesQuery }, ({ messages }) => { // ovim je  message vidljiva i kod posiljaoca
        return { messages: [...messages, newMessage] };
      });
    },
  }
  );
  return {
    messages: data?.messages ?? [],
  };
}
