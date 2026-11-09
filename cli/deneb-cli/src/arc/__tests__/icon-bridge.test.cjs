const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');

// Exercise the actual bridge functions with SVG/HTML ancestry, without a browser.
const source = fs.readFileSync(path.resolve(__dirname, '../../../tool-sources/template-preview-focus-bridge.ts'), 'utf8');
const ast = ts.createSourceFile('bridge.ts', source, ts.ScriptTarget.Latest, true);
function extract(name) {
  let found;
  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name?.text === name) found = node.getText(ast);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  assert.ok(found, name);
  return ts.transpile(found, { target: ts.ScriptTarget.ES2020 });
}
class Element {
  constructor(attrs = {}, parent = null) { this.attrs = attrs; this.parentElement = parent; }
  getAttribute(key) { return this.attrs[key] ?? null; }
  hasAttribute(key) { return key in this.attrs; }
  matches() { return false; }
}
class HTMLElement extends Element {}

test('style-only card targets resolve as containers rather than text', () => {
  const body = new HTMLElement();
  const card = new HTMLElement({'data-preview-style-target':'contact.informationCard','data-preview-style-type':'card'},body);
  card.closest = () => null;
  const context = {
    Element, HTMLElement, document:{body}, STATIC_ATTRIBUTE:'data-preview-static',
    LIST_PATH_ATTRIBUTE:'data-preview-list-path',ITEM_PATH_ATTRIBUTE:'data-preview-item-path',
    RESOLVED_PATH_ATTRIBUTE:'data-resolved-path',EDITABLE_SELECTOR:'div',
    targetRegistry:{getPath:()=>null}, editableFields:[],
  };
  vm.createContext(context);
  vm.runInContext(extract('resolveEditableField') + extract('findEditableTarget') + extract('canEditInline'),context);
  const target = context.findEditableTarget(card);
  assert.equal(target.element,card);
  assert.equal(target.field.path,'contact.informationCard');
  assert.equal(target.field.type,'object');
  assert.equal(context.canEditInline(card,target.field),false);
});

test('navbar background resolves as a named container without replacing child fields', () => {
  const body = new HTMLElement();
  const navbar = new HTMLElement({
    'data-preview-style-target': 'common.header.navbar',
    'data-preview-style-type': 'card',
    'data-preview-style-label': 'Whole navbar',
  }, body);
  navbar.closest = () => null;
  const context = {
    Element, HTMLElement, document: {body}, STATIC_ATTRIBUTE: 'data-preview-static',
    LIST_PATH_ATTRIBUTE: 'data-preview-list-path', ITEM_PATH_ATTRIBUTE: 'data-preview-item-path',
    RESOLVED_PATH_ATTRIBUTE: 'data-resolved-path', EDITABLE_SELECTOR: 'header',
    targetRegistry: {getPath: () => null}, editableFields: [],
  };
  vm.createContext(context);
  vm.runInContext(extract('resolveEditableField') + extract('findEditableTarget'), context);
  const target = context.findEditableTarget(navbar);
  assert.equal(target.field.path, 'common.header.navbar');
  assert.equal(target.field.label, 'Whole navbar');
  assert.equal(target.field.type, 'object');
});

test('navbar child selection offers the whole navbar scope', () => {
  const navbar = new HTMLElement({'data-preview-style-target': 'common.header.navbar'});
  const link = new HTMLElement();
  link.tagName = 'SPAN';
  link.textContent = 'Home';
  link.getBoundingClientRect = () => ({top: 0, left: 0, width: 60, height: 20});
  link.closest = selector => selector.includes('data-design-section="navbar"') ? navbar : null;
  const messages = [];
  const context = {
    window: {getComputedStyle: () => ({})},
    extractCollectionContext: () => ({collectionPath: null, itemIndex: null}),
    ITEM_PATH_ATTRIBUTE: 'data-preview-item-path', LIST_PATH_ATTRIBUTE: 'data-preview-list-path',
    CLICK_MESSAGE: 'FIVORA_PREVIEW_ELEMENT_CLICKED', LEGACY_CLICK_MESSAGE: 'LEGACY_CLICK',
    postToParent: message => messages.push(message),
  };
  vm.createContext(context);
  vm.runInContext(extract('emitClickEvent'), context);
  context.emitClickEvent(link, {path: 'common.navLabels.home', type: 'text', value: 'Home'}, []);
  assert.equal(messages[0].fieldPath, 'common.navLabels.home');
  assert.ok(messages[0].styleScopes.some(scope =>
    scope.key === 'common.header.navbar' && scope.label === 'Whole navbar' && scope.kind === 'card'));
});

