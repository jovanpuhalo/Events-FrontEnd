import { faHouseUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { getTokenSourceMapRange } from "typescript";
import api, { getToken } from "../../api/api";
import IdleTimerContainer from "../IdleTimerContainer/IdleTimer";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";




interface Events {
    eventTypeId: number,
    name: string
}

interface HomePageState {
    roleState: "user" | "visitor" | "administrator",
    isLogedIn: boolean,
    eventTypes?: Events[]

}


export default class HomePage extends React.Component {
    state: HomePageState;
    constructor(props: Readonly<{}>) {
        super(props)

        this.state = {
            roleState: 'visitor',
            isLogedIn: false,

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




    private setEventTypesState(eventTypes: Events[]) {
        let newState = Object.assign(this.state, {
            eventTypes: eventTypes
        })
        this.setState(newState);

    }


    private setLoginState(isLogedIn: boolean) {
        let newState = Object.assign(this.state, {
            isLogedIn: isLogedIn
        })
        this.setState(newState);
    }

    private setRoleState(role: string) {
        let newState = Object.assign(this.state, {
            roleState: role
        })
        this.setState(newState);
    }

    componentDidMount() {
        this.getEventType();
    }



    private getEventType() {
        api('api/eventType', 'get', {})
            .then(res => {
                if (res.status === 'login') {
                    this.setLoginState(false);
                    return;
                }
                if (res.status === 'error') {
                    // this.setMessage('Request error. Please try to refresh the page.');
                    return;
                }
                this.setLoginState(true);

                this.setEventTypesState(res.data)

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


    render() {
        if (this.state.eventTypes?.length === 0) {
            return;
        }
        console.log(this.state.roleState);





        return (
            <Container>
                <RoledMainMenu role={this.state.roleState} />
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faHouseUser} /> Event types
                        </Card.Title>
                        <Card.Text>
                            <Row>
                                {this.state.eventTypes?.map(this.showEventTypes)}
                            </Row>
                        </Card.Text>

                    </Card.Body>
                </Card>
            </Container>

        )



    }
}