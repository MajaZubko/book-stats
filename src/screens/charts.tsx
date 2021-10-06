import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Dimensions, Text } from 'react-native';
import firebase from 'firebase';
import { uniq } from 'lodash';
import { Picker } from '@react-native-picker/picker';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';

import { Button } from '../components';
import { getDataForYear } from '../utils';
import { DataObject } from '../types';
import { DARK_BLUE } from '../constants/colors';

interface Props {
    navigation: {
        navigate: (route: string) => void;
        goBack: () => void;
    };
}

const { width } = Dimensions.get('screen');

const Charts: FC<Props> = ({ navigation }) => {
    const currentYear = new Date().getFullYear();

    const [date, setDate] = useState(currentYear);
    const [stats, setStats] = useState<any[]>([]);
    const [availableYears, setAvailableYears] = useState([currentYear.toString()]);

    useEffect(() => {
        fetchUserStatsForSetYear();
    }, [date]);

    const fetchUserStatsForSetYear = async () => {
        const uid = firebase.auth().currentUser?.uid;

        await firebase
            .firestore()
            .collection('stats')
            .doc(uid)
            .onSnapshot((querySnapshot) => {
                const stats = querySnapshot.data() as DataObject;
                if (stats) {
                    const yearsWithData = uniq(Object.keys(stats).map((key) => key.split('-')[1]))
                        .sort()
                        .reverse();
                    setAvailableYears(yearsWithData);
                    const statsForYear = getDataForYear({ data: stats, year: date.toString() });
                    setStats(statsForYear);
                } else {
                    setAvailableYears([]);
                    setStats([]);
                }
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backButton}>
                <Button onPress={() => navigation.goBack()} title="Back" />
            </View>

            {availableYears.length > 0 ? (
                <Picker selectedValue={date} onValueChange={(value) => setDate(value)} mode="dropdown" style={styles.picker}>
                    {availableYears.map((option) => (
                        <Picker.Item label={option.toString()} value={option} key={option} />
                    ))}
                </Picker>
            ) : (
                <Text>Add new stats to create charts</Text>
            )}

            {stats.length > 0 && (
                <>
                    <VictoryChart width={width - 10} theme={VictoryTheme.material}>
                        <VictoryLine
                            animate
                            data={stats}
                            x="monthYear"
                            y="value"
                            style={{
                                data: { stroke: DARK_BLUE },
                            }}
                        />
                        <VictoryAxis fixLabelOverlap={true} style={{ grid: { stroke: 'none' } }} />
                        <VictoryAxis dependentAxis style={{ grid: { stroke: 'none' } }} />
                    </VictoryChart>
                </>
            )}
        </SafeAreaView>
    );
};

export default Charts;

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
