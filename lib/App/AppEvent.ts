type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? true
  : false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyEvent = Event<any, any>;
export type Event<EventType extends string, Payload = never> = Equal<
  Payload,
  never
> extends true
  ? { type: EventType; payload?: never }
  : { type: EventType; payload: Payload };


export type AppEvent =
  | PROMPT_SUBMITTED


type PROMPT_SUBMITTED =
  Event<'PROMPT_SUBMITTED', { prompt: string }>
