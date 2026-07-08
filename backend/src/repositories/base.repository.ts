import { Model, Document } from "mongoose";

export const makeRepository = <T extends Document>(model: Model<T>) => {
  return {
    create: async (data: any): Promise<T> => {
      return await model.create(data);
    },

    findAll: async (
      filter: any = {},
      options: { sort?: any; select?: string; populate?: string; limit?: number; skip?: number } = {}
    ): Promise<T[]> => {
      const query = model.find(filter);
      if (options.sort) {
        query.sort(options.sort);
      }
      if (options.select) {
        query.select(options.select);
      }
      if (options.populate) {
        query.populate(options.populate);
      }
      if (options.limit !== undefined) {
        query.limit(options.limit);
      }
      if (options.skip !== undefined) {
        query.skip(options.skip);
      }
      return (await query.exec()) as T[];
    },

    findById: async (id: string, populate?: string): Promise<T | null> => {
      const query = model.findById(id);
      if (populate) {
        query.populate(populate);
      }
      return await query.exec();
    },

    findOne: async (filter: any, populate?: string): Promise<T | null> => {
      const query = model.findOne(filter);
      if (populate) {
        query.populate(populate);
      }
      return await query.exec();
    },

    updateById: async (id: string, data: any): Promise<T | null> => {
      return await model.findByIdAndUpdate(id, data, { new: true }).exec();
    },

    updateMany: async (filter: any, data: any) => {
      return await model.updateMany(filter, data).exec();
    },

    deleteById: async (id: string): Promise<T | null> => {
      return await model.findByIdAndDelete(id).exec();
    },

    count: async (filter: any = {}): Promise<number> => {
      return await model.countDocuments(filter).exec();
    },
  };
};

export type RepositoryType<T extends Document> = ReturnType<typeof makeRepository<T>>;
