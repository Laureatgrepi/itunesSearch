import React from 'react';
import { StyleSheet, Text, View, FlatList,Image,Alert } from 'react-native';
import{Button} from 'react-native-elements';

import { SQLite} from 'expo';



const db  =SQLite.openDatabase('projekti.db');

export default class LibaryScreen extends React.Component{
    static navigationOptions= { title:'Library'};

    constructor(props){
        super(props);
        this.state = {
            libraryList1:[]

        }
    }

    componentDidMount(){
        this.updateData();
    }
    
   

    updateData= () => {
        db.transaction(tx => {
          tx.executeSql('select * from library', [], (_, { rows })=>
          this.setState({
            libraryList1: rows._array,
         
        
          })
          );
        });
        }  

    deleteItem=(id,track,artist)=>{
        db.transaction(tx => {
          tx.executeSql('delete from library where id = ?;', [id]);
          Alert .alert(track + " by "+artist +" is deleted");
        },null, this.updateData)
      }

render() {
   
    const uri = 'data:image/jpeg;base64,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';
    return (
        <View style ={styles.container}>
        <FlatList data={this.state.libraryList1}

            style={{marginLeft:'5%'}}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => <View style={{flexDirection:'row'}}> 
                                    <Image style={{height:50, width:50}} source={{uri:uri}}></Image>
                                    <Text style ={{fontSize:18}}> {item.track}</Text>
                                    <Text style ={{fontSize:18}}> {item.artist}</Text>
                                    <Button icon={{name:'delete'}} style={{width:50}} onPress={() => this.deleteItem(item.id, item.track,item.artist)}/> 
                                    </View>
                }

          
        />
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



