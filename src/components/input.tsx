import React, { FC } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

interface Props {
    placeholder: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
}

const { width } = Dimensions.get('screen');

const Input: FC<Props> = ({ placeholder, onChangeText, secureTextEntry }) => {
    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder={placeholder} onChangeText={onChangeText} secureTextEntry={secureTextEntry} />
        </View>
    );
};

export default Input;

const styles = StyleSheet.create({
    container: {
        width: width / 1.1,
        alignSelf: 'center',
        backgroundColor: '#e3e3e3',
        borderRadius: 5,
        marginVertical: 10,
    },
    input: {
        padding: 15,
    },
});
