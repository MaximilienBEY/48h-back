import { Sequelize } from "sequelize-typescript"
import Group from "./group.model"
import Slider from "./slider.model"
import User from "./user.model"

export type ModelAttribute<Attribute> = Attribute & {
    createdAt?: Date
    updatedAt?: Date
}

const sequelize = new Sequelize({
    database: 'ekip',
    dialect: 'mysql',
    username: 'root',
    password: 'root',
    host: "localhost",
    logging: false
})

sequelize.addModels([
    User,
    Group,
    Slider,
])

export default sequelize