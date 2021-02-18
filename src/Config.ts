import path from 'path';
const { CONFIG_FILE = 'config.json' } = process.env;
import { Config as ConfigProps, DefaultConfig } from './definitions/interfaces';
import { FileManager, logger } from './services';

export class Config {
  static get(): ConfigProps {
    const file = new FileManager(CONFIG_FILE, 'build');
    if (!file.exists()) {
      file.write(JSON.stringify(DefaultConfig));
      logger.debug(`Config file not found. Created '${file.path}'`);
    }

    const config: ConfigProps = JSON.parse(file.read());
    return config;
  }

  static getValue<T extends keyof ConfigProps>(prop: T): ConfigProps[T] {
    const config = Config.get();
    return config[prop];
  }

  static set(update: Partial<ConfigProps>): void {
    const file = new FileManager(path.join(__dirname, CONFIG_FILE));
    const config = JSON.parse(file.read());
    Object.assign(config, update);
    file.write(JSON.stringify(config));
  }
}
