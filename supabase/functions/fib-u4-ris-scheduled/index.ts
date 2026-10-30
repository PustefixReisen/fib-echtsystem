// Dedicated server-to-server entrypoint. Authorization and opt-in gate are
// enforced by the shared RIS handler before any database access.
import {handleRis} from '../fib-u4-ris-pilot/index.ts';
export default {fetch(req:Request){return handleRis(req,'scheduler')}};
