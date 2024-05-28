import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDoc extends AbstractDocument> {
  protected logger: Logger;
  constructor(protected readonly model: Model<TDoc>) {}

  async create(doc: Omit<TDoc, '_id'>): Promise<TDoc> {
    const createdDoc = new this.model({
      ...doc,
      _id: new Types.ObjectId(),
    });

    return (await createdDoc.save()).toJSON() as unknown as TDoc;
  }

  async findOne(filter: FilterQuery<TDoc>): Promise<TDoc> {
    const doc = await this.model.findOne(filter).lean<TDoc>(true);

    if (!doc) {
      this.logger.warn('Document not found with filter: ', filter);
      throw new NotFoundException('Document not found');
    }

    return doc;
  }

  async findOneAndUpdate(
    filter: FilterQuery<TDoc>,
    update: UpdateQuery<TDoc>,
  ): Promise<TDoc> {
    const doc = await this.model
      .findOneAndUpdate(filter, update, { new: true })
      .lean<TDoc>(true);

    if (!doc) {
      this.logger.warn('Document not found with filter: ', filter);
      throw new NotFoundException('Document not found');
    }

    return doc;
  }

  async find(filter: FilterQuery<TDoc>): Promise<TDoc[]> {
    return this.model.find(filter).lean<TDoc[]>(true);
  }

  async findOneAndDelete(filter: FilterQuery<TDoc>): Promise<TDoc> {
    return this.model.findOneAndDelete(filter).lean<TDoc>(true);
  }
}
