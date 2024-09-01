// ESbuild:
import * as esbuild from 'esbuild-wasm';

// Local storage (for caching):
import Storage from '../Storage';

// Types, interfaces and enumns:
import { PluginBuilder } from '../Bundler';

const fileCache = new Storage();

export const fetchPlugin: PluginBuilder = (
  inputCode: string
): esbuild.Plugin => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // For entry file of "index.js"
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          contents: inputCode,
          loader: 'jsx',
        };
      });

      //  Looking for and returning cached results:
      build.onLoad(
        { filter: /.*/, namespace: 'packages' },
        async (args: esbuild.OnLoadArgs) => {
          // console.log(`Looking for cached packages...`);

          const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
            args.path
          );
          if (cachedResult) {
            // console.log(`Found cached package for ${args.path}`);
            return cachedResult;
          }
        }
      );

      //   For CSS enrties:
      build.onLoad(
        { filter: /.css$/, namespace: 'packages' },
        async (args: esbuild.OnLoadArgs) => {
          // Fetching results:
          const response = await fetch(args.path);
          const data = await response.text();

          // console.log('args.path from fetchPlugin: ', args.path);

          // Workaround for processing CSS:
          const escapedCSS = data
            .replace(/\n/g, '')
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'");
          const contents = `
                const style = document.createElement('style');
                style.innerText = '${escapedCSS}';
                document.head.appendChild(style);
            `;
          // Assembling result:
          const result: esbuild.OnLoadResult = {
            contents,
            loader: 'jsx',
            resolveDir: new URL('./', response.url).pathname,
          };

          // Caching result:
          const storedResult = await fileCache.setItem<esbuild.OnLoadResult>(
            args.path,
            result
          );

          // Returning result:
          return storedResult;
        }
      );

      build.onLoad(
        { filter: /.*/, namespace: 'packages' },
        async (args: esbuild.OnLoadArgs) => {
          // Fetching results:
          const response = await fetch(args.path);
          const data = await response.text();

          // console.log('args.path from fetchPlugin: ', args.path);

          // Assembling result:
          const result: esbuild.OnLoadResult = {
            loader: 'jsx',
            contents: data,
            resolveDir: new URL('./', response.url).pathname,
          };

          // Caching result:
          const storedResult = await fileCache.setItem<esbuild.OnLoadResult>(
            args.path,
            result
          );

          // Returning result:
          return storedResult;
        }
      );
    },
  };
};

// export const fetchPlugin: PluginBuilder = (
//   inputCode: string
// ): esbuild.Plugin => {
//   return {
//     name: 'fetch-plugin',
//     setup(build: esbuild.PluginBuild) {
//       build.onLoad({ filter: /(^index\.js$)/ }, () => {
//         return {
//           loader: 'jsx',
//           contents: inputCode,
//         };
//       });

//       build.onLoad(
//         { filter: /.*/, namespace: 'packages' },
//         async (args: esbuild.OnLoadArgs) => {
//           const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
//             args.path
//           );
//           if (cachedResult) {
//             return cachedResult;
//           }

//           const response = await fetch(args.path);
//           const data = await response.text();

//           const result: esbuild.OnLoadResult = {
//             loader: 'jsx',
//             contents: data,
//             // resolveDir: new URL('./', response.url).pathname,
//             resolveDir: new URL('./', response.url).pathname,
//             // resolveDir: 'virtual',
//           };

//           await fileCache.setItem<esbuild.OnLoadResult>(args.path, result);
//           return result;
//         }
//       );

//       build.onLoad(
//         { filter: /.css$/, namespace: 'packages' },
//         async (args: esbuild.OnLoadArgs) => {
//           const response = await fetch(args.path);
//           const data = await response.text();

//           const escapedCSS = data
//             .replace(/\n/g, '')
//             .replace(/"/g, '\\"')
//             .replace(/'/g, "\\'");
//           const contents = `
//           const style = document.createElement('style');
//           style.innerText = '${escapedCSS}';
//           document.head.appendChild(style);
//         `;

//           const result: esbuild.OnLoadResult = {
//             loader: 'jsx',
//             contents,
//             // resolveDir: new URL('./', response.url).pathname,
//             resolveDir: new URL('./', response.url).pathname,
//             // resolveDir: 'virtual',
//           };

//           await fileCache.setItem<esbuild.OnLoadResult>(args.path, result);
//           return result;
//         }
//       );
//     },
//   };
// };
