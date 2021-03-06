import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { ApiResponse, getToken } from "../../api/api";
import IdleTimerContainer from "../IdleTimerContainer/IdleTimer";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

const passwordValidator = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

interface UserProfilePageProperties {
    match: {
        params: {
            userId: number
        }
    }
}


interface UserProfileDto {
    userId?: number;
    forename: string;
    surname: string;
    email: string;
    username: string;
    password?: string
    phoneNumber?: string;
    address: string;
}

interface UserProfilePageState {

    message: string;
    isLoggedIn: boolean;
    roleState?: "user" | "visitor";
    user: UserProfileDto;
    editModal: {
        visible: boolean;
        forename: string;
        surname: string;
        password: string;
        confirmPassword: string;
        address: string;
        message: string;
    }
    comfirmModal: {
        visible: boolean
    }

}

export default class UserEventPage extends React.Component<UserProfilePageProperties>{
    state: UserProfilePageState
    constructor(props: Readonly<UserProfilePageProperties>) {
        super(props)

        this.state = {
            message: '',
            isLoggedIn: false,

            user: {
                forename: '',
                surname: '',
                email: '',
                username: '',
                address: '',
            },

            editModal: {
                visible: false,
                forename: '',
                surname: '',
                password: '',
                address: '',
                message: '',
                confirmPassword: ''
            },
            comfirmModal: {
                visible: false,
            }

        }
        const token = getToken('user').split(" ")[1]

        if (token !== 'null') {
            this.setRoleState('user')
        }

    }


