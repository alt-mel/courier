import * as React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import {render, fireEvent, act } from '@testing-library/react-native';
import wait from "waait";

import SignInScreen, { SIGN_IN_MUTATION } from '../SignInScreen';

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
  const tree = render( <MockedProvider><SignInScreen/></MockedProvider>).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders default elements', () => {
  const { getByPlaceholderText, getByTestId } = render(<MockedProvider mocks={mocks} addTypename={false}><SignInScreen/></MockedProvider> );
  expect(getByPlaceholderText("email@email.com")).not.toBeNull();
  expect(getByPlaceholderText("password")).not.toBeNull();
  expect(getByTestId('SignIn.Button'))
});

it('shows invalid credentials error message', async () => {
    const {getByTestId, queryAllByText } = render(<MockedProvider mocks={mocks} addTypename={false}><SignInScreen/></MockedProvider> );

    fireEvent.changeText(getByTestId('SignIn.Email'), 'msadsd'),
    fireEvent.changeText(getByTestId('SignIn.Password'), 'asdasdas'),    
    fireEvent.press(getByTestId('SignIn.Button'))

    await act(async () => {
      await wait(0);
    });
  
    expect(queryAllByText("Invalid credentials, try again").length).toBe(1)
});

it('handles valid input submission', async () => {
  const pushMock = jest.fn();
  const {getByTestId } = render(<MockedProvider mocks={mocks} addTypename={false}><SignInScreen navigation={{ navigate: pushMock }}/></MockedProvider> );

  fireEvent.changeText(getByTestId('SignIn.Email'), 'email'),
  fireEvent.changeText(getByTestId('SignIn.Password'), 'password'),    
  fireEvent.press(getByTestId('SignIn.Button'))

  await act(async () => {
    await wait(0);
  });

  expect(pushMock).toBeCalledWith("Home")
});