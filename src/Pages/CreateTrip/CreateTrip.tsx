import React, { useState } from 'react';
import './CreateTrip.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useAddUserToTripMutation, useCreateTripMutation } from '../../features/api';
import { useAppSelector } from '../../features/store';

const CreateTrip = () => {
  const [tripName, setTripName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const userId = useAppSelector(state => state.auth.userId);
  const [createTrip] = useCreateTripMutation();
  const [addUserToTrip] = useAddUserToTripMutation();
  const handleDateChange = dates => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleSaveTrip = async () => {
    const postdata = {
      name: tripName,
      destination: tripName,
      description: description,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    };

    let createTripResponse = await createTrip(postdata);
    await addUserToTrip({ tripId: createTripResponse.data?.tripId!, userId: userId! });
    alert('Trip created successfully');
  };

  return (
    <div className='createTrip'>
      <h1 className='title'>Create Trip</h1>

      <div>
        <h2>Destination</h2>
        <input
          type='text'
          value={tripName}
          onChange={e => setTripName(e.target.value)}
          placeholder='Enter destination name'
        />
      </div>

      <div>
        <h2>Description</h2>
        <input
          type='text'
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder='Enter a description'
        />
      </div>

      <div>
        <div>
          <label htmlFor='start-date'>Start Date:</label>
          <input
            type='text'
            id='start-date'
            value={
              startDate
                ? new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString().split('T')[0]
                : ''
            }
            readOnly
            placeholder='Select a start date'
          />
        </div>
        <div>
          <label htmlFor='end-date'>End Date:</label>
          <input
            type='text'
            id='end-date'
            value={
              endDate
                ? new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString().split('T')[0]
                : ''
            }
            readOnly
            placeholder='Select an end date'
          />
        </div>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          minDate={new Date()}
          showMonthDropdown
          showYearDropdown
          dropdownMode='select'
          renderCustomHeader={({ date, changeYear, changeMonth }) => (
            <div>
              <select value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(Number(value))}>
                {Array.from({ length: 101 }, (_, i) => new Date().getFullYear() + i).map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select value={date.getMonth()} onChange={({ target: { value } }) => changeMonth(Number(value))}>
                {[
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ].map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          )}
        />
      </div>

      <button onClick={handleSaveTrip} className='save-trip-btn'>
        Save Trip
      </button>
    </div>
  );
};

export default CreateTrip;