    private setRoleState(role: string) {
        this.setState(Object.assign(this.state, {
            roleState: role
        }))
    }
    private setLoggedInState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isLoggedIn: isLoggedIn
        }))
    }

    private setMessageState(message: string) {
        this.setState(Object.assign(this.state, {
            message: message
        }))
    }

    private setUserState(user: UserProfileDto) {
        this.setState(Object.assign(this.state, {
            user: user
        }))
    }


    private setEditModalVisibleState(visible: boolean) {
        this.setState(Object.assign(this.state.editModal, {
            visible: visible
        }))
    }
    private setComfirmModalVisibleState(visible: boolean) {
        this.setState(Object.assign(this.state.comfirmModal, {
            visible: visible
        }))
    }


    private setEditModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [fieldName]: newValue,
            })
        ));
    }



    componentDidMount() {
        this.getUser();

    }


    private getUser() {

        let token: string = getToken('user')
        const tokenParts = token.split(' ');

        token = tokenParts[1];


        api('api/user/userId', 'post', { token })
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
                    this.setMessageState('Request error. Please try to refresh the page.');
                    return;
                }
                if (res.status === 'login') {
                    this.setLoggedInState(true);
                    return;
                }

                const user: UserProfileDto =

                {
                    userId: res.data.userId,
                    username: res.data.username,
                    surname: res.data.surname,
                    forename: res.data.forename,
                    email: res.data.email,
                    address: res.data.address,
                    phoneNumber: res.data.phoneNumber
                }

                this.setUserState(user);


            })

    }

    private showEditModal() {

        this.setEditModalStringFieldState('message', '');
        this.setEditModalStringFieldState('surname', this.state.user.surname);
        this.setEditModalStringFieldState('forename', this.state.user.forename);
        this.setEditModalStringFieldState('password', '');
        this.setEditModalStringFieldState('address', this.state.user.address);
        this.setEditModalStringFieldState('confirmPassword', '');

        this.setEditModalVisibleState(true);

    }

    private doEditUser() {

        const data = {
            surname: this.state.editModal.surname,
            forename: this.state.editModal.forename,
            password: this.state.editModal.password,
            address: this.state.editModal.address,
        }
        if (!passwordValidator.test(this.state.editModal.password)) {
            this.setEditModalStringFieldState("message", "Password must contain at least 8 characters, 1 number, 1 upper and 1 lowercase!")
            return
        }
        if (this.state.editModal.password !== this.state.editModal.confirmPassword) {
            this.setEditModalStringFieldState("message", "Passwords do not match")
            return
        }

        api('api/user/' + this.state.user.userId, 'patch', data)
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
                    // this.setMessage('Request error. Please try to refresh the page.');
                }
                if (res.status === 'login') {
                    this.setLoggedInState(true);
                }
                this.setEditModalVisibleState(false);
                this.setComfirmModalVisibleState(true);
                setTimeout(() => {
                    this.setComfirmModalVisibleState(false);
                }, 2000)
                const user: UserProfileDto =

                {
                    userId: this.state.user.userId,
                    username: this.state.user.username,
                    surname: res.data.surname,
                    forename: res.data.forename,
                    email: this.state.user.email,
                    address: res.data.address,
                    phoneNumber: this.state.user.phoneNumber
                }

                this.setUserState(user);

            })

    }

    render() {

        if (this.state.roleState !== "user") {

            return (
                <Redirect to="/user/login" />
            );

        }

        return (
            <>
                <IdleTimerContainer />
                <RoledMainMenu role={"user"} />
                <Container>
                    <br />
                    <Row>
                        <Col lg="6">
                            <Form.Group>
                                <Form.Label htmlFor="Surname"><b>Surname</b></Form.Label>
                                <Form.Control id="Forname" type="text" value={this.state.user.surname}>
                                </Form.Control>

                            </Form.Group>
                        </Col>
                        <Col lg="6">
                            <Form.Group>
                                <Form.Label htmlFor="Forname"><b>Forename</b></Form.Label>
                                <Form.Control id="Forname" type="text" value={this.state.user.forename}>

                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="6">
                            <Form.Group>
                                <Form.Label htmlFor="Username"><b>Username</b></Form.Label>
                                <Form.Control id="Username" type="text" value={this.state.user.username}>

                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col lg="6">
                            <Form.Group>
                                <Form.Label htmlFor="E-mail"><b>E-mail</b></Form.Label>
                                <Form.Control id="E-mail" type="text" value={this.state.user.email}>

                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="6">
                            <Form.Group>
                                <Form.Label htmlFor="Phone number"><b>Phone number</b></Form.Label>
                                <Form.Control id="Phone number" type="text" value={this.state.user.phoneNumber}>

                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col lg="6">
                            <Form.Group>
                                <Form.Label htmlFor="Address"><b>Address</b></Form.Label>
                                <Form.Control id="Address" type="text" value={this.state.user.address}>

                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group>
                        <Button variant="primary" onClick={() => this.showEditModal()}>
                            <FontAwesomeIcon icon={faEdit} /> Edit profile
                            </Button>
                    </Form.Group>

                    {/* {this.state.addModal.message ? (
                    <Alert variant="danger" value={this.state.addModal.message} />
                ) : ''} */}

                </Container>


                <Modal size="sm" centered show={this.state.comfirmModal.visible}
                    onHide={() => this.setComfirmModalVisibleState(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Done!</Modal.Title>
                    </Modal.Header>
                    {/* <Modal.Body>
                        <p>Done!</p>
                    </Modal.Body> */}
                </Modal>


                <Modal size="lg" centered show={this.state.editModal.visible}
                    onHide={() => this.setEditModalVisibleState(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit article</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md="6">
                                <Form.Group>
                                    <Form.Label htmlFor="Surname"><b>Surname</b></Form.Label>
                                    <Form.Control id="Surname" type="text" placeholder="Surname"
                                        value={this.state.editModal.surname}
                                        onChange={(e) => this.setEditModalStringFieldState('surname', e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md="6">
                                <Form.Group>
                                    <Form.Label htmlFor="Forename"><b>Forename</b></Form.Label>
                                    <Form.Control id="Forename" type="text"
                                        value={this.state.editModal.forename}
                                        onChange={(e) => this.setEditModalStringFieldState('forename', e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <Form.Group>
                                    <Form.Label htmlFor="Password"><b>Password</b></Form.Label>
                                    <Form.Control id="Password" type="password" placeholder="Password"
                                        value={this.state.editModal.password}
                                        onChange={(e) => this.setEditModalStringFieldState('password', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md="6">
                                <Form.Group>
                                    <Form.Label htmlFor="Confirm password"><b>Confirm password</b></Form.Label>
                                    <Form.Control id="Confirm password" type="password" placeholder="Confirm password"
                                        value={this.state.editModal.confirmPassword}
                                        onChange={(e) => this.setEditModalStringFieldState('confirmPassword', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <Form.Group>
                                    <Form.Label htmlFor="Address"><b>Address</b></Form.Label>
                                    <Form.Control id="Address" type="text" value={this.state.editModal.address}
                                        onChange={(e) => this.setEditModalStringFieldState('address', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group>
                            <Button variant="primary" onClick={() => this.doEditUser()}>
                                <FontAwesomeIcon icon={faSave} /> Ok
                            </Button>
                        </Form.Group>
                        <Alert variant="danger"
                            className={this.state.editModal.message ? '' : 'd-none'}>
                            {this.state.editModal.message}
                        </Alert>
                    </Modal.Body>
                </Modal>
            </>


        )
    }
}