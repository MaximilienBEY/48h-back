import { Table, Model, AllowNull, Column, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { ModelAttribute } from '.'
import Group from './group.model'
import Slider from './slider.model'

export interface GroupSliderAttributes {
    id: number
    position: number;

    groupId: number;
    sliderId: number;
}

@Table({
    modelName: "group_slider"
})
export default class GroupSlider extends Model<ModelAttribute<GroupSliderAttributes>, Omit<GroupSliderAttributes, "id">> {
    @AllowNull(false)
    @Column
    position!: number
    
    @ForeignKey(() => Group)
    @Column
    groupId!: number


    @BelongsTo(() => Group, {
        onDelete: "CASCADE"
    })

    getGroup = async (): Promise<Group|null> => Group.findOne({where: {id: this.groupId}})
    
    @ForeignKey(() => Slider)
    @Column
    sliderId!: number

    @BelongsTo(() => Slider, {
        onDelete: "CASCADE"
    })

    getSlider = async (): Promise<Slider|null> => Slider.findOne({where: {id: this.sliderId}})
}