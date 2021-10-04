import React, { FC } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

import Button from '../components/button';

interface Props {
    message: string;
    approved: boolean;
    timestamp: number;
}

const { width } = Dimensions.get('screen');

const ApprovedPost: FC<Props> = ({ message, timestamp }) => {
    return (
        <View style={styles.container}>
            <View style={styles.messagesContainer}>
                <Text>{message}</Text>
                <Text>{timestamp}</Text>
            </View>
        </View>
    );
};

export default ApprovedPost;

const styles = StyleSheet.create({
    container: {
        width: width / 1.1,
        alignSelf: 'center',
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowOffset: { width: 3, height: 3 },
        shadowColor: '#ccc',
        shadowOpacity: 0.9,
    },
    messagesContainer: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
