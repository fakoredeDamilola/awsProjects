import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    userId: string;
    email: string;
    passwordHash: string;
    name: string;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map