import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Home, Charts, NewStat } from '../screens';

const { Navigator, Screen } = createStackNavigator();

const AppStack: FC = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="home" component={Home} />
            <Screen name="charts" component={Charts} />
            <Screen name="new-stat" component={NewStat} />
        </Navigator>
    );
};

export default AppStack;
