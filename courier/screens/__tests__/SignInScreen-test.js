import * as React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';
import {render, fireEvent, act } from '@testing-library/react-native';
import SignInScreen from '../SignInScreen';

const SIGN_IN_MUTATION = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const mocks = [ {
    request: {
      query: SIGN_IN_MUTATION,
      variables: {
        email: 'email',
        password: 'password'
      },
    },
    result: {
      data: {
        signIn: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzYzOTc0YjZmMjZjNmNkNzg4MTE4MyIsImlhdCI6MTYzMTEyNTg4MSwiZXhwIjoxNjMzNzE3ODgxfQ.QlAWUoJ6z-40MS2GtDsbc9btN98Lxb_Nd4Z4I3DPGEA',
          user: {
            id: '61363974b6f26c6cd7881183',
            name: 'John Briggs',
            email: 'admin@john.com'
          }
        }
      }
    },
  },];

it('renders the Sign In Screen', () => {
  const tree = renderer.create( <MockedProvider><SignInScreen/></MockedProvider>).toJSON();
  expect(tree).toMatchSnapshot();
});


it('shows invalid credentials message', async () => {
    const {getByTestId, queryAllByText } = render(<MockedProvider mocks={mocks} addTypename={false}><SignInScreen/></MockedProvider> );
  
     act(() =>
        fireEvent.changeText(getByTestId('SignIn.Email'), 'skadjsk'),
        fireEvent.changeText(getByTestId('SignIn.Password'), 'skadjsk'),    
        fireEvent.press(getByTestId('SignIn.Button'))
    );
    
    expect(queryAllByText('Invalid credentials, try again')).toBe(1);  
  });