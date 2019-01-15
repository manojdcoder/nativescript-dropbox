import { Observable } from "tns-core-modules/data/observable";

export class HelloWorldModel extends Observable {
  constructor() {
    super();
    this.set("url", "~/images/logo.png");
    this.set("status", "");
  }
}