test('navbar restores saved group styles and desktop/mobile text consumes live variables', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { EditableNavbar } = require('../../../../../packages/deneb-ui/dist/EditableNavbar');
  const { SiteDataContext } = require('../../../../../packages/deneb-ui/dist/SiteDataProvider');
  const previousUseState = React.useState;
  React.useState = () => [true, () => {}];
  try {
    const html = renderToStaticMarkup(React.createElement(SiteDataContext.Provider, {value: {
      content: {common: {}}, requirements: {requiredPages: ['home', 'contact']},
      template: {structure: {theme: {elementStyles: {
        'common.header.navbar': {fontSize: '22px', fontWeight: 700, backgroundColor: '#abcdef', paddingTop: 12},
      }}}},
    }}, React.createElement(EditableNavbar)));
    assert.match(html, /data-preview-style-target="common.header.navbar"/);
    assert.match(html, /data-preview-style-label="Whole navbar"/);
    assert.match(html, /--deneb-font-size:22px/);
    assert.match(html, /--deneb-card-bg:#abcdef/);
    assert.match(html, /--deneb-card-pt:12px/);
    assert.match(html, /deneb-mobile-drawer/);
    assert.ok((html.match(/font-size:var\(--deneb-font-size/g) || []).length >= 6);
    assert.match(html, /data-preview-field-path="common.navLabels.home"/);
  } finally { React.useState = previousUseState; }
});

test('live navbar container patches include both typography and box styles', () => {
  const { patchElementStyle } = require('../../../../../packages/deneb-core/dist/engine/domPatcher');
  const values = new Map();
  const navbar = new HTMLElement({
    'data-design-section': 'navbar', 'data-preview-style-target': 'common.header.navbar',
    'data-preview-style-type': 'card',
  });
  navbar.style = {setProperty: (key, value) => values.set(key, value), removeProperty: key => values.delete(key)};
  patchElementStyle(navbar, 'card', {fontSize: 20, fontWeight: 600, backgroundColor: '#ffffff', paddingTop: 0});
  assert.equal(values.get('--deneb-font-size'), '20px');
  assert.equal(values.get('--deneb-font-weight'), '600');
  assert.equal(values.get('--deneb-card-bg'), '#ffffff');
  assert.equal(values.get('--deneb-card-pt'), '0px');
});

test('click messages preserve icon-picker metadata instead of only a text value', () => {
  for (const key of ['footerEmailIcon', 'footerPhoneIcon', 'footerLocationIcon']) {
    const icon = new HTMLElement({
      'data-preview-field-path': `common.${key}`,
      'data-preview-control': 'icon-picker',
      'data-preview-icon-type': 'lucide',
      'data-preview-icon': 'mail',
    });
    icon.tagName = 'SPAN';
    icon.textContent = '';
    icon.getBoundingClientRect = () => ({top: 0, left: 0, width: 14, height: 14});
    icon.closest = () => null;
    const messages = [];
    const context = {
      window: {getComputedStyle: () => ({})},
      extractCollectionContext: () => ({collectionPath: null, itemIndex: null}),
      ITEM_PATH_ATTRIBUTE: 'data-preview-item-path', LIST_PATH_ATTRIBUTE: 'data-preview-list-path',
      CLICK_MESSAGE: 'FIVORA_PREVIEW_ELEMENT_CLICKED', LEGACY_CLICK_MESSAGE: 'LEGACY_CLICK',
      postToParent: message => messages.push(message),
    };
    vm.createContext(context);
    vm.runInContext(extract('emitClickEvent'), context);
    context.emitClickEvent(icon, {path: `common.${key}`, type: 'text', value: 'mail'}, []);
    assert.equal(messages.length, 2);
    for (const message of messages) {
      assert.equal(message.fieldPath, `common.${key}`);
      assert.equal(message.control, 'icon-picker');
      assert.equal(message.iconType, 'lucide');
      assert.equal(message.iconName, 'mail');
      assert.equal(message.fieldValue, 'mail');
    }
    // A regular text field must keep its existing click-message behavior.
    icon.attrs = {};
    icon.textContent = 'Explore';
    messages.length = 0;
    context.emitClickEvent(icon, {path: 'common.footerExploreHeading', type: 'text', value: 'Explore'}, []);
    assert.equal(messages[0].fieldValue, 'Explore');
    assert.ok(!('control' in messages[0]));
    assert.ok(!('iconName' in messages[0]));
  }
});

test('built-in icons use the same HTML editing boundary as custom icons', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { EditableIcon } = require('../../../../../packages/deneb-ui/dist/EditableIcon');
  const { SiteDataContext } = require('../../../../../packages/deneb-ui/dist/SiteDataProvider');
  for (const [field, name] of [['footerEmailIcon', 'mail'], ['footerPhoneIcon', 'phone'], ['footerLocationIcon', 'map-pin']]) {
    const html = renderToStaticMarkup(React.createElement(SiteDataContext.Provider,
      {value: {content: {common: {[field]: name}}}},
      React.createElement(EditableIcon, {fieldPath: `common.${field}`, name: 'circle', size: 14})));
    assert.match(html, /^<span[^>]*data-preview-field-path=/);
    assert.ok(html.includes(`data-preview-icon="${name}"`));
    assert.match(html, /<svg[^>]*width="14"/);
    assert.equal((html.match(/data-preview-field-path=/g) || []).length, 1);
  }
});

