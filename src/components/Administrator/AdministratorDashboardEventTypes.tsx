import { faListAlt, faMinus, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Container, Form, Modal, Table } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { ApiResponse } from "../../api/api";
import IdleTimerContainer from "../IdleTimerContainer/IdleTimer";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

interface EventTypes {
    eventTypeId: number,
    name: string,
    events: EventDto[]
}


interface EventDto {
    eventId: number;
    name: string;
    description: string;
    start: string;
    end: string;
    location: string;
}

interface EventPageState {
    message: string;
    isAdministratorLoggedIn: boolean;

    eventTypes?: EventTypes[],
    eventOpend: boolean,
    eventSent?: EventDto[],
    addModal: {
        visible: boolean,
        eventTypeId: number,
        name: string,
        message: string
    }
    confirmModal: {
        visible: boolean
    }
}


export default class AdministratorDashboardEventTypes extends React.Component {
    state: EventPageState
    constructor(props: {} | Readonly<{}>) {
        super(props)

        this.state = {
            message: '',
            isAdministratorLoggedIn: true,
            eventTypes: [],
            eventOpend: false,
            addModal: {
                visible: false,
                eventTypeId: 0,
                name: '',
                message: ''
            },
            confirmModal: {
                visible: false
            }

        }


    }

    private setConfirmModalVisibleState(visible: boolean) {
        this.setState(Object.assign(this.state.confirmModal, {
            visible: visible
        }))
    }


    private setAddModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [fieldName]: newValue,
            })
        ));
    }
    private setAddModalVisible(newState: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                visible: newState,
            })
        ));
    }


    private setEventOpendState(event: boolean) {
        this.setState(Object.assign(this.state, {
            eventOpend: event
        }))
    }

    private setEventTypesState(eventTypes: EventTypes[]) {
        let newState = Object.assign(this.state, {
            eventTypes: eventTypes
        })
        this.setState(newState);

    }



    private setLoggedInState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn
        }))
    }

    private setMessageState(message: string) {
        this.setState(Object.assign(this.state, {
            message: message
        }))
    }



    private saveStateToLocalStorage(stejt: any, eventTypeId: number) {
        localStorage.setItem('state', JSON.stringify(stejt))
        localStorage.setItem('eventTypeId', JSON.stringify(eventTypeId))

    }


    componentDidMount() {
        this.getEvents();

    }



    private getEvents() {
        api('api/eventType/', 'get', {}, "administrator")
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
                    this.setMessageState('Request error. Please try to refresh the page.');
                    return;
                }
                if (res.status === 'login') {
                    this.setLoggedInState(false);
                    this.setMessageState('Please Log in!');

                    return;
                }

                this.setEventTypesState(res.data);

            })

    }

    render() {
        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Redirect to="/administrator/login" />
            );
        }
        if (this.state.eventOpend === true) {
            return (<Redirect
                to={{
                    pathname: "/administrator/dashboard/events/event",
                    // state: { events: this.state.eventSent }
                }}
            />)

        }

        return (
            <Container>
                <IdleTimerContainer />
                <RoledMainMenu role={"administrator"} />

                <Card className="border-white">
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt} /> Event types
                        </Card.Title>
                        <Table hover size="sm" bordered>
                            <thead>
                                <tr>
                                    <th colSpan={2}></th>
                                    <th className="text-center">
                                        <Button variant="primary" size="sm"
                                            onClick={() => this.showAddModal()}
                                        >
                                            <FontAwesomeIcon icon={faPlus} /> Add
                                        </Button>
                                    </th>
                                </tr>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>

                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.eventTypes?.map(eventType => (
                                    <tr>
                                        <td className="text-right">{eventType.eventTypeId}</td>
                                        <td>{eventType.name}</td>

                                        <td className="text-center">
                                            <Button variant="danger" size="sm" className="mr-2"
                                                onClick={() => this.doDeleteEvent(eventType.eventTypeId)}>
                                                <FontAwesomeIcon icon={faMinus} /> Delete
                                               </Button>

                                            <Button variant="info" size="sm"
                                                onClick={() => {
                                                    this.setEventOpendState(true);
                                                    this.saveStateToLocalStorage(eventType.events, eventType.eventTypeId)
                                                }}>
                                                Open
                                            </Button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </Table>

                    </Card.Body>
                </Card>

                <Modal size="lg" centered show={this.state.addModal.visible}
                    onHide={() => this.setAddModalVisible(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add event type</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="edit-name">Name</Form.Label>
                            <Form.Control id="edit-name" type="text"
                                value={this.state.addModal.name}
                                onChange={(e) => this.setAddModalStringFieldState('name', e.target.value)} />

                        </Form.Group>

                        <Form.Group>
                            <Button variant="primary" onClick={() => this.doAddEvent()}>
                                <FontAwesomeIcon icon={faSave} /> Add event type
                            </Button>
                        </Form.Group>
                        <Alert variant="danger"
                            className={this.state.addModal.message ? '' : 'd-none'}>
                            {this.state.addModal.message}
                        </Alert>
                        {/* {this.state.addModal.message ? (
                            <Alert variant="danger" value={this.state.addModal.message} />
                        ) : ''} */}
                    </Modal.Body>
                </Modal>


                <Modal size="sm" centered show={this.state.confirmModal.visible}
                    onHide={() => this.setConfirmModalVisibleState(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Done!</Modal.Title>
                    </Modal.Header>
                    {/* <Modal.Body>
                   <p>Done!</p>
                   </Modal.Body> */}
                </Modal>




            </Container>
        )
    }
    private doDeleteEvent(eventTypeId: number) {
        if (!window.confirm('Are you sure?')) {
            return;
        }
        api('api/eventType/' + eventTypeId, 'delete', {}, 'administrator')
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
                    // this.setEditModalStringFieldState('message', 'Request error. Please try to refresh the page.');
                    return;
                }
                if (res.status === 'login') {
                    this.setLoggedInState(false);
                    // this.setMessageState('Please Log in!');

                    return;
                }
                this.getEvents()
                this.setConfirmModalVisibleState(true);
                setTimeout(() => {
                    this.setConfirmModalVisibleState(false);
                }, 2000)


            })
    }

    private doAddEvent() {
        api('api/eventType/add', 'post', { name: this.state.addModal.name }, "administrator")
            .then((res: ApiResponse) => {
                console.log(res);

                if (res.status === 'error') {
                    // this.setEditModalStringFieldState('message', 'Request error. Please try to refresh the page.');
                    return;
                }
                if (res.status === 'login') {
                    this.setLoggedInState(false);
                    // this.setMessageState('Please Log in!');

                    return;
                }
                if (res.data.errorCode) {
                    this.setAddModalStringFieldState('message', 'You have to write the name of event type!');
                    console.log("porukaaaaaaa", this.state.addModal.message);

                    return;
                }


                this.getEvents();
                this.setAddModalVisible(false);
                this.setConfirmModalVisibleState(true);
                setTimeout(() => {
                    this.setConfirmModalVisibleState(false);
                }, 2000)

            })
    }


    private showAddModal() {

        this.setAddModalStringFieldState('name', '');
        this.setAddModalVisible(true);

    }
}