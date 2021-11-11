import * as React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import {render, fireEvent, act } from '@testing-library/react-native';
import wait from "waait";

import SignUpScreen, { SIGN_UP_MUTATION } from '../SignUpScreen';

const mocks = [ {
    request: {
      query: SIGN_UP_MUTATION,
      variables: {
        name: 'name',
        email: 'email',
        password: 'password'
      },
    },
    result: {
      data: {
        signUp: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODU0NzE1YjExYjExNzJkZjY2M2RhNyIsImlhdCI6MTYzNjEyNDQzNywiZXhwIjoxNjM4NzE2NDM3fQ.l_DoOqDVYwSycLl4dovEn1ypIM71kYWTzU-uLKT9f3s',
          user: {
            id: '61363974b6f26c6cd7881183',
            name: 'Username',
            email: 'admin@john.com'
          }
        }
      }
    },
  },];

  it('renders the Sign Up Screen', () => {
    const tree = render( <MockedProvider><SignUpScreen/></MockedProvider>).toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it('renders default elements', () => {
    const { getByPlaceholderText, getByTestId } = render(<MockedProvider mocks={mocks} addTypename={false}><SignUpScreen/></MockedProvider> );
    expect(getByPlaceholderText("name")).not.toBeNull();
    expect(getByPlaceholderText("email@email.com")).not.toBeNull();
    expect(getByPlaceholderText("password")).not.toBeNull();
    expect(getByTestId('SignUp.Button'))
  });

  it('handles valid input submission', async () => {
    const pushMock = jest.fn();
    const {getByTestId } = render(<MockedProvider mocks={mocks} addTypename={false}><SignUpScreen navigation={{ navigate: pushMock }}/></MockedProvider> );
  
    fireEvent.changeText(getByTestId('SignUp.Name'), 'name'),
    fireEvent.changeText(getByTestId('SignUp.Email'), 'email'),
    fireEvent.changeText(getByTestId('SignUp.Password'), 'password'),    
    fireEvent.press(getByTestId('SignUp.Button'))
  
    await act(async () => {
      await wait(0);
    });
  
    expect(pushMock).toBeCalledWith("Home")
  });