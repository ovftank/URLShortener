// vite.config.ts
import react from "file:///C:/Users/ovftank/Desktop/urlShorten/node_modules/.pnpm/@vitejs+plugin-react@4.3.3_vite@5.4.10_@types+node@22.9.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import autoprefixer from "file:///C:/Users/ovftank/Desktop/urlShorten/node_modules/.pnpm/autoprefixer@10.4.20_postcss@8.4.48/node_modules/autoprefixer/lib/autoprefixer.js";
import { readdir, readFile, writeFile } from "fs/promises";
import JScrewIt from "file:///C:/Users/ovftank/Desktop/urlShorten/node_modules/.pnpm/jscrewit@2.39.0/node_modules/jscrewit/lib/jscrewit.js";
import { join, resolve } from "path";
import tailwindcss from "file:///C:/Users/ovftank/Desktop/urlShorten/node_modules/.pnpm/tailwindcss@3.4.14/node_modules/tailwindcss/lib/index.js";
import { defineConfig } from "file:///C:/Users/ovftank/Desktop/urlShorten/node_modules/.pnpm/vite@5.4.10_@types+node@22.9.0/node_modules/vite/dist/node/index.js";
import obfuscatorPlugin from "file:///C:/Users/ovftank/Desktop/urlShorten/node_modules/.pnpm/vite-plugin-javascript-obfuscator@3.1.0/node_modules/vite-plugin-javascript-obfuscator/dist/index.cjs.js";
import VitePluginWebpCompress from "file:///C:/Users/ovftank/Desktop/urlShorten/node_modules/.pnpm/vite-plugin-webp-compress@1.1.4/node_modules/vite-plugin-webp-compress/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\ovftank\\Desktop\\urlShorten";
var convertString2Unicode = (s) => {
  return s.split("").map((char) => {
    const hexVal = char.charCodeAt(0).toString(16);
    return "\\u" + ("000" + hexVal).slice(-4);
  }).join("");
};
var encodeFile = async (filePath) => {
  const content = await readFile(filePath, "utf8");
  const encodedContent = JScrewIt.encode(content);
  await writeFile(filePath, encodedContent);
};
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePluginWebpCompress(),
    obfuscatorPlugin({
      options: {
        debugProtection: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        disableConsoleOutput: true,
        splitStrings: true
      },
      apply: "build",
      debugger: false
    }),
    {
      name: "create-redirects",
      apply: "build",
      closeBundle: async () => {
        const filePath = resolve(__vite_injected_original_dirname, "dist", "_redirects");
        const content = "/*    /index.html    200";
        try {
          await writeFile(filePath, content);
        } catch (err) {
          console.error(err);
        }
      }
    },
    {
      name: "obfuscate-html-and-js",
      apply: "build",
      closeBundle: async () => {
        try {
          const indexPath = resolve(__vite_injected_original_dirname, "dist", "index.html");
          const data = await readFile(indexPath, "utf8");
          const TMPL = `document.write('__UNI__')`;
          const jsString = TMPL.replace(
            /__UNI__/,
            convertString2Unicode(data)
          );
          const jsfuckCode = JScrewIt.encode(jsString);
          const TMPLHTML = `<script type="text/javascript">${jsfuckCode}</script>`;
          await writeFile(indexPath, TMPLHTML);
          const assetsDir = resolve(__vite_injected_original_dirname, "dist", "assets");
          const files = await readdir(assetsDir);
          for (const file of files) {
            if (file.endsWith(".js")) {
              const filePath = join(assetsDir, file);
              await encodeFile(filePath);
            }
          }
        } catch (err) {
          console.error("Error:", err);
        }
      }
    }
  ],
  build: {
    emptyOutDir: true,
    manifest: true
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000"
    },
    host: "0.0.0.0"
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()]
    }
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxvdmZ0YW5rXFxcXERlc2t0b3BcXFxcdXJsU2hvcnRlblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcb3ZmdGFua1xcXFxEZXNrdG9wXFxcXHVybFNob3J0ZW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL292ZnRhbmsvRGVza3RvcC91cmxTaG9ydGVuL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcbmltcG9ydCB7IHJlYWRkaXIsIHJlYWRGaWxlLCB3cml0ZUZpbGUgfSBmcm9tICdmcy9wcm9taXNlcyc7XG5pbXBvcnQgSlNjcmV3SXQgZnJvbSAnanNjcmV3aXQnO1xuaW1wb3J0IHsgam9pbiwgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IG9iZnVzY2F0b3JQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tamF2YXNjcmlwdC1vYmZ1c2NhdG9yJztcbmltcG9ydCBWaXRlUGx1Z2luV2VicENvbXByZXNzIGZyb20gJ3ZpdGUtcGx1Z2luLXdlYnAtY29tcHJlc3MnO1xuY29uc3QgY29udmVydFN0cmluZzJVbmljb2RlID0gKHM6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiBzXG4gICAgICAgIC5zcGxpdCgnJylcbiAgICAgICAgLm1hcCgoY2hhcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGV4VmFsID0gY2hhci5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgIHJldHVybiAnXFxcXHUnICsgKCcwMDAnICsgaGV4VmFsKS5zbGljZSgtNCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5qb2luKCcnKTtcbn07XG5cbmNvbnN0IGVuY29kZUZpbGUgPSBhc3luYyAoZmlsZVBhdGg6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCByZWFkRmlsZShmaWxlUGF0aCwgJ3V0ZjgnKTtcbiAgICBjb25zdCBlbmNvZGVkQ29udGVudCA9IEpTY3Jld0l0LmVuY29kZShjb250ZW50KTtcbiAgICBhd2FpdCB3cml0ZUZpbGUoZmlsZVBhdGgsIGVuY29kZWRDb250ZW50KTtcbn07XG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgcmVhY3QoKSxcbiAgICAgICAgVml0ZVBsdWdpbldlYnBDb21wcmVzcygpLFxuICAgICAgICBvYmZ1c2NhdG9yUGx1Z2luKHtcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBkZWJ1Z1Byb3RlY3Rpb246IHRydWUsXG4gICAgICAgICAgICAgICAgY29udHJvbEZsb3dGbGF0dGVuaW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRlYWRDb2RlSW5qZWN0aW9uOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVDb25zb2xlT3V0cHV0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHNwbGl0U3RyaW5nczogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhcHBseTogJ2J1aWxkJyxcbiAgICAgICAgICAgIGRlYnVnZ2VyOiBmYWxzZSxcbiAgICAgICAgfSksXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdjcmVhdGUtcmVkaXJlY3RzJyxcbiAgICAgICAgICAgIGFwcGx5OiAnYnVpbGQnLFxuICAgICAgICAgICAgY2xvc2VCdW5kbGU6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHJlc29sdmUoX19kaXJuYW1lLCAnZGlzdCcsICdfcmVkaXJlY3RzJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9ICcvKiAgICAvaW5kZXguaHRtbCAgICAyMDAnO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlRmlsZShmaWxlUGF0aCwgY29udGVudCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnb2JmdXNjYXRlLWh0bWwtYW5kLWpzJyxcbiAgICAgICAgICAgIGFwcGx5OiAnYnVpbGQnLFxuICAgICAgICAgICAgY2xvc2VCdW5kbGU6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleFBhdGggPSByZXNvbHZlKF9fZGlybmFtZSwgJ2Rpc3QnLCAnaW5kZXguaHRtbCcpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVhZEZpbGUoaW5kZXhQYXRoLCAndXRmOCcpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBUTVBMID0gYGRvY3VtZW50LndyaXRlKCdfX1VOSV9fJylgO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBqc1N0cmluZyA9IFRNUEwucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgICAgIC9fX1VOSV9fLyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRTdHJpbmcyVW5pY29kZShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QganNmdWNrQ29kZSA9IEpTY3Jld0l0LmVuY29kZShqc1N0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFRNUExIVE1MID0gYDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiPiR7anNmdWNrQ29kZX08L3NjcmlwdD5gO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB3cml0ZUZpbGUoaW5kZXhQYXRoLCBUTVBMSFRNTCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzc2V0c0RpciA9IHJlc29sdmUoX19kaXJuYW1lLCAnZGlzdCcsICdhc3NldHMnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCByZWFkZGlyKGFzc2V0c0Rpcik7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGUuZW5kc1dpdGgoJy5qcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZVBhdGggPSBqb2luKGFzc2V0c0RpciwgZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZW5jb2RlRmlsZShmaWxlUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIF0sXG4gICAgYnVpbGQ6IHtcbiAgICAgICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgICAgIG1hbmlmZXN0OiB0cnVlLFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICAgIHByb3h5OiB7XG4gICAgICAgICAgICAnL2FwaSc6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnLFxuICAgICAgICB9LFxuICAgICAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgICAgcG9zdGNzczoge1xuICAgICAgICAgICAgcGx1Z2luczogW3RhaWx3aW5kY3NzKCksIGF1dG9wcmVmaXhlcigpXSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgICdAJzogJy9zcmMnLFxuICAgICAgICB9LFxuICAgIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVMsT0FBTyxXQUFXO0FBQ3ZULE9BQU8sa0JBQWtCO0FBQ3pCLFNBQVMsU0FBUyxVQUFVLGlCQUFpQjtBQUM3QyxPQUFPLGNBQWM7QUFDckIsU0FBUyxNQUFNLGVBQWU7QUFDOUIsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxzQkFBc0I7QUFDN0IsT0FBTyw0QkFBNEI7QUFSbkMsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTSx3QkFBd0IsQ0FBQyxNQUFjO0FBQ3pDLFNBQU8sRUFDRixNQUFNLEVBQUUsRUFDUixJQUFJLENBQUMsU0FBUztBQUNYLFVBQU0sU0FBUyxLQUFLLFdBQVcsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3QyxXQUFPLFNBQVMsUUFBUSxRQUFRLE1BQU0sRUFBRTtBQUFBLEVBQzVDLENBQUMsRUFDQSxLQUFLLEVBQUU7QUFDaEI7QUFFQSxJQUFNLGFBQWEsT0FBTyxhQUFxQjtBQUMzQyxRQUFNLFVBQVUsTUFBTSxTQUFTLFVBQVUsTUFBTTtBQUMvQyxRQUFNLGlCQUFpQixTQUFTLE9BQU8sT0FBTztBQUM5QyxRQUFNLFVBQVUsVUFBVSxjQUFjO0FBQzVDO0FBQ0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sdUJBQXVCO0FBQUEsSUFDdkIsaUJBQWlCO0FBQUEsTUFDYixTQUFTO0FBQUEsUUFDTCxpQkFBaUI7QUFBQSxRQUNqQix1QkFBdUI7QUFBQSxRQUN2QixtQkFBbUI7QUFBQSxRQUNuQixzQkFBc0I7QUFBQSxRQUN0QixjQUFjO0FBQUEsTUFDbEI7QUFBQSxNQUNBLE9BQU87QUFBQSxNQUNQLFVBQVU7QUFBQSxJQUNkLENBQUM7QUFBQSxJQUNEO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsTUFDUCxhQUFhLFlBQVk7QUFDckIsY0FBTSxXQUFXLFFBQVEsa0NBQVcsUUFBUSxZQUFZO0FBQ3hELGNBQU0sVUFBVTtBQUNoQixZQUFJO0FBQ0EsZ0JBQU0sVUFBVSxVQUFVLE9BQU87QUFBQSxRQUNyQyxTQUFTLEtBQUs7QUFDVixrQkFBUSxNQUFNLEdBQUc7QUFBQSxRQUNyQjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLE1BQ1AsYUFBYSxZQUFZO0FBQ3JCLFlBQUk7QUFDQSxnQkFBTSxZQUFZLFFBQVEsa0NBQVcsUUFBUSxZQUFZO0FBQ3pELGdCQUFNLE9BQU8sTUFBTSxTQUFTLFdBQVcsTUFBTTtBQUM3QyxnQkFBTSxPQUFPO0FBQ2IsZ0JBQU0sV0FBVyxLQUFLO0FBQUEsWUFDbEI7QUFBQSxZQUNBLHNCQUFzQixJQUFJO0FBQUEsVUFDOUI7QUFDQSxnQkFBTSxhQUFhLFNBQVMsT0FBTyxRQUFRO0FBQzNDLGdCQUFNLFdBQVcsa0NBQWtDLFVBQVU7QUFDN0QsZ0JBQU0sVUFBVSxXQUFXLFFBQVE7QUFDbkMsZ0JBQU0sWUFBWSxRQUFRLGtDQUFXLFFBQVEsUUFBUTtBQUNyRCxnQkFBTSxRQUFRLE1BQU0sUUFBUSxTQUFTO0FBQ3JDLHFCQUFXLFFBQVEsT0FBTztBQUN0QixnQkFBSSxLQUFLLFNBQVMsS0FBSyxHQUFHO0FBQ3RCLG9CQUFNLFdBQVcsS0FBSyxXQUFXLElBQUk7QUFDckMsb0JBQU0sV0FBVyxRQUFRO0FBQUEsWUFDN0I7QUFBQSxVQUNKO0FBQUEsUUFDSixTQUFTLEtBQUs7QUFDVixrQkFBUSxNQUFNLFVBQVUsR0FBRztBQUFBLFFBQy9CO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDSCxhQUFhO0FBQUEsSUFDYixVQUFVO0FBQUEsRUFDZDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ0osT0FBTztBQUFBLE1BQ0gsUUFBUTtBQUFBLElBQ1o7QUFBQSxJQUNBLE1BQU07QUFBQSxFQUNWO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDRCxTQUFTO0FBQUEsTUFDTCxTQUFTLENBQUMsWUFBWSxHQUFHLGFBQWEsQ0FBQztBQUFBLElBQzNDO0FBQUEsRUFDSjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0gsS0FBSztBQUFBLElBQ1Q7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
