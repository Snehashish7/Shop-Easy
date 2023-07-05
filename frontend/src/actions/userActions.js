//We want a login action which will make a request to login and get the token

import axios from 'axios'
import { order_list_my_reset } from "../reducers/orderReducers/orderListMySlice"
import { login_fail, login_request, login_success, logout as logoutSlice } from "../reducers/userReducers/userLoginSlice"
import { user_register_request, user_register_success, user_register_fail } from "../reducers/userReducers/userRegisterSlice"
import { user_details_request, user_details_success, user_details_fail, user_details_reset } from "../reducers/userReducers/userDetailsSlice"
import { update_profile_fail, update_profile_request, update_profile_success } from "../reducers/userReducers/userUpdateProfileSlice"
import { user_list_request, user_list_success, user_list_fail, user_list_reset } from "../reducers/userReducers/userListSlice"
import { user_delete_request, user_delete_success, user_delete_fail } from "../reducers/userReducers/userDeleteSlice"
import { user_update_request, user_update_success, user_update_fail } from "../reducers/userReducers/userUpdateSlice"


export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(login_request())

    // config object because when we are actually sending data, we want to send in the header a content
    //type of application/json. here we also pass the token for protected routes (line 26)
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    //make request:
    const { data } = await axios.post(  //this will hit the route '/api/users/login' in userController.js and return the res.json(...)
      '/api/users/login',
      { email, password },
      config
    )

    dispatch(login_success(data))
    //set the userInfo of local storage to the destructured data and load the data in initial state (see initialState in store.js) 
    //to store.js (head-over to 'userInfoFromStorage' in store.js)
    localStorage.setItem('userInfo', JSON.stringify(data))

    // the fails will be the same in every component
  } catch (err) {
    const error = err.response &&
      err.response.data.message ?
      err.response.data.message :
      err.message
    dispatch(login_fail(error))
  }
}
// after doing above create login screen and create a form so that we can call the login action (pass the email,password & send req)
export const logout = () => async (dispatch) => {
  localStorage.removeItem('userInfo') // remove the user data from local storage
  dispatch(logoutSlice())
  dispatch(order_list_my_reset())
  dispatch(user_details_reset())
  dispatch(user_list_reset())
}

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch(user_register_request())

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const { data } = await axios.post(
      '/api/users',
      { name, email, password },
      config
    )

    dispatch(user_register_success(data))
    dispatch(login_success(data))

    localStorage.setItem('userInfo', JSON.stringify(data))

  } catch (err) {
    const error = err.response &&
      err.response.data.message ?
      err.response.data.message :
      err.message
    dispatch(user_register_fail(error))
  }
}

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch(user_details_request())

    const { userLogin: { userInfo } } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.get(
      `/api/users/${id}`,
      config
    )

    dispatch(user_details_success(data))

  } catch (err) {
    const error = err.response &&
      err.response.data.message ?
      err.response.data.message :
      err.message
    dispatch(user_details_fail(error))
  }
}

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch(update_profile_request())

    const { userLogin: { userInfo } } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.put(
      `/api/users/profile`,
      user,
      config
    )

    dispatch(update_profile_success(data))
    dispatch(login_success(data))

    localStorage.setItem('userInfo', JSON.stringify(data))

  } catch (err) {
    const error = err.response &&
      err.response.data.message ?
      err.response.data.message :
      err.message
    dispatch(update_profile_fail(error))
  }
}

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch(user_list_request())

    const { userLogin: { userInfo } } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.get(
      `/api/users/`,
      config
    )

    dispatch(user_list_success(data))

  } catch (err) {
    const error = err.response &&
      err.response.data.message ?
      err.response.data.message :
      err.message
    dispatch(user_list_fail(error))
  }
}

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch(user_delete_request())

    const { userLogin: { userInfo } } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.delete(
      `/api/users/${id}`,
      config
    )

    dispatch(user_delete_success())

  } catch (err) {
    const error = err.response &&
      err.response.data.message ?
      err.response.data.message :
      err.message
    dispatch(user_delete_fail(error))
  }
}

export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch(user_update_request())

    const { userLogin: { userInfo } } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.put(
      `/api/users/${user._id}`,
      user,
      config
    )

    dispatch(user_update_success())
    dispatch(user_details_success(data))


    localStorage.setItem('userInfo', JSON.stringify(data))

  } catch (err) {
    const error = err.response &&
      err.response.data.message ?
      err.response.data.message :
      err.message
    dispatch(user_update_fail(error))
  }
}