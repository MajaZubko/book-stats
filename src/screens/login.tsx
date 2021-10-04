import React, { FC, useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Input } from '../components';
import firebase from 'firebase';
import { DARK_BLUE } from '../constants/colors';

interface Props {
    navigation: {
        navigate: (route: string) => void;
    };
}

const Login: FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    const login = async () => {
        if (email && password) {
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password);
            } catch (error) {
                console.log(error);
            }
        } else {
            Alert.alert('Error', 'Missing fields');
        }
    };

    return (
        <View style={styles.container}>
            <Input placeholder="Email" onChangeText={(text) => setEmail(text)} />
            <Input placeholder="Password" onChangeText={(text) => setPassword(text)} secureTextEntry />
            <Button title="Log In" onPress={login} />

            <View style={styles.loginText}>
                <Text>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('signup')}>
                    <Text style={{ color: DARK_BLUE }}>Sign Up Here</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        flexDirection: 'row',
        marginVertical: 20,
    },
});
