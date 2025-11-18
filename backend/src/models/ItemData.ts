import mongoose, { Document, Schema } from 'mongoose';

export interface IItemData extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  items: {
    model: string;
    serial: string;
    scanned: boolean;
  }[];
  dataInput: string;
}

const ItemDataSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true,
  },
  items: [{
    model: { type: String, required: true },
    serial: { type: String, required: true },
    scanned: { type: Boolean, required: true, default: false },
  }],
  dataInput: {
    type: String,
    default: '',
  }
});

export default mongoose.model<IItemData>('itemdata', ItemDataSchema);
