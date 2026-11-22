import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// './' + hash routing = works on username.github.io and on project pages
export default defineConfig({ base: './', plugins: [react()] })
