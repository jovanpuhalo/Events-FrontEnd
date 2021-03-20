
import { faBackward, faListAlt, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Container, Form, Modal, Table } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import api, { ApiResponse } from "../../api/api";
import IdleTimerContainer from "../IdleTimerContainer/IdleTimer";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

interface EventsPageProperties {
    location?: any
}



interface EventDto {
    eventId: number;
    name: string;
    description: string;
    start: string;
    end: string;
    location: string;

    eventTypeId: number

}


interface AdministratorEventState {
    eventTypeId: number
    events?: EventDto[]
    isAdministratorLoggedIn: boolean;
    editModal: {
        visible: boolean,
        eventId: number,
        name: string,
        description: string;
        start: string;
        end: string;
        location: string;
        message: string;
        eventTypeId: number;
    }
    addModal: {
        visible: boolean,
        eventId: number,
        name: string,
        description: string;
        start: string;
        end: string;
        location: string;
        message: string;
        eventTypeId?: number;
    }
    confirmModal: {
        visible: boolean
    }
}


export default class AdministratorEvent extends React.Component<EventsPageProperties> {
    state: AdministratorEventState;

    constructor(props: EventsPageProperties | Readonly<EventsPageProperties>) {
        super(props)
        this.state = {
            isAdministratorLoggedIn: true,
            eventTypeId: 0,
            editModal: {
                visible: false,
                eventId: 0,
                name: '',
                description: '',
                start: '',
                end: '',
                location: '',
                message: '',

                eventTypeId: 0
            },
            addModal: {
                visible: false,
                eventId: 0,
                name: '',
                description: '',
                start: '',
                end: '',
                location: '',
                message: '',
            },
            confirmModal: {
                visible: false
            }

        }
        const state = localStorage.getItem('state')
        const eventTypeId = localStorage.getItem('eventTypeId')
        console.log(eventTypeId);
        console.log(typeof (Number(eventTypeId)));



        if (state && eventTypeId) {

            this.setEventTypesState(JSON.parse(state))
            this.setEventTypeIdState(Number(eventTypeId))
            console.log(this.state.addModal.eventTypeId);

        }


    }

    componentDidMount() {
        this.getEvents(this.state.eventTypeId)
        console.log(this.state.addModal.eventTypeId);

    }

    private setConfirmModalVisibleState(visible: boolean) {
        this.setState(Object.assign(this.state.confirmModal, {
            visible: visible
        }))
    }

    private setEventTypeIdState(eventTypeId: number) {
        let newState = Object.assign(this.state, {
            eventTypeId: eventTypeId
        })
        this.setState(newState);
    }

