import { Table, Model, AllowNull, Column, ForeignKey } from 'sequelize-typescript'
import { ModelAttribute } from '.'
import Group from './group.model'

export interface SliderAttributes {
    id: number
    title: string
    mediaType: string
    mediaSource: string;

    groupId: number

}

@Table({
    modelName: "slider"
})
export default class Slider extends Model<ModelAttribute<SliderAttributes>, Omit<SliderAttributes, "id">> {
    @AllowNull(false)
    @Column
    session!: string
    
    @AllowNull(false)
    @Column
    refresh!: string
    
    @ForeignKey(() => Group)
    @Column
    groupId!: number

    getGroup = async (): Promise<Group|null> => Group.findOne({where: {id: this.groupId}})
}