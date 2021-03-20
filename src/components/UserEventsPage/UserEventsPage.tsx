import { faCalendar, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card, Col, Container, Tab, Table, Tabs } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { ApiResponse, getToken } from "../../api/api";
import IdleTimerContainer from "../IdleTimerContainer/IdleTimer";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

interface EventsPageProperties {
    match: {
        params: {
            role: "administrator" | "user"
        }
    }


}

interface Events {
    userEventsId: number,
    eventTypeId: number,
    name: string

    eventId: number;
    description: string;
    start: string;
    end: string;
    location: string;
    status: "Scheduled" | "In progress" | "Closed"
    eventType: {
        name: string
        eventTypeId: string
    },
}

interface UserEventPageState {
    // roleState: "user" | "visitor",
    isLoggedIn: boolean,
    events: Events[],
    message: string,
    userId?: number,
    userEvents: number[]

}


export default class UserEventPage extends React.Component<EventsPageProperties> {
    state: UserEventPageState;
    constructor(props: EventsPageProperties | Readonly<EventsPageProperties>) {
        super(props)

        this.state = {

            isLoggedIn: true,
            message: '',
            events: [],
            userEvents: []

        }

    }

    private setStateUserId(userId: number) {
        let newState = Object.assign(this.state, {
            userId: userId
        })
        this.setState(newState);
    }

    private setUserEvents(userEvents: number[]) {
        let newState = Object.assign(this.state, {
            userEvents: userEvents
        })
        this.setState(newState);
    }

    private setMessage(message: string) {
        let newState = Object.assign(this.state, {
            message: message
        })
        this.setState(newState);
    }

    private setEventState(events: Events[]) {
        let newState = Object.assign(this.state, {
            events: events
        })
        this.setState(newState);

    }


    private setLoggedInState(isLoggedIn: boolean) {
        let newState = Object.assign(this.state, {
            isLoggedIn: isLoggedIn
        })
        this.setState(newState);
    }



    componentDidMount() {
        this.getEventsForUser(this.props.match.params.role);
    }



    private getEventsForUser(role: "administrator" | "user") {
        let token: string = getToken(role)
        const tokenParts = token.split(' ');

        token = tokenParts[1];

        if (role !== "administrator" && role !== "user") {
            this.setLoggedInState(false);

        }

        if (token !== 'null' && role === "user") {
            api('api/user/userId', 'post', { token }, role)
                .then((res: ApiResponse) => {
                    if (res.status === 'error') {
                        this.setLoggedInState(false);
                        // this.setMessageState('Request error. Please try to refresh the page.');
                        return;
                    }
                    if (res.status === 'login') {
                        this.setLoggedInState(false);
                        return
                    }
                    this.setStateUserId(res.data.userId)
                    // this.setLoggedInState(true);


                    api('/api/events/' + this.state.userId, 'get', {}, role)
                        .then(res => {
                            if (res.status === 'login') {
                                this.setLoggedInState(false);
                                return;
                            }
                            if (res.status === 'error') {
                                this.setLoggedInState(false);
                                // this.setMessage('Request error. Please try to refresh the page.');
                                return;
                            }


                            let userEventss: number[] = []
                            userEventss = res.data.userEvents.map((userEvent: any) => {
                                userEventss.push(userEvent.userEventId)

                                this.setUserEvents(userEventss)
                            })

                            // this.setEventTypesState(res.data)
                            let events: Events[] =
                                res.data.events.map((event: Events) => {
                                    const status = this.setStatusEvent(event.start, event.end)

                                    return {
                                        userEventsId: this.state.userEvents.shift(),
                                        eventId: event.eventId,
                                        name: event.name,
                                        description: event.description,
                                        start: event.start,
                                        end: event.end,
                                        status: status,
                                        eventTypeId: event.eventTypeId,
                                        location: event.location,
                                        // userEventsId: res.data.userEvents.filter((userEvent: any) => userEvent.eventId === event.eventId).map()
                                    }
                                }).sort(function (a: any, b: any) {
                                    return a.userEventsId - b.userEventsId
                                });
                            // console.log(events);
                            // events.sort(function (a, b) {
                            //     return a.userEventsId - b.userEventsId
                            // })

                            this.setEventState(events)
                            console.log(events);
                        })

                })
            this.setLoggedInState(true)
            return;
        }


        if (token !== 'null' && role === "administrator") {
            api('api/administrator/admin/adminId', 'post', { token }, role)
                .then((res: ApiResponse) => {
                    if (res.status === 'error') {
                        this.setLoggedInState(false);
                        // this.setMessageState('Request error. Please try to refresh the page.');
                        return;
                    }
                    if (res.status === 'login') {
                        this.setLoggedInState(false);
                        return
                    }
                    this.setStateUserId(res.data)
                    // this.setLoggedInState(true);

                    api('/api/administrator/events/' + this.state.userId, 'get', {}, role)
                        .then(res => {
                            if (res.status === 'login') {
                                this.setLoggedInState(false);
                                return;
                            }
                            if (res.status === 'error') {
                                // this.setMessage('Request error. Please try to refresh the page.');
                                return;
                            }
                            // this.setLoggedInState(true);


                            let adminEvents: number[] = []
                            adminEvents = res.data.administratorEvents.map((administratorEvent: any) => {
                                adminEvents.push(administratorEvent.administratorEventId)

                                this.setUserEvents(adminEvents)


                            })

                            // this.setEventTypesState(res.data)
                            let events: Events[] =
                                res.data.events.map((event: Events) => {
                                    const status = this.setStatusEvent(event.start, event.end)

                                    return {
                                        userEventsId: this.state.userEvents.shift(),
                                        eventId: event.eventId,
                                        name: event.name,
                                        description: event.description,
                                        start: event.start,
                                        end: event.end,
                                        status: status,
                                        eventTypeId: event.eventTypeId,
                                        location: event.location,
                                        // userEventsId: res.data.userEvents.filter((userEvent: any) => userEvent.eventId === event.eventId).map()
                                    }
                                }).sort(function (a: any, b: any) {
                                    return a.userEventsId - b.userEventsId
                                });

                            this.setEventState(events)

                        })

                })
            this.setLoggedInState(true)
            return;
        }
        this.setLoggedInState(false)
    }

