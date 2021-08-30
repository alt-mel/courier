import * as React from 'react';
import Colors from '../constants/Colors';

import { View as DefaultView } from 'react-native';

import useColorScheme from '../hooks/useColorScheme';
type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
    const theme = useColorScheme();
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}

export function DeliveryItem(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}