import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  PubSubEngine,
  Query,
  Root,
  Subscription,
} from "type-graphql";
import Container, { Service } from "typedi";

@ObjectType()
@InputType("EventInput")
export class Event {
  @Field({ nullable: true })
  desc: string;
  @Field({ nullable: true })
  date: string;
  @Field({ nullable: true })
  context: string;

  constructor(event: Event) {
    Object.assign(this, event);
  }

  static publish(desc: string, context: string) {
    let event = new Event({
      desc,
      date: new Date().toISOString(),
      context,
    } as Event);
    EventResolver.addEvent(event);
  }
}

let events: Event[] = [];

@Service()
export class EventResolver {
  @Query(() => [Event])
  getEvents(
    @Arg("length", () => Number, { nullable: true }) length: Number
  ): Event[] {
    return events.slice(-length);
  }

  @Subscription(() => Event, {
    topics: "NEW_EVENT",
  })
  newEvent(@Root() newEvent: Event): Event {
    return newEvent;
  }

  @Mutation(() => String)
  static addEvent(@Arg("event") event: Event) {
    events = events.concat([event]).slice(-50);

    Container.get<PubSubEngine>("pubsub").publish("NEW_EVENT", event);
    return "OK";
  }
}
