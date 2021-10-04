import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import firebase from 'firebase';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

import { Button } from '../components';
import { ChartObject } from '../types';
import { getDataForYear } from '../utils';
import { DARK_BLUE } from '../constants/colors';

interface Props {
    navigation: {
        navigate: (route: string, opt?: any) => void;
    };
}

const { width } = Dimensions.get('screen');

const Home: FC<Props> = ({ navigation }) => {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<ChartObject[]>([]);

    useEffect(() => {
        fetchUsersStatsForThisYear();
    }, []);

    const currentYear = new Date().getFullYear();

    const fetchUsersStatsForThisYear = async () => {
        const uid = firebase.auth().currentUser?.uid;
        const currentUser = await firebase.firestore().collection('users').doc(uid).get();
        setUser(currentUser.data());

        const statsForThisYear = getDataForYear({ data: currentUser.data()?.stats, year: currentYear.toString() });
        setStats(statsForThisYear);
    };

    const logout = async () => {
        await firebase.auth().signOut();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.helloText}>
                Hello, {user?.name}! Here's how your {currentYear} has been going:
            </Text>
            <VictoryChart width={width - 10} theme={VictoryTheme.material}>
                <VictoryLine
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
            <View style={styles.buttonsContainer}>
                <Button title="Book charts" onPress={() => navigation.navigate('charts')} />
                <Button title="Add new stats" onPress={() => navigation.navigate('new-stat')} />
            </View>
            <Button title="Log out" onPress={logout} />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonsContainer: {
        marginTop: 50,
        flexDirection: 'row',
    },
    helloText: {
        fontSize: 24,
        marginHorizontal: 30,
        textAlign: 'center',
    },
});
