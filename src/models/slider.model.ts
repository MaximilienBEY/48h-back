import { Table, Model, AllowNull, Column, ForeignKey, HasMany } from 'sequelize-typescript'
import { ModelAttribute } from '.'
import Group from './group.model'
import GroupSlider from './group.slider.model'

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

    @HasMany(() => GroupSlider, {
        onDelete: "CASCADE"
    })
    getGroupSliders = async (): Promise<GroupSlider[]> => GroupSlider.findAll({where: {sliderId: this.id}})
}

