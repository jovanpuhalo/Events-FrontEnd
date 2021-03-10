import { faEdit, faHouseUser, faListAlt, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import api, { ApiResponse, getToken } from "../../api/api";
import IdleTimerContainer from "../IdleTimerContainer/IdleTimer";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

// interface EventPageProperties {
//     match: {
//         params: {
//             eId: number
//         }
//     }
// }
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
    // eventType: {
    //     name: string
    // }
    // eventTypeId: string

}

interface EventPageState {
    message: string;
    isLoggedIn: boolean;
    // events?: EventDto[];
    eventTypes?: EventTypes[],
    eventOpend: boolean,
    eventSent?: EventDto[],
    addModal: {
        visible: boolean,
        eventTypeId: number,
        name: string,
        message: string
    }
}




export default class AdministratorDashboardEventTypes extends React.Component {
    state: EventPageState
    constructor(props: {} | Readonly<{}>) {
        super(props)

        this.state = {
            message: '',
            isLoggedIn: false,
            // eventTypes: [],
            eventOpend: false,
            addModal: {
                visible: false,
                eventTypeId: 0,
                name: '',
                message: ''
            }

        }
        // const tokenUser = getToken('user').split(" ")[1]

        // if (tokenUser !== 'null') {
        //     this.setRoleState('user')
        //     return;
        // }
        // const tokenAdmin = getToken('administrator').split(" ")[1]

        // if (tokenAdmin !== 'null') {
        //     this.setRoleState('administrator')
        //     return;
        // }




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


    private setEventSend(event: any) {
        this.setState(Object.assign(this.state, {
            eventSent: event
        }))
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





    private setEventSendState(events: EventDto[]) {
        this.setState(Object.assign(this.state, {
            eventSent: events
        }))
    }

    private setEventTypeState(event: string) {
        this.setState(Object.assign(this.state, {
            eventType: event
        }))
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



    private saveStateToLocalStorage(stejt: any, eventTypeId: number) {
        localStorage.setItem('state', JSON.stringify(stejt))
        localStorage.setItem('eventTypeId', JSON.stringify(eventTypeId))

    }


    componentDidMount() {
        this.getEvents();

    }

    // componentDidUpdate() {
    //     this.getEvents();

    // }

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
                console.log("koliko puta se izvrsio");

                this.setLoggedInState(true);


                // const eventType: EventTypes[] =
                //     res.data.map((eventType: EventTypes) => {
                //         const object:EventTypes={
                //             eventTypeId: eventType.eventTypeId,
                //             name: eventType.name,
                //             events:[]
                //         }
                //         eventType.events.map((event:EventDto)=>{

                //         })
                //         return {
                //             eventTypeId: eventType.eventTypeId,
                //             name: eventType.name
                //         }
                //     })
                this.setEventTypesState(res.data);

                // console.log("Stejt eventType ", this.state.eventTypes);


                // const eventTypes: {}[] =
                //     res.data.map((eventType: {}) => {
                //         return
                //         {

                //         }
                //     })


                // const eventss: [] =
                //     res.data.map((eventTypes: any) => {
                //         eventTypes.events?.map((event: EventDto) => {
                //             return {

                //                 eventId: event.eventId,
                //                 name: event.name,
                //                 description: event.description,
                //                 start: event.start,
                //                 end: event.end,
                //                 // eventTypeId: event.eventTypeId

                //             }
                //         })


                //         // this.setEventsState(events);
                //     })
                // this.setEventsState(eventss);
                // console.log(eventss);


            })

    }




    private showEventTypes(eventType: EventTypes) {

        return (
            <Col lg="3" md="4" sm="6" xs="12" >
                <Card className="mb-3 ">
                    <Card.Body>
                        <Card.Title as="p"> {eventType.name} </Card.Title>
                        <Link to={`/eventType/${eventType.eventTypeId}`}
                            className="btn btn-primary btn-block btn-sm">
                            Show events
                                      </Link>
                    </Card.Body>
                </Card>
            </Col>

        );
    }

    render() {
        if (this.state.eventOpend === true) {
            return (<Redirect
                to={{
                    pathname: "/administrator/dashboard/events/event",
                    // state: { events: this.state.eventSent }
                }}
            />)

        }
        console.log("state u renderu ", this.state.eventTypes);
        return (
            <Container>
                <IdleTimerContainer />
                <RoledMainMenu role={"administrator"} />

                <Card>
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
                                            <Button variant="danger" size="sm" className="mr-2" onClick={() => this.doDeleteEvent(eventType.eventTypeId)}>
                                                Delete
                                               </Button>
                                            <Button variant="info" size="sm"
                                                onClick={() => {
                                                    // this.setEventSend(eventType)
                                                    // this.setEventSendState(eventType.events)
                                                    this.setEventOpendState(true);
                                                    this.saveStateToLocalStorage(eventType.events, eventType.eventTypeId)

                                                    console.log(this.state.eventOpend);
                                                }}
                                            >
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
                        {this.state.addModal.message ? (
                            <Alert variant="danger" value={this.state.addModal.message} />
                        ) : ''}
                    </Modal.Body>
                </Modal>


            </Container>
        )
    }
    private doDeleteEvent(eventTypeId: number) {
        api('api/eventType/' + eventTypeId, 'delete', {}, 'administrator')
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
                this.getEvents()


            })
    }

    private doAddEvent() {
        api('api/eventType/add', 'post', { name: this.state.addModal.name }, "administrator")
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
                this.getEvents();
                this.setAddModalVisible(false);

            })
    }


    private showAddModal() {

        this.setAddModalStringFieldState('name', '');
        this.setAddModalVisible(true);

    }
}