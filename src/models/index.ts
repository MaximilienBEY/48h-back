import { Sequelize } from "sequelize-typescript"
import Group from "./group.model"
import GroupSlider from "./group.slider.model"
import Slider from "./slider.model"
import User from "./user.model"

export type ModelAttribute<Attribute> = Attribute & {
    createdAt?: Date
    updatedAt?: Date
}

const sequelize = new Sequelize({
    database: '48h_database',
    dialect: 'mysql',
    username: 'root',
    password: 'root',
    host: "localhost",
    port: 8889,
    logging: false
})

sequelize.addModels([
    User,
    Group,
    Slider,
    GroupSlider
])

export default sequelize