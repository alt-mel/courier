import * as React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, act } from '@testing-library/react-native';
import wait from 'waait';

import DeliveriesScreen, { GET_DELIVERIES_QUERY } from '../DeliveriesScreen';

const mocks = [
  {
    request: {
      query: GET_DELIVERIES_QUERY
    },
    result: {
      data: {
        myDeliveries: [
          {
            id: '61158567c849aff608e06253',
            title: 'box',
            price: '300',
            pickup_location: 'south.trombone.ask',
            destination_location: 'kiss.boo.run',
            description: 'Sample description for a package',
            size: 'Small',
            weight: '20 kilos',
            status: 'delivered'
          }
        ]
      }
    }
  }
];

it('renders the Deliveries Screen', () => {
  const tree = render(
    <MockedProvider>
      <DeliveriesScreen />
    </MockedProvider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders default elements', async () => {
  const { getByTestId } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <DeliveriesScreen />
    </MockedProvider>
  );

  await act(async () => {
    await wait(0);
  });

  expect(getByTestId('Deliveries.Title'));
  expect(getByTestId('Deliveries.Item-61158567c849aff608e06253'));
});
