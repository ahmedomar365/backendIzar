import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    Name: string

    @Column()
    Price : number

    // @Column("json")
    // Images: Object


    // @Column()
    // cloudinary_id: string


    @Column("simple-array")
    Images: string[]

}
