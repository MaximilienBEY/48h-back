import { Table, Model, AllowNull, Column, ForeignKey, HasMany } from 'sequelize-typescript'
import { ModelAttribute } from '.'
import GroupSlider from './group.slider.model'

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

    @HasMany(() => GroupSlider, {
        onDelete: "CASCADE"
    })
    getGroupSliders = async (): Promise<GroupSlider[]> => GroupSlider.findAll({where: {groupId: this.id}})
}