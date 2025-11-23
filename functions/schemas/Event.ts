import mongoose, { Schema, Document } from 'mongoose';

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

const EventSchema: Schema = new Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },
    organizerId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    registrationDateStart: {
      type: String,
      required: true,
    },
    registrationDateEnd: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    imageKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster organizerId lookups
EventSchema.index({ organizerId: 1 });
// Index for date-based queries
EventSchema.index({ date: 1 });

export default mongoose.model<IEvent>('Event', EventSchema);