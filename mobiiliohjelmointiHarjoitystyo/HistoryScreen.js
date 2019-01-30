import React from 'react';
import {StyleSheet, Text, View,  Alert,FlatList,Image } from 'react-native';

import { SQLite} from 'expo';
import{Button} from 'react-native-elements';


const db  =SQLite.openDatabase('projekti.db');

export default class HistoryScreen extends React.Component{
    static navigationOptions= { title:'History',};

    constructor(props){
        super(props);
        this.state = {
            libraryList:[],
            id:'',
            track:'',
            artist:''

        }
    }
    componentDidMount(){
        db.transaction(tx => {
            tx.executeSql('create table if not exists library (id integer primary key not null, artist text, track text, album text);')
        });
        this.updateData;

    }


    updateData= () => {
        db.transaction(tx => {
          tx.executeSql('select * from library', [], (_, { rows })=>
          this.setState({
            libraryList: rows._array,
         
        
          })
          );
        });
        }  
        
        addToLibrary=(id,track, artist)=>{
            this.setState({
                id:id,
                track: track,
                artist: artist
            })
            db.transaction(tx => {
                tx.executeSql('insert into library (id, artist, track) values(?,?,?)', [this.state.id, this.state.artist,this.state.track]);
            },null, this.updateData)
            Alert .alert(track + ' by '+ artist +' was added to library')
            
        }
        deleteAll=()=>{
            db.transaction(tx =>{
                tx.executeSql('delete  from library');
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
        const{ params } = this.props.navigation.state;
        return(
        <View style={styles.container}>
            <Button title='Library' onPress={this.showLibrary}/>
            <Button icon ={{name:'delete'}}title='Delete all from Library' onPress={this.deleteAll}/>
            
            <FlatList data={params.list}
            ItemSeparatorComponent={this.listSeparator}
            keyExtractor={item => item.trackId.toString()}
            renderItem={({item}) =>

            <View style={{flexDirection:'row'}}>
            
            <Image style={{height:50, width:50}} source={{uri:item.artworkUrl100}}></Image>
            <View>
                <Text style={{fontSize : 15}}>{item.artistName}   </ Text>
                <Button icon={{name:'save'}} style={{width:50}} onPress={() => this.addToLibrary(item.id,item.trackName, item.artistName)}/>
            </View>
                <Text style={{fontSize : 15}}>{item.trackName}   </ Text>
               
                
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