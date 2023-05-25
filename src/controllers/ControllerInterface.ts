import { Express } from 'express';

abstract class ControllerInterface {
    constructor(app: Express, route: string) {
        this.app = app
        this.route = route
        console.info("Route added: " + route)
    }
    app: Express
    route: string
}

export default ControllerInterface;