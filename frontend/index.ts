import { Router } from '@stricjs/router';
import { group } from '@stricjs/utils';

await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist'
})

const plugin = group('dist');
export default new Router().plug(plugin);
