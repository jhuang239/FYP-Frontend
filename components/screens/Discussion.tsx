import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Image } from "react-native";
import React from "react";
import IMAGES from "../images";
import EntypoIcon from "react-native-vector-icons/Entypo";




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



export default function Discussion() {
    const temp = [
        { id: 1, topic: "EE2013 Assignment 1", category: "EE2013", date: "12/03/2021 10:00pm", lastDiscussionMessage: "Don't know how to do this" },
        { id: 2, topic: "GE2153 Assignment 2", category: "GE2153", date: "12/01/2021 10:00pm", lastDiscussionMessage: "Someone Help me?" },
        { id: 3, topic: "CS3426 Mid-term Revision Group", category: "CS3426", date: "12/02/2021 10:00pm", lastDiscussionMessage: "Anyone got hints?" },
        { id: 4, topic: "FYP dead line figther", category: "FYP", date: "12/02/2021 10:00pm", lastDiscussionMessage: "almost finished, HAHA" },
        { id: 5, topic: "PartTime Post", category: "OTHER", date: "12/02/2021 10:00pm", lastDiscussionMessage: "You poor guy" },
        { id: 6, topic: "EE2013 Assignment 1", category: "EE2013", date: "12/02/2021 10:00pm", lastDiscussionMessage: ":(" },
        { id: 7, topic: "EE2013 Assignment 1", category: "EE2016", date: "12/02/2021 10:00pm", lastDiscussionMessage: ":(" },
    ]
    const [data, setData] = React.useState(temp);
    const [selectedTag, setSelectedTag] = React.useState("");

    React.useEffect(() => {
        // Do fetch here
        try {

        } catch (error) {

        } finally {

        }
    }, []);

    const setTag = (category: string) => {
        if (category == selectedTag) {
            setSelectedTag("");
        } else {
            setSelectedTag(category);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.title}>Recent Discussion</Text>
                <TouchableOpacity style={styles.createDiscussionContainer} onPress={() => { }}>
                    <Text style={{ fontSize: 13 }}>Say Something Now</Text>
                    <EntypoIcon style={{ fontSize: 13 }} name="arrow-bold-right" />
                </TouchableOpacity>
            </View>
            <View>
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
                            <TouchableOpacity onPress={() => { setTag(item) }} style={{ height: 20, borderColor: "gray", borderWidth: 1, borderRadius: 45, marginHorizontal: 10, marginVertical: 10, backgroundColor: "white", alignItems: "center", justifyContent: "center", }}>
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
                        <TouchableOpacity onPress={() => { }} style={index + 1 == data.length ? { ...styles.discussionConatiner, borderBottomWidth: 0 } : styles.discussionConatiner}>
                            <Image
                                source={IMAGES.USER}
                                style={{
                                    height: 50,
                                    width: 50,
                                    aspectRatio: 1,
                                    borderRadius: 25
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
                                <Text style={{ fontSize: 15, color: "gray", marginBottom: 10 }}>{item.date}</Text>
                                <Text style={{ fontSize: 15, color: "gray" }}>
                                    {item.lastDiscussionMessage}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}