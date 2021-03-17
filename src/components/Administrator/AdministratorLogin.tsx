import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Col, Container, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { ApiResponse, saveToken } from "../../api/api";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

interface AdministratorLoginState {
    username: string,
    password: string,
    errorMessage: string,
    isLoggedIn: boolean
}

export default class AdministratorLogin extends React.Component {

    state: AdministratorLoginState
    constructor(props: {} | Readonly<{}>) {
        super(props)
        this.state = {
            username: '',
            password: '',
            errorMessage: '',
            isLoggedIn: false
        }
    }

    private formInputChanged(e: React.ChangeEvent<HTMLInputElement>) {
        const newState = Object.assign(this.state, {
            [e.target.id]: e.target.value
        });
        this.setState(newState)

    }

    private setLoginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isLoggedIn: isLoggedIn,
        });
        this.setState(newState);
    }

    private setErrorMessage(message: string) {
        const newState = Object.assign(this.state, {
            errorMessage: message
        });
        this.setState(newState)
    }

    private doLogin() {
        api(
            'auth/administrator/login',
            'post',
            {
                username: this.state.username,
                password: this.state.password
            },

        )
            .then((res: ApiResponse) => {


                if (res.status === 'error') {
                    this.setErrorMessage('System error... Try again');
                    return;
                }

                if (res.status === 'ok') {
                    if (res.data.errorCode !== undefined) {
                        let message = '';
                        switch (res.data.errorCode) {
                            case -4001: message = "Can't find administrator with that username"; break;
                            case -4002: message = "Incorrect password"; break;
                        }
                        this.setErrorMessage(message);
                        return;
                    }

                    saveToken('administrator', res.data.token);
                    this.setLoginState(true);
                }

            })
    }


    render() {
        if (this.state.isLoggedIn === true) {
            return (
                <Redirect to="/" />
            );
        }
        return (
            <Container>
                <RoledMainMenu role="visitor" />
                <Col md={{ span: 6, offset: 3 }}>
                    <Card className="mt-2">
                        <Card.Title>
                            <FontAwesomeIcon icon={faSignInAlt} /> Administrator Login
                        </Card.Title>
                        <Card.Text>
                            <Form className="mx-2">
                                <Form.Group>
                                    <Form.Label htmlFor="username">Username:</Form.Label>
                                    <Form.Control type="username" id="username"
                                        value={this.state.username}
                                        onChange={(e) => this.formInputChanged(e as any)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="password" />Password:
                                    <Form.Control type="password" id="password"
                                        value={this.state.password}
                                        onChange={(e) => this.formInputChanged(e as any)} />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary"
                                        onClick={() => this.doLogin()}>
                                        Log in
                                    </Button>
                                </Form.Group>
                            </Form>
                            <Alert variant="danger"
                                className={this.state.errorMessage ? '' : 'd-none'}>
                                {this.state.errorMessage}
                            </Alert>
                        </Card.Text>
                    </Card>
                </Col>
            </Container>
        )
    }
}