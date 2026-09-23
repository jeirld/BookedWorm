// The only file components import from.
//
// Swapping the simulated backend for the real API is one environment
// variable, set at BUILD time. Nothing in src/components or src/pages
// changes.
//
//   VITE_USE_MOCK_API=false  -> the real Express API at VITE_API_BASE_URL
//   anything else, INCLUDING UNSET -> the browser-only fake
//
// Note which way round that is. Demo mode is the DEFAULT, so a fresh copy
// of this repo builds into a working site before anything is configured.
// The alternative (defaulting to the real API) means a forgotten variable
// produces a deployed site that calls an empty URL and fails on every
// request, with nothing on the page explaining why. A visible demo notice
// is a much better failure than a silently broken app.
//
// Both modules are imported statically and one is chosen at run time.
// `await import(...)` to load only the needed one does not build:
// top-level await isn't available in Vite's default browser target.
// Bundling both costs a couple of kilobytes and keeps the demo build
// available as a fallback, which is wanted anyway.

import * as mockApi from './mockApi.js'
import * as httpApi from './httpApi.js'

export const USING_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

const implementation = USING_MOCK_API ? mockApi : httpApi

export const {
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  listNotes,
  createNote,
  updateNote,
  deleteNote,
  getProfile,
  updateProfile,
} = implementation
