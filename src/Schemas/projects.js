import mongoose, { Schema, model} from "mongoose";

const projects = new Schema({
    project_id:Number,
    tags:Array
})

var ActivityModel = new model('projects', projects)

export default ActivityModel