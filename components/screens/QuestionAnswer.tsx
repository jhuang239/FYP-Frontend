import * as React from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Text,
} from "react-native";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import { Overlay, LinearProgress, CheckBox } from "react-native-elements";
import { useNavigation, NavigationProp } from '@react-navigation/native';


const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
    topbar: {
        flexDirection: "row",
        alignItems: "center",
        width: width,
        backgroundColor: "#ffedd5",
        justifyContent: "space-between",
    },
    backButton: {
        margin: 10,
        fontSize: 40,
        color: "black",
    },
    progressBar: {
        width: width * 0.8,
        marginRight: 10
    },
    container: {
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "#ffedd5",
        height: height,
    },
    questionNumberContainer: {
        justifyContent: "flex-start",
        alignItems: "center",
    },
    questionNumberText: {
        fontSize: 30,
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
    },
    questionTitleContainer: {
        justifyContent: "flex-start",
        alignItems: "center",
    },
    questionTitleText: {
        fontSize: 20,
        color: "black",
        textAlign: "center",
    },
    answerRow: {
        margin: 10,
        paddingVertical: 5,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: width * 0.9,
    },
    answerText: {
        flexWrap: 'wrap',
        flex: 1,
        fontSize: 16,
        color: "black",
        margin: 5,
        textAlign: 'left',
    },
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: width,
    },
    previousButton: {
        margin: 10,
        padding: 10,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#870331",
        width: width * 0.3,
    },
    previousButtonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    nextButton: {
        margin: 10,
        padding: 10,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#032487",
        width: width * 0.3,
    },
    nextButtonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    finishButton: {
        margin: 10,
        padding: 10,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#03871b",
        width: width * 0.3,
    },
    finishButtonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    overlayContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        margin: 10,
        padding: 10,
        width: width * 0.6,
        height: height * 0.2,
    },
    overlayText: {
        fontSize: 20,
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
    },
    overlayButton: {
        margin: 10,
        marginTop: 20,
        padding: 10,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#03871b",
        width: width * 0.3,
    },
    overlayButtonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    }
});

const QuestionAnswer = ({ route }) => {
    const { item } = route.params;
    const navigation = useNavigation();

    const goToBack = () => {
        navigation.goBack();
    };


    const datas = [
        { questionTitle: "How the day today?", questionOptions: ["a1aaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddaaaaaaaaaaaaaaaa", "b1", "c1", "d1"] },
        { questionTitle: "Are you happy today?", questionOptions: ["a2", "b2", "c2", "d2"] },
        { questionTitle: "AAAAAAAAAAA AAAAAAA AAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAA AAAA AA", questionOptions: ["a3", "b3", "c3", "d3"] },
        { questionTitle: "AAAA AAAAAA AAAAAAAAAA AAAAAAAAAA AAAAA AAAAA AAAAAAAAAA AAAAAA AAAA AAAA AAAAAA AAAAA AAAAA AAAAAAAAAA v v  AAAAAAAAAAAA AAAAAAAAAAAA AAAAAAAAAA AAAAAAA AAAAAAAAA AAAAA AAAAA", questionOptions: ["a4", "b4", "c4", "d4"] },
        { questionTitle: "what a bad day, arent?", questionOptions: ["a5", "b5", "c5", "d5"] },
        { questionTitle: "What is your gmail?", questionOptions: ["a6", "b6", "c6", "d6"] },
    ];
    const [currentLocation, setCurrentLocation] = React.useState(0);
    const [showOverlay, setshowOverlay] = React.useState(false);
    const [overlayMessage, setOverlayMessage] = React.useState("");
    const [answers, setAnswers] = React.useState<string[]>([]);
    const [isFinish, setIsFinish] = React.useState(false);


    const updateAnswers = (option: string) => {
        let newAnswer = [...answers];
        if (newAnswer[currentLocation] != option) {
            newAnswer[currentLocation] = option;
        } else {
            newAnswer = newAnswer.slice(0, currentLocation).concat(newAnswer.slice(currentLocation + 1));
        }
        setAnswers(newAnswer);
    }

    const pressNext = () => {
        if (answers.length > currentLocation) {
            setCurrentLocation(currentLocation + 1);
        } else {
            setOverlayMessage("Please finish current question first");
            setshowOverlay(true)
        }
    }

    const pressPrevious = () => {
        setCurrentLocation(currentLocation - 1);
    }

    const pressFinish = () => {
        if (answers.length != datas.length) {
            setOverlayMessage("Exercise not completed");
            setshowOverlay(true);
        }

        console.log(answers);

        try {
            // Do Post Submission
            setIsFinish(true);
            setOverlayMessage("Task Completed");
        } catch (error) {
            setOverlayMessage("Submission Failed. Please check the network connection");
        } finally {
            setshowOverlay(true);
        }
    }

    const closeOverlay = () => {
        setshowOverlay(false)
    }

    React.useEffect(() => {
        if (!showOverlay && isFinish) {
            navigation.goBack();
        }
    }, [showOverlay, isFinish, navigation]);

    return (
        <View>
            <View style={styles.topbar}>
                <IoniconsIcon
                    name="arrow-back"
                    style={styles.backButton}
                    onPress={() => goToBack()}
                />
                <LinearProgress
                    variant="determinate"
                    style={styles.progressBar}
                    value={answers.length / datas.length}
                />
            </View>
            <View style={styles.container}>
                <View style={styles.questionNumberContainer}>
                    <Text style={styles.questionNumberText}>{item.subject + "   Question  " + (currentLocation + 1)}</Text>
                </View>
                <View style={styles.questionTitleContainer}>
                    <Text style={styles.questionTitleText}>{datas[currentLocation].questionTitle}</Text>
                </View>
                <View>
                    {
                        datas[currentLocation].questionOptions.map((option, index) => (
                            <View key={index} style={styles.answerRow}>
                                <CheckBox
                                    checked={answers[currentLocation] == option}
                                    onPress={() => updateAnswers(option)}
                                    iconType="material-community"
                                    checkedIcon="checkbox-outline"
                                    uncheckedIcon='checkbox-blank-outline'
                                />
                                <Text style={styles.answerText}>{option}</Text>
                            </View>
                        ))
                    }
                </View>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={currentLocation != 0 ? styles.previousButton : { ...styles.previousButton, display: 'none' }} onPress={pressPrevious}>
                        <Text style={styles.previousButtonText}>Previous</Text>
                    </TouchableOpacity>
                    {currentLocation != datas.length - 1 ? (
                        <TouchableOpacity style={styles.nextButton} onPress={pressNext} >
                            <Text style={styles.nextButtonText}>Next</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.finishButton} onPress={pressFinish} >
                            <Text style={styles.finishButtonText}>Finish</Text>
                        </TouchableOpacity>
                    )
                    }
                </View>
                {/* Here is the Overlay group */}
                < Overlay
                    isVisible={showOverlay}
                    onBackdropPress={() => { closeOverlay }}
                >
                    <View style={styles.overlayContainer}>
                        <Text style={styles.overlayText}>{overlayMessage}</Text>
                        <TouchableOpacity style={styles.overlayButton} onPress={closeOverlay} >
                            <Text style={styles.overlayButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </Overlay >
            </View >
        </View >
    );
};

export default QuestionAnswer;
