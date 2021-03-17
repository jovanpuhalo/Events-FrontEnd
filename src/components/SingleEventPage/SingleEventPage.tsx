import { faBackward, faCalendar, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import api, { ApiResponse, getToken } from "../../api/api";
import IdleTimerContainer from "../IdleTimerContainer/IdleTimer";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";
import UsersInEvent from "../UsersInEvent.tsx/UsersInEvent";

interface SingleEventPageProperties {
    match: {
        params: {
            eId: number
        }
    }
}

interface EventDto {
    eventId: number;
    name: string;
    description: string;
    start: string;
    end: string;
    location: string;
    eventType: {
        name: string
        eventTypeId: string
    };
    users: {
        userId: number
        forename: string
        surname: string

    }[];
    administrators: {
        administratorId: number
    }[]

}

interface EventPageState {
    roleState: "user" | "administrator",
    message: string;

    isLoggedIn: boolean;
    userId?: number;
    event?: EventDto;
    subscribed: "Subscribe" | "Unsubscribe",
    eventStatus?: string


}




export default class SingleEventPage extends React.Component<SingleEventPageProperties>{
    state: EventPageState
    constructor(props: Readonly<SingleEventPageProperties>,) {
        super(props)

        this.state = {
            message: '',
            isLoggedIn: false,
            roleState: 'user',
            subscribed: 'Subscribe'


        }


        const token = getToken('user').split(" ")[1]

        if (token !== 'null') {
            this.setRoleState('user')
            return;
        }

        const tokenAdmin = getToken('administrator').split(" ")[1]

        if (tokenAdmin !== 'null') {
            this.setRoleState('administrator')
            return;
        }
    }
    private setEventStatusState(status: string) {
        this.setState(Object.assign(this.state, {
            eventStatus: status
        }))
    }
    private setSubscribedState(subscribe: string) {
        this.setState(Object.assign(this.state, {
            subscribed: subscribe
        }))
    }
    private setEventsState(event: EventDto) {
        this.setState(Object.assign(this.state, {
            event: event
        }))
    }
    private setStateUserId(userId: number) {
        this.setState({
            userId: userId
        })
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


    componentDidMount() {
        this.getEvent();


    }


    private getEvent() {
        api('api/event/' + this.props.match.params.eId, 'get', {}, this.state.roleState)
            .then((res: ApiResponse) => {
                console.log(res.data);

                if (res.status === 'error') {
                    this.setMessageState('Request error. Please try to refresh the page.');
                    return;
                }
                if (res.status === 'login') {
                    this.setLoggedInState(true);
                    return;

                }


                const event: EventDto =
                {
                    eventId: res.data.eventId,
                    name: res.data.name,
                    description: res.data.description,
                    start: res.data.start,
                    end: res.data.end,
                    location: res.data.location,
                    eventType: {
                        eventTypeId: res.data.eventType.eventTypeId,
                        name: res.data.eventType.name,
                    },
                    users: res.data.users,
                    administrators: res.data.administrators
                }

                this.setEventsState(event);

                this.setStatusEvent(this.state.event?.start, this.state.event?.end)

                this.getCurentUserId(this.state.roleState);

            })

    }

    render() {


        if (this.state.isLoggedIn) {

            return (
                <Redirect to="/user/login" />
            );

        }

        return (
            <Container>
                <IdleTimerContainer />
                <RoledMainMenu role={this.state.roleState} />
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <Link to={"/eventType/" + this.state.event?.eventType.eventTypeId}
                                className="btn btn-sm btn-secondary mb-2">
                                <FontAwesomeIcon icon={faBackward} /> Back to events
                             </Link><br />
                            <FontAwesomeIcon icon={faCalendar} /> {this.state.event ?
                                this.state.event?.name :
                                'Event not found'}
                        </Card.Title>


                        {
                            this.state.event ?
                                (this.renderEventData(this.state.event)) :
                                ''
                        }

                    </Card.Body>
                </Card>
            </Container>
        )
    }

    private printOptionalMessage() {
        if (this.state.message === '') {
            return;
        }

        return (
            <Card.Text>
                { this.state.message}
            </Card.Text>
        );
    }

    private subscribe(status: any, role: "administrator" | "user") {

        if (status === 'Closed' || status === 'In Progress') {
            this.setMessageState("You cannot subscribe an event that has ended or is in progress")
            this.setSubscribedState("Subscribe");
            return;
        }
        let token: string = getToken(role)
        const tokenParts = token.split(' ');

        token = tokenParts[1];

        if (token !== 'null' && role === "user") {
            api('api/user/userId', 'post', { token }, role)
                .then((res: ApiResponse) => {
                    if (res.status === 'error') {
                        this.setMessageState('Request error. Please try to refresh the page.');
                        return;
                    }
                    if (res.status === 'login') {
                        this.setLoggedInState(true);
                        return
                    }
                    this.setStateUserId(res.data)

                    if (this.state.subscribed === "Subscribe") {

                        api('api/event/user/subscribe', 'post', { userId: this.state.userId, eventId: this.state.event?.eventId }, role)
                            .then((res: ApiResponse) => {
                                if (res.status === 'error') {
                                    this.setMessageState('Request error. Please try to refresh the page.');
                                }
                                if (res.status === 'login') {
                                    this.setLoggedInState(true);
                                }

                                this.setSubscribedState("Unsubscribe");


                            })
                    } else {
                        api('api/event/user/unsubscribe/' + this.state.userId + '/' + this.state.event?.eventId, 'delete', {}, role)
                            .then((res: ApiResponse) => {
                                if (res.status === 'error') {
                                    this.setMessageState('Request error. Please try to refresh the page.');
                                }
                                if (res.status === 'login') {
                                    this.setLoggedInState(true);
                                }

                                this.setSubscribedState("Subscribe");


                            })
                    }




                })
        }

        if (token !== 'null' && role === "administrator") {
            api('api/administrator/admin/adminId', 'post', { token }, role)
                .then((res: ApiResponse) => {
                    if (res.status === 'error') {
                        this.setMessageState('Request error. Please try to refresh the page.');
                        return;
                    }
                    if (res.status === 'login') {
                        this.setLoggedInState(true);
                        return
                    }
                    this.setStateUserId(res.data)

                    if (this.state.subscribed === "Subscribe") {

                        api('api/event/admin/subscribe', 'post', { administratorId: this.state.userId, eventId: this.state.event?.eventId }, role)
                            .then((res: ApiResponse) => {
                                if (res.status === 'error') {
                                    this.setMessageState('Request error. Please try to refresh the page.');
                                }
                                if (res.status === 'login') {
                                    this.setLoggedInState(true);
                                }

                                this.setSubscribedState("Unsubscribe");


                            })
                    } else {
                        api('api/event/admin/unsubscribe/' + this.state.userId + '/' + this.state.event?.eventId, 'delete', {}, role)
                            .then((res: ApiResponse) => {
                                if (res.status === 'error') {
                                    this.setMessageState('Request error. Please try to refresh the page.');
                                }
                                if (res.status === 'login') {
                                    this.setLoggedInState(true);
                                }

                                this.setSubscribedState("Subscribe");


                            })
                    }




                })
        }

    }

    private getCurentUserId(role: "user" | "administrator") {
        let token: string = getToken(role)
        const tokenParts = token.split(' ');
        token = tokenParts[1];

        if (token !== "null" && role === "user") {

            api('api/user/userId', 'post', { token }, role)
                .then((res: ApiResponse) => {
                    if (res.status === 'error') {
                        this.setMessageState('Request error. Please try to refresh the page.');
                    }
                    if (res.status === 'login') {
                        this.setLoggedInState(true);
                    }


                    this.setStateUserId(res.data)

                    if (this.state.event?.users) {
                        this.state.event.users.map((user) => {
                            if (this.state.userId === user.userId) {
                                this.setSubscribedState("Unsubscribe");


                            }
                        })
                    }
                })
        }
        if (token !== "null" && role === "administrator") {

            api('api/administrator/admin/adminId', 'post', { token }, role)
                .then((res: ApiResponse) => {
                    if (res.status === 'error') {
                        this.setMessageState('Request error. Please try to refresh the page.');
                    }
                    if (res.status === 'login') {
                        this.setLoggedInState(true);
                    }

                    this.setStateUserId(res.data)

                    if (this.state.event?.administrators) {
                        this.state.event.administrators.map((administrator) => {
                            if (this.state.userId === administrator.administratorId) {
                                this.setSubscribedState("Unsubscribe");

                            }
                        })
                    }
                })
        }

    }

    setStatusEvent(startTime: any, endTime: any) {


        const curentTime = new Date().getTime()
        const start = new Date(startTime).getTime()
        const end = new Date(endTime).getTime()

        if (end < curentTime) {
            this.setEventStatusState('Closed');

        } else {
            if (start < curentTime) {
                this.setEventStatusState("In Progress");


            } else {
                this.setEventStatusState("Scheduled");

            }
        }

    }

    renderEventData(event: EventDto) {
        return (
            <>

                <Row>
                    <Col xs="12" sm="12" md="6" lg="6" >

                        <div className="description">
                            {event.description}
                        </div>

                        <hr />
                        <UsersInEvent events={this.state.event} />


                    </Col>
                    <Col xs={{ span: 12 }} sm={{ span: 12, offset: 1 }} md={{ span: 4, offset: 2 }} lg={{ span: 3, offset: 3 }} >
                        <Table hover size="sm" bordered>

                            <tr>
                                <th>Start</th>
                                <td>{event.start.slice(0, 10)}  <br /> {event.start.slice(11, 16)}</td>
                            </tr>

                            <tr>
                                <th>End  </th>
                                <td>{event.end.slice(0, 10)} <br /> {event.end.slice(11, 16)}</td>


                            </tr>
                        </Table>

                        <b> Location:  </b>{this.state.event?.location} <br /><br />

                        <p><b> Status:  </b> {this.state.eventStatus}</p>

                        <Button variant="primary" size="sm"
                            onClick={() => this.subscribe(this.state.eventStatus, this.state.roleState)}
                        >
                            <FontAwesomeIcon icon={faPlus} /> {(this.state.eventStatus === "Closed" || this.state.eventStatus === "In Progress")
                                ? "Subscribe" : this.state.subscribed}

                        </Button>
                        <br />  <br />

                        {this.state.message ? (
                            <Alert variant="danger">{this.state.message}</Alert>
                        ) : ''}
                        {/* {this.printOptionalMessage()} */}
                    </Col>

                </Row>
            </>
        );
    }
}