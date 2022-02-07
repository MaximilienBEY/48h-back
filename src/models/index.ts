import { Sequelize } from "sequelize-typescript"
import Access from "./access.model"
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
    Access
])

export default sequelize