test('clicking a glyph inside an HTML icon boundary emits the exact icon field', () => {
  const body = new HTMLElement();
  const row = new HTMLElement({}, body);
  const icon = new HTMLElement({'data-preview-field-path': 'common.footerEmailIcon', 'data-preview-control': 'icon-picker'}, row);
  const svg = new Element({}, icon);
  const glyph = new Element({}, svg);
  let emitted;
  const context = {
    Element, HTMLElement, document: {body}, editModeActive: true, activeInlineEdit: null,
    STATIC_ATTRIBUTE: 'data-preview-static', LIST_PATH_ATTRIBUTE: 'data-preview-list-path',
    ITEM_PATH_ATTRIBUTE: 'data-preview-item-path', RESOLVED_PATH_ATTRIBUTE: 'data-resolved-path',
    EDITABLE_SELECTOR: '[data-preview-field-path]', targetRegistry: {getPath: () => null},
    resolveEditableField: el => ({path: el.getAttribute('data-preview-field-path'), type: 'text', value: 'mail'}),
    findRelatedAncestorFields: () => [], preferParentPopover: true,
    emitClickEvent: (el, field) => { emitted = {el, field}; },
  };
  vm.createContext(context);
  vm.runInContext(extract('findEditableTarget') + extract('onEditClick'), context);
  let prevented = false;
  context.onEditClick({target: glyph, preventDefault: () => { prevented = true; }, stopPropagation() {}});
  assert.ok(prevented);
  assert.equal(emitted.el, icon);
  assert.equal(emitted.field.path, 'common.footerEmailIcon');
});

test('clicking an SVG path resolves its authored icon field', () => {
  const body = new HTMLElement();
  const row = new HTMLElement({}, body);
  const icon = new Element({ 'data-preview-field-path': 'common.footerEmailIcon', 'data-preview-control': 'icon-picker' }, row);
  const glyph = new Element({}, icon);
  const context = {
    Element, HTMLElement, document: { body }, STATIC_ATTRIBUTE: 'data-preview-static',
    LIST_PATH_ATTRIBUTE: 'data-preview-list-path', ITEM_PATH_ATTRIBUTE: 'data-preview-item-path',
    RESOLVED_PATH_ATTRIBUTE: 'data-resolved-path', EDITABLE_SELECTOR: '[data-preview-field-path]',
    targetRegistry: { getPath: () => null },
    resolveEditableField: element => ({path: element.getAttribute('data-preview-field-path')}),
  };
  vm.createContext(context);
  vm.runInContext(extract('findEditableTarget'), context);
  assert.equal(context.findEditableTarget(glyph).element, icon);
  assert.equal(context.findEditableTarget(icon).field.path, 'common.footerEmailIcon');
});

test('field updates preserve SVG children for the provider renderer', () => {
  const icon = new Element({ 'data-preview-control': 'icon-picker' });
  icon.textContent = 'preserve-glyph';
  const text = new HTMLElement();
  text.childElementCount = 0;
  const context = {
    document: {querySelectorAll: () => [icon, text]}, CSS: {escape: x => x},
    RESOLVED_PATH_ATTRIBUTE: 'data-resolved-path', activeInlineEdit: null, editModeActive: false,
  };
  vm.createContext(context);
  vm.runInContext(extract('applyDomFieldValue'), context);
  context.applyDomFieldValue('common.footerEmailIcon', 'heart');
  assert.equal(icon.textContent, 'preserve-glyph');
  assert.equal(text.textContent, 'heart');
  vm.runInContext(extract('canEditInline'), context);
  assert.equal(context.canEditInline(icon, {type: 'text'}), false);
});
