import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { readdir, readFile, writeFile } from 'fs/promises';
import JScrewIt from 'jscrewit';
import { join, resolve } from 'path';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator';
const convertString2Unicode = (s: string) => {
    return s
        .split('')
        .map((char) => {
            const hexVal = char.charCodeAt(0).toString(16);
            return '\\u' + ('000' + hexVal).slice(-4);
        })
        .join('');
};

const encodeFile = async (filePath: string) => {
    const content = await readFile(filePath, 'utf8');
    const encodedContent = JScrewIt.encode(content);
    await writeFile(filePath, encodedContent);
};
export default defineConfig({
    plugins: [
        react(),
        obfuscatorPlugin({
            options: {
                debugProtection: false,
                controlFlowFlattening: true,
                deadCodeInjection: true,
                disableConsoleOutput: true,
                splitStrings: true,
            },
            apply: 'build',
            debugger: false,
        }),
        {
            name: 'create-redirects',
            apply: 'build',
            closeBundle: async () => {
                const filePath = resolve(__dirname, 'static', '_redirects');
                const content = '/*    /index.html    200';
                try {
                    await writeFile(filePath, content);
                } catch (err) {
                    console.error(err);
                }
            },
        },
        {
            name: 'obfuscate-html-and-js',
            apply: 'build',
            closeBundle: async () => {
                try {
                    const indexPath = resolve(__dirname, 'static', 'index.html');
                    const data = await readFile(indexPath, 'utf8');
                    const TMPL = `document.write('__UNI__')`;
                    const jsString = TMPL.replace(
                        /__UNI__/,
                        convertString2Unicode(data),
                    );
                    const jsfuckCode = JScrewIt.encode(jsString);
                    const TMPLHTML = `<script type="text/javascript">${jsfuckCode}</script>`;
                    await writeFile(indexPath, TMPLHTML);
                    const assetsDir = resolve(__dirname, 'static', 'assets');
                    const files = await readdir(assetsDir);
                    for (const file of files) {
                        if (file.endsWith('.js')) {
                            const filePath = join(assetsDir, file);
                            await encodeFile(filePath);
                        }
                    }
                } catch (err) {
                    console.error('Error:', err);
                }
            },
        }
    ],
    build: {
        emptyOutDir: true,
        outDir: 'static',
    },
    server: {
        proxy: {
            '/api': 'http://localhost:3000',
        },
        host: '0.0.0.0',
    },
    css: {
        postcss: {
            plugins: [tailwindcss(), autoprefixer()],
        },
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
