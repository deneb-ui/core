#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { spawn } = require('node:child_process');

const DEFAULT_API_PORT = 4174;
const DEFAULT_PREVIEW_PORT = 4173;
const MAX_LOG_LENGTH = 96 * 1024;
const MAX_SITE_DATA_BYTES = 10 * 1024 * 1024;
const LOOPBACK_HOST = '127.0.0.1';
const LOCAL_PREVIEW_ROUTE = '/__fivora_local_preview';
const FALLBACK_LOCAL_VISUAL_BRIDGE_SCRIPT = String.raw`
(() => {
  const PREVIOUS_BRAND = ['market', 'place'].join('');
  const PREVIOUS_BRIDGE_KEY = '__' + PREVIOUS_BRAND.toUpperCase() + '_LOCAL_VISUAL_BRIDGE__';
  const PREVIOUS_PREVIEW_PREFIX = PREVIOUS_BRAND.toUpperCase() + '_PREVIEW_';
  const previousPreviewMessage = (suffix) => PREVIOUS_PREVIEW_PREFIX + suffix;
  if (window.__FIVORA_LOCAL_VISUAL_BRIDGE__ || window[PREVIOUS_BRIDGE_KEY]) return;
  window.__FIVORA_LOCAL_VISUAL_BRIDGE__ = true;
  window[PREVIOUS_BRIDGE_KEY] = true;

  const EDIT_MODE_MESSAGE = 'FIVORA_PREVIEW_EDIT_MODE';
  const LEGACY_EDIT_MODE_MESSAGE = previousPreviewMessage('EDIT_MODE');
  const CLICK_MESSAGE = 'FIVORA_PREVIEW_ELEMENT_CLICKED';
  const LEGACY_CLICK_MESSAGE = previousPreviewMessage('ELEMENT_CLICKED');
  const READY_MESSAGE = 'FIVORA_PREVIEW_READY';
  const LEGACY_READY_MESSAGE = previousPreviewMessage('READY');
  const FIELD_ATTRIBUTE = 'data-preview-field-path';
  const LIST_ATTRIBUTE = 'data-preview-list-path';
  const ITEM_ATTRIBUTE = 'data-preview-item-path';
  const ACTIVE_ATTRIBUTE = 'data-fivora-local-edit-target';
  const SELECTED_ATTRIBUTE = 'data-fivora-local-selected-target';
  const LEGACY_ACTIVE_ATTRIBUTE = 'data-' + PREVIOUS_BRAND + '-local-edit-target';
  const LEGACY_SELECTED_ATTRIBUTE = 'data-' + PREVIOUS_BRAND + '-local-selected-target';
  const EDITABLE_SELECTOR =
    '[data-preview-field-path], [data-preview-list-path], [data-preview-item-path], [data-preview-style-target]';
  // The local lab is edit-first when embedded. The portal can still switch the
  // preview back to normal navigation mode with EDIT_MODE_MESSAGE.
  let editMode = window.parent !== window;
  let descriptors = new Map();
  let activeTarget = null;
  let selectedTarget = null;
  let parentOrigin = '*';

  const style = document.createElement('style');
  style.setAttribute('data-fivora-local-visual-bridge', '');
  style.setAttribute('data-' + PREVIOUS_BRAND + '-local-visual-bridge', '');
  style.textContent = [
    '[' + ACTIVE_ATTRIBUTE + '], [' + LEGACY_ACTIVE_ATTRIBUTE + '] {',
    '  outline: 2px solid #06b6d4 !important;',
    '  outline-offset: 3px !important;',
    '  cursor: pointer !important;',
    '  box-shadow: 0 0 0 5px rgba(6, 182, 212, 0.16) !important;',
    '}',
    '[' + SELECTED_ATTRIBUTE + '], [' + LEGACY_SELECTED_ATTRIBUTE + '] {',
    '  outline: 2px dashed #06b6d4 !important;',
    '  outline-offset: 3px !important;',
    '  box-shadow: 0 0 0 5px rgba(6, 182, 212, 0.18) !important;',
    '}',
    'html[data-fivora-local-edit-mode="true"] [data-preview-field-path],',
    'html[data-fivora-local-edit-mode="true"] [data-preview-list-path],',
    'html[data-fivora-local-edit-mode="true"] [data-preview-item-path],',
    'html[data-fivora-local-edit-mode="true"] [data-preview-field-path],',
    'html[data-fivora-local-edit-mode="true"] [data-preview-list-path],',
    'html[data-fivora-local-edit-mode="true"] [data-preview-item-path] {',
    '  cursor: pointer !important;',
    '}',
  ].join('\n');
  document.head.appendChild(style);
  document.documentElement.setAttribute(
    'data-fivora-local-edit-mode',
    String(editMode),
  );
  document.documentElement.setAttribute(
    'data-fivora-local-edit-mode',
    String(editMode),
  );

  function rememberParentOrigin(event) {
    if (event.source !== window.parent) return false;
    if (parentOrigin === '*' && event.origin && event.origin !== 'null') {
      parentOrigin = event.origin;
    }
    return parentOrigin === '*' || event.origin === parentOrigin;
  }

  function post(payload) {
    window.parent.postMessage(payload, parentOrigin);
  }

  function clearActiveTarget() {
    if (activeTarget) {
      activeTarget.removeAttribute(ACTIVE_ATTRIBUTE);
      activeTarget.removeAttribute(LEGACY_ACTIVE_ATTRIBUTE);
    }
    activeTarget = null;
  }

  function selectTarget(target) {
    if (selectedTarget && selectedTarget !== target) {
      selectedTarget.removeAttribute(SELECTED_ATTRIBUTE);
      selectedTarget.removeAttribute(LEGACY_SELECTED_ATTRIBUTE);
    }
    selectedTarget = target;
    selectedTarget.setAttribute(SELECTED_ATTRIBUTE, 'true');
    selectedTarget.setAttribute(LEGACY_SELECTED_ATTRIBUTE, 'true');
  }

  function clearSelectedTarget() {
    if (selectedTarget) {
      selectedTarget.removeAttribute(SELECTED_ATTRIBUTE);
      selectedTarget.removeAttribute(LEGACY_SELECTED_ATTRIBUTE);
    }
    selectedTarget = null;
  }

  function findEditableTarget(rawTarget) {
    if (!(rawTarget instanceof Element)) return null;
    return rawTarget.closest(EDITABLE_SELECTOR);
  }

  function fieldValue(target, fieldPath) {
    const descriptor = descriptors.get(fieldPath);
    if (descriptor && ['string', 'number', 'boolean'].includes(typeof descriptor.value)) {
      return descriptor.value;
    }
    if (target instanceof HTMLImageElement) return target.currentSrc || target.src || '';
    return (target.textContent || '').trim();
  }

  function onPointerOver(event) {
    if (!editMode) return;
    const target = findEditableTarget(event.target);
    if (!target || target === activeTarget) return;
    clearActiveTarget();
    activeTarget = target;
    activeTarget.setAttribute(ACTIVE_ATTRIBUTE, 'true');
  }

  function onPointerOut(event) {
    if (!editMode || !activeTarget) return;
    const next = event.relatedTarget;
    if (next instanceof Node && activeTarget.contains(next)) return;
    clearActiveTarget();
  }

  function findRelatedFields(target, fieldPath, itemPath) {
    const related = [];
    const seen = new Set(fieldPath ? [fieldPath] : []);
    const prefix =
      itemPath ||
      (fieldPath && fieldPath.replace(/(\[\d+\])?\.\w+$/, '').replace(/\[\d+\]$/, ''));
    if (prefix) {
      for (const [path, descriptor] of descriptors) {
        if (
          path !== fieldPath &&
          !seen.has(path) &&
          (path.startsWith(prefix + '.') || path.startsWith(prefix + '[')) &&
          descriptor?.kind !== 'collection'
        ) {
          seen.add(path);
          related.push({
            path,
            label: descriptor.label || path.split('.').pop() || 'Content',
            type: descriptor.type || 'text',
          });
        }
      }
    }
    let current = target instanceof Element ? target : null;
    let depth = 0;
    while (current && current !== document.body && depth < 3) {
      const candidatePath = current.getAttribute(FIELD_ATTRIBUTE);
      if (
        candidatePath &&
        candidatePath !== fieldPath &&
        !seen.has(candidatePath)
      ) {
        const descriptor = descriptors.get(candidatePath);
        if (descriptor?.kind !== 'collection') {
          seen.add(candidatePath);
          related.push({
            path: candidatePath,
            label: descriptor?.label || candidatePath.split('.').pop() || 'Content',
            type: descriptor?.type || 'text',
          });
        }
      }
      current = current.parentElement;
      depth += 1;
    }
    return related;
  }

  function onClick(event) {
    if (!editMode) return;
    const target = findEditableTarget(event.target);
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    selectTarget(target);

    const fieldTarget = target.closest('[' + FIELD_ATTRIBUTE + ']');
    const listTarget = target.closest('[' + LIST_ATTRIBUTE + ']');
    const itemTarget = target.closest('[' + ITEM_ATTRIBUTE + ']');
    const fieldPath = fieldTarget?.getAttribute(FIELD_ATTRIBUTE) || null;
    const listPath = listTarget?.getAttribute(LIST_ATTRIBUTE) || null;
    const itemPath = itemTarget?.getAttribute(ITEM_ATTRIBUTE) || null;
    const styleTarget = target.closest('[data-preview-style-target]');
    const stylePath = styleTarget?.getAttribute('data-preview-style-target') || null;
    const descriptor = fieldPath ? descriptors.get(fieldPath) : null;
    const rect = target.getBoundingClientRect();
    const itemIndexMatch = itemPath?.match(/\[(\d+)\](?!.*\[\d+\])/);

    const styleScopes = [];
    const pushScope = (kind, key, label) => {
      if (!key || styleScopes.some((s) => s.key === key)) return;
      styleScopes.push({ kind, key, label });
    };
    pushScope('element', fieldPath, 'This element');
    const navbarElement = target.closest('[data-design-section="navbar"][data-preview-style-target]');
    pushScope('card', navbarElement?.getAttribute('data-preview-style-target'), 'Whole navbar');
    pushScope('card', itemPath, 'This card');
    pushScope('grid', listPath, 'Entire grid');
    const pageElement = target.closest('[data-preview-page-key]');
    const pageKey = pageElement?.getAttribute('data-preview-page-key') || '';
    const sectionElement = target.closest('section,[data-design-section],[data-section-id]');
    if (sectionElement) {
      const explicitSectionKey =
        sectionElement.getAttribute('data-design-section') ||
        sectionElement.getAttribute('data-section-id') ||
        sectionElement.id;
      const sectionSiblings = sectionElement.parentElement
        ? Array.from(sectionElement.parentElement.children).filter(
            (c) => c.tagName === 'SECTION',
          )
        : [];
      const sectionIndex = sectionSiblings.indexOf(sectionElement) + 1;
      const sectionKey =
        explicitSectionKey || (sectionIndex > 0 ? 'nth-' + sectionIndex : '');
      pushScope(
        'section',
        sectionKey ? 'section:' + (pageKey || 'all') + ':' + sectionKey : null,
        'This section',
      );
    }
    pushScope('page', pageKey ? 'page:' + pageKey : null, 'Current page');
    pushScope('site', 'site:all', 'Whole website');

    const clickPayload = {
      type: CLICK_MESSAGE,
      fieldPath: fieldPath || stylePath,
      styleType: styleTarget?.getAttribute('data-preview-style-type') || undefined,
      fieldValue: fieldPath ? fieldValue(fieldTarget || target, fieldPath) : '',
      elementTag: target.tagName.toLowerCase(),
      isImage:
        target instanceof HTMLImageElement || descriptor?.type === 'image',
      boundingRect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      collectionPath: listPath,
      listPath,
      itemPath,
      itemIndex: itemIndexMatch ? Number(itemIndexMatch[1]) : null,
      descriptorKind: fieldPath ? 'field' : listPath ? 'collection' : stylePath ? 'object' : null,
      relatedFields: findRelatedFields(target, fieldPath, itemPath),
      styleScopes,
    };
    post(clickPayload);
    post({ ...clickPayload, type: LEGACY_CLICK_MESSAGE });
  }

  window.addEventListener('message', (event) => {
    if (!rememberParentOrigin(event) || !event.data || typeof event.data !== 'object') {
      return;
    }
    if (event.data.type !== EDIT_MODE_MESSAGE && event.data.type !== LEGACY_EDIT_MODE_MESSAGE) return;
    editMode = event.data.editMode === true;
    descriptors = new Map(
      Array.isArray(event.data.fields)
        ? event.data.fields
            .filter((field) => field && typeof field.path === 'string')
            .map((field) => [field.path, field])
        : [],
    );
    document.documentElement.setAttribute(
      'data-fivora-local-edit-mode',
      String(editMode),
    );
    document.documentElement.setAttribute(
      'data-fivora-local-edit-mode',
      String(editMode),
    );
    if (!editMode) {
      clearActiveTarget();
      clearSelectedTarget();
    }
  });

  document.addEventListener('mouseover', onPointerOver, true);
  document.addEventListener('mouseout', onPointerOut, true);
  document.addEventListener('click', onClick, true);
  post({ type: READY_MESSAGE, pathname: window.location.pathname });
  post({ type: LEGACY_READY_MESSAGE, pathname: window.location.pathname });
})();
`;

