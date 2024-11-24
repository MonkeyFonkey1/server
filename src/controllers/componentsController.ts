import { Request, Response } from 'express';
import Component from '../models/component';
import mongoose from 'mongoose';

// Fetch all components
export const getAllComponents = async (req: Request, res: Response) => {
    try {
        const components = await Component.find();
        res.json(components);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching components', error });
    }
};

// Search components to support compatibility filtering
export const searchComponents = async (req: Request, res: Response) => {
    const { type, socket, memoryType, wattage } = req.query;

    try {
        const query: any = {};
        if (type) query.type = type;
        if (socket) query['specs.socket'] = socket; // Filter by socket
        if (memoryType) query['specs.memoryType'] = memoryType; // Filter by memory type
        if (wattage) query['specs.wattage'] = { $gte: Number(wattage) }; // Filter by minimum wattage

        const components = await Component.find(query);
        res.json(components);
    } catch (error) {
        res.status(500).json({ message: 'Error searching components', error });
    }
};

// Add a new component
export const addComponent = async (req: Request, res: Response) => {
    try {
        const newComponent = new Component(req.body);
        const savedComponent = await newComponent.save();
        res.status(201).json(savedComponent);
    } catch (error) {
        res.status(500).json({ message: 'Error adding component', error });
    }
};

export const updateComponent = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params; // Extract ID from URL
    const updates = req.body; // Extract update fields from the request body

    try {
        // Validate ObjectId
        if (!mongoose.isValidObjectId(id)) {
            res.status(400).json({ message: 'Invalid ObjectId format' });
            return;
        }

        // Perform the update
        const updatedComponent = await Component.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );
        if (!updatedComponent) {
            res.status(404).json({ message: 'Component not found' });
            return;
        }

        res.json(updatedComponent); // Return the updated document
    } catch (error) {
        res.status(500).json({ message: 'Error updating component', error });
    }
};

// Delete a component
export const deleteComponent = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const deletedComponent = await Component.findByIdAndDelete(
            req.params.id
        );
        if (!deletedComponent) {
            res.status(404).json({ message: 'Component not found' });
            return;
        }
        res.json({ message: 'Component deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting component', error });
    }
};
