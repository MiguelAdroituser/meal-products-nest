import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('text', {
        unique: true,
    })
    name: string;

    @Column({
        type:'text',
        nullable: true
    })
    description: string;

    @Column('float')
    price: number;

}