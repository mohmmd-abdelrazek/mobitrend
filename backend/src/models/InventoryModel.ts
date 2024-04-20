// InventoryModel.ts

import { Schema, model, Document, Types } from 'mongoose';

interface IInventory extends Document {
    product: Types.ObjectId;        // Reference to the Product
    warehouse: string;              // Warehouse location identifier or name
    quantity: number;               // Current stock quantity
    restockThreshold: number;       // Threshold at which a restock is triggered
    supplier: Types.ObjectId;       // Reference to the Supplier
    restockQuantity: number;        // Quantity to reorder when restocking
    lastRestocked: Date;            // Last restock date
    isInTransit: boolean;           // If stock is in transit from supplier
    expectedArrival: Date;          // Expected arrival date of restocked items
}

const inventorySchema = new Schema<IInventory>({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    warehouse: { type: String, required: true },
    quantity: { type: Number, required: true },
    restockThreshold: { type: Number, required: true },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    restockQuantity: { type: Number, required: true },
    lastRestocked: { type: Date },
    isInTransit: { type: Boolean, default: false },
    expectedArrival: { type: Date }
}, {
    timestamps: true // Tracks when inventory records are created or modified
});

const InventoryModel = model<IInventory>('Inventory', inventorySchema);

export default InventoryModel;
