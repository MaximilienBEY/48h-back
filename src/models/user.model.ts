
   
import { Table, Model, AllowNull, Column, HasMany, ForeignKey } from 'sequelize-typescript'
import { ModelAttribute } from '.'
import Access from './slider.model'

export interface UserAttributes {
    id: number
    username: string
    email: string
    password: string
}

@Table({
    modelName: "user"
})
export default class User extends Model<ModelAttribute<UserAttributes>, Omit<UserAttributes, "id">> {
    @AllowNull(false)
    @Column
    username!: string

    @AllowNull(false)
    @Column
    email!: string
    
    @AllowNull(false)
    @Column
    password!: string
}