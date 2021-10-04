import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Dimensions, FlatList, Text } from 'react-native';

import { Button, Input, ApprovedPost } from '../components';
import firebase from 'firebase';

interface Props {
    navigation: {
        navigate: (route: string) => void;
    };
}

const { width } = Dimensions.get('screen');

const Home: FC<Props> = ({ navigation }) => {
    const [text, setText] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        fetchCurrentUser();
        fetchApprovedPosts();
    }, []);

    const fetchCurrentUser = async () => {
        const uid = firebase.auth().currentUser?.uid;
        const currentUser = await firebase.firestore().collection('users').doc(uid).get();
        setUser({ id: currentUser.id, ...currentUser.data() });
    };

    const fetchApprovedPosts = async () => {
        firebase
            .firestore()
            .collection('posts')
            .where('approved', '==', true)
            .onSnapshot((querySnaphot) => {
                const documents = querySnaphot.docs;
                setPosts(documents);
            });
        // const posts = await firebase.firestore().collection('posts').where('approved', '==', true).get();
        // setPosts([...posts.docs]);
    };

    const logout = async () => {
        await firebase.auth().signOut();
    };

    const post = async () => {
        if (text) {
            try {
                const data = { text, timeStamp: new Date(), approved: false };
                await firebase.firestore().collection('posts').add(data);
            } catch (error) {
                console.log(error);
            }
        } else {
            Alert.alert('Missing fields');
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.5 }}>
                {posts.length > 0 ? (
                    <FlatList
                        data={posts}
                        renderItem={({ item }) => (
                            <ApprovedPost
                                message={item.data().text}
                                approved={item.data().approved}
                                timestamp={item.data().timeStamp.toDate().toDateString()}
                            />
                        )}
                    />
                ) : (
                    <View>
                        <Text>Nothing to see here</Text>
                    </View>
                )}
            </View>

            <Input placeholder="Write something here" onChangeText={(text) => setText(text)} />
            <Button title="Post" onPress={post} />

            <View style={styles.buttonsContainer}>
                {user && user.isAdmin && (
                    <View>
                        <Button title="Dashboard" onPress={() => navigation.navigate('dashboard')} />
                    </View>
                )}
                <Button title="Log out" onPress={logout} />
            </View>
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
        width: width / 2,
        justifyContent: 'space-between',
    },
});
