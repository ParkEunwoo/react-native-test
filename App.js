import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Platform , Dimensions, ScrollView, AsyncStorage } from 'react-native';
import { white } from 'ansi-colors';
//import { Platform } from 'expo-core';
import { AppLoading } from "expo";
import uuidv1 from "uuid/v1";
import ToDo from "./ToDo.js";

const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: "",
    loadedToDoList: false,
    toDoList: {}
  };

  componentDidMount = () => {
    this._loadToDoList();
  }
  render() {
    const { newToDo, loadedToDoList, toDoList } = this.state;
    
    if(!loadedToDoList){
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>To Do List</Text>
        <View style={styles.card}>
          <TextInput style={styles.input}
          placeholder={"New To Do"}
          value={newToDo}
          onChangeText={this._newToDo}
          placeholderTextColor={"#999"}
          returnKeyType={"done"}
          autoCorrect={false}
          onSubmitEditing={this._addToDo}
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDoList).reverse().map(toDo => <ToDo
              key={toDo.id}
              {...toDo}
              updateToDo={this._updateToDo}
              deleteToDo={this._deleteToDo}
              uncompletedToDo={this._uncompletedToDo}
              completedToDo={this._completedToDo}
              />)}
          </ScrollView>
        </View>
      </View>
    );
  }
  _newToDo = newToDo => {
    this.setState({
      newToDo
    });
  }
  _loadToDoList = async () => {
    try {
      const toDoList = await AsyncStorage.getItem("toDoList");
      const parsedToDoList = JSON.parse(toDoList);
      this.setState({
        loadedToDoList: true,
        toDoList: parsedToDoList
      });
    } catch(err){
      console.log(err);
    }
  }
  _addToDo = () => {
    const { newToDo } = this.state;
    if(newToDo !== ""){
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo: '',
          toDoList: {
            ...prevState.toDoList,
            ...newToDoObject
          }
        };
        this._saveToDoList(newState.toDoList);
        return { ...newState };
      });
    }
  }
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDoList: {
          ...prevState.toDoList,
          [id]: {
            ...prevState.toDoList[id],
            text
          }
        }
      };
      this._saveToDoList(newState.toDoList);
      return {...newState};
    })
  }
  _deleteToDo = (id) => {
    this.setState(prevState => {
      const { toDoList } = prevState;
      delete toDoList[id];
      const newState = {
        ...prevState,
        ...toDoList
      };      
      this._saveToDoList(newState.toDoList);
      return {...newState};
    })
  }
  _uncompletedToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDoList: {
          ...prevState.toDoList,
          [id]: {
            ...prevState.toDoList[id],
            isCompleted: false
          }
        }
      }
      this._saveToDoList(newState.toDoList);
      return {...newState};
    });
  }
  _completedToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDoList: {
          ...prevState.toDoList,
          [id]: {
            ...prevState.toDoList[id],
            isCompleted: true
          }
        }
      }
      this._saveToDoList(newState.toDoList);
      return {...newState};
    });
  }
  _saveToDoList = (newToDoList) => {
    const saveToDoList = AsyncStorage.setItem("toDoList", JSON.stringify(newToDoList));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f23657',
    alignItems: 'center',
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "200",
    marginTop: 50,
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 5
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 20,
  }, 
  toDos: {
    alignItems: "center"
  }
});
