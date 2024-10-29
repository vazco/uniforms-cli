import fetch from 'node-fetch';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const GITHUB_URL =
  'https://github.com/vazco/uniforms/tree/master/packages/uniforms-unstyled/src';
const RAW_GITHUB_URL =
  'https://raw.githubusercontent.com/vazco/uniforms/master/packages/uniforms-unstyled/src';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchFiles = async () => {
  const response = await fetch(GITHUB_URL);
  const text = await response.text();

  const fileLinks = Array.from(
    text.matchAll(
      /href="\/vazco\/uniforms\/blob\/master\/packages\/uniforms-unstyled\/src\/([^"]+)"/g,
    ),
  ).map((match) => match[1]);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'uniforms-unstyled-'));

  for (const fileLink of fileLinks) {
    await delay(100);
    const rawFileUrl = `${RAW_GITHUB_URL}/${fileLink}`;
    const fileResponse = await fetch(rawFileUrl);
    const fileContent = await fileResponse.text();
    const fileName = path.basename(fileLink);
    fs.writeFileSync(path.join(tempDir, fileName), fileContent);
  }

  return {
    tempDir,
  };
};
