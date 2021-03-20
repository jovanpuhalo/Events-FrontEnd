import React from "react";
import { Button, Card, Container, Table } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { ApiResponse } from "../../api/api";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";


interface AdministratorDashboardUsersState {
    isAdministratorLoggedIn: boolean;
    user: {
        userId: number;
        name: string;
        lastName: string;
        email: string;
        username: string;
        phone: string;
        address: string;
        validation: '0' | '1'
    }[]


}



export default class AdministratorDashboardUsers extends React.Component {
    state: AdministratorDashboardUsersState;

    constructor(props: {} | Readonly<{}>) {
        super(props)

        this.state = {
            isAdministratorLoggedIn: true,
            user: []
        }

    }
    private setUsersState(users: []) {
        let newState = Object.assign(this.state, {
            user: users
        })
        this.setState(newState);

    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        }));
    }


    componentDidMount() {
        this.getUsers()
    }


    private getUsers() {
        api('api/administrator/user', 'get', {}, 'administrator')
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
                    // this.setMessageState('Request error. Please try to refresh the page.');
                    return;
                }
                if (res.status === 'login') {
                    this.setLogginState(false);
                    // this.setMessageState('Please Log in!');

                    return;
                }
                // this.setLogginState(true);

                const users: [] =
                    res.data.map((user: any) => {
                        return {
                            userId: user.userId,
                            name: user.forename,
                            lastName: user.surname,
                            email: user.email,
                            username: user.username,
                            phone: user.phoneNumber,
                            address: user.address,
                            validation: user.validation
                        }
                    })

                this.setUsersState(users)

            })
    }

    render() {

        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Redirect to="/administrator/login" />
            );
        }
        return (
            <Container>
                <RoledMainMenu role="administrator" />
                <Card className="border-0">
                    <Card.Body >
                        <Table hover size="sm" bordered>
                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Last name</th>
                                    <th>E-mail</th>
                                    <th>Username</th>
                                    <th>Phone</th>
                                    <th>Address</th>

                                    <th> Deny access</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.user.map(user => (
                                    <tr>
                                        <td className="text-right">{user.userId}</td>
                                        <td>{user.name}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.username}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.address}</td>

                                        <td className="text-center">
                                            <Button variant={(user.validation === '1') ? "primary" : "danger"} size="sm" className="mr-2"
                                                onClick={() => this.doUserOff_On(user.userId)}
                                            >
                                                {(user.validation === '1') ? "ON" : "OFF"}
                                            </Button>

                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </Table>

                    </Card.Body>
                </Card>
            </Container>
        )

    }

    private doUserOff_On(id: number) {
        api('api/administrator/userOff', 'post', { userId: id }, 'administrator')
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
                    // this.setEditModalStringFieldState('message', 'Request error. Please try to refresh the page.');
                    return;
                }
                if (res.status === 'login') {
                    // this.setLoggedInState(false);
                    // this.setMessageState('Please Log in!');

                    return;
                }
                this.getUsers()

            })
    }

}