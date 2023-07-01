import {BiCalendar} from 'react-icons/bi'
import './App.css';
import Search from './components/Search';
import AddAppointment from './components/AddAppointment';
import AppointmentInfo from './components/AppointmentInfo';
import { useState, useCallback, useEffect } from 'react';

function App() {
  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("petName");
  const [orderBy, setOrderBy] = useState("ASC");

  let filteredAppointmentList = appointmentList;
  filteredAppointmentList = appointmentList.filter((item)=> 
  item.petName.includes(query) || item.ownerName.includes(query) || item.aptNotes.includes(query))
  .sort((a,b) => {
    if(orderBy === "ASC") {
      return a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? -1 : 1;
    }
    else {
      return a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? 1 : -1;
    }
  });

  const fetchAppointments = useCallback(() => {
    fetch('./data.json').then(response => response.json()).then(data => {
      setAppointmentList(data);
    });
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  function handleDeleteAppointment(id) {
    setAppointmentList(appointmentList.filter((appointment) => appointment.id !== id));
  }

  function handleQueryChange(queryStr) {
    setQuery(queryStr);
  }

  function onSubmitNewAppointment(myAppointment) {
    console.log(myAppointment);
    setAppointmentList([...appointmentList, myAppointment]);
  }

  const lastId = appointmentList.reduce((max,item) => { return Number(item.id)> max ? Number(item.id) : max},0)

  return (
    <div className="App container smx-auto mt-3 font-thin">
      
      <h1 className="text-5xl mb-3">
      <BiCalendar className="inline-block text-red-400 align-top"/>
      Your appointments
      </h1>
      <AddAppointment onSubmitNewAppointment={onSubmitNewAppointment} lastId={lastId}/>
      <Search query={query} handleQueryChange={handleQueryChange} sortBy={sortBy} handleChangeSortBy={(mysort)=>setSortBy(mysort)} orderBy={orderBy} handleChangeOrderBy={(myorder)=>setOrderBy(myorder)}/>
      <ul className='divide-y divide-gray-200'>
        {filteredAppointmentList.map(appointment => {
          return (
            <AppointmentInfo appointment={appointment} key={appointment.id} handleDeleteAppointment={handleDeleteAppointment}  />
          );
        })}
      </ul>
    </div>
  );
}

export default App;