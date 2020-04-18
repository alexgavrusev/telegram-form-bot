import { prop, defaultClasses, Ref } from "@typegoose/typegoose";

import User from "./user";

class Field {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  description!: string;
}

export default class Form extends defaultClasses.TimeStamps {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  url!: string;

  @prop({ required: true, _id: false, type: Field })
  fields!: Field[];

  @prop()
  redirectUrl!: string;

  @prop({ required: true, ref: () => User })
  user!: Ref<User>;

  @prop({ required: true, default: true })
  notificationsEnabled!: boolean;
}
