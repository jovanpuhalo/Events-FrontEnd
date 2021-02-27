import React from "react";
import { Redirect } from "react-router-dom";
import { removeToken } from "../../api/api";

interface UserLogoutState {
    isLogedIn: boolean
}
export default class UserLogout extends React.Component {
    state: UserLogoutState;
    constructor(props: {} | Readonly<{}>) {
        super(props)

        this.state = {
            isLogedIn: false
        }
    }

    setLoginState() {
        this.setState({
            isLogedIn: true
        })
    }

    componentDidMount() {
        this.logOut();
    }
    componentDidUpdate() {
        this.logOut();
    }

    logOut() {
        removeToken('user')
        this.setLoginState()
    }


    render() {
        if (this.state.isLogedIn) {
            return <Redirect to="/user/login" />
        }

        return (
            <p>Loging out...</p>
        )
    }
}