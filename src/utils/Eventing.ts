// eslint-disable-next-line
export type Args = any[];
export type Callback = (...args: Args) => Promise<void> | void;

/**
 * Class representing Events
 */
export class Eventing {
  events: { [key: string]: Callback[] } = {};

  /**
   * Binds handler fucntion to given event
   *
   * @param eventName Event identifier
   * @param callback function to be executed when specified event is triggered
   */
  on = (eventName: string, callback: Callback): void => {
    const handlers = this.events[eventName] || [];
    handlers.push(callback);
    this.events[eventName] = handlers;
  };

  /**
   * Triggers specified event with given optional arguments
   *
   * @param eventName Event to be triggered
   * @param args arguments passed to registered callback function(s)
   */
  trigger = async (eventName: string, ...args: Args): Promise<void> => {
    const handlers = this.events[eventName];
    if (!handlers || handlers.length === 0) {
      return Promise.resolve();
    }

    await Promise.all(
      handlers.map(callback => {
        // logger.debug(`Triggering callback: ${callback} with args: ${args}`);
        return callback(...args);
      })
    );

    return Promise.resolve();
  };
}
