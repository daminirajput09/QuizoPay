import React, {useEffect, useState, useCallback, useContext} from 'react';
import {
  Text,
  View,
} from 'react-native';
import moment from 'moment';

const TimerComponent = (props) => {

    // console.log('time', props.time);

  const expDate = moment('2021-07-10 14:00:00').getDate();
  // const [timerCount, setTimer] = useState();
  // const [dateDiff, setDateDiff] = useState(null);
  // const [Time, setTime] = useState();
  // let nowDate = moment(new Date());

  // const [changableTime, setChangableTime] = useState();

  var timer;
  var compareDate = new Date();
  compareDate.setDate(expDate); //compareDate.getDate() + 7); //just for this demo today + 7 days

  const timeBetweenDates = (toDate) => {
    var dateEntered = toDate;
    var now = new Date();
    var difference = dateEntered.getTime() - now.getTime();
  
    if (difference <= 0) {
  
      // Timer done
      clearInterval(timer);
    
    } else {
      
      var seconds = Math.floor(difference / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);
  
      hours %= 24;
      minutes %= 60;
      seconds %= 60;
  
      console.log('time ', days + ' : ' + hours + ' : ' + minutes + ' : ' + seconds);
      // $("#days").text(days);
      // $("#hours").text(hours);
      // $("#minutes").text(minutes);
      // $("#seconds").text(seconds);
    }
  }

  useEffect(() => {

    timer = setInterval(function() {
      timeBetweenDates(compareDate);
    }, 1000);

    // const end = moment(expDate).endOf('days'); 

    // var start = moment("2013-11-03");
    // var end = moment("2013-11-04");
    // let min = end.diff(start, "minutes");
    // console.log(end.diff(start, "minutes"));    

    // setInterval(function() {
    //     const timeLeft = moment(end.diff(moment())); // get difference between now and timestamp
    //     setChangableTime(timeLeft.format('d:HH:mm:ss')); // make pretty

    //     console.log(changableTime); // or do your jQuery stuff here
    // }, 1000);


  },[]);

  // useEffect(()=>{
  //   setDateDiff(expDate.diff(nowDate, 'seconds'));
  //   setTimer(expDate.diff(nowDate, 'seconds'));
  //   console.log('date difference', dateDiff);
  // },[]);

  return (
    <View>
        <Text>{'changableTime'}</Text>
    </View>
  );
};

export default TimerComponent;
