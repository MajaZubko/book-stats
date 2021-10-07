import React, { FC, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Alert, Text } from 'react-native';
import 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import firebase from 'firebase';

import { Button, Input } from '../components';
import { getNumbersBetween } from '../utils';

interface Props {
    navigation: {
        navigate: (route: string) => void;
        goBack: () => void;
    };
}
const NewStat: FC<Props> = ({ navigation }) => {
    const currentYear = new Date().getFullYear();
    const startYear = 2010;
    const currentMonth = new Date().getMonth() + 1;

    const [numberOfBooksRead, setNumberOfBooksRead] = useState<number | null>(null);
    const [month, setMonth] = useState<number>(currentMonth);
    const [year, setYear] = useState<number>(currentYear);

    const addStat = async () => {
        if (numberOfBooksRead && month && year && Number.isInteger(numberOfBooksRead)) {
            try {
                const fullMonth = month.toString().length === 1 ? `0${month}` : month;
                const newStat = { [`${fullMonth}-${year}`]: numberOfBooksRead };
                const uid = firebase.auth().currentUser?.uid;
                await firebase.firestore().collection('stats').doc(uid).set(newStat, { merge: true });

                navigation.navigate('home');
            } catch (error) {
                console.log(error);
            }
        } else if (!Number.isInteger(numberOfBooksRead)) {
            Alert.alert('Number of books has to be an integer');
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
            <View style={styles.pickersContainer}>
                <Picker selectedValue={month} onValueChange={(value) => setMonth(+value)} mode="dropdown" style={styles.picker}>
                    {getNumbersBetween(1, year === currentYear ? currentMonth : 12).map((option) => (
                        <Picker.Item label={option.toString()} value={option} key={option} />
                    ))}
                </Picker>

                <Picker selectedValue={year} onValueChange={(value) => setYear(+value)} mode="dropdown" style={styles.picker}>
                    {getNumbersBetween(startYear, currentYear).map((option) => (
                        <Picker.Item label={option.toString()} value={option} key={option} />
                    ))}
                </Picker>
            </View>

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
        position: 'absolute',
        top: 40,
        left: 0,
    },
    picker: {
        width: 150,
    },
    pickersContainer: {
        flexDirection: 'row',
    },
});
