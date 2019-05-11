import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from "react-native";

const { width, height } = Dimensions.get("window");

export default class ToDo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            value: props.text
        }
    }
    state = {
        isEditing: false,
        isCompleted: false,
        value: ''
    }
    render() {
        const { isEditing, value } = this.state;
        const { text, id, deleteToDo, isCompleted } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPress={this._toggleComplete}>
                        <View style={[styles.circle, isCompleted ? styles.completedCircle : styles.uncompletedCircle]} />
                    </TouchableOpacity>
                    {isEditing ? (<TextInput
                        style={[
                            styles.text,
                            isCompleted ? styles.completedText : styles.uncompletedText]}
                        value={value}
                        multiline={true}
                        onChangeText={this._controllInput}
                        returnKeyType={"done"}
                        onBlur={this._finishEditing} />) : 
                    (<Text
                        style={[
                            styles.text,
                            isCompleted ? styles.completedText : styles.uncompletedText
                        ]}>
                        {text}
                    </Text>)}
                </View>
                    {isEditing ? (
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this._finishEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>complete</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        ) : (
                            
                        <View style={styles.actions}>
                            <TouchableOpacity  onPressOut={this._startEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>edit</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPressOut={(event)=> {event.stopPropagation; deleteToDo(id)}}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>delete</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        )
                    }
            </View>

        )
    }
    _toggleComplete = (event) => {
        event.stopPropagation();
        const { isCompleted, uncompletedToDo, completedToDo, id } = this.props;
        if(isCompleted){
            uncompletedToDo(id);
        }
        else {
            completedToDo(id);
        }
    };
    _startEditing = (event) => {
        event.stopPropagation();
        this.setState({
            isEditing: true
        })
    }
    _finishEditing = (event) => {
        event.stopPropagation();
        const { value } = this.state;
        const { updateToDo, id } = this.props;
        updateToDo(id, value);
        this.setState({
            isEditing: false
        })
    }
    _controllInput = text => {
        this.setState({
            value: text
        })
    }
}

const styles = StyleSheet.create({
    container: {
        width: width - 50,
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    text: {
        fontWeight: "600",
        fontSize: 20,
        marginVertical: 20,
        width: width/2
        
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 3,
        marginRight: 20
    },
    completedCircle: {
        borderColor: "#bbb"
    },
    uncompletedCircle : {
        borderColor: "#f23657"
    },
    completedText: {
        color: "#bbb",
        textDecorationLine: "line-through"
    },
    uncompletedText : {
        color: "#353839"
    },
    column: {
        flexDirection: "row",
        alignItems: "center",
    },
    actions: {
        flexDirection: "row"
    },
    actionContainer: {
        marginVertical: 10,
        marginHorizontal: 10
    }
});