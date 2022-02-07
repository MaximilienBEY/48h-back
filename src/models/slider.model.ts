import { Table, Model, AllowNull, Column, ForeignKey } from 'sequelize-typescript'
import { ModelAttribute } from '.'
import Group from './group.model'

export interface SliderAttributes {
    id: number
    label: string
    title: string
    mediaType: "image" | "video"
    mediaSource: string
}

@Table({
    modelName: "slider"
})
export default class Slider extends Model<ModelAttribute<SliderAttributes>, Omit<SliderAttributes, "id">> {
    @AllowNull(false)
    @Column
    label!: string
    
    @AllowNull(false)
    @Column
    title!: string
    
    @AllowNull(false)
    @Column
    mediaType!: string
    
    @AllowNull(false)
    @Column
    mediaSource!: string
    
    @ForeignKey(() => Group)
    @Column
    groupId!: number

    getGroup = async (): Promise<Group|null> => Group.findOne({where: {id: this.groupId}})
}