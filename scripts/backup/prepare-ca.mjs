// Write only to a fresh private file; the caller exports its path, never the PEM.
import { writeFileSync } from 'node:fs';
import { trustedCA, privatePath } from '../ris-shared-apps/io.mjs';
process.umask(0o077);
try {
 const path=privatePath(process.argv[2]);
 const pem=process.env.FIB_BACKUP_DATABASE_CA;
 if (!pem?.includes('-----BEGIN CERTIFICATE-----')) throw Error();
 writeFileSync(path,pem,{mode:0o600,flag:'wx'});
 trustedCA(path);
} catch { console.error('Trusted database CA setup failed; no credential printed.'); process.exitCode=1; }
