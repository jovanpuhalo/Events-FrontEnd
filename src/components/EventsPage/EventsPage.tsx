import { faBackward, faHouseUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import api, { ApiResponse, getToken } from "../../api/api";
import IdleTimerContainer from "../IdleTimerContainer/IdleTimer";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

interface EventPageProperties {
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
    // status: "Scheduled" | "In progress" | "Closed"
    eventType: {
        name: string
    }
    eventTypeId: string

}

interface EventPageState {
    roleState?: "user" | "administrator"
    message: string;
    isLoggedIn: boolean;
    events?: EventDto[]
    eventType?: string


}




export default class EventPage extends React.Component<EventPageProperties>{
    state: EventPageState
    constructor(props: Readonly<EventPageProperties>) {
        super(props)

        this.state = {
            message: '',
            isLoggedIn: false,


        }
        const tokenUser = getToken('user').split(" ")[1]

        if (tokenUser !== 'null') {
            this.setRoleState('user')
            return;
        }
        const tokenAdmin = getToken('administrator').split(" ")[1]

        if (tokenAdmin !== 'null') {
            this.setRoleState('administrator')
            return;
        }




    }

    private setEventsState(events: EventDto[]) {
        this.setState(Object.assign(this.state, {
            events: events
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


    componentDidMount() {
        this.getEvents();

    }


    private getEvents() {
        api('api/eventType/' + this.props.match.params.eId, 'get', {}, this.state.roleState)
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

                this.setLoggedInState(true);
                const eventType: string = res.data.name
                this.setEventTypeState(eventType);

                const events: EventDto[] =
                    res.data.events.map((event: EventDto) => {
                        return {
                            eventId: event.eventId,
                            name: event.name,
                            description: event.description,
                            start: event.start,
                            end: event.end,
                            // status: event.status,
                            eventTypeId: event.eventTypeId

                        }
                    })
                this.setEventsState(events);



            })

        // api('api/event/'+)
    }





    render() {
        if (this.state.roleState !== "user" && this.state.roleState !== "administrator") {

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

                        <Link to="/"
                            className="btn btn-sm btn-secondary mb-2">
                            <FontAwesomeIcon icon={faBackward} /> Back to event types
                         </Link><br /><br />
                        <Card.Title>
                            <FontAwesomeIcon icon={faHouseUser} /> {this.state.eventType}

                        </Card.Title>
                        <Card.Text>

                            <Row>
                                {this.state.events?.map(this.showEvents)}
                            </Row>
                        </Card.Text>

                    </Card.Body>
                </Card>


            </Container>
        )
    }

    private showEvents(event: EventDto) {

        return (
            <Col lg="3" md="4" sm="6" xs="12" >
                <Card className="mb-3 ">
                    <Card.Body>
                        <Card.Title as="p"> {event.name} </Card.Title>
                        <Link to={`/event/${event.eventId}`}
                            className="btn btn-primary btn-block btn-sm">
                            Show event
                        </Link>
                    </Card.Body>
                </Card>
            </Col>

        );
    }
}