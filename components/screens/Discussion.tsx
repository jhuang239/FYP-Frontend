import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Image } from "react-native";
import React from "react";
import IMAGES from "../images";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { SearchBar } from "react-native-elements";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffedd5',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: 'black',
    },
    discussionConatiner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        paddingHorizontal: 20,
        padding: 5,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        backgroundColor: '#ffedd5'
    }, createDiscussionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 45,
        padding: 2,
        paddingHorizontal: 5,
        backgroundColor: 'white'
    }
})

export default function Discussion({ UpdateUserState }) {
    const isFocused = useIsFocused();

    const [data, setData] = React.useState<Array<{ id: string, author: string, banner_img: { file_name: string, link: string }, category: string, created_at: string, topic: string }>>([]);
    const [selectedTag, setSelectedTag] = React.useState("");

    // Search function
    const [SearchKeyword, setSearchKeyword] = React.useState("");
    const [isSearchLoading, setIsSearchLoading] = React.useState(false);

    const navigation = useNavigation();


    const fetchAllDiscussions = async () => {
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            const response = await fetch(`http://3.26.57.153:8000/discussion/get_all_discussions`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });
            // Handle response
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setData(data)
            }
        } catch (error) {
            console.log("Error fetchAllDiscussions:" + error);
        }
    }

    const fetchDiscussionsByCategory = async () => {
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            const response = await fetch(`http://3.26.57.153:8000/discussion/get_discussion_by_category?category=${selectedTag}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });
            // Handle response
            if (response.ok) {
                const data = await response.json();
                setData(data)
            }
        } catch (error) {
            console.log("Error fetchDiscussionsByCategory:" + error);
        }
    }

    const fetchDiscussionsByTopic = async () => {
        try {
            const userinfo = await AsyncStorage.getItem('userData').then(value => {
                if (value) {
                    return JSON.parse(value);
                }
            });
            if (userinfo == null) return;

            const response = await fetch(`http://3.26.57.153:8000/discussion/get_discussion_by_topic?topic=${SearchKeyword}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userinfo.token}`,
                },
            });
            // Handle response
            if (response.ok) {
                const data = await response.json();
                if (!data.error) {
                    setData(data)
                } else {
                    setData([])
                }
            }
        } catch (error) {
            console.log("Error fetchDiscussionsByTopic:" + error);
        }
    }

    React.useEffect(() => {
        setIsSearchLoading(true)
        if (selectedTag != "") {
            fetchDiscussionsByCategory()
        } else {
            fetchAllDiscussions();
        }
        setIsSearchLoading(false)
    }, [selectedTag]);

    React.useEffect(() => {
        if (isFocused) {
            console.log("Do fetch here")
            fetchAllDiscussions();
        }
    }, [isFocused]);

    React.useEffect(() => {
        setIsSearchLoading(true)
        if (SearchKeyword != "") {
            fetchDiscussionsByTopic()
        } else {
            fetchAllDiscussions();
        }
        setIsSearchLoading(false)
    }, [SearchKeyword]);

    const setTag = (category: string) => {
        if (category == selectedTag) {
            setSelectedTag("");
        } else {
            setSelectedTag(category);
        }
    }

    const goToDiscussionDetail = (details: any) => {
        navigation.navigate('DiscussionDetail', { details });
    };

    const goToCreateDiscussion = () => {
        navigation.navigate('CreateDiscussion');
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.title}>Recent Discussion</Text>
                <TouchableOpacity style={styles.createDiscussionContainer} onPress={() => { goToCreateDiscussion() }}>
                    <Text style={{ fontSize: 13 }}>Say Something Now</Text>
                    <EntypoIcon style={{ fontSize: 13 }} name="arrow-bold-right" />
                </TouchableOpacity>
            </View>
            <View>
                <SearchBar
                    containerStyle={{
                        padding: 20,
                        paddingRight: 10,
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        width: width,
                        backgroundColor: "#ffedd5",
                    }}
                    placeholder="Type Here..."
                    onChangeText={setSearchKeyword}
                    value={SearchKeyword}
                    lightTheme={true}
                    round={true}
                    showLoading={isSearchLoading}
                />
                <FlatList
                    data={data.filter((item, index, self) => {
                        return self.findIndex((t) => t.category === item.category) === index;
                    }).map(item => item.category)}
                    horizontal={true}
                    contentContainerStyle={{ height: 40 }}
                    keyExtractor={(item, index) => Math.random().toString()}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => { setTag(item) }} style={{ height: 20, borderColor: "gray", borderWidth: 1, borderRadius: 45, marginHorizontal: 10, marginVertical: 10, backgroundColor: selectedTag == item ? "lightgreen" : "white", alignItems: "center", justifyContent: "center", }}>
                                <Text style={{ fontSize: 10, color: "gray", paddingHorizontal: 6, alignItems: "center", justifyContent: "center", }}>{item}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
            <FlatList
                data={data.filter((item) =>
                    item.category.toLowerCase().includes(selectedTag.toLowerCase())
                )}
                contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
                keyExtractor={(item, index) => item.id + ''}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity onPress={() => { goToDiscussionDetail(item) }} style={index + 1 == data.length ? { ...styles.discussionConatiner, borderBottomWidth: 0 } : styles.discussionConatiner}>
                            <Image
                                source={{
                                    uri: item.banner_img.link
                                }}
                                style={{
                                    height: 70,
                                    width: 70,
                                    aspectRatio: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            />
                            <View
                                style={{
                                    flex: 1,
                                    marginHorizontal: 10,
                                }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: "black" }}>{item.topic}</Text>
                                    <Text style={{ fontSize: 10, color: "gray", paddingHorizontal: 6, alignItems: "center", justifyContent: "center", }}>{item.category}</Text>
                                </View>
                                <Text style={{ fontSize: 15, color: "gray", marginBottom: 10 }}>
                                    {`Author \t -- \t ${item.author}`}
                                </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                }}>
                                    <Text style={{ fontSize: 15, color: "gray", }}>
                                        {new Date(item.created_at).toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}