let LOCAL_VISUAL_BRIDGE_SCRIPT = FALLBACK_LOCAL_VISUAL_BRIDGE_SCRIPT;
try {
  const productionBridge = require('./template-preview-focus-bridge.cjs');
  if (typeof productionBridge === 'string' && productionBridge.trim()) {
    LOCAL_VISUAL_BRIDGE_SCRIPT = productionBridge;
  }
} catch {
  // Source checkouts can run before the generated production bridge exists.
  // The package build always creates it; retain a compact fallback for safety.
}

const RUNTIME_NAME_SHIM =
  'var __name = typeof __name === "function" ? __name : ((target, value) => (typeof Object.defineProperty === "function" ? Object.defineProperty(target, "name", { value, configurable: true }) : target));\n';

if (
  LOCAL_VISUAL_BRIDGE_SCRIPT.includes('__name') &&
  !LOCAL_VISUAL_BRIDGE_SCRIPT.includes('var __name')
) {
  LOCAL_VISUAL_BRIDGE_SCRIPT = `${RUNTIME_NAME_SHIM}${LOCAL_VISUAL_BRIDGE_SCRIPT}`;
}

function fail(message) {
  process.stderr.write(`Local Template Lab: ${message}\n`);
  process.exit(1);
}

try {
  // Validate the generated iframe program as well as this outer runner file.
  new Function(LOCAL_VISUAL_BRIDGE_SCRIPT);
} catch (error) {
  fail(`Visual editor bridge is invalid: ${error.message}`);
}

