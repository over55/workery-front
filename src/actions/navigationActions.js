import axios from 'axios';
import store from '../store';
import { camelizeKeys } from 'humps';
import msgpack from 'msgpack-lite';

import { NAVIGATION_REQUEST, NAVIGATION_FAILURE, NAVIGATION_SUCCESS } from '../constants/actionTypes';
import getCustomAxios from '../helpers/customAxios';
import { WORKERY_NAVIGATION_API_ENDPOINT } from "../constants/api"


export const setNavigationRequest = () => ({
    type: NAVIGATION_REQUEST,
    payload: {
        isAPIRequestRunning: true,
        errors: {}
    },
});


export const setNavigationFailure = (info) => ({
    type: NAVIGATION_FAILURE,
    payload: info,
});


export const setNavigationSuccess = (info) => ({
    type: NAVIGATION_SUCCESS,
    payload: info,
});


/**
 *  Function will pull the ``navigation`` API endpoint and override our
 *  global application state for the 'navigation'.
 */
export function pullNavigation(schema, successCallback=null, failedCallback=null) {
    return dispatch => {
        // Change the global state to attempting to fetch latest user details.
        store.dispatch(
            setNavigationRequest()
        );

        // Generate our app's Axios instance.
        const customAxios = getCustomAxios();

        // Make the call to the web-service.
        customAxios.get(WORKERY_NAVIGATION_API_ENDPOINT).then( (successResponse) => { // SUCCESS
            // Decode our MessagePack (Buffer) into JS Object.
            const responseData = msgpack.decode(Buffer(successResponse.data));

            // console.log(responseData); // For debugging purposes.

            let navigation = camelizeKeys(responseData);

            // Extra.
            navigation['isAPIRequestRunning'] = false;
            navigation['errors'] = {};

            // Update the global state of the application to store our
            // user navigation for the application.
            store.dispatch(
                setNavigationSuccess(navigation)
            );

            // DEVELOPERS NOTE:
            // IF A CALLBACK FUNCTION WAS SET THEN WE WILL RETURN THE JSON
            // OBJECT WE GOT FROM THE API.
            if (successCallback) {
                successCallback(navigation);
            }

        }).catch( (exception) => {
            if (exception.response) {
                const responseBinaryData = exception.response.data; // <=--- NOTE: https://github.com/axios/axios/issues/960

                // Decode our MessagePack (Buffer) into JS Object.
                const responseData = msgpack.decode(Buffer(responseBinaryData));

                let errors = camelizeKeys(responseData);

                // Send our failure to the redux.
                store.dispatch(
                    setNavigationFailure({
                        isAPIRequestRunning: false,
                        errors: errors
                    })
                );

                // DEVELOPERS NOTE:
                // IF A CALLBACK FUNCTION WAS SET THEN WE WILL RETURN THE JSON
                // OBJECT WE GOT FROM THE API.
                if (failedCallback) {
                    failedCallback(errors);
                }
            }
        }).then( () => { // FINALLY
            // Do nothing.
        });

    }
}
