import { Table, Model, AllowNull, Column, ForeignKey, HasMany } from 'sequelize-typescript'
import { ModelAttribute } from '.'
import Slider from './slider.model'

export interface GroupAttributes {
    id: number
    label: string
}

@Table({
    modelName: "group"
})
export default class Group extends Model<ModelAttribute<GroupAttributes>, Omit<GroupAttributes, "id">> {
    @AllowNull(false)
    @Column
    label!: string

    @HasMany(() => Slider, {
        onDelete: "CASCADE"
    })
    getSliders = async (): Promise<Slider[]> => Slider.findAll({where: {groupId: this.id}})
}