function parsePort(value, flag, fallback) {
  if (value === undefined) return fallback;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    fail(`${flag} must be a port between 1024 and 65535.`);
  }
  return port;
}

function parseArguments(argv) {
  const args = [...argv];
  let templatePath = '';
  let apiPort;
  let previewPort;
  let skipInstall = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--api-port') {
      apiPort = args[index + 1];
      index += 1;
    } else if (arg.startsWith('--api-port=')) {
      apiPort = arg.slice('--api-port='.length);
    } else if (arg === '--preview-port') {
      previewPort = args[index + 1];
      index += 1;
    } else if (arg.startsWith('--preview-port=')) {
      previewPort = arg.slice('--preview-port='.length);
    } else if (arg === '--skip-install') {
      skipInstall = true;
    } else if (arg === '--help' || arg === '-h') {
      process.stdout.write(
        [
          'Fivora Local Template Lab',
          '',
          'Usage:',
          '  npm run lab -- <template-directory> [options]',
          '',
          'Options:',
          '  --api-port <port>      Loopback controller port (default: 4174)',
          '  --preview-port <port>  Template dev-server port (default: 4173)',
          '  --skip-install         Do not install missing local dependencies',
          '',
        ].join('\n'),
      );
      process.exit(0);
    } else if (arg.startsWith('-')) {
      fail(`Unknown option: ${arg}`);
    } else if (!templatePath) {
      templatePath = arg;
    } else {
      fail(`Unexpected argument: ${arg}`);
    }
  }

  if (!templatePath) {
    fail('A template directory is required. Run with --help for usage.');
  }

  return {
    templatePath: path.resolve(templatePath),
    apiPort: parsePort(apiPort, '--api-port', DEFAULT_API_PORT),
    previewPort: parsePort(
      previewPort,
      '--preview-port',
      DEFAULT_PREVIEW_PORT,
    ),
    skipInstall,
  };
}

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(
      `${label} is missing or invalid at ${filePath}: ${
        error instanceof Error ? error.message : 'unknown error'
      }`,
    );
  }
}

