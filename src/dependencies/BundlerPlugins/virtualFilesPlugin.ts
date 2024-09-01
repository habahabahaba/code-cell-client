// ESbuild:
import * as esbuild from 'esbuild-wasm';

// Types, interfaces and enumns:
import { PluginBuilder, VirtualFiles } from '../Bundler';

export const virtualFilesPlugin: PluginBuilder = (
  inputFiles: VirtualFiles
): esbuild.Plugin => {
  return {
    name: 'virtual-files-plugin',
    setup(build: esbuild.PluginBuild) {
      // Resolve paths to virtual files
      build.onResolve(
        { filter: /^_code_.{6}$/ },
        (args: esbuild.OnResolveArgs) => {
          // console.log('virtual-files-plugin onResolve', args.path);
          if (inputFiles[args.path]) {
            // console.log(
            //   'virtual-files-plugin: Resolving as virtual file',
            //   args.path
            // );

            return {
              path: args.path,
              namespace: 'virtual-files',
            };
          }
          // Allow other plugins to handle paths not in virtual files:

          return null;
        }
      );

      // Load the content of virtual files
      build.onLoad(
        { filter: /.*/, namespace: 'virtual-files' },
        async (args: esbuild.OnLoadArgs) => {
          // console.log('virtual-files-plugin onLoad', args.path);
          return {
            contents: inputFiles[args.path],
            loader: 'jsx',
            resolveDir: '', // Provide a resolve directory to help with module resolution
          };
        }
      );
    },
  };
};
