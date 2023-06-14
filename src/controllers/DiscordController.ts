import { Express } from 'express';
import { awakensDiscord } from '../service/DiscordService.cs';
import { logInfo } from '../utility/Logger';
import ControllerInterface from "./ControllerInterface";

export class DiscordController extends ControllerInterface {
    constructor(app: Express, route: string) {
        super(app, route)

        app.get(route + "/awakens", (req, res) => {
            logInfo("Start Discord awakens")
            try {
                awakensDiscord()
                res.send("🤖 This is a harsh awakening")
            } catch (e) {
                this.sendError(res, e)
            }
        })
    }
}