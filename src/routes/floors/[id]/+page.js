import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  if (params.id.length > 0) {
    return { floors_id: params.id.split('-') };
  }

  throw error(404, 'Not found');
}