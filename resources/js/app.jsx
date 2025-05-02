import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const tsxPages = import.meta.glob('./Pages/**/*.tsx');
        const jsxPages = import.meta.glob('./Pages/**/*.jsx');

        // 🔥 Check if `.tsx` version exists first, otherwise fallback to `.jsx`
        return tsxPages[`./Pages/${name}.tsx`]
            ? resolvePageComponent(`./Pages/${name}.tsx`, tsxPages)
            : resolvePageComponent(`./Pages/${name}.jsx`, jsxPages);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