const options = parseArguments(process.argv.slice(2));
if (!fs.existsSync(options.templatePath)) {
  fail(`Template directory does not exist: ${options.templatePath}`);
}
if (!fs.statSync(options.templatePath).isDirectory()) {
  fail(`Template path must be a directory: ${options.templatePath}`);
}

const manifestFile = [
  'fivora-template.json',
  'fivora-template.json',
].find((name) => fs.existsSync(path.join(options.templatePath, name))) || 'fivora-template.json';

const manifestPath = path.join(options.templatePath, manifestFile);
const packagePath = path.join(options.templatePath, 'package.json');
const manifest = readJson(manifestPath, 'Template manifest');
const packageJson = readJson(packagePath, 'package.json');

if (manifest.framework !== 'nextjs-static-export') {
  fail('Template manifest framework must be "nextjs-static-export".');
}
if (!packageJson.scripts || typeof packageJson.scripts.dev !== 'string') {
  fail('Template package.json must define a dev script for live preview.');
}
if (typeof manifest.siteDataFile !== 'string' || !manifest.siteDataFile.trim()) {
  fail('Template manifest siteDataFile is required.');
}

const siteDataPath = path.resolve(
  options.templatePath,
  manifest.siteDataFile.trim(),
);
const relativeSiteDataPath = path.relative(options.templatePath, siteDataPath);
if (
  relativeSiteDataPath.startsWith('..') ||
  path.isAbsolute(relativeSiteDataPath)
) {
  fail('Template manifest siteDataFile must stay inside the template directory.');
}

const controllerToken = crypto.randomBytes(24).toString('base64url');
const apiUrl = `http://${LOOPBACK_HOST}:${options.apiPort}`;
const sourcePreviewUrl = `http://${LOOPBACK_HOST}:${options.previewPort}`;
const previewUrl = `${apiUrl}${LOCAL_PREVIEW_ROUTE}`;
const validatorPath = path.join(
  __dirname,
  'deneb-template-validator.cjs',
);

let shuttingDown = false;
let devProcess = null;
let validationProcess = null;
let readinessTimer = null;
let devRestartTimer = null;
let devRestartAttempts = 0;
const MAX_DEV_RESTART_ATTEMPTS = 5;
let devLog = '';
let validationLog = '';

const state = {
  protocolVersion: 2,
  connected: true,
  templateName:
    typeof manifest.name === 'string' && manifest.name.trim()
      ? manifest.name.trim()
      : typeof packageJson.name === 'string'
        ? packageJson.name
        : path.basename(options.templatePath),
  templatePath: options.templatePath,
  previewUrl,
  apiUrl,
  devStatus: 'starting',
  devError: null,
  startedAt: new Date().toISOString(),
  validation: {
    status: 'idle',
    startedAt: null,
    completedAt: null,
    exitCode: null,
  },
};

