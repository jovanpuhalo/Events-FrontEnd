import IdleTimer from 'react-idle-timer'
import React, { useRef, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { removeToken } from '../../api/api'




function IdleTimerContainer() {

    const [path, setPath] = useState(null)
    const IdleTimerRef = useRef(null)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [isLoggedOf, setIsLoggeOf] = useState(false)

    function onIdle() {


        setModalIsOpen(true);
        removeToken('user')
    }

    function logOut() {

        setIsLoggeOf(true)
        setModalIsOpen(false);
        setPath('/user/logout')

    }


    if (isLoggedOf) {

        return (
            < Redirect to={path} />
        )
    }

    return (

        <div>
            <Modal size="sm" centered show={modalIsOpen} className="border-4">
                <p className="ml-5 mt-2">Your session has expired!</p>
                <Row className=" mb-3" >
                    <Col xs={{ span: 5, offset: 4 }} >
                        <Button variant="primary" className="" onClick={logOut}>
                            Log in

                         </Button>
                    </Col>
                </Row>
            </Modal>
            <IdleTimer
                ref={IdleTimerRef}
                timeout={1000 * 60 * 60}
                onIdle={onIdle}>
            </IdleTimer>
        </div>
    )

}

export default IdleTimerContainer
