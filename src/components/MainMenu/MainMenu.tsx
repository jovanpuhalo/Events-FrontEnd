import React from "react";
import { Col, Container, Nav, Row } from "react-bootstrap";
import { HashRouter, Link } from "react-router-dom";

export class MainMenuItem {
    text: string = '';
    link: string = '#';

    constructor(text: string, link: string) {
        this.link = link;
        this.text = text;
    }
}

interface MainMenuProperties {
    items: MainMenuItem[]
}

export class MainMenu extends React.Component<MainMenuProperties> {

    render() {
        return (
            <Container>
                <Row>
                    <Col md="6" sm="8" xs="12">
                        <Nav variant="tabs" className="justify-content-sm-start  border-0  justify-content-center ">
                            <HashRouter>
                                {
                                    this.props.items.map(item => {

                                        if (item.text !== 'User Login') {
                                            return this.makeNavLink(item);
                                        } else {
                                            return false;
                                        }
                                    }, this)

                                }
                            </HashRouter>
                        </Nav>
                    </Col>
                    <Col md="6" sm="4" xs="12"  >
                        <Nav variant="tabs" className="justify-content-center border-0 justify-content-sm-end">
                            {
                                this.props.items.map(item => {
                                    if (item.text !== 'User Login') {
                                        return false;
                                    }
                                    return this.makeNavLink(item);
                                })
                            }
                        </Nav>
                    </Col>
                </Row>
            </Container>
        );
    }

    private makeNavLink(item: MainMenuItem) {
        return (

            <Link to={item.link} className="nav-link">
                {item.text}
            </Link>

        )
    }

}