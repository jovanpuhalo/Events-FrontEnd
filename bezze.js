import IdleTimer from 'react-idle-timer'
import React, { useRef, useState } from 'react'

import { Redirect } from 'react-router-dom'
import Modal from 'react-modal'




function IdleTimerContainer(putanja) {

    const [path, setPath] = useState(putanja.path)
    const IdleTimerRef = useRef(null)
    const [modalIsOpen, setModalIsOpen] = useState(false)

    function onIdle() {

        setPath('/user/logout')
        setModalIsOpen(true);

    }

    const logOut = () => {

        setIsLoggedIn(false)
        // clearTimeout(sessionTimeoutRef.current)
        return (< Redirect to={"/user/logout"} />)

    }


    if (path === "/user/logout") {
        return (

            <div>
                <Modal isOpen={modalIsOpen}>

                    <div>
                        <p>You have to log in again</p>
                        <button onClick={logOut}>Log in</button>

                    </div>
                </Modal>

                <IdleTimer
                    ref={IdleTimerRef}
                    timeout={1000 * 5}
                    onIdle={onIdle}>

                </IdleTimer>

            </div>
        )


    }

    return (

        <div>

            <IdleTimer
                ref={IdleTimerRef}
                timeout={1000 * 5}
                onIdle={onIdle}>
            </IdleTimer>
        </div>
    )

}

export default IdleTimerContainer
