import React from 'react';
import { StyleSheet, Text, View,Alert,FlatList } from 'react-native';
import { SQLite} from 'expo';

import {FormInput, Button} from 'react-native-elements';


const db  =SQLite.openDatabase('projekti.db');


export default class HomeScreen extends React.Component{
    static navigationOptions= { title:'Home',};

    

    constructor(props){
        super(props);
        this.state = {
          term:'',
          data:[],
          limit:'',
          history:[],
          searched:''
          
        }
      }
      componentDidMount(){
        db.transaction(tx => {
            tx.executeSql('create table if not exists searchHistory (id integer primary key not null, searched text);')
        });
        this.updateData;

    }
    updateData= () => {
      db.transaction(tx => {
        tx.executeSql('select * from searchHistory', [], (_, { rows })=>
        this.setState({
          history: rows._array,
        })
        );
      });
      }

      getData=()=>{
        const{ navigate} = this.props.navigation;
        const word = this.state.term.replace(/ /g, "+");
        const url = 'https://itunes.apple.com/search?term='+word;
        fetch(url)
        .then ((response) => response.json())
        .then ((responseJson)=> {
            this.setState({
              data : responseJson.results, 
              history:[...this.state.history, {key: this.state.term}],
              searched:this.state.term,
              term : ''
            });
        })
        .then(
          () => navigate('History', {list:this.state.data})
        ) .catch((error) => {
          Alert.alert(error);
        })
      }

      



      addSearchHistory=(searched)=>{
        this.setState({
          searched:searched
      })
      db.transaction(tx => {
        tx.executeSql('insert into searchHistory (searched) values(?)', [this.state.searched]);
    },null, this.updateData)
   

      }
      showLibrary= () => {          
        const{ navigate} = this.props.navigation;
        this.updateData;
        navigate('Library')
        
    }
    
      listSeparator = () => {
        return (
          <View
            style={{
              height: 5,
              width: "80%",
              backgroundColor: "#fff",
              marginLeft: "10%"
            }}
          />
        );
      };


    render() {
      
        return(
<View style={styles.container}>


        <Text style={{fontSize:20, marginTop:20}}>Search</Text>
   
    
    <View style={{flex:2}}>

          
        <View style={{flexDirection:'column', alignItems:'center'}}>

            <FormInput placeholder='Artist, Track or Album' style={{borderColor:'gray', borderWidth:1, height:80, width:100
            }}
            value={this.state.term}
            onChangeText={(term) => this.setState({term})}/>
            <Button icon={{name:'search'}} style={{width:100}} title='Search' onPress={this.getData}/>
        
            <View>
                      <Text style={{fontSize:30, fontFamily:"Georgia"}}>Search history:</Text>
                      <FlatList data={this.state.history.reverse()}
                    renderItem={({item}) =>
                    <Text style={{fontSize:20, fontFamily:"Times New Roman"}}  >{item.key}  </ Text>
                    
                    }
                    />
                </View> 
              
          
          </View >
      
          

        
    </View>
        
      
    <Button title="Library" style={{width:100}} onPress={this.showLibrary}/>
           

</View>
            );
        }
    
    }         


    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#ccccff',
          alignItems: 'center',
          justifyContent: 'center',
        },
      });