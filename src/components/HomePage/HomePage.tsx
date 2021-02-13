import { faHouseUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Container } from "react-bootstrap";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

export default class HomePage extends React.Component {

    render() {
        return (
            <Container>
                <RoledMainMenu role="visitor" />
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faHouseUser} />  Event category
                        </Card.Title>
                        <Card.Text>
                            Event categories
                        </Card.Text>

                    </Card.Body>
                </Card>


            </Container>
        )
    }
}