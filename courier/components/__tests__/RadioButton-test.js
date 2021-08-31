import * as React from 'react';
import renderer from 'react-test-renderer';

import RadioButton from '../RadioButton';

it('renders correctly', () => {
  const tree = renderer.create(<RadioButton selected="true" value="0 - 5 kg"/>).toJSON();

  expect(tree).toMatchSnapshot();
});

