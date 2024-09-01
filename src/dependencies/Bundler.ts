// ESbuild:
import * as esbuild from 'esbuild-wasm';

// Plugins:
import * as bundlerPlugins from './BundlerPlugins';

// Types, interfaces and enumns:
export interface BundlerResult {
  code: string;
  error: unknown;
}

// //  @ts-expect-error (rightful "any[]")
export type PluginBuilder = (...args: any[]) => esbuild.Plugin;
type BundlerPlugins = { [Key: string]: PluginBuilder };
export type VirtualFiles = {
  [id: string]: string;
};
type VirtualFileKeys = Extract<keyof VirtualFiles, string>;

export interface CumulativeCode {
  inputFiles: VirtualFiles;
  entryId: VirtualFileKeys;
}

export default class Bundler {
  constructor() {
    throw new Error(`Bundler is a static class!!!`);
  }

  static initialized: Promise<void>;

  static initialize = (
    wasmURL: string = 'https://unpkg.com/esbuild-wasm@0.23.0/esbuild.wasm',
    worker: boolean = true
  ) => {
    if (!Bundler.initialized)
      Bundler.initialized = esbuild.initialize({
        worker: worker,
        wasmURL: wasmURL,
      });
  };

  // Plugins (plugin builders):
  static plugins: BundlerPlugins = bundlerPlugins;

  // Methods:
  // For just transpiling:
  static transform = async (
    rawCode: string,
    options: esbuild.TransformOptions = {
      loader: 'jsx',
      target: 'es2015',
    }
  ): Promise<BundlerResult> => {
    try {
      // Initialization:
      if (!Bundler.initialized) {
        Bundler.initialize();
      }
      await Bundler.initialized;

      const transpiled: esbuild.TransformResult = await esbuild.transform(
        rawCode,
        options
      );

      console.log(`Transpiled, from Bundler.transform:
      ${JSON.stringify(transpiled)}`);

      const output: BundlerResult = {
        code: transpiled.code,
        error: '',
      };
      return output;
    } catch (error) {
      return {
        code: '',
        error: error,
      };
    }
  };

  // For bundling from single file:
  static build = async (inputCode: string): Promise<BundlerResult> => {
    try {
      // Initialization:
      if (!Bundler.initialized) {
        Bundler.initialize();
      }
      await Bundler.initialized;

      const built: esbuild.BuildResult = await esbuild.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [
          Bundler.plugins.unpkgPathPlugin(),
          Bundler.plugins.fetchPlugin(inputCode),
        ],
        // define: { 'process.env.NODE_ENV': '"production"', global: 'window' }, // not currently necessary
        // jsxFactory: '_React.createElement',
        // jsxFragment: '_React.Fragment',
      });

      // console.log(`Built, from Bundler.build:
      // ${JSON.stringify(built)}`);

      if (!built.outputFiles)
        throw new Error(`Bundler.build did not return any files!`);

      const output: BundlerResult = {
        code: built.outputFiles[0].text,
        error: '',
      };

      return output;
    } catch (error) {
      return {
        code: '',
        error: error instanceof Error ? error.message : error,
      };
    }
  };

  // For bundling from multiple files:
  static buildMultiple = async (
    cumulativeCode: CumulativeCode
  ): Promise<BundlerResult> => {
    try {
      if (!Bundler.initialized) {
        Bundler.initialize();
      }
      await Bundler.initialized;

      const { inputFiles, entryId } = cumulativeCode;

      const built: esbuild.BuildResult = await esbuild.build({
        entryPoints: [entryId],
        bundle: true,
        write: false,
        plugins: [
          Bundler.plugins.virtualFilesPlugin(inputFiles),
          Bundler.plugins.unpkgPathPlugin(),
          Bundler.plugins.fetchPlugin(inputFiles[entryId]),
        ],
        jsxFactory: '_React.createElement',
        jsxFragment: '_React.Fragment',
        // define: { 'process.env.NODE_ENV': '"production"', global: 'window' }, // not currently necessary
        // treeShaking: true, // enabled by default if "bundle" set to "true".
        // pure: ['ReactDOM.createRoot'],
        // minify: true, //  only changes the errors
        // external: Object.keys(inputFiles).filter((id) => id !== entryId),  // external option didn't help us
      });

      if (!built.outputFiles)
        throw new Error('Bundler.buildMultiple did not return any files!');

      const output: BundlerResult = {
        code: built.outputFiles[0].text,
        error: '',
      };

      return output;
    } catch (error) {
      return {
        code: '',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };
}
