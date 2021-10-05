import React, { FC, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Alert, Text, Platform } from 'react-native';
import DatePicker from '@dietime/react-native-date-picker';
import firebase from 'firebase';
import { format } from 'date-fns';

import { Button, Input } from '../components';

interface Props {
    navigation: {
        navigate: (route: string) => void;
        goBack: () => void;
    };
}
const NewStat: FC<Props> = ({ navigation }) => {
    const [numberOfBooksRead, setNumberOfBooksRead] = useState<number | null>(null);
    const [date, setDate] = useState<Date>(new Date());

    const addStat = async () => {
        if (numberOfBooksRead && date) {
            try {
                const formattedDate = format(date, 'MM-yyyy');
                const newStat = { [formattedDate]: numberOfBooksRead };
                const uid = firebase.auth().currentUser?.uid;
                await firebase.firestore().collection('stats').doc(uid).set(newStat, { merge: true });

                navigation.navigate('home');
            } catch (error) {
                console.log(error);
            }
        } else {
            Alert.alert('Missing fields');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backButton}>
                <Button onPress={() => navigation.goBack()} title="Back" />
            </View>

            <Text>Select month and year</Text>
            <DatePicker
                value={null}
                onChange={(value) => setDate(value)}
                format="mm-yyyy"
                startYear={2019}
                fontSize={16}
                width={300}
                height={80}
                fadeColor="#f2f2f2"
            />

            <Input placeholder="Number of books read (e.g. 5)" onChangeText={(text: string) => setNumberOfBooksRead(+text)} />
            <Button title="Add stat" onPress={addStat} />
        </SafeAreaView>
    );
};

export default NewStat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        alignSelf: 'flex-start',
        marginHorizontal: 20,
    },
});
