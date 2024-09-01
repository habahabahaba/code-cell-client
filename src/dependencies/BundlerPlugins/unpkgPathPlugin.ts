// ESbuild:
import * as esbuild from 'esbuild-wasm';

// Types, interfaces and enumns:
import { PluginBuilder } from '../Bundler';

// export const unpkgPathPlugin: PluginBuilder = (): esbuild.Plugin => {
//   return {
//     name: 'unpkg-path-plugin',
//     setup(build: esbuild.PluginBuild) {
//       // For entry file of "index.js"
//       build.onResolve({ filter: /(^index\.js$)/ }, () => {
//         return { namespace: 'packages', path: 'index.js' };
//       });

//       // For relative paths ( "./" and "../" ):
//       build.onResolve(
//         { filter: /^\.+\//, namespace: 'packages' },
//         (args: esbuild.OnResolveArgs) => {
//           return {
//             namespace: 'packages',
//             path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`)
//               .href,
//           };
//         }
//       );

//       // For other cases:
//       build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {
//         // adding  "namespace: 'packages'," to the options breaks everything!!!
//         return {
//           namespace: 'packages',
//           path: `https://unpkg.com/${args.path}`,
//         };
//       });
//     },
//   };
// };

export const unpkgPathPlugin: PluginBuilder = () // entryId: string
: esbuild.Plugin => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { namespace: 'packages', path: 'index.js' };
      });

      build.onResolve(
        { filter: /^\.+\//, namespace: 'packages' },
        (args: esbuild.OnResolveArgs) => {
          return {
            namespace: 'packages',
            path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`)
              .href,
          };
        }
      );

      // build.onResolve(
      //   { filter: /^_code_.{6}$/ },
      //   async (args: esbuild.OnResolveArgs) => {
      //     if (args.path === entryId) {
      //       return { namespace: 'virtual-files', path: args.path };
      //     }
      //     return null;
      //   }
      // );

      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {
        if (args.path.startsWith('_')) {
          return null;
        }
        return {
          namespace: 'packages',
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};

// Example from https://esbuild.github.io/plugins/#using-plugins:

// let envPlugin = {
//   name: 'env',
//   setup(build) {
//     // Intercept import paths called "env" so esbuild doesn't attempt
//     // to map them to a file system location. Tag them with the "env-ns"
//     // namespace to reserve them for this plugin.
//     build.onResolve({ filter: /^env$/ }, (args) => ({
//       path: args.path,
//       namespace: 'env-ns',
//     }));

//     // Load paths tagged with the "env-ns" namespace and behave as if
//     // they point to a JSON file containing the environment variables.
//     build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
//       contents: JSON.stringify(process.env),
//       loader: 'json',
//     }));
//   },
// };

// await esbuild.build({
//   entryPoints: ['app.js'],
//   bundle: true,
//   outfile: 'out.js',
//   plugins: [envPlugin],
// });
