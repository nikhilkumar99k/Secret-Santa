export class MongoService {

    static async create(model) {
      const result = await model.save();
      return result;
    }
  
    static async findOne(model, filter) {
      const result = await model.findOne(filter);
      return result;
    }
  
    static async findOneAndUpdate(model, filter, update) {
      const result = await model.findOneAndUpdate(filter, update, { new: true });
      return result;
    }
  
    static async findAll(model) {
      const result = await model.find();
      return result;
    }
  
    static async select(model, matchStage, projectionStage) {
      const result = await model.find(matchStage, projectionStage);
      return result;
    }
  
    static async updateMany(model, filter, data) {
      const result = model.updateMany(filter, data);
      return result;
    }
  
    static async count(model) {
      const result = await model.count();
      return result;
    }
    static async aggregation(model, pipeline) {
      const result = await model.aggregate(pipeline);
      return result;
    }
  
    static async bulkCreate(model, data) {
      const result = await model.insertMany(data);
      return result;
    }
  
    static async deleteOne(model, filter) {
      const result = await model.deleteOne(filter);
      return result;
    }
  
    static async deleteMany(model, filter) {
      const result = await model.deleteMany(filter);
      return result;
    }
  }
  