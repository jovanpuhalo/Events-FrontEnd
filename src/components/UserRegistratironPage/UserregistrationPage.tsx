import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Col, Container, Form, FormGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import api, { ApiResponse } from "../../api/api";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

interface UserRegistrationPageState {
    formData: {
        email: string;
        password: string;
        forename: string;
        surname: string;
        phone: string;
        address: string;
        username: string
    };
    message?: string;
    isRegistrationComplete: boolean;

}




export class UserRegistrationPage extends React.Component {
    state: UserRegistrationPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isRegistrationComplete: false,
            formData: {
                email: '',
                password: '',
                forename: '',
                surname: '',
                phone: '',
                address: '',
                username: '',
            },
        };

    }

    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>) {

        const newFormData = Object.assign(this.state.formData, {

            [event.target.id]: event.target.value,

        });

        const newState = Object.assign(this.state, {
            formData: newFormData,
        });
        this.setState(newState);
    }

    private setErrorMessage(message: string) {
        const newState = Object.assign(this.state, {
            message: message,
        });

        this.setState(newState);
    }

    private registrationComplete() {
        const newState = Object.assign(this.state, {
            isRegistrationComplete: true
        });

        this.setState(newState);

    }

    render() {
        return (
            <Container >
                <RoledMainMenu role="visitor" />
                <Col md={{ span: 8, offset: 2 }}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faUserPlus} /> User registration
                            </Card.Title>
                            {
                                (this.state.isRegistrationComplete === false) ?
                                    this.renderForm() :
                                    this.renderRegistrationCompleteMessage()
                            }
                        </Card.Body>
                    </Card>
                </Col>


            </Container>
        );


    }

    private renderForm() {
        return (
            <>
                <Form className="mx-1">                                {/*  margina */}
                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <Form.Label htmlFor="email"> E-mail: </Form.Label>
                                <Form.Control type="email" id="email"
                                    value={this.state.formData.email}
                                    onChange={event => this.formInputChanged(event as any)} />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <Form.Label htmlFor="password">Password:</Form.Label>
                                <Form.Control type="password" id="password"
                                    value={this.state.formData.password}
                                    onChange={event => this.formInputChanged(event as any)} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col >
                            <FormGroup>
                                <Form.Label htmlFor="username"> Username: </Form.Label>
                                <Form.Control type="text" id="username"
                                    value={this.state.formData.username}
                                    onChange={event => this.formInputChanged(event as any)} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <Form.Label htmlFor="forename"> Forename: </Form.Label>
                                <Form.Control type="text" id="forename"
                                    value={this.state.formData.forename}
                                    onChange={event => this.formInputChanged(event as any)} />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <Form.Label htmlFor="surname"> Surname: </Form.Label>
                                <Form.Control type="text" id="surname"
                                    value={this.state.formData.surname}
                                    onChange={event => this.formInputChanged(event as any)} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup>
                        <Form.Label htmlFor="phone"> Phone: </Form.Label>
                        <Form.Control type="phone" id="phone"
                            value={this.state.formData.phone}
                            onChange={event => this.formInputChanged(event as any)} />
                    </FormGroup>

                    <FormGroup>
                        <Form.Label htmlFor="address"> Address: </Form.Label>
                        <Form.Control id="address"
                            as="textarea" rows={2}
                            value={this.state.formData.address}
                            onChange={event => this.formInputChanged(event as any)} />
                    </FormGroup>

                    <FormGroup>
                        <Button variant="primary"
                            onClick={() => this.doRegister()}>
                            Register
                         </Button>
                    </FormGroup>
                </Form>
                <Alert variant="danger"
                    className={this.state.message ? '' : 'd-none'}>
                    {this.state.message}
                </Alert>
            </>
        );

    }

    private renderRegistrationCompleteMessage() {
        return (
            <p>
                The acount has been registered <br />
                <Link to="/user/login">Click here</Link> to go to the logine page.
            </p>
        )
    }

    private doRegister() {
        const data = {
            email: this.state.formData.email,
            password: this.state.formData.password,
            forename: this.state.formData.forename,
            surname: this.state.formData.surname,
            phoneNumber: this.state.formData.phone,
            postalAddress: this.state.formData.address,
            username: this.state.formData.username,
        }
        api('auth/user/registration', 'post', data)
            .then((res: ApiResponse) => {
                // console.log(res);

                if (res.status === 'error') {
                    console.log(res);


                    if (res.data.response.data.message[0].includes('password must be longer')) {
                        this.setErrorMessage('Lozinka mora biti duza od 6 karaktera');
                        return;

                    }



                    this.setErrorMessage('System errory...Try again!');
                    return;
                }

                if (res.data.statusCode !== undefined) {
                    this.handlErrors(res.data);
                    return;
                }

                this.registrationComplete();

            });
    }

    private handlErrors(data: any) {
        let message = '';
        switch (data.statusCode) {
            case -6001: message = 'This account alredy existe'; break;
            case -6002: message = 'User sa ovim emailom vec postoji'; break;
            case -6003: message = 'User sa ovim telefonom vec postoji'; break;
        }
        this.setErrorMessage(message);
    }


}

