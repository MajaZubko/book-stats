import React, { FC } from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { PRIMARY_COLOR, TEXT_COLOR } from '../constants/colors';

interface Props {
    title: string;
    onPress: () => void;
}

const Button: FC<Props> = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    container: {
        backgroundColor: PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 10,
    },
    text: {
        color: TEXT_COLOR,
    },
});