    private setEditModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [fieldName]: newValue,
            })
        ));
    }

    private setEditModalNumberFieldState(fieldName: string, newValue: number) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [fieldName]: newValue,
            })
        ));
    }

    private setEditModalVisible(newState: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                visible: newState,
            })
        ));
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        }));
    }


    private setAddModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [fieldName]: newValue,
            })
        ));
    }

    private setAddModalNumberFieldState(fieldName: string, newValue: any) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [fieldName]: (newValue === 'null') ? null : Number(newValue),
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

    private setEventTypesState(events: EventDto[]) {
        let newState = Object.assign(this.state, {
            events: events
        })
        this.setState(newState);
    }


    render() {
        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Redirect to="/administrator/login" />
            );
        }

        return (
            <Container>
                <IdleTimerContainer />
                <RoledMainMenu role={"administrator"} />

                <Card className="border-0">
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt} /> Events
                    </Card.Title>
                        <Table hover size="sm" bordered>
                            <thead>
                                <tr>
                                    <th colSpan={5}>
                                        <Link to="/administrator/dashboard/eventTypes"
                                            className="btn btn-sm btn-secondary mb-2">
                                            <FontAwesomeIcon icon={faBackward} /> Back to event types
                                          </Link><br /><br />
                                    </th>
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
                                    {/* <th >Descriotion</th> */}
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Location</th>
                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.events?.map((event: EventDto) => (
                                        <tr>
                                            <td className="text-right">{event.eventId}</td>
                                            <td><Link to={`/event/${event.eventId}`}>{event.name}</Link></td>
                                            {/* <td >{event.description}</td> */}
                                            <td>{event.start.slice(0, 10)}  <br /> {event.start.slice(11, 16)}</td>
                                            <td>{event.end.slice(0, 10)} <br /> {event.end.slice(11, 16)}</td>
                                            <td>{event.location}</td>
                                            <td className="text-center">
                                                <Button variant="danger" size="sm" className="mr-2" onClick={() => this.doDeleteEvent(event.eventId)}>
                                                    Delete
                                               </Button>
                                                <Button variant="secondary" size="sm" onClick={() => this.showEditModal(event)} >
                                                    Edit
                                                 </Button>
                                            </td>
                                        </tr>


                                    ), this)}

                            </tbody>
                        </Table>

                    </Card.Body>
                </Card>

                {this.addModal()}
                {this.editModal()}
                {this.confirmModal()}


            </Container>




        )
    }

    private doDeleteEvent(id: number) {

        if (!window.confirm('Are you sure?')) {
            return;
        }
        api('api/event/' + id, 'delete', {}, 'administrator')
            .then((res: ApiResponse) => {

                if (res.status === 'error') {
                    // this.setEditModalStringFieldState('message', 'Request error. Please try to refresh the page.');
                    return;
                }
                if (res.status === 'login') {
                    this.setLogginState(false);
                    // this.setMessageState('Please Log in!');

                    return;
                }

                this.getEvents(this.state.eventTypeId)


            })
    }



    private doAddEvent() {

        api('api/event/createEvent', 'post', {
            name: this.state.addModal.name,
            description: this.state.addModal.description,
            start: this.state.addModal.start,
            end: this.state.addModal.end,
            location: this.state.addModal.location,
            eventTypeId: this.state.eventTypeId,

        }, 'administrator')
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
                    console.log("res", res);

                    this.setAddModalStringFieldState('message', 'Fields must be filled in correctly and must not be blank!');
                    return;
                }
                if (res.status === 'login') {
                    this.setLogginState(false);
                    // this.setMessageState('Please Log in!');

                    return;
                }

                // this.setLogginState(true);
                this.setAddModalVisible(false);
                this.getEvents(this.state.eventTypeId)

                this.setConfirmModalVisibleState(true);
                setTimeout(() => {
                    this.setConfirmModalVisibleState(false);
                }, 2000)
            })

    }

    private doEditEvent() {
        api('api/event/' + this.state.editModal.eventId, 'patch', {
            name: this.state.editModal.name,
            description: this.state.editModal.description,
            start: this.state.editModal.start,
            end: this.state.editModal.end,
            location: this.state.editModal.location,
        }, 'administrator')
            .then((res: ApiResponse) => {
                console.log("editovan  event  ", res.data);

                if (res.status === 'error') {
                    console.log("res", res);

                    this.setEditModalStringFieldState('message', 'Fields must be filled in correctly and must not be blank!');
                    return;
                }
                if (res.status === 'login') {
                    this.setLogginState(false);
                    // this.setMessageState('Please Log in!');

                    return;
                }


                const eventTypeId = localStorage.getItem('eventTypeId')
                if (eventTypeId) {
                    this.getEvents(JSON.parse(eventTypeId))
                }

                this.setEditModalVisible(false);

                this.setConfirmModalVisibleState(true);
                setTimeout(() => {
                    this.setConfirmModalVisibleState(false);
                }, 2000)


            })

    }

    private getEvents(id: number) {
        api('api/eventType/' + id, 'get', {}, "administrator")
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



                const events: EventDto[] =
                    res.data.events?.map((event: EventDto) => {
                        return {
                            eventId: event.eventId,
                            name: event.name,
                            description: event.description,
                            start: event.start,
                            end: event.end,
                            location: event.location

                        }
                    })
                this.setEventTypesState(events);
                this.setEventTypeIdState(id);

            })

    }

    private showEditModal(event: EventDto) {

        this.setEditModalStringFieldState('message', '');
        this.setEditModalStringFieldState('name', event.name);
        this.setEditModalNumberFieldState('eventId', event.eventId);
        this.setEditModalStringFieldState('description', event.description);
        this.setEditModalStringFieldState('start', `${event.start.slice(0, 10) + ' ' + event.start.slice(11, 16)}`);
        this.setEditModalStringFieldState('end', `${event.end.slice(0, 10) + ' ' + event.end.slice(11, 16)}`);
        this.setEditModalStringFieldState('location', event.location);
        this.setEditModalNumberFieldState('eventTypeId', event.eventTypeId);

        this.setEditModalVisible(true);
    }


    private showAddModal() {

        this.setAddModalStringFieldState('message', '');
        this.setAddModalStringFieldState('name', '');
        this.setAddModalNumberFieldState('eventId', 0);
        this.setAddModalStringFieldState('description', '');
        this.setAddModalStringFieldState('start', '');
        this.setAddModalStringFieldState('end', '');
        this.setAddModalStringFieldState('location', '');


        this.setAddModalVisible(true);
    }

    private confirmModal() {
        return (
            <Modal size="sm" centered show={this.state.confirmModal.visible}
                onHide={() => this.setConfirmModalVisibleState(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Done!</Modal.Title>
                </Modal.Header>
                {/* <Modal.Body>
                   <p>Done!</p>
                   </Modal.Body> */}
            </Modal>
        )
    }

    private addModal() {
        return (
            <Modal size="lg" centered show={this.state.addModal.visible}
                onHide={() => this.setAddModalVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label htmlFor="edit-name">Name</Form.Label>
                        <Form.Control id="edit-name" type="text"
                            value={this.state.addModal.name}
                            onChange={(e) => this.setAddModalStringFieldState('name', e.target.value)} />

                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="edit-desc">Description</Form.Label>
                        <Form.Control id="edit-desc" as="textarea"
                            value={this.state.addModal.description}
                            onChange={(e) => this.setAddModalStringFieldState('description', e.target.value)}
                            rows={2} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="edit-start">Start</Form.Label>
                        <Form.Control id="edit-start" type="text"
                            value={this.state.addModal.start}
                            onChange={(e) => this.setAddModalStringFieldState('start', e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="edit-end">End</Form.Label>
                        <Form.Control id="edit-end" type="text"
                            value={this.state.addModal.end}
                            onChange={(e) => this.setAddModalStringFieldState('end', e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="edit-location">Location</Form.Label>
                        <Form.Control id="edit-location" type="text"
                            value={this.state.addModal.location}
                            onChange={(e) => this.setAddModalStringFieldState('location', e.target.value)} />
                    </Form.Group>

                    <Form.Group>
                        <Button variant="primary" onClick={() => this.doAddEvent()}>
                            <FontAwesomeIcon icon={faSave} /> Add event
                            </Button>
                    </Form.Group>
                    <Alert variant="danger"
                        className={this.state.addModal.message ? '' : 'd-none'}>
                        {this.state.addModal.message}
                    </Alert>
                </Modal.Body>
            </Modal>
        )
    }

    private editModal() {
        return (<Modal size="lg" centered show={this.state.editModal.visible}
            onHide={() => this.setEditModalVisible(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Edit event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label htmlFor="edit-name">Name</Form.Label>
                    <Form.Control id="edit-name" type="text" value={this.state.editModal.name}
                        onChange={(e) => this.setEditModalStringFieldState('name', e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="edit-desc">Description</Form.Label>
                    <Form.Control id="edit-desc" as="textarea" value={this.state.editModal.description}
                        onChange={(e) => this.setEditModalStringFieldState('description', e.target.value)}
                        rows={6} />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="edit-start">Start  -   (YYYY-DD-MM HH:mm)</Form.Label>
                    <Form.Control id="edit-start" type="text" value={this.state.editModal.start}
                        onChange={(e) => this.setEditModalStringFieldState('start', e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="edit-end">End    (YYYY-DD-MM HH:mm)</Form.Label>
                    <Form.Control id="edit-end" type="text" value={this.state.editModal.end}
                        onChange={(e) => this.setEditModalStringFieldState('end', e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="edit-location">Location</Form.Label>
                    <Form.Control id="edit-location" type="text" value={this.state.editModal.location}
                        onChange={(e) => this.setEditModalStringFieldState('location', e.target.value)} />
                </Form.Group>

                <Form.Group>

                    <Button variant="primary" onClick={() => this.doEditEvent()}>
                        <FontAwesomeIcon icon={faSave} /> Edit event
            </Button>
                </Form.Group>
                <Alert variant="danger"
                    className={this.state.editModal.message ? '' : 'd-none'}>
                    {this.state.editModal.message}
                </Alert>
            </Modal.Body>
        </Modal>)
    }
}