    unsubscribe(userId: any, eventId: any) {

        api('api/event/' + this.props.match.params.role + '/unsubscribe/' + userId + '/' + eventId, 'delete', {}, this.props.match.params.role)
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
                    this.setLoggedInState(false);
                    this.setMessage('Request error. Please try to refresh the page.');
                    return;
                }
                if (res.status === 'login') {
                    this.setLoggedInState(false);
                    return;
                }
                // this.setLoggedInState(true);

                this.getEventsForUser(this.props.match.params.role);
            })
    }

    setStatusEvent(startTime: any, endTime: any) {


        const curentTime = new Date().getTime()
        const start = new Date(startTime).getTime()
        const end = new Date(endTime).getTime()

        if (end < curentTime) {
            return "Closed"
        } else {
            if (start < curentTime) {
                return "In Progress"
            } else {
                return "Scheduled"
            }
        }

    }


    render() {


        if (this.state.isLoggedIn === false) {
            return (
                <Redirect to="/user/login" />
            );

        }

        return (
            <Container >
                <IdleTimerContainer />
                <RoledMainMenu role={this.props.match.params.role} />
                <Col >
                    <Card className="border-white">
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faCalendar} /> My events
                        </Card.Title>

                            <Tabs defaultActiveKey="All Subscribed events" id="order-tabs" className="ml-0 mb-0">
                                <Tab eventKey="All Subscribed events" title="All Subscribed events">
                                    {this.renderOrders("All Subscribed events")}
                                </Tab>

                                <Tab eventKey="Past events" title="Past events">
                                    {this.renderOrders("Closed")}
                                </Tab>

                                <Tab eventKey="Upcoming events" title="Upcoming events">
                                    {this.renderOrders("Scheduled")}
                                </Tab>
                            </Tabs>

                        </Card.Body>
                    </Card>
                </Col>

            </Container>
        )
    }

    renderOrders(withStatus: "All Subscribed events" | "Closed" | "Scheduled") {
        let rBr = 1;
        return (
            <>
                <br />

                <Table hover size="xs" bordered>
                    <thead>
                        <tr>
                            <th className="text-left pr-2"></th>
                            <th>Event</th>
                            <th>Event start</th>
                            <th>Event end</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th></th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.state.events.filter(event => (event.status === withStatus || withStatus === "All Subscribed events")).map(event => (
                            <tr>
                                <td >{rBr++}</td>
                                <td className="text-left pr-2">{event.name}</td>
                                <td><b>Date:     </b>{event.start.slice(0, 10)} <br /> <b>Time:     </b> {event.start.slice(11, 16)}</td>
                                <td><b>Date:     </b>{event.end.slice(0, 10)}  <br /> <b>Time:     </b> {event.end.slice(11, 16)}</td>
                                <td>{event.location}</td>
                                <td>{event.status}</td>

                                <td>
                                    <Button size="sm" variant="primary"
                                        onClick={() => this.unsubscribe(this.state.userId, event.eventId)}>
                                        <FontAwesomeIcon icon={faMinusCircle} />
                                    </Button>
                                </td>
                            </tr>
                        ), this)}
                    </tbody>
                </Table>
            </>
        );
    }
}