function appendLog(target, chunk) {
  const text = chunk.toString();
  if (target === 'dev') {
    devLog = `${devLog}${text}`.slice(-MAX_LOG_LENGTH);
  } else {
    validationLog = `${validationLog}${text}`.slice(-MAX_LOG_LENGTH);
  }
  process.stdout.write(text);
}

function statusPayload() {
  return {
    ...state,
    devLog,
    validationLog,
  };
}

function setCorsHeaders(request, response) {
  const origin = request.headers.origin;
  if (origin && /^(https?:\/\/|null$)/.test(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  }
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Content-Type',
  );
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Private-Network', 'true');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
}

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Content-Length', Buffer.byteLength(body));
  response.end(body);
}

function isAuthorized(request) {
  return request.headers.authorization === `Bearer ${controllerToken}`;
}

function readSiteData() {
  try {
    return JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));
  } catch (error) {
    throw new Error(
      `Unable to read ${manifest.siteDataFile}: ${
        error instanceof Error ? error.message : 'unknown error'
      }`,
    );
  }
}

function readJsonRequest(request, maxBytes = MAX_SITE_DATA_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let settled = false;

    request.on('data', (chunk) => {
      if (settled) return;
      size += chunk.length;
      if (size > maxBytes) {
        settled = true;
        reject(
          new Error(
            `Request body is too large. Local site data must be ${Math.floor(maxBytes / 1024 / 1024)} MB or less.`,
          ),
        );
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => {
      if (settled) return;
      try {
        const text = Buffer.concat(chunks).toString('utf8');
        resolve(JSON.parse(text));
      } catch {
        reject(new Error('Request body must be valid JSON.'));
      }
    });
    request.on('error', (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    });
  });
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function writeSiteData(siteData) {
  const temporaryPath = `${siteDataPath}.${process.pid}.${Date.now()}.tmp`;
  const mode = fs.existsSync(siteDataPath)
    ? fs.statSync(siteDataPath).mode
    : 0o644;
  try {
    fs.writeFileSync(
      temporaryPath,
      `${JSON.stringify(siteData, null, 2)}\n`,
      { encoding: 'utf8', flag: 'wx', mode },
    );
    fs.renameSync(temporaryPath, siteDataPath);
  } catch (error) {
    if (fs.existsSync(temporaryPath)) {
      try {
        fs.unlinkSync(temporaryPath);
      } catch {
        // Keep the original write error; a stale temporary file is harmless.
      }
    }
    throw error;
  }
}

function startValidation() {
  if (validationProcess) return false;

  validationLog = '';
  state.validation = {
    status: 'running',
    startedAt: new Date().toISOString(),
    completedAt: null,
    exitCode: null,
  };

  validationProcess = spawn(
    process.execPath,
    [validatorPath, 'validate', options.templatePath],
    {
      cwd: __dirname,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  validationProcess.stdout.on('data', (chunk) => appendLog('validation', chunk));
  validationProcess.stderr.on('data', (chunk) => appendLog('validation', chunk));
  validationProcess.on('error', (error) => {
    appendLog('validation', `\nUnable to start validation: ${error.message}\n`);
  });
  validationProcess.on('close', (code) => {
    state.validation = {
      ...state.validation,
      status: code === 0 ? 'passed' : 'failed',
      completedAt: new Date().toISOString(),
      exitCode: code,
    };
    validationProcess = null;
  });
  return true;
}

function probePreview() {
  if (shuttingDown || state.devStatus === 'ready') return;
  const request = http.get(sourcePreviewUrl, (response) => {
    response.resume();
    if (response.statusCode && response.statusCode < 500) {
      state.devStatus = 'ready';
      state.devError = null;
      devRestartAttempts = 0;
      process.stdout.write(`\nLive preview ready: ${previewUrl}\n`);
      return;
    }
    readinessTimer = setTimeout(probePreview, 600);
  });
  request.setTimeout(900, () => request.destroy());
  request.on('error', () => {
    readinessTimer = setTimeout(probePreview, 600);
  });
}

function scheduleDevRestart(reason) {
  if (shuttingDown || devRestartTimer) return;
  if (devRestartAttempts >= MAX_DEV_RESTART_ATTEMPTS) {
    state.devStatus = 'failed';
    state.devError = reason;
    return;
  }
  devRestartAttempts += 1;
  state.devStatus = 'starting';
  state.devError = null;
  appendLog(
    'dev',
    `\nPreview server stopped during navigation (${reason}). Restarting (${devRestartAttempts}/${MAX_DEV_RESTART_ATTEMPTS})...\n`,
  );
  devRestartTimer = setTimeout(() => {
    devRestartTimer = null;
    startPreview();
  }, 900);
}

function runInstallThenPreview() {
  const nodeModulesPath = path.join(options.templatePath, 'node_modules');
  if (!options.skipInstall && !fs.existsSync(nodeModulesPath)) {
    state.devStatus = 'installing';
    const installCommand =
      typeof manifest.installCommand === 'string' && manifest.installCommand.trim()
        ? manifest.installCommand.trim()
        : 'npm install';
    appendLog('dev', `Installing local dependencies with: ${installCommand}\n`);
    const install = spawn(installCommand, {
      cwd: options.templatePath,
      env: process.env,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    devProcess = install;
    install.stdout.on('data', (chunk) => appendLog('dev', chunk));
    install.stderr.on('data', (chunk) => appendLog('dev', chunk));
    install.on('error', (error) => {
      state.devStatus = 'failed';
      state.devError = error.message;
      devProcess = null;
    });
    install.on('close', (code) => {
      devProcess = null;
      if (code !== 0) {
        state.devStatus = 'failed';
        state.devError = `Dependency installation exited with code ${code}.`;
        return;
      }
      startPreview();
    });
    return;
  }

  startPreview();
}

function startPreview() {
  state.devStatus = 'starting';
  state.devError = null;
  appendLog(
    'dev',
    `Starting template source server on ${sourcePreviewUrl}. Source edits will hot reload.\n`,
  );
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  devProcess = spawn(
    npmCmd,
    [
      'run',
      'dev',
      '--',
      '--hostname',
      LOOPBACK_HOST,
      '--port',
      String(options.previewPort),
    ],
    {
      cwd: options.templatePath,
      env: {
        ...process.env,
        NEXT_PUBLIC_SITE_BASE_PATH: '',
      },
      shell: process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  devProcess.stdout.on('data', (chunk) => appendLog('dev', chunk));
  devProcess.stderr.on('data', (chunk) => appendLog('dev', chunk));
  devProcess.on('error', (error) => {
    state.devStatus = 'failed';
    state.devError = error.message;
    devProcess = null;
  });
  devProcess.on('close', (code, signal) => {
    devProcess = null;
    if (!shuttingDown) {
      const reason = signal
        ? `signal ${signal}`
        : `exit code ${code}`;
      scheduleDevRestart(reason);
    }
  });
  probePreview();
}

function previewShellHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    html, body, #template-preview { width: 100%; height: 100%; margin: 0; border: 0; }
    body { overflow: hidden; background: #080808; }
    #template-preview { display: block; }
    #bridge-error { position: fixed; inset: 16px; z-index: 10; display: none;
      padding: 16px; color: #fecaca; background: #450a0a; font: 14px system-ui; }
  </style>
</head>
<body>
  <div id="bridge-error"></div>
  <iframe id="template-preview" title="Local template preview"></iframe>
  <script>
    (() => {
      const BRIDGE_SOURCE = ${JSON.stringify(LOCAL_VISUAL_BRIDGE_SCRIPT)};
      const preview = document.getElementById('template-preview');
      const errorBox = document.getElementById('bridge-error');
      const PREVIOUS_PREVIEW_PREFIX = ['MARKET', 'PLACE'].join('') + '_PREVIEW_';
      const previousPreviewMessage = (suffix) => PREVIOUS_PREVIEW_PREFIX + suffix;
      const savedMessages = new Map();
      let childReady = false;
      let portalOrigin = '*';
      let installTimer = null;

      function sendToChild(payload) {
        preview.contentWindow?.postMessage(payload, '*');
      }

      function sendToPortal(payload) {
        window.parent.postMessage(payload, portalOrigin);
      }

      window.addEventListener('message', (event) => {
        if (!event.data || typeof event.data !== 'object') return;
        if (event.source === window.parent) {
          if (portalOrigin === '*' && event.origin && event.origin !== 'null') {
            portalOrigin = event.origin;
          }
          if (portalOrigin !== '*' && event.origin !== portalOrigin) return;
          if (event.data.type === 'FIVORA_PREVIEW_STYLE_PATCH') {
            const key = 'STYLE_PATCH:' + (event.data.fieldPath || event.data.targetPath || 'default');
            savedMessages.set(key, event.data);
          } else if (event.data.type === 'FIVORA_PREVIEW_EDIT_MODE' ||
              event.data.type === previousPreviewMessage('EDIT_MODE') ||
              event.data.type === 'FIVORA_PREVIEW_SITE_DATA' ||
              event.data.type === previousPreviewMessage('SITE_DATA') ||
              event.data.type === 'FIVORA_PREVIEW_FOCUS_PAGE' ||
              event.data.type === previousPreviewMessage('FOCUS_PAGE') ||
              event.data.type === 'FIVORA_PREVIEW_CONTENT_PATCH') {
            savedMessages.set(event.data.type, event.data);
          }
          if (String(event.data.type || '').startsWith('FIVORA_PREVIEW_') || String(event.data.type || '').startsWith(PREVIOUS_PREVIEW_PREFIX)) {
            sendToChild(event.data);
          }
          return;
        }
        if (event.source !== preview.contentWindow) return;
        if (event.data.type === 'FIVORA_PREVIEW_READY' || event.data.type === previousPreviewMessage('READY')) {
          childReady = true;
          savedMessages.forEach(sendToChild);
          sendToPortal(event.data);
          return;
        }
        if (String(event.data.type || '').startsWith('FIVORA_PREVIEW_') || String(event.data.type || '').startsWith(PREVIOUS_PREVIEW_PREFIX)) {
          sendToPortal(event.data);
        }
      });

      function installBridge() {
        if (
          !preview.contentDocument ||
          preview.contentDocument.readyState !== 'complete' ||
          preview.contentWindow.__FIVORA_LOCAL_VISUAL_BRIDGE_ATTACHED__ === true
        ) {
          return;
        }
        try {
          const script = preview.contentDocument.createElement('script');
          script.setAttribute('data-fivora-local-visual-bridge', '');
          const NAME_SHIM = "var __name = typeof __name === 'function' ? __name : ((target, value) => (typeof Object.defineProperty === 'function' ? Object.defineProperty(target, 'name', { value, configurable: true }) : target)); ";
          script.textContent = (BRIDGE_SOURCE.includes('__name') && !BRIDGE_SOURCE.includes('var __name') ? NAME_SHIM : '') + BRIDGE_SOURCE;
          preview.contentDocument.head.appendChild(script);
          preview.contentWindow.__FIVORA_LOCAL_VISUAL_BRIDGE_ATTACHED__ = true;
          script.remove();
        } catch (error) {
          errorBox.style.display = 'block';
          errorBox.textContent = 'Unable to attach the local visual editor: ' + error.message;
        }
      }

      preview.addEventListener('load', () => {
        childReady = false;
        window.clearTimeout(installTimer);
        // Next development hydration can continue briefly after load. Attach
        // after it settles, while the wrapper watchdog below keeps the bridge
        // present after a hard reload or development refresh.
        installTimer = window.setTimeout(installBridge, 600);
      });

      window.setInterval(installBridge, 900);

      preview.src = '/';
    })();
  </script>
</body>
</html>`;
}

function ignoreAbortedStreamError(error) {
  if (!error || typeof error !== 'object') return false;
  const code = 'code' in error ? String(error.code) : '';
  return (
    code === 'ECONNRESET' ||
    code === 'ECONNABORTED' ||
    code === 'EPIPE' ||
    code === 'ERR_STREAM_DESTROYED'
  );
}

function proxyPreviewRequest(request, response) {
  const headers = { ...request.headers };
  headers.host = `${LOOPBACK_HOST}:${options.previewPort}`;
  delete headers['accept-encoding'];
  delete headers.authorization;

  const upstream = http.request(
    {
      hostname: LOOPBACK_HOST,
      port: options.previewPort,
      method: request.method,
      path: request.url,
      headers,
    },
    (upstreamResponse) => {
      response.writeHead(
        upstreamResponse.statusCode || 502,
        upstreamResponse.statusMessage,
        upstreamResponse.headers,
      );
      upstreamResponse.on('error', (error) => {
        if (!ignoreAbortedStreamError(error)) {
          appendLog('dev', `\nPreview proxy upstream error: ${error.message}\n`);
        }
        if (!response.writableEnded) response.destroy();
      });
      response.on('error', (error) => {
        if (!ignoreAbortedStreamError(error)) {
          appendLog('dev', `\nPreview proxy response error: ${error.message}\n`);
        }
        upstreamResponse.destroy();
      });
      upstreamResponse.pipe(response);
    },
  );
  upstream.on('error', (error) => {
    if (!ignoreAbortedStreamError(error)) {
      appendLog('dev', `\nPreview proxy request error: ${error.message}\n`);
    }
    if (!response.headersSent) {
      sendJson(response, 502, {
        message: `Local preview is not ready: ${error.message}`,
      });
    } else if (!response.writableEnded) {
      response.destroy();
    }
  });
  request.on('error', (error) => {
    if (!ignoreAbortedStreamError(error)) {
      appendLog('dev', `\nPreview proxy client error: ${error.message}\n`);
    }
    upstream.destroy();
  });
  request.pipe(upstream);
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || '/', apiUrl);
  if (request.method === 'GET' && url.pathname === LOCAL_PREVIEW_ROUTE) {
    const html = previewShellHtml();
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Length': Buffer.byteLength(html),
      'Content-Type': 'text/html; charset=utf-8',
    });
    response.end(html);
    return;
  }
  if (!url.pathname.startsWith('/api/')) {
    proxyPreviewRequest(request, response);
    return;
  }

  setCorsHeaders(request, response);
  if (request.method === 'OPTIONS') {
    response.statusCode = 204;
    response.end();
    return;
  }

  if (!isAuthorized(request)) {
    sendJson(response, 401, { message: 'Invalid Local Template Lab token.' });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/status') {
    sendJson(response, 200, statusPayload());
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/site-data') {
    try {
      let currentManifest = manifest;
      try {
        currentManifest = readJson(manifestPath, 'Template manifest');
      } catch {
        // fallback
      }
      sendJson(response, 200, {
        manifest: currentManifest,
        siteData: readSiteData(),
        siteDataFile: currentManifest.siteDataFile || manifest.siteDataFile,
      });
    } catch (error) {
      sendJson(response, 500, {
        message: error instanceof Error ? error.message : 'Unable to read site data.',
      });
    }
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/site-data') {
    try {
      const payload = await readJsonRequest(request);
      const siteData = isPlainObject(payload) ? payload.siteData : null;
      if (!isPlainObject(siteData) || !isPlainObject(siteData.content)) {
        sendJson(response, 400, {
          message: 'siteData must be a JSON object with a content object.',
        });
        return;
      }
      writeSiteData(siteData);
      sendJson(response, 200, {
        saved: true,
        siteData,
        siteDataFile: manifest.siteDataFile,
      });
    } catch (error) {
      sendJson(response, 400, {
        message:
          error instanceof Error
            ? error.message
            : 'Unable to save local site data.',
      });
    }
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/validate') {
    if (!startValidation()) {
      sendJson(response, 409, { message: 'Validation is already running.' });
      return;
    }
    sendJson(response, 202, statusPayload());
    return;
  }

  sendJson(response, 404, { message: 'Local Template Lab endpoint not found.' });
});

function pipeProxySockets(clientSocket, upstreamSocket) {
  const closeBoth = () => {
    if (!clientSocket.destroyed) clientSocket.destroy();
    if (!upstreamSocket.destroyed) upstreamSocket.destroy();
  };
  const onSocketError = (error) => {
    if (!ignoreAbortedStreamError(error)) {
      appendLog('dev', `\nPreview proxy socket error: ${error.message}\n`);
    }
    closeBoth();
  };
  clientSocket.on('error', onSocketError);
  upstreamSocket.on('error', onSocketError);
  clientSocket.on('close', () => {
    if (!upstreamSocket.destroyed) upstreamSocket.end();
  });
  upstreamSocket.on('close', () => {
    if (!clientSocket.destroyed) clientSocket.end();
  });
  upstreamSocket.pipe(clientSocket);
  clientSocket.pipe(upstreamSocket);
}

server.on('upgrade', (request, socket, head) => {
  if (request.url?.startsWith('/api/')) {
    socket.destroy();
    return;
  }
  socket.on('error', (error) => {
    if (!ignoreAbortedStreamError(error)) {
      appendLog('dev', `\nPreview proxy upgrade client error: ${error.message}\n`);
    }
  });
  const headers = { ...request.headers };
  headers.host = `${LOOPBACK_HOST}:${options.previewPort}`;
  const upstreamRequest = http.request({
    hostname: LOOPBACK_HOST,
    port: options.previewPort,
    method: request.method,
    path: request.url,
    headers,
  });
  upstreamRequest.on('upgrade', (upstreamResponse, upstreamSocket, upstreamHead) => {
    const responseHeaders = Object.entries(upstreamResponse.headers)
      .flatMap(([name, value]) => {
        const values = Array.isArray(value) ? value : [value];
        return values
          .filter((entry) => entry !== undefined)
          .map((entry) => `${name}: ${entry}`);
      })
      .join('\r\n');
    socket.write(
      `HTTP/1.1 ${upstreamResponse.statusCode || 101} ${upstreamResponse.statusMessage || 'Switching Protocols'}\r\n${responseHeaders}\r\n\r\n`,
    );
    if (head.length) upstreamSocket.write(head);
    if (upstreamHead.length) socket.write(upstreamHead);
    pipeProxySockets(socket, upstreamSocket);
  });
  upstreamRequest.on('error', (error) => {
    if (!ignoreAbortedStreamError(error)) {
      appendLog('dev', `\nPreview proxy upgrade upstream error: ${error.message}\n`);
    }
    if (!socket.destroyed) socket.destroy();
  });
  upstreamRequest.end();
});

function stopChild(child) {
  if (!child || child.killed) return;
  child.kill('SIGTERM');
}

function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  if (readinessTimer) clearTimeout(readinessTimer);
  if (devRestartTimer) clearTimeout(devRestartTimer);
  stopChild(validationProcess);
  stopChild(devProcess);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1500).unref();
}

server.on('error', (error) => {
  fail(
    `Unable to start loopback controller at ${apiUrl}: ${
      error instanceof Error ? error.message : 'unknown error'
    }`,
  );
});

server.listen(options.apiPort, LOOPBACK_HOST, () => {
  process.stdout.write(
    [
      '',
      'Fivora Local Template Lab is running.',
      `Template: ${state.templateName}`,
      `Controller URL: ${apiUrl}`,
      `Connection token: ${controllerToken}`,
      `Preview URL: ${previewUrl}`,
      '',
      'Paste the controller URL and connection token into Developer Portal > Local Test Lab.',
      'Use Save local in the portal to write edits to the template site-data file.',
      'Press Ctrl+C to stop. No template files are uploaded by this process.',
      '',
    ].join('\n'),
  );
  runInstallThenPreview();
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
