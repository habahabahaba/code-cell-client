// LocalFoarage:
import locacForage from 'localforage';

// Types, interfaces and enumns:
type storable =
  | string
  | number
  | Blob
  | object
  | Array<unknown>
  | ArrayBuffer
  | Float32Array
  | Float64Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array;

export default class Storage {
  private storage: LocalForage;

  constructor(name: string = 'filecahe') {
    const options: LocalForageDbInstanceOptions = {
      name: name,
    };
    this.storage = locacForage.createInstance(options);
  }

  public setItem = async <T extends storable>(
    key: string,
    value: T
  ): Promise<T | undefined> => {
    try {
      const storedItem = await this.storage.setItem<T>(key, value);

      return storedItem;
    } catch (error) {
      console.error(error);
    }
  };

  public getItem = async <T extends storable>(
    key: string
  ): Promise<T | null | undefined> => {
    try {
      const storedItem: T | null = await this.storage.getItem<T>(key);

      return storedItem;
    } catch (error) {
      console.error(error);
    }
  };

  public removeItem = async (key: string): Promise<undefined> => {
    try {
      await this.storage.removeItem(key);

      return;
    } catch (error) {
      console.error(error);
    }
  };

  public clear = async (): Promise<undefined> => {
    try {
      await this.storage.clear();

      return;
    } catch (error) {
      console.error(error);
    }
  };
}
