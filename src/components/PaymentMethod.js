import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../api/axios-client'
import RazorpayCheckout from 'react-native-razorpay';

let user;

const getData = async () => {
    await AsyncStorage.getItem('user', (err, result) => {
        if (!err && result !== null) {
            user = JSON.parse(result);
        }
        else {
            //console.log(err)
        }
    });
};

const PaymentMethod = async (amount, coursename, id, key, navigation) => {

    await getData();

    if (amount && coursename && user !== null) {
        var options = {
            description: 'Credits towards' + coursename,
            image: 'https://exambook.co/assets/images/exambook_logo.png',
            currency: 'INR',
            key: 'rzp_live_yVqgHH6LnUYITW',//'rzp_live_CjcClTGZNcsI1A',//'Razorprzp_live_CjcClTGZNcsI1A', //'Razorprzp_live_CjcClTGZNcsI1A', // Your api key //rzp_test_pGKWg0jeoKJWpi
            amount: amount * 100,
            name: coursename,
            prefill: {
                email: user.email,
                contact: user.mobile,
                name: user.firstname + " " + user.lastname
            },
            theme: { color: '#F37254' }
        }
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            //console.log(data, "data")
            const fd = new FormData();
            fd.append('userid', user.id);
            fd.append('passid', id);
            fd.append('amount', amount);
            fd.append('paymentmode', 'razorpay');
            fd.append('paymentmethod', 'CC');
            fd.append('transactionid', data.razorpay_payment_id);
            axiosClient().post('pass/recordPayment', fd)
                .then((res) => {
                    //console.log(res)
                    if (res.data.Error === 0) {
                        navigation.navigate('MyTests')
                    }
                }).catch((err) => {
                    //console.log(err)
                })
        }).catch((error) => {
            // handle failure
            //console.log(error)
            // alert(`Error: ${error.code} | ${error.description}`);
        });
    }
};

export default PaymentMethod;


