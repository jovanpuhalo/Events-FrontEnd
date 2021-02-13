import React from "react";
import { MainMenu, MainMenuItem } from "../MainMenu/MainMenu";


interface RoledMainMenuProperties {
    role: 'administrator' | 'user' | 'visitor'
}

export default class RoledMainMenu extends React.Component<RoledMainMenuProperties>{

    render() {

        let items: MainMenuItem[] = [];

        switch (this.props.role) {
            case 'visitor': items = this.getVisitorMenuItems(); break;
            case 'administrator': items = this.getAdministratorMenuItems(); break;
            case 'user': items = this.getUserMenuItems(); break;
        }



        return <MainMenu items={items} />

    }

    getAdministratorMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Dashboard", "/administrator/dashboard/"),
            new MainMenuItem("Log out", "/administrator/logout/"),
        ];
    }

    getVisitorMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Home", "/"),
            new MainMenuItem("Contact", "/contact/"),
            new MainMenuItem("User Login", "/login/"),
            new MainMenuItem("Administrator Login", "/administrator/login/"),
        ];
    }

    getUserMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Home", "/"),
            new MainMenuItem("Log out", "/logout/")
        ];
    }

}