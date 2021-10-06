import React, { FC, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Alert } from 'react-native';
import 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import firebase from 'firebase';

import { Button, Input } from '../components';
import { monthsPrefixes } from '../constants/monthPrefixes';
import { getAvailableMonthsPrefixesForCurrentYear, getYearsBetween } from '../utils';

interface Props {
    navigation: {
        navigate: (route: string) => void;
        goBack: () => void;
    };
}
const NewStat: FC<Props> = ({ navigation }) => {
    const [numberOfBooksRead, setNumberOfBooksRead] = useState<number | null>(null);
    const [date, setDate] = useState<string>('');

    const getDateOptions = () => {
        const currentYear = new Date().getFullYear();
        const startYear = 2010;

        const years = getYearsBetween(startYear, currentYear);
        const availableMonthsPrefixesForCurrentYear = getAvailableMonthsPrefixesForCurrentYear();

        let allOptions: string[] = [];

        years.forEach((year) => {
            if (year !== currentYear) {
                monthsPrefixes.forEach((month) => {
                    allOptions = [...allOptions, `${month}${year}`];
                });
            } else {
                availableMonthsPrefixesForCurrentYear.forEach((month) => {
                    allOptions = [...allOptions, `${month}${currentYear}`];
                });
            }
        });

        return allOptions.reverse();
    };

    const addStat = async () => {
        if (numberOfBooksRead && date) {
            try {
                const newStat = { [date]: numberOfBooksRead };
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

            <Picker selectedValue={date} onValueChange={(value) => setDate(value)} mode="dropdown" style={styles.picker}>
                <Picker.Item label="Select month and year" value="" />
                {getDateOptions().map((option) => (
                    <Picker.Item label={option} value={option} key={option} />
                ))}
            </Picker>
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
        top: 20,
        left: 0,
    },
    picker: {
        width: 300,
    },
});
