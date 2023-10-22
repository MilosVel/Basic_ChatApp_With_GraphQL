import { gql } from '@apollo/client';

export const messagesQuery = gql`
  query MessagesQuery {
    messages {
      id
      user
      text
    }
  }
`;

export const addMessageMutation = gql`
  mutation AddMessageMutation($text: String!) {
    message: addMessage(text: $text) {
      id
      user
      text
    }
  }
`;


//  MessageAddedSubscription je ime
// sa  message: messageAdded  vrsi se preimenovanje tako da klijen dobija message a ne messageAdded
export const messageAddedSubscription = gql`
  subscription MessageAddedSubscription {
    newMessageAdded: messageAdded {
      id
      user
      text
    }
  }
`;
