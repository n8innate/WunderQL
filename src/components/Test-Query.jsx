import { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom'
import LineChartComponent from "./LineChart";
// import { channels } from '../shared/constants';
import Button from '@material-ui/core/Button';
import { useDarkTheme } from "./ThemeContext";
// const { ipcRenderer } = window.require("electron");

const TestQuery = ({ client, uri, uriID, history, setHistory, runtime, getResponseTimes, queriesList, setRuntime }) => {

  const [query, setQuery] = useState(null);
  const [queryName, setQueryName] = useState(null);

  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }

  // configure uri list to appear as drop down list upon successful login
  // when connected to backend, replace 'queriesList' with history
  // const queries = [];
  // queriesList.map((prevQuery, index) => queries.push(<option value={prevQuery.query} id={index}>{prevQuery['Query Name']}</option>))

  // this is for when a card was clicked in the 'previous searches' component and the query
  // is passed as a prop when user is rerouted back to this component
  let queryProp = null;
  let location = useLocation();
  if (location.state) {
    console.log(location.state)
    queryProp = location.state.queryProp;
    console.log('queryProp sent from cards: ', queryProp)
    // document.querySelector('#text-area').value = location.state.queryProp;
  }

  const sendQuery = () => {
    // Sends the message to Electron main process
    if (!query && !queryName) {
      alert('must enter both query and a name!')
      return;
    }
    console.log('Query is being sent to main process...')

    // Make GraphQL API query at a rate of 1 request per 5 milliseconds
    // TODO: Make the rate of requests change based on user interaction 
    // setInterval(() => {
    //   ipcRenderer.send(channels.GET_RESPONSE_TIME, {
    //     uriID: uriID,
    //     query: query,
    //     uri: uri,
    //   });
    // }, 5)
    
    // ipcRenderer.send(channels.GET_RESPONSE_TIME, {
    //   uriID: uriID,
    //   query: query,
    //   uri: uri,
    // });
    window.api.send('QueryDetailstoMain', {
      uriID: uriID,
      query: query,
      uri: uri,   
    })
    
    // Listen for resposne times from main
    getResponseTimes();

    // Initiate load test when user clicks 'Submit Query'
    // TODO: Move this to new component, and don't hardcode numofChildProcesses
    // ipcRenderer.send(channels.TEST_LOAD, {
    //   numOfChildProccesses: 3,
    //   query: query,
    //   uri: uri,
    // })
  };

  // commented out because calculating runtime from FE (for now)
  // useEffect(() => {
  //   getResponseTimes();
    
  //   // Clean the listener after the component is dismounted
  //   return () => {
  //     ipcRenderer.removeAllListeners();
  //   };
  // }, [getResponseTimes]);

  return (
    <div id='test-query' style={themeStyle}> 
      <header class='uri'>
        <h2>Currently connected to: {uri}</h2>
        <select
          name='queries-list' 
          id='queries-list' 
          onChange={(e) => document.querySelector('#text-area').innerHTML = e.target.value}
          >
          <option value="" disabled selected hidden>previously searched queries</option>
          {/* {queries}    */}
          </select>
      </header>
      <div id='query-space'>
        <textarea 
          placeholder='input for user query'
          id='text-area'
          onChange={(e) => setQuery(e.target.value)}
          style={themeStyle}
          >{queryProp}</textarea>
        <input 
          id='uri-name' 
          placeholder='give your uri a name' 
          onChange={(e)=>setQueryName(e.target.value)
          }></input>
        <Button 
          variant="contained" 
          id='send-query' 
          color="primary"
          onClick={sendQuery}
          >Send Query</Button>
      </div>
      <div id='stats'>
        <div class='category'>
          <div class='category-title'>Query Response Time (ms)</div>
          <div class='category-number'>{`${runtime}`}</div>
          {/* <div class='category-number'>100</div> */}
          {/* {runtime && (
            <p>{`${runtime}`}</p>
          )} */}
        </div>
        {/* <div class='category' id='failure'>
          <div class='category-title'>Number of Requests to Failure</div>
          <div class='category-number'>100</div>
        </div>
        <div class='category'>
          <div class='category-title'>Number of Null Responses</div>
          <div class='category-number'>100</div>
        </div> */}
        {/* <div class='category'>
          <div class='category-title'>Response Time for Batch Test</div>
          <div class='category-number'>100</div>
        </div> */}
      </div>
      <div id='response-chart'> 
        <LineChartComponent history={history}/>
      </div>
    </div>
  ) 
};

export default TestQuery;