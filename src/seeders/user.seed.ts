import Role from "../models/role.model"

export default async () => {
    await Role.create({
        label: "ADMINISTRATOR"
    })
    await Role.create({
        label: "USER"
    })
}