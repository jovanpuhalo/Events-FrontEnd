import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Col, Container, Form, FormGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import api, { ApiResponse } from "../../api/api";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";


const emailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordValidator = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const phoneValidator = /^(\+|00)+[0-9]{3}[ ]?[0-9]{2}[ ]?[0-9]{3,4}[ ]?[0-9]{3,4}$/


interface UserRegistrationPageState {
    formData: {
        email: string;
        password: string;
        passwordConfirmation: string;
        forename: string;
        surname: string;
        phone: string;
        address: string;
        username: string
    };
    message?: string;
    isRegistrationComplete: boolean;
    isFormSubmitted: boolean;
    firstNameError: string,
    lastNameError: string,
    emailAddressError: string,
    passwordError: string,
    passwordConfirmationError: string,
    addressError: string,
    phoneError: string,
    usernameError: string,
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
                passwordConfirmation: '',
                forename: '',
                surname: '',
                phone: '',
                address: '',
                username: '',
            },
            isFormSubmitted: false,
            firstNameError: "",
            lastNameError: "",
            emailAddressError: "",
            passwordError: "",
            passwordConfirmationError: "",
            addressError: "",
            phoneError: "",
            usernameError: ""

        };

        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateFirstName = this.validateFirstName.bind(this);
        this.validateLastName = this.validateLastName.bind(this);
        this.validateEmailAddress = this.validateEmailAddress.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validatePasswordConfirmation = this.validatePasswordConfirmation.bind(this);
        this.validateField = this.validateField.bind(this);
    }

    handleSubmit(event: any) {

        event.preventDefault();
        let formFields = [
            "forename",
            "surname",
            "email",
            "password",
            "passwordConfirmation"
        ];
        let isValid = true;
        formFields.forEach(field => {
            isValid = this.validateField(field) && isValid;

        });

        if (isValid) {
            const newState = Object.assign(this.state, {
                isFormSubmitted: true,
            });
            this.setState(newState)
        }
        else {
            this.setState({ isFormSubmitted: false })
        }


        if (this.state.isFormSubmitted) {
            this.doRegister()


        } else {
            this.setErrorMessage('You must fill in the fields correctly.')
        }
        return this.state.isFormSubmitted;
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



    handleBlur(event: any) {
        const { id } = event.target;

        const valid = this.validateField(id);

        const element = document.getElementById(id);
        if (element !== null) {
            if (!valid) { element.style.background = "#ffc2c2"; } else { element.style.background = "white" }
        }
        return;
    }



    validateField(id: string) {
        let isValid = false;

        if (id === "forename") isValid = this.validateFirstName();
        else if (id === "surname") isValid = this.validateLastName();
        else if (id === "email") isValid = this.validateEmailAddress();
        else if (id === "password") isValid = this.validatePassword();
        else if (id === "username") isValid = this.validateUsername();
        else if (id === "phone") isValid = this.validatePhone();
        else if (id === "address") isValid = this.validateAddress();
        else if (id === "passwordConfirmation") isValid = this.validatePasswordConfirmation();
        return isValid;
    }

    validateAddress() {
        let addressError = "";
        const value = this.state.formData.address;
        if (value.trim() === "") addressError = "Forename is required";

        this.setState({
            addressError
        });
        return addressError === "";
    }

    validatePhone() {
        let phoneError = "";
        const value = this.state.formData.phone;
        if (value.trim() === "") phoneError = "Forename is required";
        else if (!phoneValidator.test(value))
            phoneError = "You must enter the phone number in the following format:  +XXX XX XXX XXX ";
        this.setState({
            phoneError
        });
        return phoneError === "";
    }

    validateEmailAddress() {
        let emailAddressError = "";
        const value = this.state.formData.email;
        if (value.trim() === "") emailAddressError = "Email Address is required";
        else if (!emailValidator.test(value))
            emailAddressError = "Email is not valid";

        this.setState({
            emailAddressError
        });
        return emailAddressError === "";
    }

    validateUsername() {
        let usernameError = "";
        const value = this.state.formData.username;
        if (value.trim() === "") usernameError = "Forename is required";

        this.setState({
            usernameError
        });
        return usernameError === "";
    }


    validateFirstName() {
        let firstNameError = "";
        const value = this.state.formData.forename;
        if (value.trim() === "") firstNameError = "Forename is required";

        this.setState({
            firstNameError
        });
        return firstNameError === "";
    }

    validateLastName() {
        let lastNameError = "";
        const value = this.state.formData.surname;
        if (value.trim() === "") lastNameError = "Surname is required";

        this.setState({
            lastNameError
        });
        return lastNameError === "";
    }



    validatePassword() {
        let passwordError = "";
        const value = this.state.formData.password;
        if (value.trim() === "") {
            passwordError = "Password is required"
            this.setErrorMessage('')
        }
        else if (!passwordValidator.test(value)) {
            passwordError = "Password must contain at least 8 characters, 1 number, 1 upper and 1 lowercase!";
            this.setErrorMessage(passwordError)
        } else {
            this.setErrorMessage('')

        }

        this.setState({
            passwordError
        });
        return passwordError === "";
    }

    validatePasswordConfirmation() {
        let passwordConfirmationError = "";
        if (this.state.formData.password !== this.state.formData.passwordConfirmation)
            passwordConfirmationError = "Password does not match Confirmation";

        this.setState({
            passwordConfirmationError
        });
        return passwordConfirmationError === "";
    }

    render() {
        return (
            <Container >
                <RoledMainMenu role="visitor" />

                {this.state.isFormSubmitted ? (


                    <div className="details">
                        <br />
                        <br />
                        <h5>Thanks for signing up, find your details below:</h5>
                        <div>First Name: {this.state.formData.forename}</div>
                        <div>Last Name: {this.state.formData.surname}</div>
                        <div>Username: {this.state.formData.username}</div>
                        <div>Email Address: {this.state.formData.email}</div>
                        <div>Phone number: {this.state.formData.phone}</div>
                        <br />
                        <br />
                        <p>
                            The acount has been registered <br />
                            <Link to="/user/login">Click here</Link> to go to the logine page.
                          </p>
                    </div>
                ) : (
                        <Col md={{ span: 8, offset: 2 }}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        <FontAwesomeIcon icon={faUserPlus} /> User registration
                            </Card.Title>
                                    {
                                        (this.state.isRegistrationComplete === false) ?
                                            this.renderForm() : ''
                                        // this.renderRegistrationCompleteMessage()
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                }

            </Container>
        );


    }

    private renderForm() {
        return (
            <>
                <Form className="mx-1" onSubmit={this.handleSubmit}>    {/*  margina */}
                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <Form.Label htmlFor="email"> E-mail: </Form.Label>
                                <Form.Control type="email" id="email" placeholder="email"
                                    value={this.state.formData.email}
                                    onBlur={this.handleBlur}
                                    autoComplete="off"
                                    onChange={event => this.formInputChanged(event as any)} />
                            </FormGroup>
                        </Col>
                        {/* <br />
                        {this.state.emailAddressError && (
                            <div className="errorMsg">{this.state.emailAddressError}</div>
                        )} */}
                        <Col md="6">
                            <FormGroup>
                                <Form.Label htmlFor="username"> Username: </Form.Label>
                                <Form.Control type="text" id="username" placeholder="username"
                                    onBlur={this.handleBlur}
                                    value={this.state.formData.username}
                                    onChange={event => this.formInputChanged(event as any)} />
                            </FormGroup>
                        </Col>

                    </Row>
                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <Form.Label htmlFor="password">Password:</Form.Label>
                                <Form.Control type="text" id="password" placeholder="password"
                                    value={this.state.formData.password}
                                    onBlur={this.handleBlur}
                                    onChange={event => this.formInputChanged(event as any)} />
                            </FormGroup>

                        </Col>

                        <Col md="6">
                            <FormGroup>
                                <Form.Label htmlFor="passwordConfirmation">Confirm password:</Form.Label>
                                <Form.Control type="text" id="passwordConfirmation" placeholder="confirm assword"
                                    value={this.state.formData.passwordConfirmation}
                                    onBlur={this.handleBlur}
                                    onChange={event => this.formInputChanged(event as any)} />
                            </FormGroup>
                        </Col>
                        {/* <p>Password must contain at least 8 characters, 1 number, 1 upper and 1 lowercase!</p> */}
                        <br />
                        {/* {this.state.passwordError && (
                            <div className="errorMsg">
                                {this.state.passwordError}
                            </div>
                        )} */}
                    </Row>
                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <Form.Label htmlFor="forename"> Forename: </Form.Label>
                                <Form.Control type="text" id="forename" placeholder="forename"
                                    value={this.state.formData.forename}
                                    onBlur={this.handleBlur}
                                    onChange={event => this.formInputChanged(event as any)} />
                            </FormGroup>
                        </Col>
                        {/* <br />
                        {this.state.firstNameError && (
                            <div className="errorMsg">{this.state.firstNameError}</div>
                        )} */}
                        <Col md="6">
                            <FormGroup>
                                <Form.Label htmlFor="surname"> Surname: </Form.Label>
                                <Form.Control type="text" id="surname" placeholder="surname"
                                    value={this.state.formData.surname}
                                    onBlur={this.handleBlur}
                                    onChange={event => this.formInputChanged(event as any)} />
                            </FormGroup>
                        </Col>
                        {/* <br />
                        {this.state.lastNameError && (
                            <div className="errorMsg">{this.state.lastNameError}</div>
                        )} */}
                    </Row>
                    <FormGroup>
                        <Form.Label htmlFor="phone"> Phone: </Form.Label>
                        <Form.Control type="phone" id="phone" placeholder="phone"
                            value={this.state.formData.phone}
                            onBlur={this.handleBlur}
                            onChange={event => this.formInputChanged(event as any)} />
                    </FormGroup>

                    <FormGroup>
                        <Form.Label htmlFor="address"> Address: </Form.Label>
                        <Form.Control id="address" placeholder="address"
                            as="textarea" rows={2}
                            onBlur={this.handleBlur}
                            value={this.state.formData.address}
                            onChange={event => this.formInputChanged(event as any)} />
                    </FormGroup>

                    <FormGroup>
                        <Button variant="primary"
                            onClick={this.handleSubmit}>
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
        if (this.state.formData.password !== this.state.formData.passwordConfirmation) {
            this.setErrorMessage('Lozinke se ne podudaraju');
            return
        }
        const data = {
            email: this.state.formData.email,
            password: this.state.formData.password,
            forename: this.state.formData.forename,
            surname: this.state.formData.surname,
            phoneNumber: this.state.formData.phone,
            postalAddress: this.state.formData.address,
            username: this.state.formData.username,
            address: this.state.formData.address,
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

