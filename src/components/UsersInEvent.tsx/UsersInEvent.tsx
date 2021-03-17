import React from "react"


interface SingleEventPageProperties {
    events?: EventDto
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
        forename: string;
        surname: string;

    }[];
    administrators: {
        administratorId: number
    }[]

}


export default class UsersInEvent extends React.Component<SingleEventPageProperties> {


    constructor(props: SingleEventPageProperties | Readonly<SingleEventPageProperties>) {
        super(props)
    }


    private getUsers() {
        let users: any = [];

        this.props.events?.users.map((user) => {
            users.push(' ' + user.forename + ' ' + user.surname);

        })




        return (
            <>
                <p><b>Who all comes to the event:</b></p>
                <p>
                    {users + ''}
                </p>
            </
            >
        )

    }

    render() {
        return (
            <>

                {
                    this.getUsers()
                }
            </>
        )
    }
}