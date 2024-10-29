export const getTargetDir = (targetDir: string | undefined) =>
  targetDir?.trim().replace(/\/+$/g, '');
