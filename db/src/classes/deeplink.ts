import { Ref, prop } from "@typegoose/typegoose";
import User from "./user";

class Deeplink {
  @prop()
  _id!: string;

  @prop({ required: true, ref: () => User })
  user!: Ref<User>;
}

export default Deeplink;
