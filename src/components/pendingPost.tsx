import React, { FC } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

import Button from '../components/button';

interface Props {
    message: string;
    approved: boolean;
    timestamp: number;
    onApprove: () => void;
    onDecline: () => void;
}

const { width } = Dimensions.get('screen');

const PendingPost: FC<Props> = ({ message, timestamp, onApprove, onDecline }) => {
    return (
        <View style={styles.container}>
            <View style={styles.messagesContainer}>
                <Text>{message}</Text>
                <Text>{timestamp}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <Button title="Approve" onPress={onApprove} />
                <Button title="Decline" onPress={onDecline} />
            </View>
        </View>
    );
};

export default PendingPost;

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
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
});
