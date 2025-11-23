import mongoose, { Document } from 'mongoose';
export interface IEvent extends Document {
    eventId: string;
    organizerId: string;
    title: string;
    description: string;
    date: string;
    registrationDateStart: string;
    registrationDateEnd: string;
    capacity: number;
    imageKey: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IEvent, {}, {}, {}, mongoose.Document<unknown, {}, IEvent, {}, {}> & IEvent & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Event.d.ts.map