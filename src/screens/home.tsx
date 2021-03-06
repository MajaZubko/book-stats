import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import firebase from 'firebase';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

import { Button } from '../components';
import { ChartObject, DataObject } from '../types';
import { getDataForYear } from '../utils';
import { DARK_BLUE } from '../constants/colors';

interface Props {
    navigation: {
        navigate: (route: string, opt?: any) => void;
    };
}

const { width } = Dimensions.get('screen');

const Home: FC<Props> = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<ChartObject[]>([]);

    useEffect(() => {
        fetchUsersStatsForThisYear();
    }, []);

    const currentYear = new Date().getFullYear();

    const fetchUsersStatsForThisYear = async () => {
        setIsLoading(true);
        const uid = firebase.auth().currentUser?.uid;
        await firebase
            .firestore()
            .collection('users')
            .doc(uid)
            .onSnapshot((querySnapshot) => {
                const usersData = querySnapshot.data();
                setUser(usersData);
            });

        await firebase
            .firestore()
            .collection('stats')
            .doc(uid)
            .onSnapshot((querySnapshot) => {
                const stats = querySnapshot.data();
                const statsForThisYear = getDataForYear({ data: stats as DataObject, year: currentYear.toString() });
                setStats(statsForThisYear);
            });

        setIsLoading(false);
    };

    const logout = async () => {
        await firebase.auth().signOut();
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {!!user?.name && stats.length > 0 && (
                <Text style={styles.helloText}>
                    Hello, {user?.name}! Here's how your {currentYear} has been going:
                </Text>
            )}

            {stats.length > 0 ? (
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
            ) : (
                <Text style={styles.helloText}>Hello, {user?.name}! Add some book stats to see how your reading is going</Text>
            )}

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
