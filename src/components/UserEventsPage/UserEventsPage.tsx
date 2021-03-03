import { faCalendar, faHouseUser, faMinusCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card, Col, Container, Row, Tab, Table, Tabs } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import api, { ApiResponse, getToken } from "../../api/api";
import IdleTimerContainer from "../IdleTimerContainer/IdleTimer";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

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
    isLogedIn: boolean,
    events: Events[],
    message: string,
    userId?: number,
    userEvents: number[]

}


export default class UserEventPage extends React.Component {
    state: UserEventPageState;
    constructor(props: {} | Readonly<{}>) {
        super(props)

        this.state = {
            // roleState: 'visitor',
            isLogedIn: false,
            message: '',
            events: [],
            userEvents: []

        }
        // const token = getToken('user').split(" ")[1]

        // if (token !== 'null') {
        //     this.setRoleState('user')

        // }

    }

    private setUserId(userId: number) {
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


    private setLoggedInState(isLogedIn: boolean) {
        let newState = Object.assign(this.state, {
            isLogedIn: isLogedIn
        })
        this.setState(newState);
    }

    // private setRoleState(role: string) {
    //     let newState = Object.assign(this.state, {
    //         roleState: role
    //     })
    //     this.setState(newState);
    // }

    componentDidMount() {
        this.getEventsForUser();
    }



    private getEventsForUser() {
        let token: string = getToken('user')
        const tokenParts = token.split(' ');

        token = tokenParts[1];

        api('api/user/userId', 'post', { token })
            .then(res => {
                if (res.status === 'login') {
                    this.setLoggedInState(false);
                    return;
                }
                if (res.status === 'error') {
                    this.setMessage('Request error. Please try to refresh the page.');
                    return;
                }
                console.log("rezultat" + res.data);

                this.setUserId(res.data
                );
                this.setLoggedInState(true);
                api('/api/events/' + this.state.userId, 'get', {})
                    .then(res => {
                        if (res.status === 'login') {
                            this.setLoggedInState(false);
                            return;
                        }
                        if (res.status === 'error') {
                            // this.setMessage('Request error. Please try to refresh the page.');
                            return;
                        }
                        this.setLoggedInState(true);
                        // console.log(res.data);


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


    }



    private showEventTypes(eventType: Events) {

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


    unsubscribe(userId: any, eventId: any) {
        api('api/event/user/unsubscribe/' + userId + '/' + eventId, 'delete', {})
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
                    this.setMessage('Request error. Please try to refresh the page.');
                    return;
                }
                if (res.status === 'login') {
                    this.setLoggedInState(true);
                    return;
                }

                this.getEventsForUser();
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



        return (
            <Container >
                <IdleTimerContainer />
                <RoledMainMenu role={"user"} />
                <Col >
                    <Card  >
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
                                {/* <td>
                                {this.printStatusChangeButtons(order)}
                            </td> */}
                            </tr>
                        ), this)}
                    </tbody>
                </Table>
            </>
        );
    }
}