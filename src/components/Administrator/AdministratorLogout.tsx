import React from "react";
import { Redirect } from "react-router-dom";
import { removeToken } from "../../api/api";

interface AdministratorLogoutState {
    isLogedIn: boolean
}
export default class AdministratorLogout extends React.Component {
    state: AdministratorLogoutState;
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
        removeToken('administrator')
        this.setLoginState()
    }


    render() {
        if (this.state.isLogedIn) {
            return <Redirect to="/administrator/login" />
        }

        return (
            <p>Loging out...</p>
        )
    }
}