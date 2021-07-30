import {prop,pre,getModelForClass,Ref } from "@typegoose/typegoose"
import UserModel, { User} from "../User"

@pre<Dependant>('save', async function (next) {
    
    const user = await UserModel.findById(
        this.payer
    )

    if (!user) {  
        next(new Error("payer doesn't exist"))
    }
    if (this.usedAllowance > this.maxAllowance) {
      next(new Error("max allowance can't be exceeded"))
    }
    else {
        next()
    }
})
class Dependant{
    @prop({ required: true })
    public name! : string

    @prop({
        required: true, unique: true,immutable:true, set: (val:string) => {
            if (val[0] === "+") {
            return val
            }
            else {
                return "+91"+val
            }
        },
        get: (val)=>val
    })
    public mobile! : string

    @prop({ enum: ["1", "2", "3", "4"],required:true ,default:"1"})
    public avatar!: string
    
    @prop({ required: true, min:1,default:10})
    public maxAllowance!: number
    
    @prop({ required: true,ref:"User",immutable:true })
    public payer! : Ref<User>
        
    @prop({
        required: true, default: 0
    })
    public usedAllowance!: number
}

const DependantModel = getModelForClass(Dependant)

export default DependantModel